'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BarChart3, Video, Heart, Map } from 'lucide-react'

// Helper function to normalize pathname for comparison
function normalizePathname(pathname: string): string {
  // Remove basePath if present
  const basePath = '/social-video-insights-dashboard';
  if (pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length);
  }
  // Ensure it starts with /
  if (!pathname.startsWith('/')) {
    pathname = '/' + pathname;
  }
  // Remove trailing slash except for root
  if (pathname !== '/' && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }
  return pathname;
}

const navigation = [
  { name: 'Overview', href: '/', icon: BarChart3 },
  { name: 'Topics', href: '/topics', icon: Map },
  { name: 'Emotions', href: '/emotions', icon: Heart },
  { name: 'Videos', href: '/videos', icon: Video },
]

export function Navigation() {
  const pathname = usePathname()
  const normalizedPathname = normalizePathname(pathname)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-foreground">
              Social Video Insights
            </Link>
            <div className="flex space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = normalizedPathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ease-in-out',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted hover:shadow-sm'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}