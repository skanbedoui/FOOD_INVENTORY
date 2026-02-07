# 🗄️ MongoDB Setup Guide

Your Food Inventory app now uses **MongoDB Atlas** for permanent, cloud-based data storage!

## ✅ Quick Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account

1. Go to **[mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)**
2. Click **"Sign Up"** (it's FREE!)
3. Sign up with Email or Google account
4. Verify your email

### Step 2: Create Your First Cluster

1. After login, click **"Create"** (or "Build a Cluster")
2. Select **"Free Tier"** (M0 - always free)
3. Choose region close to you
4. Click **"Create Cluster"** (wait 2-3 minutes)

### Step 3: Get Your Connection String

1. In MongoDB Atlas dashboard, click **"Connect"**
2. Click **"Drivers"**
3. Select **"Node.js"** driver
4. Copy the connection string that looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
   ```

### Step 4: Create Database User

1. Go to **"Database Access"** tab (left sidebar)
2. Click **"+ Add New Database User"**
3. Enter username: `inventoryuser` (or your choice)
4. Enter password: (save it securely!)
5. Select **"Autogenerate Secure Password"** for random secure password
6. Click **"Add User"**

### Step 5: Connect Your App

1. Replace your connection string:
   - Replace `<username>` with your database username
   - Replace `<password>` with your password
   - Replace `myFirstDatabase` with `food-inventory`

**Example:**
```
BEFORE: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

AFTER: mongodb+srv://inventoryuser:MySecurePassword123@cluster0.xxxxx.mongodb.net/food-inventory?retryWrites=true&w=majority
```

2. Open `.env` file in your project:
```bash
cp .env.example .env
```

3. Edit `.env` and add your connection string:
```
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://inventoryuser:MySecurePassword123@cluster0.xxxxx.mongodb.net/food-inventory?retryWrites=true&w=majority
EXTERNAL_URL=http://localhost:3000
```

### Step 6: Install Dependencies

```bash
npm install
```

### Step 7: Start the Server

```bash
npm start
```

You should see:
```
✅ Connected to MongoDB
✅ Loaded 0 items from MongoDB
🚀 Food Inventory Sync Server Started
```

🎉 **Done!** Your data is now saved to MongoDB!

---

## 📊 MongoDB Atlas Free Tier Includes

- ✅ **500MB Storage** (plenty for food inventory)
- ✅ **Unlimited read/write operations**
- ✅ **Real-time data sync**
- ✅ **Automatic backups**
- ✅ **Free tier - no credit card required forever**
- ✅ **99.9% uptime SLA**

---

## 🔒 Security Notes

1. **Never commit `.env` file** - Already added to `.gitignore`
2. **Keep passwords secret** - Don't share your connection string
3. **Use strong passwords** - MongoDB Atlas enforces this
4. **IP Whitelist** - MongoDB Atlas allows all IPs by default on free tier (add specific IPs later if needed)

---

## 🆘 Troubleshooting

### "Connection refused"
- Check your internet connection
- Verify connection string has correct username & password
- Check cluster is created (wait 2-3 minutes if new)

### "Authentication failed"
- Double-check username and password in connection string
- Confirm user was created in "Database Access"
- Password might have special characters - verify in connection string

### "Cannot find module 'mongoose'"
```bash
npm install mongoose
```

### "Data not loading"
- Check `.env` file has correct `MONGODB_URI`
- Verify MongoDB cluster is running
- Check server logs for connection errors

### Reset Everything
```bash
# Delete all data from MongoDB (careful!)
# Go to MongoDB Atlas → Collections → Delete Database
# Then restart server
npm start
```

---

## 🚀 Getting Data from MongoDB

Your inventory data is automatically:
- ✅ Saved when you scan items
- ✅ Restored on server restart
- ✅ Synced across all devices
- ✅ Backed up by MongoDB

View your data in MongoDB Atlas:
1. Go to **"Collections"** tab
2. Click **"food-inventory"** database
3. Click **"Inventory"** collection
4. See all your stored items!

---

## 💡 Next Steps

1. **Deploy to production** - Railway/Render (see EXTERNAL_DEPLOYMENT.md)
2. **Scale up** - In the future, upgrade to paid tier if needed
3. **Add backups** - MongoDB Atlas handles this automatically

---

Questions? Check the error logs or MongoDB documentation: [docs.mongodb.com](https://docs.mongodb.com)
