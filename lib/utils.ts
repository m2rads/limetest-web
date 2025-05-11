import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gets the correct site URL based on the environment
 * Special handling for Vercel preview deployments
 */
export function getSiteUrl(): string {
  // In browser environment, use the current URL directly (most reliable)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Don't use this approach on localhost
    if (hostname !== 'localhost' && !hostname.includes('127.0.0.1')) {
      return `${window.location.protocol}//${hostname}${window.location.port ? `:${window.location.port}` : ''}/`;
    }
  }

  // For server-side rendering
  const vercelUrl = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  
  // If we're in a Vercel preview deployment
  if (vercelUrl && process.env.VERCEL_ENV === 'preview') {
    return `https://${vercelUrl}/`;
  }
  
  // For production or local development
  let url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Ensure protocol
  url = url.includes('localhost') ? url : 
    (url.startsWith('http') ? url : `https://${url}`);
  
  // Ensure trailing slash
  url = url.endsWith('/') ? url : `${url}/`;
  
  return url;
}
