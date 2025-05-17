# React Environment Variables Guide for KuppiSite

This document explains how to properly configure environment variables for the KuppiSite client application.

## Environment Variable Files

React supports different environment files that are loaded based on the environment:

1. `.env` - Default variables for all environments
2. `.env.local` - Local overrides for all environments (not committed to Git)
3. `.env.development` - Variables for development environment
4. `.env.production` - Variables for production environment

## Required Environment Variables

The KuppiSite client requires the following environment variable:

- `REACT_APP_SERVER_URL`: The base URL of the API server including the `/api` path

## Example Configurations

### For Local Development (with local backend)

Create a `.env.development` file in the client folder:
```
REACT_APP_SERVER_URL=http://localhost:5000/api
```

### For Local Development (with Vercel backend)

Create a `.env.development.vercel` file in the client folder:
```
REACT_APP_SERVER_URL=https://kuppisite.vercel.app/api
```

### For Production (Vercel)

When deploying to Vercel, add the following environment variable in the Vercel dashboard:
```
REACT_APP_SERVER_URL=https://kuppisite.vercel.app/api
```

## Testing Environment Variables

To verify your environment variables are working correctly, you can:

1. Check the browser console for any API connection errors
2. Add a temporary console log in the `api.js` file:
   ```javascript
   console.log('API Base URL:', process.env.REACT_APP_SERVER_URL);
   ```

3. Run the application with `npm run dev:local` to use development variables

## Troubleshooting

- Remember that all React environment variables must start with `REACT_APP_`
- After changing environment variables, you need to restart the React development server
- Environment variables are embedded during build time, not runtime
- If you're getting "undefined" when accessing an environment variable, make sure it's correctly set in the appropriate `.env` file
