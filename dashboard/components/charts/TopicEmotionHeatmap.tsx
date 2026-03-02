'use client'

import { useMemo } from 'react'
import { useTopicEmotionMatrix, useAppStore } from '@/store/useFilters'
import { ResponsiveContainer, Cell, Tooltip } from 'recharts'
import { getTopicColor, emotionColors } from '@/lib/types'

interface HeatmapCell {
  topic: string
  emotion: string
  value: number
  x: number
  y: number
}

export function TopicEmotionHeatmap() {
  const { topics, emotions, matrix } = useTopicEmotionMatrix()
  const { setFilters } = useAppStore()

  const heatmapData = useMemo(() => {
    const data: HeatmapCell[] = []
    
    topics.forEach((topic, topicIndex) => {
      emotions.forEach((emotion, emotionIndex) => {
        const key = `${topic}_${emotion}`
        const value = matrix.get(key) || 0
        
        data.push({
          topic,
          emotion,
          value,
          x: emotionIndex,
          y: topicIndex
        })
      })
    })
    
    return data
  }, [topics, emotions, matrix])

  const maxValue = Math.max(...heatmapData.map(d => d.value), 1)
  const cellWidth = Math.max(60, Math.min(120, 800 / emotions.length))
  const cellHeight = Math.max(40, Math.min(60, 600 / topics.length))

  const handleCellClick = (cell: HeatmapCell) => {
    setFilters({
      topics: [cell.topic],
      emotions: [cell.emotion]
    })
  }

  if (!topics.length || !emotions.length) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    )
  }

  return (
    <div className="w-full overflow-auto">
      <div className="relative" style={{ 
        width: emotions.length * cellWidth + 100, 
        height: topics.length * cellHeight + 100 
      }}>
        <svg 
          width={emotions.length * cellWidth + 100} 
          height={topics.length * cellHeight + 100}
          className="overflow-visible"
        >
          {/* Y-axis labels (topics) */}
          {topics.map((topic, index) => (
            <text
              key={topic}
              x={90}
              y={index * cellHeight + cellHeight / 2 + 50}
              textAnchor="end"
              dominantBaseline="middle"
              className="text-xs fill-current text-muted-foreground"
            >
              {topic.length > 15 ? `${topic.substring(0, 15)}...` : topic}
            </text>
          ))}

          {/* X-axis labels (emotions) */}
          {emotions.map((emotion, index) => (
            <text
              key={emotion}
              x={index * cellWidth + cellWidth / 2 + 100}
              y={40}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-current text-muted-foreground"
            >
              {emotion}
            </text>
          ))}

          {/* Heatmap cells */}
          {heatmapData.map((cell, index) => {
            const opacity = cell.value / maxValue
            
            // Emotion color mapping with hex colors
            const emotionColorMap: Record<string, string> = {
              Trust: "#10b981", // emerald-500
              Proud: "#f59e0b", // amber-500
              Surprise: "#8b5cf6", // violet-500
              Neutral: "#64748b", // slate-500
              Anger: "#ef4444", // red-500
              Fear: "#f97316", // orange-500
              Sadness: "#3b82f6", // blue-500
              Joy: "#22c55e", // green-500
              Anticipation: "#06b6d4", // cyan-500
              Disgust: "#ec4899" // pink-500
            }
            
            const color = emotionColorMap[cell.emotion] || "#64748b"
            
            return (
              <g key={index}>
                <rect
                  x={cell.x * cellWidth + 100}
                  y={cell.y * cellHeight + 50}
                  width={cellWidth - 2}
                  height={cellHeight - 2}
                  fill={color}
                  fillOpacity={Math.max(0.1, opacity)}
                  stroke="#374151"
                  strokeWidth={1}
                  className="cursor-pointer hover:stroke-primary hover:stroke-2 transition-all"
                  onClick={() => handleCellClick(cell)}
                />
                {cell.value > 0 && (
                  <text
                    x={cell.x * cellWidth + cellWidth / 2 + 100}
                    y={cell.y * cellHeight + cellHeight / 2 + 50}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs fill-current pointer-events-none"
                    fill={opacity > 0.5 ? 'white' : 'currentColor'}
                  >
                    {cell.value}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p>Click on cells to filter by topic and emotion combination</p>
        <p>Color intensity represents the number of videos</p>
      </div>
    </div>
  )
}