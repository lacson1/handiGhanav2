import { cn } from '../lib/utils'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
  width?: string | number
  height?: string | number
  count?: number
}

export default function LoadingSkeleton({ 
  className, 
  variant = 'rectangular',
  width,
  height,
  count = 1
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]'
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl'
  }

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  }

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn(baseClasses, variantClasses[variant], className)}
            style={style}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
    />
  )
}

// Preset skeleton components for common use cases
export function StatsCardSkeleton() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
      <LoadingSkeleton variant="circular" width={64} height={64} className="mx-auto" />
      <LoadingSkeleton variant="text" className="h-10 w-20 mx-auto" />
      <LoadingSkeleton variant="text" className="h-4 w-32 mx-auto" />
    </div>
  )
}

export function ProviderCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <div className="flex items-center gap-4">
        <LoadingSkeleton variant="circular" width={64} height={64} />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton variant="text" className="h-5 w-32" />
          <LoadingSkeleton variant="text" className="h-4 w-24" />
        </div>
      </div>
      <LoadingSkeleton variant="text" count={2} />
      <div className="flex gap-2">
        <LoadingSkeleton variant="rectangular" className="h-10 flex-1" />
        <LoadingSkeleton variant="rectangular" className="h-10 w-20" />
      </div>
    </div>
  )
}

export function NavbarSkeleton() {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <LoadingSkeleton variant="rectangular" width={36} height={36} />
            <LoadingSkeleton variant="text" className="h-6 w-32" />
          </div>
          <div className="hidden md:flex items-center gap-4">
            <LoadingSkeleton variant="text" className="h-4 w-24" />
            <LoadingSkeleton variant="text" className="h-4 w-24" />
            <LoadingSkeleton variant="rectangular" className="h-10 w-24" />
            <LoadingSkeleton variant="rectangular" className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function BookingCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <LoadingSkeleton variant="text" className="h-6 w-40" />
        <LoadingSkeleton variant="rectangular" className="h-6 w-20" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <LoadingSkeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton variant="text" className="h-4 w-32" />
            <LoadingSkeleton variant="text" className="h-3 w-24" />
          </div>
        </div>
        <LoadingSkeleton variant="text" count={2} />
      </div>
      <div className="flex gap-2">
        <LoadingSkeleton variant="rectangular" className="h-10 flex-1" />
        <LoadingSkeleton variant="rectangular" className="h-10 flex-1" />
      </div>
    </div>
  )
}

