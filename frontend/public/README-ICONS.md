# PWA Icons Setup

## Quick Setup (Using ImageMagick)

If you have ImageMagick installed:

```bash
cd frontend/public
./generate-icons.sh
```

## Manual Setup (Using Online Tools)

1. **Create Base Icon**: Use the `icon.svg` as a reference
2. **Generate Icons**: Visit https://realfavicongenerator.net/
   - Upload `icon.svg` or create a new design
   - Download the generated icons
   - Place them in the `public/` directory

## Required Icons

Place these files in the `public/` directory:

- `pwa-192x192.png` (192x192 pixels)
- `pwa-512x512.png` (512x512 pixels)
- `apple-touch-icon.png` (180x180 pixels)
- `favicon-32x32.png` (32x32 pixels)
- `favicon-16x16.png` (16x16 pixels)
- `safari-pinned-tab.svg` (SVG format)

## Design Guidelines

The icon uses Ghana's flag colors:
- **Red**: #CE1126 (top third)
- **Yellow**: #FACC15 (middle third)
- **Green**: #006B3F (bottom third)
- **Letter H**: Black, bold, centered

## Testing

After generating icons:
1. Build the app: `npm run build`
2. Test PWA installation on mobile device
3. Check icon appears in "Add to Home Screen"

