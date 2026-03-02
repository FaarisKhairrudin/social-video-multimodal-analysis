'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { VideoData, emotionColors } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { useEntityFrequency } from '@/store/useFilters'

interface EmotionComparisonProps {
  topicA: string
  topicB: string
  data: VideoData[]
}

export function EmotionComparison({ topicA, topicB, data }: EmotionComparisonProps) {
  const entitiesA = useEntityFrequency(topicA)
  const entitiesB = useEntityFrequency(topicB)

  const comparisonData = useMemo(() => {
    const dataA = data.filter(item => item.Topic_Label === topicA)
    const dataB = data.filter(item => item.Topic_Label === topicB)
    
    const emotionsA = dataA.reduce((acc, item) => {
      acc[item.Emotion] = (acc[item.Emotion] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const emotionsB = dataB.reduce((acc, item) => {
      acc[item.Emotion] = (acc[item.Emotion] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const allEmotions = new Set([...Object.keys(emotionsA), ...Object.keys(emotionsB)])
    
    return Array.from(allEmotions).map(emotion => ({
      emotion,
      [topicA]: emotionsA[emotion] || 0,
      [topicB]: emotionsB[emotion] || 0,
      percentageA: dataA.length > 0 ? ((emotionsA[emotion] || 0) / dataA.length * 100).toFixed(1) : '0',
      percentageB: dataB.length > 0 ? ((emotionsB[emotion] || 0) / dataB.length * 100).toFixed(1) : '0'
    }))
  }, [topicA, topicB, data])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded" 
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.dataKey}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const topEntitiesA = entitiesA.slice(0, 5)
  const topEntitiesB = entitiesB.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Emotion Comparison Chart */}
      <div className="space-y-4">
        <h4 className="font-medium">Emotion Distribution Comparison</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="emotion" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey={topicA} 
                fill="#3b82f6" 
                name={`${topicA} (count)`}
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey={topicB} 
                fill="#22c55e" 
                name={`${topicB} (count)`}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Entities Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-medium">Top Entities in {topicA}</h4>
          <div className="space-y-2">
            {topEntitiesA.length > 0 ? (
              topEntitiesA.map((entity, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {entity.type}
                    </Badge>
                    <span className="text-sm font-medium">{entity.text}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {entity.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No entities found</p>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium">Top Entities in {topicB}</h4>
          <div className="space-y-2">
            {topEntitiesB.length > 0 ? (
              topEntitiesB.map((entity, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {entity.type}
                    </Badge>
                    <span className="text-sm font-medium">{entity.text}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {entity.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No entities found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}