# 🍃 MongoDB Setup Guide for Cute Couple App

## 🚀 Quick Setup - MongoDB Atlas (Recommended - Free!)

MongoDB Atlas is a free cloud database service. This is the easiest option!

### Step 1: Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Start Free" and create an account
3. Choose the **FREE** tier (M0 Sandbox)

### Step 2: Create a Cluster
1. Select **AWS** as provider
2. Choose a region close to you
3. Keep cluster name as "Cluster0" (or rename if you prefer)
4. Click "Create Cluster" (takes 1-3 minutes)

### Step 3: Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `couple-app`
5. Password: `cuteapp123` (or create your own secure password)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (or add your specific IP)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Clusters" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" driver
5. Copy the connection string (looks like: `mongodb+srv://...`)

### Step 6: Update Your App
1. Open `backend/.env` file
2. Replace the MONGODB_URI line with your connection string:
   ```
   MONGODB_URI=mongodb+srv://couple-app:cuteapp123@cluster0.xxxxx.mongodb.net/cute-couple-app?retryWrites=true&w=majority
   ```
3. Replace `cluster0.xxxxx` with your actual cluster URL
4. Save the file

## 🏠 Alternative: Local MongoDB (If you prefer)

### Option A: MongoDB Community Server
1. Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Install MongoDB Community Server
3. Start MongoDB:
   ```bash
   mongod
   ```
4. Update your `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/cute-couple-app
   ```

### Option B: Docker (If you have Docker)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🔧 Restart Your App

After setting up MongoDB:

1. Stop the backend server (Ctrl+C in the terminal)
2. Start it again:
   ```bash
   npm run dev
   ```
3. You should see: "💕 Connected to MongoDB successfully!"

## ✅ Verify It's Working

When your app starts successfully, you should see:
```
💕 Server running on port 5000
💕 Connected to MongoDB successfully!
```

## 🆘 Troubleshooting

**"MongooseServerSelectionError"**
- Check your internet connection
- Verify the connection string is correct
- Make sure IP address is whitelisted in Atlas
- Check username/password are correct

**"Authentication failed"**
- Verify database user credentials
- Check if user has correct permissions

**Still having issues?**
- The app will still run without database (with limited features)
- You can set up MongoDB later and restart the app

## 💡 Why MongoDB Atlas?

✅ **Free forever** (up to 512MB storage)  
✅ **No installation** required  
✅ **Automatic backups**  
✅ **Global availability**  
✅ **Easy to manage**  

Perfect for your cute couple app! 💕
