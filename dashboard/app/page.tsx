'use client'

import { useEffect } from 'react'
import { useAppStore, useDataStats } from '@/store/useFilters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { KpiCard } from '@/components/KpiCard'
import { TopicEmotionHeatmap } from '@/components/charts/TopicEmotionHeatmap'
import { TopTopicsChart } from '@/components/charts/TopTopicsChart'
import WordcloudChart from '@/components/charts/WordcloudChart'
import { GlobalFilters } from '@/components/filters/GlobalFilters'
import { Skeleton } from '@/components/ui/skeleton'

export default function OverviewPage() {
  const { loadData, loading, error, filteredData } = useAppStore()
  const stats = useDataStats()

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
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
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">
            Interactive insights from social media video data
          </p>
        </div>
        <GlobalFilters />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Total Videos"
          value={stats.totalVideos.toLocaleString()}
          description="Total videos in dataset"
        />
        <KpiCard
          title="Unique Topics"
          value={stats.uniqueTopics.toString()}
          description="Different topic categories"
        />
        <KpiCard
          title="Top Emotion"
          value={stats.topEmotion}
          description="Most frequent emotion"
        />
        <KpiCard
          title="Total Entities"
          value={stats.totalEntities.toLocaleString()}
          description="Named entities extracted"
        />
        <KpiCard
          title="Platforms"
          value={Object.keys(stats.platformDistribution).length.toString()}
          description="Different platforms"
        />
      </div>

      {/* Charts - Top Row: Top Topics and WordCloud */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Topics</CardTitle>
            <CardDescription>
              Most popular topics by video count
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopTopicsChart />
          </CardContent>
        </Card>

        {/* Word Cloud Section */}
        <WordcloudChart data={filteredData} />
      </div>

      {/* Topic × Emotion Heatmap - Full Width Below */}
      <Card>
        <CardHeader>
          <CardTitle>Topic × Emotion Heatmap</CardTitle>
          <CardDescription>
            Click on cells to filter by topic and emotion combination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TopicEmotionHeatmap />
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              • <strong>{stats.topEmotion}</strong> is the dominant emotion across all videos ({((Object.values(stats.platformDistribution).reduce((a, b) => Math.max(a, b), 0) / stats.totalVideos) * 100).toFixed(1)}% of content)
            </p>
            <p>
              • Average <strong>{stats.avgEntitiesPerVideo}</strong> entities per video, with total of <strong>{stats.totalEntities}</strong> named entities extracted
            </p>
            <p>
              • Content spans <strong>{stats.uniqueTopics}</strong> distinct topics, showing diverse subject matter
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}