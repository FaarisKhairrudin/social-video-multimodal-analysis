'use client'

import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { VideoData, emotionColors, getEmotionBadgeClass } from '@/lib/types'

interface EmotionDistributionProps {
  data: VideoData[]
}

export function EmotionDistribution({ data }: EmotionDistributionProps) {
  const emotionData = useMemo(() => {
    const counts = data.reduce((acc, item) => {
      acc[item.Emotion] = (acc[item.Emotion] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(counts)
      .map(([emotion, count]) => ({
        emotion,
        count,
        percentage: ((count / data.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
  }, [data])

  // Emotion color mapping with hex colors for charts
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

  const COLORS = emotionData.map(item => 
    emotionColorMap[item.emotion] || "#64748b"
  )

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.emotion}</p>
          <p className="text-sm text-muted-foreground">
            Count: {data.count} ({data.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  if (emotionData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No emotion data available
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div className="space-y-4">
        <h4 className="font-medium">Distribution (Pie Chart)</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={emotionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ emotion, percentage }) => `${emotion} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-4">
        <h4 className="font-medium">Distribution (Bar Chart)</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={emotionData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="emotion" 
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}