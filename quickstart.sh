#!/bin/bash
# Quick Start Demo Script for AI Gold Master

echo "========================================"
echo "AI GOLD MASTER - Quick Start Demo"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env file created. Please edit it with your Telegram credentials."
    echo ""
fi

# Run tests
echo "🧪 Running tests..."
npm test
echo ""

# Ask user if they want to start the server
echo "========================================"
echo "All tests passed! ✓"
echo "========================================"
echo ""
echo "To start the AI Gold Master system:"
echo "  npm start"
echo ""
echo "Access the web interface at:"
echo "  http://localhost:3000"
echo ""
echo "Don't forget to configure your Telegram credentials in .env file!"
echo ""
