# 🍎 Food Inventory Sync - Complete Setup & Deployment Guide

A real-time food inventory scanner with **persistent MongoDB storage** and **one-click Railway deployment**.

---

## 🎯 Features

✅ **Real-time sync** - Changes appear instantly across all devices  
✅ **Barcode scanning** - Scan any food item (with camera)  
✅ **Persistent storage** - Data saved to MongoDB Atlas (free)  
✅ **Cloud deployment** - Deploy to Railway in 10 minutes  
✅ **No cost** - Free MongoDB Atlas + Free Railway tier  
✅ **Offline support** - PWA saves data locally too  

---

## 🚀 Quick Start (Choose Your Path)

### 🏠 Local Development (Testing)

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Add your MongoDB connection string to .env
# Edit MONGODB_URI=... with your Atlas credentials

# 4. Start the server
npm start

# 5. Open in browser
# http://localhost:3000
```

**See:** [MONGODB_SETUP.md](MONGODB_SETUP.md) for MongoDB setup

---

### ☁️ Cloud Deployment (Production)

```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Deploy to Railway
# Go to railway.app → New Project → Deploy from GitHub

# 3. Add MongoDB connection to Railway
# Railway Dashboard → Variables → Add MONGODB_URI

# 4. Your app is live!
# https://your-app-production.up.railway.app
```

**See:** [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) for step-by-step Railway guide

---

## 📋 Architecture

```
┌─────────────────────────────────────────┐
│         Your Browser / Phone            │
│  (index.html + JavaScript frontend)     │
└──────────────┬──────────────────────────┘
               │ WebSocket (real-time)
               ↓
┌─────────────────────────────────────────┐
│         Node.js Server (Express)        │
│  - Handles WebSocket connections        │
│  - Saves/loads data from MongoDB        │
│  - Broadcasts changes to all clients    │
└──────────────┬──────────────────────────┘
               │ MongoDB Driver
               ↓
┌─────────────────────────────────────────┐
│      MongoDB Atlas (Cloud Database)     │
│  - Stores all inventory permanently     │
│  - 500MB free storage                   │
│  - Automatic backups                    │
└─────────────────────────────────────────┘
```

---

## 🗄️ Database: MongoDB Atlas

**Why MongoDB?**
- ✅ Free tier (500MB) = plenty for food inventory
- ✅ Cloud-hosted (no server to manage)
- ✅ Automatic backups
- ✅ 99.9% uptime
- ✅ Easy to scale later

**Data Structure:**
```javascript
{
  items: [
    {
      barcode: "5901234123457",
      name: "Milk",
      brand: "Local Dairy",
      quantity: 2,
      timestamp: "2024-02-07T10:30:00Z"
    },
    // ... more items
  ],
  updatedAt: "2024-02-07T10:30:00Z"
}
```

**Setup:**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (FREE)
3. Create cluster
4. Create database user
5. Get connection string
6. Add to `.env` or Railway variables

Full guide: [MONGODB_SETUP.md](MONGODB_SETUP.md)

---

## 🚀 Deployment: Railway

**Why Railway?**
- ✅ Free tier (monthly free credits)
- ✅ Always running (no sleep mode)
- ✅ Auto-deploys on git push
- ✅ Custom domain support
- ✅ 99.9% uptime
- ✅ Works perfectly with MongoDB

**One-Click Deploy:**
1. Push code to GitHub
2. Connect GitHub to Railway
3. Add environment variables
4. Done! ✅

Full guide: [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)

---

## 📁 Project Structure

```
food-inventory/
├── index.html              # Frontend UI
├── server.js               # Node.js backend (MongoDB + WebSocket)
├── sw.js                   # Service Worker (PWA support)
├── manifest.json           # PWA manifest
├── package.json            # Dependencies
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── MONGODB_SETUP.md        # MongoDB guide
├── RAILWAY_DEPLOYMENT.md   # Railway guide
└── EXTERNAL_DEPLOYMENT.md  # ngrok/Render guides
```

---

## 🔧 Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | Database connection | `mongodb+srv://user:pass@cluster.mongodb.net/food-inventory` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `production` |
| `EXTERNAL_URL` | External access URL | `https://your-app.up.railway.app` |

---

## 💻 Local Development

### Start Server
```bash
npm start
```

### Run with Auto-Reload
```bash
npm run dev
```

