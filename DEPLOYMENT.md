# Deploying KuppiSite to Vercel

This guide provides instructions for deploying both the client and server components of KuppiSite to Vercel as separate projects.

## Prerequisites

1. [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/cli) installed (optional for local deployment)
3. GitHub repository with your code

## Important Security Notice

**NEVER commit sensitive information like database credentials, API keys, or JWT secrets to your repository.** Instead, use environment variables in Vercel.

## Step 1: Deploy the Server

### Option 1: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Set the root directory to `server`
   - Framework preset: Other
   - Build command: None (leave empty)
   - Output directory: None (leave empty)
5. Add environment variables:
   - `JWT_SECRET`: Your secure JWT secret
   - `JWT_EXPIRE`: `30d`
   - `MONGODB_URI`: Your MongoDB connection string
   - `CORS_ORIGIN`: The domain of your client app (will be set after client deployment)
6. Click "Deploy"
7. After deployment, note the production URL (e.g., `https://kuppisite-server.vercel.app`)

### Option 2: Deploy via Vercel CLI

```bash
# Navigate to the server directory
cd server

# Login to Vercel if you haven't already
vercel login

# Deploy to Vercel
vercel

# Follow the prompts and set environment variables
```

## Step 2: Deploy the Client

### Option 1: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Set the root directory to `client`
   - Framework preset: Create React App
   - Build command: `npm run build`
   - Output directory: `build`
5. Add environment variables:
   - `REACT_APP_SERVER_URL`: The API URL from Step 1, e.g., `https://kuppisite-server.vercel.app/api`
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Navigate to the client directory
cd client

# Create a production build
npm run build

# Deploy to Vercel
vercel

# Follow the prompts and set environment variables
```

## Step 3: Update CORS Settings on Server

After deploying the client, you need to update the server's CORS settings:

1. Go to your server project in Vercel Dashboard
2. Go to "Settings" > "Environment Variables"
3. Add or update `CORS_ORIGIN` with your client's domain (e.g., `https://kuppisite-client.vercel.app`)
4. Click "Save"
5. Go to "Deployments" and redeploy the latest deployment to apply changes

## Step 4: Verify the Deployment

1. Visit your client app URL
2. Try to register, log in, and access videos
3. Check the browser's developer console for any CORS or API errors

## Troubleshooting

1. **CORS Issues**: Ensure the server's `CORS_ORIGIN` contains the exact domain of your client app
2. **API Connection Issues**: Verify that `REACT_APP_SERVER_URL` points to the correct server API URL
3. **MongoDB Connection Issues**: Check that your MongoDB Atlas cluster allows connections from Vercel's IP addresses
4. **Environment Variables**: Make sure all environment variables are correctly set in Vercel

## Continuous Deployment

Vercel automatically deploys changes when you push to your connected GitHub repository. You can configure the deployment settings in Vercel dashboard.
