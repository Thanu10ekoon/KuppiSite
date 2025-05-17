# Vercel Deployment Troubleshooting Guide

This document provides troubleshooting steps for common Vercel deployment issues with KuppiSite.

## MongoDB Connection Issues

If you're seeing MongoDB connection errors in your Vercel deployment logs:

1. **Check MongoDB Atlas IP Whitelist**:
   - Add `0.0.0.0/0` to your MongoDB Atlas IP whitelist to allow connections from anywhere
   - This is necessary since Vercel uses dynamic IPs for serverless functions

2. **Verify MongoDB URI Format**:
   - Make sure the URI contains your database name at the end, e.g., `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
   - Special characters in password need to be URL encoded

3. **Update Environment Variables**:
   - Go to your server project in Vercel dashboard
   - Check "Settings" > "Environment Variables"
   - Ensure MONGODB_URI is correctly set

## CORS Issues

If you see "Access to XMLHttpRequest has been blocked by CORS policy":

1. **Check Your Frontend Domain**:
   - Look at the error message to identify your frontend domain
   - It might be slightly different from what you expected (e.g., `kuppi-site.vercel.app` vs `kuppisite.vercel.app`)

2. **Update CORS Settings**:
   - Go to your server project in Vercel dashboard
   - Update `CORS_ORIGIN` to include all possible domain variations, separated by commas:
     ```
     https://kuppi-site.vercel.app,https://kuppisite.vercel.app
     ```

3. **Verify Frontend API URL**:
   - Ensure `REACT_APP_SERVER_URL` in your client project points to the correct backend URL
   - It should include `/api` at the end (e.g., `https://kuppisite.vercel.app/api`)

## HTTP 500 Error (Internal Server Error)

If your API endpoints return 500 errors:

1. **Check Vercel Logs**:
   - Go to your server project in Vercel dashboard
   - Click "View Function Logs" to see what's causing the error

2. **Common Causes**:
   - MongoDB connection issues
   - Missing environment variables
   - Syntax errors in server code
   - Memory limits exceeded

3. **Fix and Redeploy**:
   - Make necessary fixes in your code
   - Push changes to GitHub
   - Redeploy through Vercel

## Authentication Issues

If users can't log in or register:

1. **Verify JWT Secret**:
   - Check that `JWT_SECRET` is properly set in server environment variables
   - Make sure `JWT_EXPIRE` is also set (e.g., `30d`)

2. **Check Request Flow**:
   - Use browser developer tools to inspect network requests
   - Look for failed requests to `/api/auth/login` or `/api/auth/register`
   - Check response bodies for specific error messages

## Improving Error Messages

To make debugging easier, we've enhanced error handling in:

1. **Server-side:**
   - Added detailed logs for MongoDB connection attempts
   - Improved error messages in authentication endpoints
   - Added specific error types for common failures

2. **Client-side:**
   - Better error displays for login/registration failures
   - Improved handling of network errors
   - Added a debug page at `/debug` to test API connectivity
