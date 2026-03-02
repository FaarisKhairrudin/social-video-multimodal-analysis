/**
 * Get the correct asset path based on environment
 * This handles the basePath for GitHub Pages deployment
 */
export function getAssetPath(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In production (GitHub Pages), we need to include the basePath
  if (process.env.NODE_ENV === 'production') {
    const basePath = '/social-video-insights-dashboard';
    return `${basePath}/${cleanPath}`;
  }
  
  // In development, use the path as-is
  return `/${cleanPath}`;
}

/**
 * Get the base URL for the application
 */
export function getBaseUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    return 'https://faariskhairrudin.github.io/social-video-insights-dashboard';
  }
  
  return 'http://localhost:3000';
}