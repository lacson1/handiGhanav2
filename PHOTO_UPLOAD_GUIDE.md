# Photo Upload Feature Guide

## Overview

The photo upload feature allows users to upload images to Cloudinary with a modern, user-friendly interface. This guide explains how to use the reusable `PhotoUpload` component in your app.

## 🚀 Quick Start

### Basic Usage

```tsx
import PhotoUpload from '../components/PhotoUpload'

function MyComponent() {
  const handleUpload = (urls: string[]) => {
    console.log('Uploaded photo URLs:', urls)
    // Do something with the URLs (save to database, etc.)
  }

  return (
    <PhotoUpload
      onUpload={handleUpload}
      maxPhotos={5}
      folder="my-folder"
    />
  )
}
```

### Demo Page

Visit `/photo-upload-demo` to see the component in action with usage examples.

## 📦 Component API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onUpload` | `(urls: string[]) => void` | **Required** | Callback function that receives array of uploaded photo URLs |
| `maxPhotos` | `number` | `5` | Maximum number of photos allowed |
| `folder` | `string` | `'uploads'` | Cloudinary folder name for organization |
| `accept` | `string` | `'image/*'` | File input accept attribute |
| `maxSizeMB` | `number` | `5` | Maximum file size in megabytes |
| `multiple` | `boolean` | `true` | Allow multiple file selection |
| `previewUrls` | `string[]` | `[]` | Pre-populate with existing photo URLs |
| `className` | `string` | `''` | Additional CSS classes |
| `label` | `string` | `'Upload Photos'` | Label text for the upload area |
| `helperText` | `string` | Auto-generated | Helper text displayed below upload area |

## 🎨 Features

### ✅ What's Included

- **Drag & Drop Support**: Users can drag files directly onto the upload area
- **Image Preview**: Thumbnails with hover-to-remove functionality
- **Upload Progress**: Visual progress bar during upload
- **Validation**: Automatic file type and size validation
- **Error Handling**: User-friendly error messages
- **Dark Mode**: Full dark mode support
- **Mobile Responsive**: Works seamlessly on all devices
- **Multiple Files**: Upload multiple images at once
- **Photo Management**: Easy removal of individual photos

### 🔒 Validation

The component automatically validates:
- File type (only images allowed)
- File size (configurable, default 5MB)
- Number of photos (configurable maximum)

## 💡 Usage Examples

### Example 1: Profile Photo Upload

```tsx
import PhotoUpload from '../components/PhotoUpload'

function ProfileSettings() {
  const [avatarUrl, setAvatarUrl] = useState('')

  return (
    <PhotoUpload
      onUpload={(urls) => setAvatarUrl(urls[0])}
      maxPhotos={1}
      folder="profiles"
      label="Profile Photo"
      helperText="Upload a profile photo (max 5MB)"
    />
  )
}
```

### Example 2: Product Photos

```tsx
import PhotoUpload from '../components/PhotoUpload'

function ProductForm() {
  const [productPhotos, setProductPhotos] = useState<string[]>([])

  const handleSubmit = () => {
    // Submit form with productPhotos
    console.log('Product photos:', productPhotos)
  }

  return (
    <form onSubmit={handleSubmit}>
      <PhotoUpload
        onUpload={setProductPhotos}
        maxPhotos={10}
        folder="products"
        label="Product Images"
        helperText="Upload up to 10 high-quality product photos"
      />
      <button type="submit">Save Product</button>
    </form>
  )
}
```

### Example 3: Work Portfolio

```tsx
import PhotoUpload from '../components/PhotoUpload'

function ProviderPortfolio() {
  const [portfolioUrls, setPortfolioUrls] = useState<string[]>([])
  
  // Load existing photos
  useEffect(() => {
    const existingPhotos = ['https://...', 'https://...']
    setPortfolioUrls(existingPhotos)
  }, [])

  return (
    <PhotoUpload
      onUpload={setPortfolioUrls}
      maxPhotos={8}
      folder="portfolio"
      previewUrls={portfolioUrls}
      label="Portfolio Photos"
      helperText="Showcase your best work"
      maxSizeMB={10}
    />
  )
}
```

