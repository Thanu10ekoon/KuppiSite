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
     - Name: `REACT_APP_SERVER_URL` 
     - Value: URL of your server deployment + `/api` (e.g., `https://kuppisite-server.vercel.app/api`)
     - **IMPORTANT**: Enter this as plain text. Do NOT use the "@" symbol or select "Reference a Secret"

4. **Deploy**:
   - Click "Deploy"
   - Wait for the deployment to complete
   - Note the production URL (e.g., `https://kuppisite-client.vercel.app`)

## Updating CORS Settings

After deploying the client, you need to update the server's CORS settings:

1. Go to your server project in Vercel Dashboard
2. Go to "Settings" > "Environment Variables"
3. Add or update `CORS_ORIGIN` with your client's domain
   - **Important**: Add both the client and server URLs to handle potential cross-origin issues
   - Include the domain with and without hyphens if your URLs have different formats
   - Example value: `https://kuppi-site.vercel.app,https://kuppisite.vercel.app`
4. Click "Save"
5. Redeploy the server project by going to "Deployments" and clicking "Redeploy" on the latest deployment

## Testing the Deployment

1. Visit your client app URL
2. Try to register a new account
3. Log in with your credentials
4. Verify that you can see and watch videos

## Troubleshooting

### CORS Issues
- Check browser console for CORS errors
- Verify the `CORS_ORIGIN` in server settings includes your client domain
  - If your client domain has a hyphen (e.g., `kuppi-site`) but server domain doesn't (e.g., `kuppisite`), make sure both variations are included in CORS_ORIGIN
  - Example: `https://kuppi-site.vercel.app,https://kuppisite.vercel.app`
- The error "Access to XMLHttpRequest has been blocked by CORS policy" indicates that your client's domain isn't in the server's allowed origins list
- Make sure server URLs in client use the correct format and include `/api` path
- After updating CORS settings, redeploy the server for changes to take effect

### Environment Variable Issues
- For the client, ensure `REACT_APP_SERVER_URL` is set properly in Vercel environment variables
- For the server, check that `MONGODB_URI`, `JWT_SECRET`, and `CORS_ORIGIN` are properly set
- If using environment variables in Vercel, enter them as plain text (don't use the @ symbol or reference secrets)
- Environment variables are injected at build time, so you must redeploy after changing them

### Authentication Issues
- JWT_SECRET might be invalid or missing
- Check that token is being properly sent in the Authorization header
- Try clearing browser localStorage if you're seeing persistent auth errors
- Check browser console for authentication-related errors

### Database Connection Issues
- Verify MongoDB URI is correct
- Check MongoDB Atlas settings to ensure connections are allowed from Vercel's IPs
- If using MongoDB Atlas, make sure your IP whitelist includes `0.0.0.0/0` for Vercel
- Test database connection by adding a console log in the server code

## Continuous Deployment

Any push to the `deployment` branch will trigger a new deployment if you've configured your Vercel project to deploy from this branch.

To switch the deployment branch:
1. Go to your Vercel project
2. Click "Settings" > "Git"
3. Under "Production Branch", select "deployment"
4. Click "Save"
