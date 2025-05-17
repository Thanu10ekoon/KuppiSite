@echo off
echo Starting KuppiSite server...
cd server
start cmd /k "npm start"
echo Starting KuppiSite client...
cd ../client
start cmd /k "npm run dev:local"
echo KuppiSite development environment started.
echo Server: http://localhost:5000
echo Client: http://localhost:3000
