import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const GHANA_CITIES = [
  "Accra",
  "Kumasi",
  "Cape Coast",
  "Takoradi",
  "Tema",
  "Tamale",
  "Sunyani",
  "Ho",
  "Koforidua",
  "Techiman"
] as const

export const SERVICE_CATEGORIES = [
  "Electrician",
  "Plumber",
  "Cleaner",
  "Handyman",
  "Carpenter",
  "Painter",
  "Mechanic",
  "Gardener",
  "Tiler",
  "Welder"
] as const

