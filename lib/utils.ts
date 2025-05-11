import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gets the correct site URL based on the environment
 * Works across development, preview, and production
 */
export function getSiteUrl(): string {
  if (typeof window !== 'undefined') {
    if (window.location.hostname !== 'localhost') {
      return window.location.origin;
    }
  }
  
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}