### Example 4: Review Photos

```tsx
import PhotoUpload from '../components/PhotoUpload'

function ReviewForm() {
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([])

  return (
    <PhotoUpload
      onUpload={setReviewPhotos}
      maxPhotos={5}
      folder="reviews"
      label="Add Photos (Optional)"
      helperText="Add photos to your review to help others"
    />
  )
}
```

## 🔧 Backend Configuration

### Cloudinary Setup

The backend uses Cloudinary for image storage. Configure these environment variables:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Development Mode

When Cloudinary is not configured, the system automatically switches to **demo mode**:
- Returns base64 data URLs for preview
- Perfect for local development
- No external dependencies required

## 📝 API Endpoints

### Upload Image

**Endpoint**: `POST /api/upload/image`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body**:
- `file`: Image file (required)
- `folder`: Folder name (optional, default: 'providers')

**Response**:
```json
{
  "url": "https://res.cloudinary.com/.../image.jpg",
  "publicId": "handyghana/folder/filename"
}
```

## 🎯 Best Practices

### 1. Choose Appropriate Folder Names

Organize uploads by feature:
- `profiles` - User profile photos
- `portfolio` - Provider work samples
- `reviews` - Review photos
- `verification` - ID documents
- `products` - Product images

### 2. Set Reasonable Limits

```tsx
// For profile photos
<PhotoUpload maxPhotos={1} maxSizeMB={5} />

// For portfolios
<PhotoUpload maxPhotos={10} maxSizeMB={10} />

// For quick uploads
<PhotoUpload maxPhotos={5} maxSizeMB={5} />
```

### 3. Pre-populate Existing Photos

When editing existing content, load current photos:

```tsx
const [photos, setPhotos] = useState<string[]>([])

useEffect(() => {
  // Load from API or state
  setPhotos(existingPhotos)
}, [])

<PhotoUpload
  onUpload={setPhotos}
  previewUrls={photos}
/>
```

### 4. Handle Errors Gracefully

The component handles errors internally, but you can add custom error handling:

```tsx
const handleUpload = (urls: string[]) => {
  try {
    // Save to your backend
    await savePhotos(urls)
  } catch (error) {
    console.error('Failed to save photos:', error)
    // Show error message to user
  }
}
```

## 🐛 Troubleshooting

### Issue: Upload fails with "No file uploaded"

**Solution**: Ensure your backend has `multer` configured correctly and the route accepts `multipart/form-data`.

### Issue: Photos not displaying after upload

**Solution**: Check that URLs are being saved correctly and are publicly accessible.

### Issue: Cloudinary errors in production

**Solution**: Verify all Cloudinary environment variables are set correctly in your production environment.

### Issue: Large images causing slow uploads

**Solution**: Consider implementing client-side image compression before upload or reduce `maxSizeMB`.

## 🔐 Security Considerations

1. **Authentication**: The upload endpoint requires authentication (Bearer token)
2. **File Validation**: Backend validates file types and sizes
3. **Rate Limiting**: Consider implementing rate limiting for upload endpoints
4. **Storage Limits**: Set appropriate Cloudinary quotas

## 📱 Mobile Support

The component is fully responsive and works seamlessly on mobile devices:
- Touch-friendly upload button
- Mobile-optimized grid layout
- Camera access on mobile browsers
- Smooth scrolling for photo previews

## 🌙 Dark Mode

Full dark mode support is included automatically:
- Adapts to system theme
- Consistent with app design system
- All states (normal, hover, active) styled for dark mode

## 🚦 Testing

Test the feature at: `http://localhost:5173/photo-upload-demo`

The demo page includes:
- Live upload functionality
- Usage examples
- Props documentation
- Debug output

## 📚 Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [React File Upload Best Practices](https://react.dev/reference/react-dom/components/input#providing-an-initial-value-for-a-file-input)
- [MDN: File API](https://developer.mozilla.org/en-US/docs/Web/API/File)

## 🎉 Success!

You now have a fully functional, production-ready photo upload system. The component is reusable across your entire application and follows modern UX best practices.

Happy uploading! 📸

