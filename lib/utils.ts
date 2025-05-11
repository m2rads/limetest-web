import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gets the correct site URL based on the environment
 * Following Supabase's recommended pattern for Vercel deployments
 */
export function getSiteUrl(): string {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000';
    
  // Make sure to include `https://` when not localhost.
  url = url.includes('localhost') ? url : 
    (url.startsWith('http') ? url : `https://${url}`);
    
  url = url.endsWith('/') ? url : `${url}/`;
  
  return url;
}
