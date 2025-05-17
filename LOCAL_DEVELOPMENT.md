# Local Development Guide for KuppiSite

This document provides instructions for running the KuppiSite application locally for testing.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or Atlas connection)

## Running the Frontend with Local Backend

For complete local development (both frontend and backend running locally):

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=30d
   PORT=5000
   CORS_ORIGIN=http://localhost:3000
   ```

4. Start the server:
   ```
   npm start
   ```

   The server should now be running on http://localhost:5000.

5. In a new terminal, navigate to the client directory:
   ```
   cd client
   ```

6. Install dependencies:
   ```
   npm install
   ```

7. Start the client in development mode:
   ```
   npm run dev:local
   ```

   The client should now be running on http://localhost:3000.

8. Use the provided batch script for convenience:
   ```
   start-local-dev.bat
   ```

## Running the Frontend with Vercel Backend

For testing the frontend with the deployed Vercel backend:

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies (if not already done):
   ```
   npm install
   ```

3. Start the client with Vercel backend configuration:
   ```
   npm run dev:vercel
   ```

   The client should now be running on http://localhost:3000 and connecting to https://kuppisite.vercel.app/api.

4. Use the provided batch script for convenience:
   ```
   run-local-with-vercel-backend.bat
   ```

## Testing the Application

1. Open your browser and navigate to http://localhost:3000
2. Register a new account or log in with existing credentials
3. Try accessing and watching videos

## Debugging Connection Issues

We've added a special debug page to help diagnose API connection issues:

1. With both client and server running, go to http://localhost:3000/debug
2. The debug page will:
   - Test API connectivity
   - Check CORS configuration
   - Show environment variable settings
   - Display any connection errors

This is especially helpful when troubleshooting issues between local and deployed environments.

## Troubleshooting

### API Connection Issues
- Check that the server is running on port 5000
- Verify that CORS is properly configured in the server
- Check browser console for any error messages

### Authentication Issues
- Clear browser localStorage if you're seeing token-related errors
- Verify that JWT_SECRET is consistent

### Database Issues
- Ensure MongoDB is running (if using local MongoDB)
- Check MongoDB connection string if using Atlas
