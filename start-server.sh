#!/bin/bash

# Mac Audio Streamer - Start Server Script
# This script starts both the UDP audio server and QR code server

echo "🎵 Starting Mac Audio Streamer..."
echo "================================"
echo ""

# Check if servers are already running
if lsof -i :3001 > /dev/null 2>&1; then
    echo "⚠️  UDP server is already running on port 3001"
    echo "   Please stop it first or use a different port"
    exit 1
fi

if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  QR server is already running on port 3000"
    echo "   Please stop it first or use a different port"
    exit 1
fi

# Get local IP
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

echo "📱 Your iPhone can connect to: $LOCAL_IP:3001"
echo "🌐 QR code available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the servers"
echo ""

# Start UDP server in background
echo "🎧 Starting UDP audio server..."
node udp-server.js &
UDP_PID=$!

# Wait a moment for UDP server to start
sleep 2

# Start QR server in background
echo "📱 Starting QR code server..."
node qr-server.js &
QR_PID=$!

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $UDP_PID $QR_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

echo "✅ Both servers are running!"
echo "   UDP Server PID: $UDP_PID"
echo "   QR Server PID: $QR_PID"
echo ""

# Wait for processes
wait
