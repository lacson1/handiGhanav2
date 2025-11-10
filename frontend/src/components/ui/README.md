# UI Components - Form Inputs

Smart, accessible form input components with autocomplete and validation.

## Components

### 1. AutocompleteInput
Generic autocomplete with dropdown suggestions.

```tsx
<AutocompleteInput
  options={[
    { value: 'opt1', label: 'Option 1', description: 'Details' }
  ]}
  value={value}
  onChange={setValue}
  placeholder="Type to search..."
  icon={<SearchIcon />}
  minChars={1}
/>
```

### 2. EmailInput
Smart email input with domain suggestions.

```tsx
<EmailInput
  value={email}
  onChange={setEmail}
  label="Email Address"
  error={errors.email}
  required
  showValidation
  showSuggestions
/>
```

### 3. PhoneInput
Ghana phone number with formatting and validation.

```tsx
<PhoneInput
  value={phone}
  onChange={setPhone}
  label="Phone Number"
  hint="Ghana phone number"
  required
  showValidation
/>
```

### 4. PasswordInput
Password field with strength indicator.

```tsx
<PasswordInput
  value={password}
  onChange={setPassword}
  label="Password"
  required
  showStrength
/>
```

### 5. LocationInput
Ghana location picker with autocomplete.

```tsx
<LocationInput
  value={location}
  onChange={setLocation}
  label="Location"
  required
/>
```

## Features

- ✅ TypeScript support
- ✅ Dark mode
- ✅ Keyboard navigation
- ✅ Real-time validation
- ✅ Error handling
- ✅ Accessible (WCAG)
- ✅ Mobile responsive
- ✅ Animated

## Props

All components support:
- `value` - Current value
- `onChange` - Change handler
- `label` - Field label
- `error` - Error message
- `hint` - Helper text
- `required` - Required field
- `disabled` - Disabled state
- `className` - Custom classes

## Keyboard Shortcuts

- `↓/↑` - Navigate suggestions
- `Enter` - Select item
- `Escape` - Close dropdown
- `Tab` - Select and move next

## Usage Tips

1. Always provide labels
2. Show validation feedback
3. Include helpful hints
4. Handle errors gracefully
5. Test on mobile

## Browser Support

- Chrome/Edge ✅
- Firefox ✅
- Safari ✅
- Mobile ✅

