import Button from './ui/Button'
import { formatCategory } from '../lib/utils'

interface CategoryButtonsProps {
  onCategorySelect?: (category: string) => void
}

const categories = ['EmergencyService', 'Electrician', 'Plumber', 'Cleaner', 'Handyman']

export default function CategoryButtons({ onCategorySelect }: CategoryButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {categories.map(category => (
        <Button
          key={category}
          variant="outline"
          size="sm"
          onClick={() => onCategorySelect?.(category)}
          className="hover:bg-ghana-yellow-subtle hover:border-ghana-yellow/50 hover:text-black transition-colors border-ghana-green/20"
        >
          {formatCategory(category)}
        </Button>
      ))}
    </div>
  )
}

