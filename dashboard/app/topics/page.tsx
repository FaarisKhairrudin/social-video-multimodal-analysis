'use client'

import { useEffect, useState } from 'react'
import { useAppStore, useTopicStats } from '@/store/useFilters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlobalFilters } from '@/components/filters/GlobalFilters'
import { TopicCard } from '@/components/TopicCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Grid, List } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TopicsPage() {
  const { loadData, loading, error } = useAppStore()
  const topicStats = useTopicStats()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredTopics = Array.from(topicStats.entries())
    .filter(([topic]) => 
      topic.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort(([,a], [,b]) => b.count - a.count)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error loading data: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Topic Explorer</h1>
          <p className="text-muted-foreground">
            Discover topics and their characteristics across video content
          </p>
        </div>
        <GlobalFilters />
      </div>

      {/* Topic Search and View Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <div className="text-sm text-muted-foreground ml-4">
                {filteredTopics.length} topics
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topics Grid/List */}
      <motion.div 
        layout
        className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }
      >
        {filteredTopics.map(([topic, stats], index) => (
          <motion.div
            key={topic}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <TopicCard
              topic={topic}
              stats={stats}
              viewMode={viewMode}
            />
          </motion.div>
        ))}
      </motion.div>

      {filteredTopics.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              No topics found matching your search criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}