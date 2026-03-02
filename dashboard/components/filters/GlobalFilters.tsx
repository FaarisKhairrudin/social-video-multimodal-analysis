'use client'

import { useState } from 'react'
import { useAppStore, useFilters } from '@/store/useFilters'
import { DataService } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Search, Filter, RotateCcw } from 'lucide-react'
import { getEmotionBadgeClass } from '@/lib/types'

export function GlobalFilters() {
  const { data, setFilters, resetFilters } = useAppStore()
  const filters = useFilters()
  const [searchQuery, setSearchQuery] = useState(filters.query)

  const dataService = DataService.getInstance()
  
  const availablePlatforms = dataService.getUniqueValues('Platform')
  const availableEmotions = dataService.getUniqueValues('Emotion')
  const availableTopics = dataService.getUniqueValues('Topic_Label')

  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter(p => p !== platform)
      : [...filters.platforms, platform]
    setFilters({ platforms: newPlatforms })
  }

  const handleEmotionToggle = (emotion: string) => {
    const newEmotions = filters.emotions.includes(emotion)
      ? filters.emotions.filter(e => e !== emotion)
      : [...filters.emotions, emotion]
    setFilters({ emotions: newEmotions })
  }

  const handleTopicToggle = (topic: string) => {
    const newTopics = filters.topics.includes(topic)
      ? filters.topics.filter(t => t !== topic)
      : [...filters.topics, topic]
    setFilters({ topics: newTopics })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ query: searchQuery })
  }

  const activeFiltersCount = 
    filters.platforms.length + 
    filters.emotions.length + 
    filters.topics.length + 
    (filters.query ? 1 : 0)

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <h3 className="font-medium">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters}
          className="h-8 px-2"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex space-x-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos, topics, entities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" size="sm">
          Search
        </Button>
      </form>

      {/* Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Platforms */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Platforms</Label>
          <div className="flex flex-wrap gap-1">
            {availablePlatforms.map((platform) => (
              <Button
                key={platform}
                variant={filters.platforms.includes(platform) ? "default" : "outline"}
                size="sm"
                onClick={() => handlePlatformToggle(platform)}
                className="h-7 text-xs capitalize"
              >
                {platform.replace('_', ' ')}
                {filters.platforms.includes(platform) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Emotions */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Emotions</Label>
          <div className="flex flex-wrap gap-1">
            {availableEmotions.map((emotion) => (
              <Button
                key={emotion}
                variant={filters.emotions.includes(emotion) ? "default" : "outline"}
                size="sm"
                onClick={() => handleEmotionToggle(emotion)}
                className="h-7 text-xs"
              >
                {emotion}
                {filters.emotions.includes(emotion) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Topics</Label>
          <Select
            value=""
            onValueChange={(value) => handleTopicToggle(value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select topics..." />
            </SelectTrigger>
            <SelectContent>
              {availableTopics.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.topics.map((topic) => (
                <Badge 
                  key={topic} 
                  variant="secondary" 
                  className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleTopicToggle(topic)}
                >
                  {topic}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}