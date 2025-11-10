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
  "Welder",
  "EmergencyService",
  "NetworkSetup",
  "VeterinaryCare",
  "Pharmacy",
  "Other"
] as const

/**
 * Format availability status from backend enum to user-friendly text
 */
export function formatAvailability(availability: string): string {
  switch (availability) {
    case "AVAILABLE_NOW":
      return "Available Now"
    case "AVAILABLE_SOON":
      return "Available Soon"
    case "NOT_AVAILABLE":
      return "Not Available"
    default:
      return availability
  }
}

/**
 * Check if provider is available now
 */
export function isAvailableNow(availability: string): boolean {
  return availability === "Available Now" || availability === "AVAILABLE_NOW"
}

/**
 * Format service category for display
 */
export function formatCategory(category: string): string {
  switch (category) {
    case "EmergencyService":
      return "Emergency Service"
    case "NetworkSetup":
      return "Network Setup"
    case "VeterinaryCare":
      return "Veterinary Care"
    default:
      return category
  }
}

