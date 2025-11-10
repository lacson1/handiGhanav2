#!/bin/bash

# Create Demo Users Script
# This script creates demo users via the API

API_URL="${API_URL:-http://localhost:3001}"

echo "🌱 Creating demo users via API..."
echo "Using API URL: $API_URL"
echo ""

# Function to create user
create_user() {
  local email=$1
  local password=$2
  local name=$3
  local phone=$4
  local role=$5
  
  echo "Creating $role: $email..."
  
  response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$email\",
      \"password\": \"$password\",
      \"name\": \"$name\",
      \"phone\": \"$phone\",
      \"role\": \"$role\"
    }")
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
    echo "✅ Successfully created $email"
  elif echo "$body" | grep -q "already exists"; then
    echo "ℹ️  User $email already exists"
  else
    echo "❌ Failed to create $email (HTTP $http_code)"
    echo "   Response: $body"
  fi
  echo ""
}

# Create demo users
create_user "customer@test.com" "password123" "John Doe" "+233241111111" "CUSTOMER"
create_user "provider@test.com" "password123" "Bis FagQ" "+233241234567" "PROVIDER"
create_user "admin@test.com" "admin123" "Admin User" "+233241111999" "ADMIN"

echo "🎉 Demo users setup complete!"
echo ""
echo "📝 Demo Credentials:"
echo "   Customer: customer@test.com / password123"
echo "   Provider: provider@test.com / password123"
echo "   Admin: admin@test.com / admin123"
echo ""
echo "💡 To activate hidden demo login on login page:"
echo "   Click 5 times rapidly on the 'Sign In' title area"

