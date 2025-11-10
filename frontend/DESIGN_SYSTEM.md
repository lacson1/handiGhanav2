# Handighana Design System

This document outlines the consistent design system used across the Handighana platform.

## Color Palette

### Primary Ghana Colors (Brand Identity)
These colors represent Ghana's flag and are used throughout the application for branding:

- **Primary Yellow**: `bg-primary` / `text-primary` / `border-primary`
  - Main brand color (#FCD116)
  - Dark variant: `bg-primary-dark` / `hover:bg-primary-dark`
  - Light variant: `bg-primary-light`

- **Ghana Red**: `bg-ghana-red` / `text-ghana-red` / `border-ghana-red`
  - Accent color (#CE1126)
  - Dark variant: `bg-ghana-red-dark`
  - Light variant: `bg-ghana-red-light`
  - Subtle variant: `bg-ghana-red-subtle`

- **Ghana Green**: `bg-ghana-green` / `text-ghana-green` / `border-ghana-green`
  - Action color (#006B3F)
  - Dark variant: `bg-ghana-green-dark` (use for hover states)
  - Light variant: `bg-ghana-green-light`
  - Subtle variant: `bg-ghana-green-subtle`

### Neutral Colors
Use Tailwind's gray scale for neutral elements:
- `gray-50` through `gray-900` for backgrounds, text, and borders
- Light backgrounds: `bg-gray-50`, `bg-gray-100`
- Dark text: `text-gray-700`, `text-gray-900`
- Muted text: `text-gray-500`, `text-gray-600`
- Borders: `border-gray-200`, `border-gray-300`

## Typography

### Font Family
All text uses **Inter** as the primary font:
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Font Sizes & Weights
- **Headings**: Use `font-bold` (700 weight)
  - H1: `text-4xl md:text-6xl` (2.5rem/4rem)
  - H2: `text-3xl md:text-4xl` (2rem)
  - H3: `text-xl` (1.5rem)
  - H4: `text-lg` (1.25rem)

- **Body Text**: `text-base` (16px) with `font-normal`
- **Small Text**: `text-sm` (14px)
- **Fine Print**: `text-xs` (12px)

## Border Radius

Use consistent rounded corners throughout:
- Small elements (badges, pills): `rounded-lg` (1rem)
- Cards and containers: `rounded-xl` (1.5rem)
- Buttons: `rounded-lg` or `rounded-xl`
- Full circles (avatars): `rounded-full`

## Shadows

- Small elevation: `shadow-sm`
- Medium elevation (cards): `shadow-md`
- Large elevation (modals): `shadow-lg`
- Extra large (dropdowns): `shadow-xl`

## Spacing

Follow Tailwind's spacing scale:
- Extra small: `p-2`, `m-2`, `gap-2`
- Small: `p-4`, `m-4`, `gap-4`
- Medium: `p-6`, `m-6`, `gap-6`
- Large: `p-8`, `m-8`, `gap-8`
- Extra large: `p-12`, `m-12`, `gap-12`

## Components

### Buttons

Primary button (CTA):
```tsx
className="bg-ghana-green text-white px-8 py-4 rounded-lg font-medium hover:bg-ghana-green-dark transition-colors shadow-lg"
```

Secondary button:
```tsx
className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
```

Outline button:
```tsx
className="border-2 border-gray-300 bg-transparent px-6 py-3 rounded-lg hover:bg-ghana-yellow-subtle hover:border-primary transition-colors"
```

### Cards

Standard card:
```tsx
className="bg-white rounded-xl p-8 border-2 border-gray-200 shadow-sm"
```

Interactive card with hover:
```tsx
className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-primary hover:shadow-md transition-all"
```

### Forms

Input fields:
```tsx
className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-ghana-green focus:outline-none transition-colors"
```

Labels:
```tsx
className="block text-sm font-medium text-gray-700 mb-2"
```

### Icons

Use Ghana colors for accent icons:
- Success/Verification: `text-ghana-green`
- Warning/Important: `text-primary`
- Error/Alert: `text-ghana-red`
- Neutral: `text-gray-500` or `text-gray-600`

### Ghana Flag Accent

For decorative Ghana flag elements:
```tsx
<div className="flex h-1 w-32 rounded-full overflow-hidden shadow-sm">
  <div className="flex-1 bg-ghana-red"></div>
  <div className="flex-1 bg-primary"></div>
  <div className="flex-1 bg-ghana-green"></div>
</div>
```

## Dark Mode

All components support dark mode using Tailwind's `dark:` variant:
- Background: `dark:bg-gray-900`
- Text: `dark:text-white` or `dark:text-gray-300`
- Borders: `dark:border-gray-700` or `dark:border-gray-800`
- Cards: `dark:bg-gray-800`

## Transitions

Use consistent transition timing:
```tsx
className="transition-colors duration-200"
className="transition-all duration-300"
```

## Best Practices

1. **Never use hardcoded hex colors** - Always use Tailwind color classes
2. **Maintain consistent spacing** - Use Tailwind's spacing scale
3. **Use Ghana colors intentionally** - They should represent the brand and cultural identity
4. **Keep rounded corners consistent** - Prefer `rounded-lg` and `rounded-xl`
5. **Add hover states** - All interactive elements should have clear hover feedback
6. **Support dark mode** - Include `dark:` variants for all colored elements
7. **Ensure accessibility** - Use proper contrast ratios and focus states
8. **Mobile-first** - Use responsive classes (`sm:`, `md:`, `lg:`) for larger screens

## Example Component

```tsx
<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all shadow-sm">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-12 h-12 bg-ghana-green-subtle rounded-lg flex items-center justify-center">
      <CheckCircle className="w-6 h-6 text-ghana-green" />
    </div>
    <div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        Title
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Subtitle
      </p>
    </div>
  </div>
  <p className="text-gray-600 dark:text-gray-300 mb-4">
    Description text here
  </p>
  <button className="bg-ghana-green text-white px-6 py-3 rounded-lg font-medium hover:bg-ghana-green-dark transition-colors">
    Action Button
  </button>
</div>
```

