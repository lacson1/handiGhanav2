import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        type={props.type || 'button'}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none leading-relaxed',
          {
            'bg-primary text-black hover:bg-primary-dark focus:ring-primary/30 shadow-md hover:shadow-lg': variant === 'primary',
            'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 focus:ring-gray-400/30': variant === 'secondary',
            'border-2 border-gray-700 bg-white text-gray-900 hover:bg-primary hover:border-primary hover:text-black dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-primary dark:hover:border-primary dark:hover:text-black shadow-sm hover:shadow-md focus:ring-primary/30': variant === 'outline',
            'text-gray-900 bg-gray-100 hover:bg-gray-200 dark:text-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-gray-400/30': variant === 'ghost',
            'px-4 py-2.5 text-sm sm:text-base': size === 'sm',
            'px-6 py-3.5 text-base sm:text-lg': size === 'md',
            'px-8 py-4 text-lg sm:text-xl': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export default Button

