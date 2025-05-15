# Step-by-Step Vercel Deployment Guide

This guide will walk you through deploying your KuppiSite application on Vercel, with the server and client as separate projects.

## Important Note for Server Deployment

For the server to work correctly on Vercel, we've made these key changes:
1. Updated `server/index.js` to export the Express app for serverless deployment
2. Simplified `server/vercel.json` for proper routing
3. Added environment variable handling

## Deploying the Server

1. **Login to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Login or create an account if you don't have one

2. **Create a New Project**:
   - Click "Add New" > "Project"
   - Import your GitHub repository
   - **Important**: Select the `deployment` branch

3. **Configure the Project**:
   - **Root Directory**: `/server`
   - **Framework Preset**: Select "Other"
   - **Build Command**: Leave empty (uses default)
   - **Output Directory**: Leave empty (uses default)

4. **Configure Environment Variables**:
   - Click "Environment Variables" and add the following:
     - `MONGODB_URI`: Your MongoDB connection string 
     - `JWT_SECRET`: A secure string for JWT token generation
     - `JWT_EXPIRE`: `30d` (or your preferred expiration time)
     - `PORT`: `5000` (Vercel will override this, but good to include)

5. **Deploy**:
   - Click "Deploy"
   - Wait for the deployment to complete
   - Note the production URL (e.g., `https://kuppisite-server.vercel.app`)

## Deploying the Client

1. **Create a New Project in Vercel**:
   - Click "Add New" > "Project"
   - Select the same GitHub repository

2. **Configure the Project**:
   - **Root Directory**: `/client`
   - **Framework Preset**: Select "Create React App"
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

3. **Configure Environment Variables**:
   - Click "Environment Variables" and add:
     - `REACT_APP_API_URL`: URL of your server deployment + `/api` (e.g., `https://kuppisite-server.vercel.app/api`)

4. **Deploy**:
   - Click "Deploy"
   - Wait for the deployment to complete
   - Note the production URL (e.g., `https://kuppisite-client.vercel.app`)

## Updating CORS Settings

After deploying the client, you need to update the server's CORS settings:

1. Go to your server project in Vercel Dashboard
2. Go to "Settings" > "Environment Variables"
3. Add or update `CORS_ORIGIN` with your client's domain (e.g., `https://kuppisite-client.vercel.app`)
4. Click "Save"
5. Redeploy the server project

## Testing the Deployment

1. Visit your client app URL
2. Try to register a new account
3. Log in with your credentials
4. Verify that you can see and watch videos

## Troubleshooting

### CORS Issues
- Check browser console for CORS errors
- Verify the `CORS_ORIGIN` in server settings includes your client domain
- Make sure server URLs in client use the correct format

### Authentication Issues
- JWT_SECRET might be invalid or missing
- Check that token is being properly sent in the Authorization header

### Database Connection Issues
- Verify MongoDB URI is correct
- Check MongoDB Atlas settings to ensure connections are allowed from Vercel's IPs

## Continuous Deployment

Any push to the `deployment` branch will trigger a new deployment if you've configured your Vercel project to deploy from this branch.

To switch the deployment branch:
1. Go to your Vercel project
2. Click "Settings" > "Git"
3. Under "Production Branch", select "deployment"
4. Click "Save"
