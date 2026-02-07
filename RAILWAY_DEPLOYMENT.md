# � Railway + MongoDB Deployment Guide

Deploy your Food Inventory app to Railway with MongoDB persistence! 🚀

## ✅ Prerequisites

Before you start, make sure you have:

1. **MongoDB Atlas Account** (FREE) - [Sign up here](https://www.mongodb.com/cloud/atlas)
2. **GitHub Account** - [github.com](https://github.com)
3. **Railway Account** (FREE) - [railway.app](https://railway.app)
4. **MongoDB Connection String** - From your Atlas cluster

---

## 📊 Why Railway + MongoDB?

| Feature | Before | After |
|---------|--------|-------|
| Data Storage | Memory only ❌ | MongoDB ✅ |
| Data Persistence | Lost on restart ❌ | Permanent ✅ |
| Uptime | Local machine only ❌ | 24/7 Cloud ✅ |
| Real-time Sync | Yes ✅ | Yes ✅ |
| Cost | Free | **FREE** ✅ |
| Deployment | None | Automatic ✅ |

---

## 🎯 Quick Start (30 minutes total)

### Phase 1: MongoDB Setup (10 mins)

**Create your MongoDB Atlas cluster:**

```bash
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Sign up (FREE - no credit card)
# 3. Create a new cluster (M0 tier - always free)
# 4. Create database user:
#    - Username: inventoryuser
#    - Password: (generate secure one)
# 5. Get connection string:
#    - Click "Connect" → "Drivers" → "Node.js"  
#    - Copy the connection string
#    - Replace <password> with your actual password
```

**Example connection string:**
```
mongodb+srv://inventoryuser:MySecurePassword123@cluster0.abc123.mongodb.net/food-inventory?retryWrites=true&w=majority
```

### Phase 2: Local Testing (10 mins)

**Make sure it works locally first:**

```bash
# Create .env file
cp .env.example .env

# Add your MongoDB connection string
# Edit .env with your MONGODB_URI

# Install dependencies
npm install

# Start server
npm start

# Test health endpoint
curl http://localhost:3000/health
```

You should see:
```json
{"status":"ok","mongodb":"connected"}
```

### Phase 3: GitHub Setup (5 mins)

**Push your code to GitHub:**

```bash
# Initialize git
git init
git add .
git commit -m "Food inventory with MongoDB"

# Create new repo on GitHub.com

# Push to GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/food-inventory.git
git push -u origin main
```

### Phase 4: Railway Deployment (5 mins)

**Deploy to Railway:**

1. Go to [railway.app](https://railway.app)
2. Click **"Create New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect GitHub and select your `food-inventory` repository
5. Click **"Deploy"**

Railway will automatically:
- ✅ Detect it's a Node.js app
- ✅ Read `Procfile` (web: node server.js)
- ✅ Install dependencies (npm install)
- ✅ Start server
- ✅ Give you a live URL

### Phase 5: Add MongoDB (5 mins)

**Configure MongoDB in Railway:**

1. In Railway dashboard, go to your project
2. Click the project service
3. Go to **"Variables"** tab
4. Add these variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB connection string |
| `EXTERNAL_URL` | Your Railway URL (shown after deploy) |
| `NODE_ENV` | production |

5. Save - Railway redeploys automatically! ✅

---

## ✅ Your App is Live!

1. **Get Your URL:**
   - Railway Dashboard → Your Project → Your Service → Domain tab
   - URL looks like: `https://food-inventory-production.up.railway.app`

2. **Test It:**
   - Open URL in browser
   - Scan some items
   - Open URL on phone
   - See **real-time sync**! ✅

3. **Share It:**
   - Give your URL to friends/family
   - They can use your app from anywhere! 🌍

---

## 🔄 Making Changes & Redeploying

### Update Your Code Locally

```bash
# Make changes
# Test locally
npm start

# Then push to GitHub
git add .
git commit -m "Your changes"
git push origin main
```

**Railway automatically redeploys!** ✅

---

## 📊 Architecture

Your deployed app looks like:

```
Users (web/mobile)
    ↓
    └──→ Railway Server (node.js)
             ↓
             └──→ MongoDB Atlas (database)
```

**Data Flow:**
1. User scans item → Browser sends WebSocket message
2. Server receives → Database saves to MongoDB
3. All clients synced → Real-time update ✅
4. Data persists → Even if server restarts ✅

---

## 🆘 Troubleshooting

### Health Check Fails

```bash
curl https://your-app.up.railway.app/health
# ❌ Returns: mongodb: disconnected
```

**Fix:**
1. Check `MONGODB_URI` in Railway variables
2. Verify connection string has correct format
3. Check password doesn't need URL encoding
4. Restart Railway service (click "Redeploy")

### App Shows Blank Page

```bash
# ❌ https://your-app.up.railway.app shows nothing
```

**Fix:**
1. Check Railway logs: Dashboard → Deployments → Logs
2. Common issues:
   - Missing environment variable
   - Port not set (Railway auto-sets it)
   - MongoDB connection failed

### Data Not Persisting

```bash
# ❌ Items disappear after server restart
```

**Fix:**
1. ✅ This shouldn't happen with MongoDB
2. Check MongoDB Atlas cluster is running
3. Verify `MONGODB_URI` is correct
4. Check collection in MongoDB Atlas

### WebSocket Connection Fails

Find in browser console (F12):
```
❌ WebSocket connection refused
```

**Fix:**
1. Add `EXTERNAL_URL` to Railway variables
2. Set it to your Railway domain
3. Wait for redeploy
4. Refresh browser

### Rate Limit/Timeout Errors

**If MongoDB times out:**
1. MongoDB might be sleeping - access it to wake up
2. Check IP whitelist in MongoDB Atlas (should allow 0.0.0.0/0)
3. Verify cluster status

---

## 📈 Scaling (Optional Later)

### When Free Tier Gets Tight

**MongoDB:**
- Free: 500MB
- If you need more: Upgrade to M2 tier (~$9/month)

**Railway:**
- Free: Monthly credits (~$5 worth)
- If you need 24/7 reliability: Upgrade to paid plan

### Current Setup
- ✅ Works perfectly for small teams
- ✅ 500MB MongoDB = thousands of food items
- ✅ Free tier credits last for heavy usage

---

## 🔐 Security Checklist

- [ ] `MONGODB_URI` is in Railway variables (not in git)
- [ ] `.env` file is in `.gitignore` ✅
- [ ] Password is strong (20+ characters)
- [ ] MongoDB whitelist allows necessary IPs
- [ ] HTTPS is enabled (Railway does this automatically)

---

## 💡 Pro Tips

1. **Monitor Usage:**
   - Check Railway credits: Account → Billing
   - Check MongoDB storage: MongoDB Atlas → Collections

2. **Backup Data:**
   - MongoDB Atlas auto-backups
   - Or manually export from MongoDB Atlas

3. **Debug Locally First:**
   - Always test changes locally before pushing
   - Same .env variables as production

4. **Watch Logs:**
   ```bash
   # Realtime logs
   railway logs -f
   ```

5. **Sample API Call:**
   ```bash
   # Check app is running
   curl -I https://your-app.up.railway.app/
   
   # Check database connection
   curl https://your-app.up.railway.app/health
   ```

---

## 📚 Files & Commands Reference

### Important Files

| File | Purpose |
|------|---------|
| `Procfile` | Tells Railway how to start app |
| `railway.json` | Railway configuration |
| `package.json` | Node.js dependencies & scripts |
| `.env` | Local environment variables |
| `.gitignore` | Prevents committing secrets |

### Useful Commands

```bash
# Test locally
npm start

# Test MongoDB connection
curl http://localhost:3000/health

# Push to GitHub (triggers auto-deploy)
git push origin main

# View Railway logs
railway logs -f

# Stop local server
Ctrl + C
```

---

## ❓ FAQ

### Q: How do I see my MongoDB data?
**A:** MongoDB Atlas → Collections → food-inventory → Inventory

### Q: Can I use a custom domain?
**A:** Yes! Railway Settings → Custom Domains (add your domain)

### Q: Will my app go down?
**A:** Unlikely! Both Railway and MongoDB have 99.9% uptime

### Q: How do I update my app?
**A:** Edit code → `git push` → Railway auto-deploys

### Q: Is there a cost?
**A:** Free tier! Railway gives monthly credits, MongoDB is free tier forever

### Q: How much data can I store?
**A:** MongoDB free: 500MB (easily handles thousands of items)

### Q: What happens if I exceed 500MB?
**A:** MongoDB warns you. Upgrade tier or delete old data

---

## 🚀 Deployment Checklist

Before going live:

- [ ] MongoDB Atlas cluster created and running
- [ ] Database user created with password
- [ ] Local testing works (npm start)
- [ ] Code pushed to GitHub
- [ ] Railway connected to GitHub repo
- [ ] `MONGODB_URI` added to Railway variables
- [ ] Health check working: `/health` returns "mongodb": "connected"
- [ ] Test scanning items works
- [ ] Test sync across devices works
- [ ] URL shared with team! 🎉

---

## 🎯 Next Steps

1. **Follow setup above** (30 mins)
2. **Test with friends** - Share your URL
3. **Monitor usage** - Check Railway & MongoDB dashboards
4. **Scale if needed** - Upgrade to paid if necessary

---

## 📞 Support

- **Railway Issues:** [docs.railway.app](https://docs.railway.app)
- **MongoDB Issues:** [docs.mongodb.com](https://docs.mongodb.com)
- **Code Issues:** Check server logs in Railway

**Happy deploying! 🚀**

