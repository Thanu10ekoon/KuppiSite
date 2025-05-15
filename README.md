# YouTube Video Sharing Platform

A full-stack web application where authenticated users can access private YouTube videos.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB Atlas (MongoDB online)
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
.
├── client/                 # React frontend
│   ├── public/             # Public assets
│   ├── src/                # Source files
│       ├── components/     # Reusable components
│       ├── context/        # Context providers
│       ├── pages/          # Page components
│       └── ...
└── server/                 # Node.js backend
    ├── controllers/        # Request handlers
    ├── middleware/         # Middleware functions
    ├── models/             # Database models
    ├── routes/             # API routes
    └── index.js            # Entry point
```

## Setup Instructions

### MongoDB Atlas Setup

1. **Create a MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account

2. **Create a New Cluster**:
   - Click "Build a Cluster"
   - Choose the free tier option (Shared Clusters)
   - Select your preferred cloud provider and region
   - Click "Create Cluster" (creation takes a few minutes)

3. **Database Access**:
   - Create a database user
   - Username and password authentication
   - Remember to save the password

4. **Network Access**:
   - Click on "Network Access" in the sidebar
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" for development (restrict for production)

5. **Get Connection String**:
   - Once the cluster is created, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your preferred database name (e.g., "kuppi-videos")

### Backend Setup

1. **Navigate to the server directory**:
   ```
   cd server
   ```

2. **Create a .env file in the server directory with the following variables**:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string_here
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=7d
   ```

3. **Install dependencies**:
   ```
   npm install
   ```

4. **Start the development server**:
   ```
   npm run dev
   ```

### Frontend Setup

1. **Navigate to the client directory**:
   ```
   cd client
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Create a .env file in the client directory**:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**:
   ```
   npm start
   ```

## YouTube Video Access

To embed private YouTube videos that only authenticated users can access:

1. The private videos must be hosted on your YouTube account
2. Users authenticate through your application
3. The application securely displays the embedded videos to authenticated users
4. Private videos remain private on YouTube, but your application acts as a secure gateway

Note: YouTube API does not allow direct access to private videos via API. The approach used here is to securely embed the videos in your authenticated application.

## Admin Features

As an admin user, you can:
- Add new videos to the platform
- Update existing videos
- Delete videos from the platform

Regular users can only view the videos after authentication. 