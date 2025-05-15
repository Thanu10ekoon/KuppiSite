# Vercel Deployment Verification Guide

After dep2. **Check API URL in Client**:
   - Verify that `REACT_APP_SERVER_URL` is set correctly in the clientying both the server and client to Vercel, follow these steps to verify everything is working correctly.

## 1. Server Verification

1. **Check Server Endpoint**
   - Visit your server URL (e.g., `https://kuppisite-server.vercel.app/`)
   - You should **NOT** see your source code displayed as plain text
   - You might see a 404 page, which is expected for the root URL

2. **Check API Health**
   - Try accessing the registration endpoint with a GET request (it will return a 405 Method Not Allowed but will confirm the API is running)
   - Visit: `https://kuppisite-server.vercel.app/api/auth/register`
   - You should get a response like "Method not allowed" or similar, not your source code
   
3. **Check Environment Variables**
   - In Vercel Dashboard, go to your server project
   - Click "Settings" > "Environment Variables"
   - Verify that all required variables are set:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `JWT_EXPIRE`
     - `CORS_ORIGIN` (including your client URL)

## 2. Client Verification

1. **Check Client Loading**
   - Visit your client URL (e.g., `https://kuppisite-client.vercel.app/`)
   - Verify the home page loads correctly

2. **Test Registration**
   - Try to register a new user
   - Check the browser console for any API connection errors

3. **Test Login**
   - Log in with the user you just created
   - Verify that you can access the dashboard

4. **Test Video Playback**
   - Click on a video to view details
   - Ensure the video player loads and plays the content

## 3. CORS Troubleshooting

If you encounter CORS errors in the browser console:

1. **Verify CORS Setting on Server**
   - Check that `CORS_ORIGIN` includes your client URL exactly
   - For example: `https://kuppisite-client.vercel.app` (no trailing slash)

2. **Check API URL in Client**
   - Verify that `REACT_APP_API_URL` is set correctly in the client
   - Should be: `https://kuppisite-server.vercel.app/api` (note the `/api` at the end)

3. **Check Network Requests**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Watch for requests when you perform actions
   - Look for any failed requests or CORS errors

4. **Redeploy if Needed**
   - If you make any changes to environment variables, you'll need to redeploy

## 4. Database Connection Issues

If users cannot be created or videos don't load:

1. **Check MongoDB Connection**
   - Verify your MongoDB Atlas cluster is running
   - Check that your IP whitelist includes Vercel's IP addresses (or set to allow all)
   - Test the connection string manually

2. **Check Server Logs**
   - In Vercel Dashboard, go to your server project
   - Click on the latest deployment
   - Check "Functions" and look for any error logs

## 5. Successful Deployment Checklist

- [ ] Server API endpoints are accessible
- [ ] Client loads without errors
- [ ] User registration works
- [ ] Login works and keeps session
- [ ] Videos can be viewed
- [ ] No CORS errors in console 
- [ ] Admin features (if applicable) work correctly

If all these checks pass, your deployment is successful!