### Check Health
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "mongodb": "connected",
  "timestamp": "2024-02-07T10:30:00Z"
}
```

---

## 🌐 Deployment Options

| Option | Setup Time | Cost | Best For |
|--------|-----------|------|----------|
| **Local** | 5 min | FREE | Testing |
| **Railway** | 10 min | FREE* | Production |
| **ngrok** | 2 min | FREE (limits) | Quick demos |
| **Render** | 15 min | FREE* | Alternative |

*Free tiers available, no credit card required

---

## 📊 Data Flow

### Scanning an Item
```
1. User scans barcode
   ↓
2. Browser sends WebSocket message to server
   ↓
3. Server receives and stores in MongoDB
   ↓
4. Server broadcasts update to ALL connected clients
   ↓
5. All devices see the new item instantly ✅
```

### Recovering from Restart
```
1. Server starts
   ↓
2. Connects to MongoDB Atlas
   ↓
3. Loads all previous items
   ↓
4. New client connects
   ↓
5. Receives all items from database ✅
```

---

## 🆘 Troubleshooting

### Can't connect to MongoDB
```bash
# Check connection string in .env
# Verify MongoDB user credentials
# Check cluster is active in Atlas
```

### WebSocket connection fails
```bash
# Add EXTERNAL_URL to environment
# Use full Railway domain
# Check firewall isn't blocking WebSockets
```

### Data not persisting
```bash
# Check MONGODB_URI is set correctly
# Verify MongoDB user has database access
# Check server logs for errors
# npm start
```

### App won't start on Railway
```bash
# Check all variables in Railway dashboard
# View logs: Railway → Deployments → Logs
# Verify PORT is not hardcoded
```

---

## 🔐 Security

✅ **Production-ready features:**
- Environment variables for sensitive data
- `.env` file ignored by git (see `.gitignore`)
- MongoDB Atlas IP whitelist
- HTTPS support (Railway provides free SSL)

⚠️ **Future enhancements:**
- User authentication
- Rate limiting
- Data encryption
- Input validation

---

## 📈 Monitoring

### Local Development
```bash
npm start
# View logs in terminal
```

### Production (Railway)
1. Go to Railway dashboard
2. Click your project
3. View real-time logs
4. Monitor CPU/memory usage

---

## 🚀 Next Steps

1. **[Set up MongoDB Atlas](MONGODB_SETUP.md)** - Free cloud database
2. **[Test locally](#-local-development)** - Run `npm start`
3. **[Deploy to Railway](RAILWAY_DEPLOYMENT.md)** - Share with the world
4. **[Monitor performance](RAILWAY_DEPLOYMENT.md)** - Check Railway dashboard

---

## 📚 Documentation

- **[MongoDB Setup Guide](MONGODB_SETUP.md)** - How to create and connect MongoDB
- **[Railway Deployment Guide](RAILWAY_DEPLOYMENT.md)** - Deploy to production
- **[External Deployment](EXTERNAL_DEPLOYMENT.md)** - ngrok, Render, Railway alternatives

---

## 🤝 Contributing

Feel free to submit issues or improvements!

---

## 📄 License

MIT

---

## 💡 Tips & Tricks

### Backup Your Data
MongoDB Atlas automatically backs up your data daily. You can also export:
1. MongoDB Atlas → Collections
2. Select database → Export

### Scale Up Later
If you need more storage:
- MongoDB: Upgrade from free M0 to paid tier
- Railway: Upgrade to paid plan for more resources

### Add Features
- User authentication
- Item categories
- Expiration dates
- Shopping lists
- Notifications

### Custom Domain
Add your own domain:
1. Railway: Settings → Custom Domain
2. Point DNS to Railway
3. Auto HTTPS enabled ✅

---

## ❓ FAQ

**Q: How much data can I store?**  
A: MongoDB free tier has 500MB, which is plenty for thousands of items.

**Q: What happens after 1 month on Railway?**  
A: Free tier continues running with monthly free credits. No data loss, no service interruption.

**Q: Can I use this offline?**  
A: Yes! PWA support means data syncs when you go online.

**Q: How do I add users/authentication?**  
A: Check `DEPLOYMENT.md` for security notes and future enhancements.

**Q: Can I export my data?**  
A: Yes, from MongoDB Atlas Collections tab.

---

**Ready to start?** Follow the [Quick Start](#-quick-start-choose-your-path) section above! 🚀
