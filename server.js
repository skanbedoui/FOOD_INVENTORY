const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, port: 3001 });

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

// Current inventory state
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
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);

      if (message.type === 'sync' || message.type === 'update') {
        sharedInventory = message.data;
        console.log(`📦 Inventory updated: ${sharedInventory.length} items`);

        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'update', data: sharedInventory }));
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
server.listen(PORT, () => {
  const localIP = getLocalIP();
  console.log('\n🚀 Food Inventory Sync Server Started');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📱 Local URL:     http://localhost:${PORT}`);
  console.log(`🌐 Network URL:   http://${localIP}:${PORT}`);
  console.log(`📡 WebSocket:     ws://${localIP}:3001`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n💡 Tip: Open multiple tabs/windows or devices at the network URL');
  console.log('✅ All changes will sync in real-time!\n');
});

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
