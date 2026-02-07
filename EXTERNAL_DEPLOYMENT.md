## 🌍 Connect Outside Your Network

Your app can be accessed from anywhere in the world! Here are 3 options:

---

## ⚡ Option 1: ngrok (Fastest - 2 minutes)

Perfect for testing, temporary access, and demos.

### Setup:
```bash
# Install ngrok
brew install ngrok          # macOS
# or: choco install ngrok    # Windows  
# or: apt-get install ngrok  # Linux

# Make sure server is running
npm start

# In another terminal, expose to internet:
ngrok http 3000

# You'll get a URL like: https://abc-123-def-456.ngrok.io
```

### Share the URL:
- Give friends/family the ngrok URL
- They can access from iPhone, Android, or web
- All syncing works in real-time!

**Pros:**
- ✅ Instant setup
- ✅ No account needed  
- ✅ Works from anywhere
- ✅ Real-time sync

**Cons:**
- ❌ URL changes on restart (free tier)
- ❌ Limited bandwidth (free tier ~1Gb/hour)
- ❌ Terminates after 2 hours idle (free tier)

---

## 🚀 Option 2: Railway.app + MongoDB (RECOMMENDED ⭐)

Permanent deployment with cloud database - data never lost!

### Prerequisites:
1. ✅ MongoDB Atlas account (FREE) - [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. ✅ GitHub account - [github.com](https://github.com)
3. ✅ Railway account - [railway.app](https://railway.app)

### Step 1: Setup MongoDB Atlas (if not done)

```bash
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Sign up (FREE - no credit card)
# 3. Create a FREE cluster (M0)
# 4. Create database user in "Database Access"
#    - Username: inventoryuser
#    - Password: (generate secure one)
# 5. Get connection string from "Connect" → "Drivers" → "Node.js"
#    Copy: mongodb+srv://inventoryuser:PASSWORD@cluster0.xxxxx.mongodb.net/food-inventory?retryWrites=true&w=majority
```

### Step 2: Setup GitHub

```bash
# Initialize git repository
git init
git add .
git commit -m "Food inventory app with MongoDB"
git branch -M main

# Create new repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/food-inventory.git
git push -u origin main
```

### Step 3: Deploy to Railway

```bash
# 1. Go to https://railway.app
# 2. Click "Create New Project"
# 3. Click "Deploy from GitHub"
# 4. Connect your GitHub account
# 5. Select your "food-inventory" repository
# 6. Railway will auto-detect and deploy!
```

### Step 4: Configure MongoDB on Railway

**Add Environment Variables:**

1. Go to Railway Dashboard
2. Click your project → Click your service
3. Go to **"Variables"** tab
4. Add your MongoDB connection string:
   - **Key:** `MONGODB_URI`
   - **Value:** `mongodb+srv://inventoryuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/food-inventory?retryWrites=true&w=majority`

5. Add external URL (optional, for better sync):
   - **Key:** `EXTERNAL_URL`  
   - **Value:** (Railway will show you the generated URL after first deploy)

### Step 5: Verify Deployment

```bash
# Railway will automatically:
✅ Build your app (npm install)
✅ Start server (node server.js)
✅ Connect to MongoDB
✅ Give you a live URL
```

Your app is **LIVE**! 🎉

**Share this URL:** `https://your-app.up.railway.app`

### What Happens Now:

- 📱 **Real-time Sync** - Changes sync instantly across all devices
- 💾 **Permanent Storage** - Data saved in MongoDB Atlas (500MB FREE)
- 🚀 **Auto-Deploy** - Push to GitHub = auto-deploys to Railway
- 🔒 **Secure** - HTTPS by default, MongoDB with authentication
- ♾️ **Always Running** - No sleep, 24/7 uptime

### Pros:
- ✅ Permanent URL (never changes)
- ✅ MongoDB persists data forever
- ✅ Free tier never expires
- ✅ Auto-deploy on git push
- ✅ Great performance & uptime
- ✅ 500MB MongoDB storage

### Cons:
- ❌ Railway free tier (~5 USD/month credits)
- ❌ MongoDB 500MB limit (enough for large inventories)
- ❌ Requires GitHub account

---

## 🎯 Option 3: Render.com (Free Tier)

Similar to Railway, very beginner-friendly.

### Setup:

```bash
# 1. Push to GitHub (same steps as Railway)

# 2. Go to render.com
# 3. Click "New → Web Service"
# 4. Connect your GitHub repo
# 5. Select this folder
# 6. Deploy!
```

Your app is live with auto-deploys!

**Pros:**
- ✅ Free tier available
- ✅ Simple UI
- ✅ Auto-deploy on push
- ✅ Good uptime

**Cons:**
- ❌ Free tier may sleep after inactivity
- ❌ Requires GitHub

---

## 📋 Which Should You Use?

| Use Case | Solution |
|----------|----------|
| Quick test with friends | **ngrok** |
| **Production + Permanent Data** | **Railway + MongoDB** ⭐ |
| Long-term free hosting | **Railway + MongoDB** |  
| Simplest setup | **Render** (but data not persistent) |

---

## 🔧 Configuration for External URLs

### 1. Create `.env` file:

Copy from `.env.example`:
```bash
cp .env.example .env
```

### 2. Edit `.env`:

```
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://inventoryuser:PASSWORD@cluster0.xxxxx.mongodb.net/food-inventory
EXTERNAL_URL=https://your-deployed-url.com
```

### 3. Get Your MongoDB Connection String:

1. Go to **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**
2. Click **"Connect"** in your cluster
3. Select **"Drivers"** → **"Node.js"**
4. Copy the connection string
5. Replace `<password>` with your database password
6. Paste into `.env` as `MONGODB_URI`

### 4. Test Locally:

```bash
npm install        # Install dependencies
npm start
```

You should see:
```
✅ Connected to MongoDB
✅ Loaded X items from MongoDB
🚀 Food Inventory Sync Server Started
📱 Local URL:     http://localhost:3000
```

### 5. Deploy Check:

Visit `https://your-app.up.railway.app/health`

You should see:
```json
{
  "status": "ok",
  "mongodb": "connected",
  "timestamp": "2026-02-07T10:30:00.000Z"
}
```

---

## 🔐 Security Notes

For production deployment with MongoDB + Railway:

1. **🔒 Never commit `.env`** - Already in `.gitignore`
2. **🔑 Keep MongoDB password secret** - Don't share connection string
3. **🌐 Use HTTPS** - Railway provides free SSL (automatic)
4. **📝 MongoDB Authentication** - Username + password required
5. **🚫 Enable IP Whitelist** (later) - Restrict access if needed
6. **🔄 Backup Data** - MongoDB Atlas provides automatic backups

```javascript
// Future: Add rate limiting
const rateLimit = require('express-rate-limit');
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Future: Add authentication
app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Unauthorized');
  next();
});
```

---

## 📊 Deployment Comparison

```
                    ngrok    Railway    Render
Speed               🔥🔥🔥     🔥🔥       🔥🔥
Uptime              ⏰        ✅✅      ✅✅
Cost                Free      Free*      Free*
Difficulty          ⭐        ⭐⭐      ⭐⭐⭐
Custom Domain       ❌        ✅         ✅
Real-time Sync      ✅        ✅         ✅
Data Persistence   ❌✅      ✅✅       ❌✅
Database (MongoDB)  ❌        ✅         ❌
Always Running      ❌        ✅         ~
```

\* Free tier, paid options available  
✅ = With MongoDB integration (default)  
❌ = Without database

---

## 🆘 Troubleshooting

### "Can't connect from outside network"
- Make sure server is running: `npm start`
- Check `/health` endpoint returns `ok` status
- Verify `MONGODB_URI` is set correctly in Railway variables
- Test locally first: `curl http://localhost:3000/health`

### "MongoDB connection failed on Railway"
```
❌ MongoDB connection error: getaddrinfo ENOTFOUND
```
- Check `MONGODB_URI` variable is added in Railway dashboard
- Verify connection string includes correct password (no special chars issues)
- Test connection string locally first
- Check MongoDB Atlas cluster is running (not paused)

### "Sync not working after deployment"
- Check browser console (F12) for WebSocket errors
- Verify `EXTERNAL_URL` variable matches your Railway URL
- Check logs: Go to Railway → Logs tab
- Try: `curl https://your-app.up.railway.app/health`

### "Data disappeared after restart"
- ✅ This should NOT happen - MongoDB persists data
- Check MongoDB Atlas cluster is running
- Check database user has correct permissions
- View data in MongoDB Atlas → Collections

### "Railway logs show connection timeout"
- MongoDB Atlas might have IP whitelist - allow all IPs
- Go to MongoDB Atlas → Network Access → Add IP 0.0.0.0/0
- Restart Railway deployment

### "npm install fails on Railway"
- Check `package.json` has all dependencies
- Verify no syntax errors in `package.json`
- Check: `npm install` locally succeeds

### Local Testing Before Deploy
```bash
# 1. Ensure .env has correct MONGODB_URI
cp .env.example .env
# Edit .env with your MongoDB details

# 2. Install dependencies
npm install

# 3. Start locally
npm start

# 4. Test health endpoint
curl http://localhost:3000/health

# 5. Scan items and verify they save
# 6. Restart server (Ctrl+C then npm start again)
# 7. Check if items still there ✅
```

---

## 🎉 Deployment Complete!

Once deployed with Railway + MongoDB, anyone in the world can:

1. **Open your app URL** - `https://your-app.up.railway.app`
2. **Scan grocery items** - Real-time barcode scanning
3. **See instant sync** - Across all devices, everywhere! 🌍
4. **Data persists** - Even if server restarts ✅

```
Device A (Phone)     Device B (Tablet)     Device C (PC)
  Japan              Brazil                 USA
     |                   |                   |
     +------- Sync Server (Railway) -------+
                        |
                  (MongoDB Storage)
                        |
            ✅ Data Always Saved
```

## 💡 Quick Reference

### Your URLs:
- **App:** `https://your-app.up.railway.app`
- **Health Check:** `https://your-app.up.railway.app/health`
- **MongoDB Data:** View in MongoDB Atlas → Collections

### Environment Variables on Railway:
```
MONGODB_URI=mongodb+srv://...
EXTERNAL_URL=https://your-app.up.railway.app
PORT=3000
NODE_ENV=production
```

### Future Improvements:
1. Add user authentication
2. Add rate limiting  
3. Upgrade to paid tiers for more storage
4. Add custom domain

---

## 📚 More Resources

- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Guide](https://docs.mongodb.com/atlas)
- [WebSocket Real-time Sync](./EXTERNAL_DEPLOYMENT.md)
- [Local Development](./README.md)

**Questions?** Check Railway logs or MongoDB Atlas dashboard!
