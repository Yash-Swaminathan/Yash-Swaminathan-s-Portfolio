#!/bin/bash

# Portfolio Database Setup Script
echo "🚀 Starting Portfolio Database Environment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please make sure .env file exists in the project root"
    exit 1
fi

# Start the containers
echo "📦 Starting PostgreSQL and pgAdmin containers..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Containers are running successfully!"
    echo ""
    echo "📊 Database Connection Info:"
    echo "  Host: localhost"
    echo "  Port: 5432"
    echo "  Database: portfolio_db"
    echo "  Username: portfolio_user"
    echo ""
    echo "🔧 pgAdmin Access:"
    echo "  URL: http://localhost:5050"
    echo "  Email: admin@portfolio.local"
    echo "  Password: admin_password"
    echo ""
    echo "🎯 To test button click functionality:"
    echo "  SELECT increment_button_click('test_button');"
    echo "  SELECT * FROM button_click_stats;"
else
    echo "❌ Some containers failed to start. Check logs with:"
    echo "docker-compose logs"
fi