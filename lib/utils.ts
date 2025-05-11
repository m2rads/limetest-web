import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gets the correct site URL based on the environment
 * Works across development, preview, and production environments
 */
export function getSiteUrl(): string {
  // Browser environment - Always use the current origin except on localhost
  if (typeof window !== 'undefined') {
    if (window.location.hostname !== 'localhost') {
      return window.location.origin;
    }
  }
  
  // Server environment - Use Vercel-specific environment variables for preview deployments
  const vercelUrl = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  
  if (vercelUrl) {
    // Vercel automatically sets this for all preview and production deployments
    return `https://${vercelUrl}`;
  }
  
  // Production site or local development
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}
