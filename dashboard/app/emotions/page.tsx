'use client'

import { useEffect, useState } from 'react'
import { useAppStore, useFilteredData } from '@/store/useFilters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GlobalFilters } from '@/components/filters/GlobalFilters'
import { EmotionDistribution } from '@/components/charts/EmotionDistribution'
import { EmotionComparison } from '@/components/charts/EmotionComparison'
import { EmotionLegend } from '@/components/EmotionLegend'
import { Skeleton } from '@/components/ui/skeleton'
import { DataService } from '@/lib/data'

export default function EmotionsPage() {
  const { loadData, loading, error } = useAppStore()
  const filteredData = useFilteredData()
  const [topicA, setTopicA] = useState<string>('')
  const [topicB, setTopicB] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [loadData])

  const dataService = DataService.getInstance()
  const availableTopics = dataService.getUniqueValues('Topic_Label')

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
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
          <h1 className="text-3xl font-bold tracking-tight">Emotion Insights</h1>
          <p className="text-muted-foreground">
            Analyze emotional patterns across video content
          </p>
        </div>
        <GlobalFilters />
      </div>

      {/* Emotion Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Emotion Color Legend</CardTitle>
          <CardDescription>
            Color coding used throughout the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmotionLegend emotions={dataService.getUniqueValues('Emotion')} />
        </CardContent>
      </Card>

      {/* Global Emotion Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Global Emotion Distribution</CardTitle>
          <CardDescription>
            Overall distribution of emotions across all filtered videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmotionDistribution data={filteredData} />
        </CardContent>
      </Card>

      {/* Topic Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Compare Emotions Between Topics</CardTitle>
          <CardDescription>
            Select two topics to compare their emotional distributions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic A</label>
              <Select value={topicA} onValueChange={setTopicA}>
                <SelectTrigger>
                  <SelectValue placeholder="Select first topic..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTopics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic B</label>
              <Select value={topicB} onValueChange={setTopicB}>
                <SelectTrigger>
                  <SelectValue placeholder="Select second topic..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTopics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {topicA && topicB && (
            <EmotionComparison topicA={topicA} topicB={topicB} data={filteredData} />
          )}
          
          {(!topicA || !topicB) && (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Select two topics to compare their emotional patterns
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Emotion Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            {(() => {
              const emotionCounts = filteredData.reduce((acc, item) => {
                acc[item.Emotion] = (acc[item.Emotion] || 0) + 1
                return acc
              }, {} as Record<string, number>)
              
              const totalVideos = filteredData.length
              const topEmotion = Object.entries(emotionCounts)
                .sort(([,a], [,b]) => b - a)[0]
              
              if (!topEmotion) return null
              
              const [emotion, count] = topEmotion
              const percentage = ((count / totalVideos) * 100).toFixed(1)
              
              return (
                <>
                  <p>
                    • <strong>{emotion}</strong> dominates with {count} videos ({percentage}% of content)
                  </p>
                  <p>
                    • {Object.keys(emotionCounts).length} different emotions detected across {totalVideos} videos
                  </p>
                  <p>
                    • Emotional diversity indicates varied content engagement patterns
                  </p>
                </>
              )
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}