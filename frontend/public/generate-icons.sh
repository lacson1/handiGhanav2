#!/bin/bash

# Generate PWA icons from SVG
# Requires ImageMagick: brew install imagemagick (on macOS)

echo "Generating PWA icons..."

# Create icons directory if it doesn't exist
mkdir -p icons

# Generate PNG icons from SVG
convert -background none -resize 192x192 icon.svg icons/pwa-192x192.png
convert -background none -resize 512x512 icon.svg icons/pwa-512x512.png
convert -background none -resize 180x180 icon.svg icons/apple-touch-icon.png
convert -background none -resize 32x32 icon.svg icons/favicon-32x32.png
convert -background none -resize 16x16 icon.svg icons/favicon-16x16.png

# Copy to public directory
cp icons/pwa-192x192.png public/
cp icons/pwa-512x512.png public/
cp icons/apple-touch-icon.png public/
cp icons/favicon-32x32.png public/
cp icons/favicon-16x16.png public/

# Generate Safari pinned tab SVG (simplified)
cat > public/safari-pinned-tab.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#FACC15"/>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="280" font-weight="bold" fill="#000000" text-anchor="middle" dominant-baseline="middle">H</text>
</svg>
EOF

echo "✅ Icons generated successfully!"
echo "Icons are in the public/ directory"

