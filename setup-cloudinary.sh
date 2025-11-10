#!/bin/bash

# Cloudinary Setup Script for HandiGhana
# This script helps you configure Cloudinary for both local and production environments

set -e

echo ""
echo "☁️  ═══════════════════════════════════════════"
echo "   CLOUDINARY SETUP FOR HANDIGHANA"
echo "═══════════════════════════════════════════"
echo ""

# Check if running from project root
if [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📝 You'll need your Cloudinary credentials."
echo "   Get them from: https://console.cloudinary.com/"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Prompt for credentials
read -p "🌐 Enter your CLOUDINARY_CLOUD_NAME: " CLOUD_NAME
read -p "🔑 Enter your CLOUDINARY_API_KEY: " API_KEY
read -sp "🔐 Enter your CLOUDINARY_API_SECRET: " API_SECRET
echo ""
echo ""

# Validate inputs
if [ -z "$CLOUD_NAME" ] || [ -z "$API_KEY" ] || [ -z "$API_SECRET" ]; then
    echo "❌ Error: All fields are required!"
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Setup local environment
echo "📁 Setting up LOCAL environment..."
cd backend

# Check if .env exists, create if not
if [ ! -f .env ]; then
    touch .env
    echo "✅ Created .env file"
fi

# Remove old Cloudinary settings if they exist
if grep -q "CLOUDINARY_" .env; then
    echo "🔄 Updating existing Cloudinary configuration..."
    sed -i.bak '/CLOUDINARY_/d' .env && rm .env.bak 2>/dev/null || sed -i '/CLOUDINARY_/d' .env
fi

# Add new settings
echo "" >> .env
echo "# Cloudinary Configuration" >> .env
echo "CLOUDINARY_CLOUD_NAME=$CLOUD_NAME" >> .env
echo "CLOUDINARY_API_KEY=$API_KEY" >> .env
echo "CLOUDINARY_API_SECRET=$API_SECRET" >> .env

echo "✅ Local environment configured"
echo ""

# Ask about production setup
read -p "🚀 Set up PRODUCTION environment (Fly.io)? (y/n): " setup_prod

if [ "$setup_prod" = "y" ] || [ "$setup_prod" = "Y" ]; then
    echo ""
    echo "🚀 Setting up PRODUCTION environment..."
    echo "   (This will restart your app automatically)"
    echo ""
    
    # Check if flyctl is installed
    if ! command -v fly &> /dev/null; then
        echo "⚠️  Warning: 'fly' command not found. Please install flyctl first:"
        echo "   brew install flyctl"
        echo ""
        echo "📋 Manual setup commands:"
        echo ""
        echo "fly secrets set CLOUDINARY_CLOUD_NAME=\"$CLOUD_NAME\" -a handighana-backend"
        echo "fly secrets set CLOUDINARY_API_KEY=\"$API_KEY\" -a handighana-backend"
        echo "fly secrets set CLOUDINARY_API_SECRET=\"$API_SECRET\" -a handighana-backend"
    else
        echo "🔐 Setting Cloudinary secrets in Fly.io..."
        fly secrets set CLOUDINARY_CLOUD_NAME="$CLOUD_NAME" -a handighana-backend
        fly secrets set CLOUDINARY_API_KEY="$API_KEY" -a handighana-backend
        fly secrets set CLOUDINARY_API_SECRET="$API_SECRET" -a handighana-backend
        echo "✅ Production environment configured"
    fi
fi

cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ CLOUDINARY SETUP COMPLETE!"
echo ""
echo "🧪 Test your setup:"
echo ""
echo "   Local:      http://localhost:3001/test/config"
echo "   Production: https://handighana-backend.fly.dev/test/config"
echo ""
echo "🎨 You can now:"
echo "   • Upload provider profile photos"
echo "   • Add work portfolio images"
echo "   • Upload user avatars"
echo "   • Share service images"
echo ""
echo "═══════════════════════════════════════════"
echo ""

