# MongoDB Atlas Configuration Guide for Vercel Deployment

This document explains how to properly configure MongoDB Atlas for your Vercel deployment of KuppiSite.

## Common MongoDB Connection Issues

Based on the logs, we're seeing connection errors from your Vercel deployment to MongoDB. Here's how to fix them:

### 1. IP Whitelist Configuration

MongoDB Atlas by default restricts which IP addresses can connect to your database. Since Vercel uses dynamic IPs, you need to allow connections from anywhere:

1. Log in to your [MongoDB Atlas account](https://cloud.mongodb.com/)
2. Select your project
3. Go to Network Access in the left sidebar
4. Click "ADD IP ADDRESS"
5. Click "ALLOW ACCESS FROM ANYWHERE" (adds `0.0.0.0/0` to your whitelist)
6. Click "Confirm"

### 2. Checking Your Connection String

Make sure your MongoDB connection string is correctly formatted:

1. In MongoDB Atlas, click on your cluster
2. Click "Connect"
3. Choose "Connect your application"
4. Select "Node.js" and the appropriate version
5. Copy the connection string
6. Replace `<password>` with your database user's password
7. Replace `<dbname>` with your database name

### 3. Update Vercel Environment Variables

Update your MongoDB URI in Vercel:

1. Go to your Vercel dashboard
2. Select your server project
3. Go to "Settings" > "Environment Variables"
4. Update `MONGODB_URI` with the correct connection string
5. Click "Save"
6. Redeploy your server project

## Testing MongoDB Connection

To diagnose MongoDB connection issues, we've added a test script to the server folder. When developing locally, run:

```bash
cd server
node test-mongodb-connection.js
```

This will provide detailed diagnostics about your MongoDB connection.

## Important Note on MongoDB URI Format

The connection string should look like:

```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

Common issues include:
- Missing database name at the end of the URI
- Incorrect username or password
- Special characters in password not properly URL encoded

## MongoDB Atlas Free Tier Limitations

If you're using the MongoDB Atlas free tier:
- The database may sleep after inactivity
- There are connection limits
- Certain operations may be throttled

For a production deployment, consider upgrading to a paid tier if you experience frequent connection issues.
