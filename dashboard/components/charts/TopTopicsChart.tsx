'use client'

import { useState, useMemo } from 'react'
import { useTopicStats, useAppStore } from '@/store/useFilters'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'
import { getTopicColor } from '@/lib/types'

export function TopTopicsChart() {
  const topicStats = useTopicStats()
  const { setFilters } = useAppStore()
  const [sortBy, setSortBy] = useState<'count' | 'entities'>('count')

  const chartData = useMemo(() => {
    const data = Array.from(topicStats.entries()).map(([topic, stats]) => ({
      topic: topic.length > 20 ? `${topic.substring(0, 20)}...` : topic,
      fullTopic: topic,
      count: stats.count,
      entityCount: stats.entityCount,
      value: sortBy === 'count' ? stats.count : stats.entityCount
    }))

    return data
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Top 10 topics
  }, [topicStats, sortBy])

  const handleBarClick = (data: any) => {
    if (data && data.fullTopic) {
      setFilters({ topics: [data.fullTopic] })
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.fullTopic}</p>
          <p className="text-sm text-muted-foreground">
            Videos: {data.count}
          </p>
          <p className="text-sm text-muted-foreground">
            Entities: {data.entityCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Click to filter dashboard
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button
          variant={sortBy === 'count' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('count')}
        >
          By Count
        </Button>
        <Button
          variant={sortBy === 'entities' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('entities')}
        >
          By Entities
        </Button>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 80,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="topic" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
              interval={0}
            />
            <YAxis 
              fontSize={12}
              label={{ 
                value: sortBy === 'count' ? 'Video Count' : 'Entity Count', 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              onClick={handleBarClick}
              className="cursor-pointer"
              radius={[2, 2, 0, 0]}
              fill="#8884d8"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-muted-foreground">
        {sortBy === 'count' 
          ? 'Topics ranked by number of videos' 
          : 'Topics ranked by total entity count'
        }. Click bars to filter dashboard.
      </p>
    </div>
  )
}