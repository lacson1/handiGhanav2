# HandyGhana Frontend

Modern React + TypeScript frontend for the HandyGhana service marketplace.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Features

- ⚡ Vite for fast development
- 🎨 Tailwind CSS for styling
- 🌙 Dark/Light mode support
- 📱 Fully responsive
- ✨ Framer Motion animations
- 🔍 Advanced filtering and search
- 📞 WhatsApp and phone integration

## 🏗️ Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── ui/         # Base UI components (Button, etc.)
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── ProviderCard.tsx
│   ├── FilterBar.tsx
│   └── BookingModal.tsx
├── pages/          # Page components
│   ├── HomePage.tsx
│   └── ProviderProfile.tsx
├── context/        # React context
│   └── ThemeContext.tsx
├── lib/            # Utilities
│   └── utils.ts
├── types/          # TypeScript types
│   └── index.ts
└── utils/          # Helper functions
    └── mockData.ts
```
