import { cn } from '../lib/utils'

interface KentePatternProps {
  className?: string
  variant?: 'header' | 'accent' | 'background' | 'divider'
  colors?: 'ghana' | 'traditional' | 'gold' | 'royal'
}

export default function KentePattern({ 
  className, 
  variant = 'accent',
  colors = 'ghana'
}: KentePatternProps) {
  const colorSchemes = {
    ghana: {
      primary: '#CE1126', // Ghana Red
      secondary: '#FCD116', // Ghana Yellow/Gold
      tertiary: '#006B3F', // Ghana Green
      accent: '#000000' // Black
    },
    traditional: {
      primary: '#D4AF37', // Gold
      secondary: '#8B0000', // Dark Red
      tertiary: '#006400', // Dark Green
      accent: '#FFD700' // Bright Gold
    },
    gold: {
      primary: '#FFD700', // Gold
      secondary: '#FFA500', // Orange
      tertiary: '#FF8C00', // Dark Orange
      accent: '#DAA520' // Goldenrod
    },
    royal: {
      primary: '#4B0082', // Indigo
      secondary: '#FFD700', // Gold
      tertiary: '#8B008B', // Dark Magenta
      accent: '#9370DB' // Medium Purple
    }
  }

  const scheme = colorSchemes[colors]

  if (variant === 'header') {
    return (
      <div className={cn('relative overflow-hidden', className)}>
        {/* Kente Header Pattern */}
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="kente-header" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill={scheme.primary} />
              <rect x="0" y="0" width="20" height="20" fill={scheme.secondary} />
              <rect x="20" y="20" width="20" height="20" fill={scheme.secondary} />
              <rect x="10" y="10" width="20" height="20" fill={scheme.tertiary} />
              <line x1="0" y1="0" x2="40" y2="40" stroke={scheme.accent} strokeWidth="1" opacity="0.3" />
              <line x1="40" y1="0" x2="0" y2="40" stroke={scheme.accent} strokeWidth="1" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="1200" height="120" fill="url(#kente-header)" opacity="0.15" />
        </svg>
      </div>
    )
  }

  if (variant === 'divider') {
    return (
      <div className={cn('relative h-2 md:h-3', className)}>
        <div className="absolute inset-0 flex">
          <div className="flex-1" style={{ backgroundColor: scheme.primary }} />
          <div className="flex-1" style={{ backgroundColor: scheme.secondary }} />
          <div className="flex-1" style={{ backgroundColor: scheme.tertiary }} />
        </div>
      </div>
    )
  }

  if (variant === 'background') {
    return (
      <div className={cn('absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none', className)}>
        <svg
          className="w-full h-full"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="kente-bg" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              {/* Main diamonds */}
              <rect width="80" height="80" fill={scheme.primary} />
              <polygon points="40,0 80,40 40,80 0,40" fill={scheme.secondary} />
              <polygon points="40,20 60,40 40,60 20,40" fill={scheme.tertiary} />
              
              {/* Cross pattern */}
              <rect x="38" y="0" width="4" height="80" fill={scheme.accent} opacity="0.3" />
              <rect x="0" y="38" width="80" height="4" fill={scheme.accent} opacity="0.3" />
              
              {/* Small corner squares */}
              <rect x="0" y="0" width="10" height="10" fill={scheme.secondary} opacity="0.5" />
              <rect x="70" y="0" width="10" height="10" fill={scheme.secondary} opacity="0.5" />
              <rect x="0" y="70" width="10" height="10" fill={scheme.secondary} opacity="0.5" />
              <rect x="70" y="70" width="10" height="10" fill={scheme.secondary} opacity="0.5" />
            </pattern>
          </defs>
          <rect width="800" height="600" fill="url(#kente-bg)" />
        </svg>
      </div>
    )
  }

  // Default: accent variant
  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      <svg
        className="w-full h-full"
        viewBox="0 0 200 40"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="kente-accent" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill={scheme.primary} />
            <rect x="5" y="5" width="30" height="30" fill={scheme.secondary} />
            <rect x="10" y="10" width="20" height="20" fill={scheme.tertiary} />
            <circle cx="20" cy="20" r="5" fill={scheme.accent} opacity="0.5" />
            <line x1="0" y1="20" x2="40" y2="20" stroke={scheme.accent} strokeWidth="2" opacity="0.3" />
            <line x1="20" y1="0" x2="20" y2="40" stroke={scheme.accent} strokeWidth="2" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="200" height="40" fill="url(#kente-accent)" />
      </svg>
    </div>
  )
}

// Pre-made components for easy use
export function KenteHeader() {
  return <KentePattern variant="header" colors="ghana" className="h-24 md:h-32" />
}

export function KenteDivider() {
  return <KentePattern variant="divider" colors="ghana" className="my-8" />
}

export function KenteBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <KentePattern variant="background" colors="ghana" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export function KenteCard({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn('relative overflow-hidden rounded-xl', className)}>
      <KentePattern variant="accent" colors="traditional" className="absolute top-0 left-0 right-0 h-2" />
      <div className="relative">{children}</div>
      <KentePattern variant="accent" colors="traditional" className="absolute bottom-0 left-0 right-0 h-2" />
    </div>
  )
}

