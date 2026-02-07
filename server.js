const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const path = require('path');
const mongoose = require('mongoose');
const { classifyItem } = require('./lib/classifier');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-inventory';

// Connect to MongoDB with retry logic for production
let dbConnected = false;
const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
    });
    dbConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️ Retrying in 5 seconds...');
    setTimeout(connectMongoDB, 5000);
  }
};

// Start MongoDB connection immediately
connectMongoDB();

// Inventory Schema
const inventorySchema = new mongoose.Schema({
  items: [
    {
      barcode: String,
      name: String,
      brand: String,
      quantity: Number,
      category: String,
      weightGrams: Number,
      weightRaw: String,
      classificationSource: String,
      classifiedAt: Date,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

const Inventory = mongoose.model('Inventory', inventorySchema);

// Initialize or get existing inventory
async function getInventoryFromDB() {
  try {
    let inventory = await Inventory.findOne({});
    if (!inventory) {
      inventory = new Inventory({ items: [] });
      await inventory.save();
    }
    return inventory.items;
  } catch (error) {
    console.error('❌ Error fetching inventory:', error.message);
    return [];
  }
}

// Save inventory to database with better logging
async function saveInventoryToDB(items) {
  if (!dbConnected) {
    console.warn('⚠️ MongoDB not connected - items saved in memory only');
    return false;
  }
  
  try {
    // Enrich items with classification information
    const enriched = await Promise.all(items.map(async (it) => {
      try {
        const c = await classifyItem(it);
        return Object.assign({}, it, {
          category: c.category,
          weightGrams: c.weight?.grams ?? (it.weightGrams || null),
          weightRaw: c.weight?.raw ?? (it.weightRaw || null),
          classificationSource: c.source,
          classifiedAt: new Date()
        });
      } catch (e) {
        return it;
      }
    }));

    const result = await Inventory.updateOne(
      {},
      { items: enriched, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    console.log(`💾 Inventory SAVED to MongoDB (${items.length} items) ✅`);
    console.log(`   Timestamp: ${new Date().toISOString()}`);
    console.log(`   Items: ${items.map(i => i.name).join(', ')}`);
    return true;
  } catch (error) {
    console.error('❌ ERROR saving inventory:', error.message);
    return false;
  }
}

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Serve static files
app.use(express.static(path.join(__dirname)));

// Health check endpoint (important for Railway)
// Health check endpoint (important for Railway)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// API endpoint to get current inventory from database
app.get('/api/inventory', async (req, res) => {
  try {
    const result = await Inventory.findOne({});
    if (!result) {
      return res.json({
        status: 'empty',
        items: [],
        mongodb: dbConnected ? 'connected' : 'disconnected',
        message: 'No inventory saved yet'
      });
    }

    res.json({
      status: 'success',
      items: result.items,
      count: result.items.length,
      lastUpdated: result.updatedAt,
      mongodb: dbConnected ? 'connected' : 'disconnected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      mongodb: dbConnected ? 'connected' : 'disconnected'
    });
  }
});

// Current inventory state (will load from DB)
let sharedInventory = [];

// Store client information
const clients = new Map();

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const clientId = `${req.socket.remoteAddress}:${req.socket.remotePort}`;
  clients.set(ws, {
    id: clientId,
    connected: new Date()
  });

  console.log(`✅ Client connected: ${clientId} (Total: ${clients.size})`);

  // Send current inventory to new client
  if (sharedInventory.length > 0) {
    ws.send(JSON.stringify({ type: 'update', data: sharedInventory }));
  }

  // Handle incoming messages
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data);

      if (message.type === 'sync' || message.type === 'update') {
        sharedInventory = message.data;
        const savedToDB = await saveInventoryToDB(sharedInventory);
        
        console.log(`📦 Received ${sharedInventory.length} items`);
        if (savedToDB) {
          console.log(`✅ Successfully saved to MongoDB database`);
        } else {
          console.log(`⚠️ Database connection issue - will save when reconnected`);
        }

        // Broadcast to all connected clients with save status
        const broadcastData = {
          type: 'update',
          data: sharedInventory,
          savedToDB: savedToDB,
          timestamp: new Date().toISOString()
        };
        
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(broadcastData));
          }
        });
      }
    } catch (error) {
      console.error('❌ Message parsing error:', error.message);
    }
  });

  // Handle client disconnect
  ws.on('close', () => {
    clients.delete(ws);
    console.log(`❌ Client disconnected: ${clientId} (Total: ${clients.size})`);
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error(`⚠️ WebSocket error from ${clientId}:`, error.message);
  });
});

// HTTP server
const PORT = process.env.PORT || 3000;
const EXTERNAL_URL = process.env.EXTERNAL_URL;

// Start server after loading inventory from DB
async function startServer() {
  try {
    sharedInventory = await getInventoryFromDB();
    console.log(`✅ Loaded ${sharedInventory.length} items from MongoDB`);
  } catch (error) {
    console.error('❌ Error loading inventory:', error.message);
  }

  server.listen(PORT, () => {
    const localIP = getLocalIP();
    console.log('\n🚀 Food Inventory Sync Server Started');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📱 Local URL:     http://localhost:${PORT}`);
    console.log(`🌐 Local Network: http://${localIP}:${PORT}`);
    if (EXTERNAL_URL) {
      console.log(`🌍 External URL:  ${EXTERNAL_URL}`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 Tip: Open multiple tabs/windows or devices at the URL above');
    console.log('✅ All changes will sync in real-time!\n');
  });
}

// Classification endpoint: query by barcode or name
app.get('/api/classify', async (req, res) => {
  try {
    const { barcode, name } = req.query;
    if (!barcode && !name) return res.status(400).json({ error: 'Provide barcode or name query parameter' });
    const result = await classifyItem({ barcode, name });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  wss.clients.forEach((client) => {
    client.close();
  });
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
