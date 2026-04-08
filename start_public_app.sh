#!/bin/bash

# =========================================================
# Kisan Kamai - Public Start Script
# =========================================================
# This script starts the Next.js app and binds it to 0.0.0.0 
# so it can be accessed from other devices on your local 
# network (or public IP if ports are forwarded).

PORT=3000
HOST="0.0.0.0"

echo "Starting Kisan Kamai Web App on $HOST:$PORT..."
echo "If you want to run this in Production mode instead, uncomment the build lines below:"
# npm run build
# npm start -- -H $HOST -p $PORT

# Development mode (with network access)
npm run dev -- -H $HOST -p $PORT
