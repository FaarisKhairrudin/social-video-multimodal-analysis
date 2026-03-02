import { Badge } from '@/components/ui/badge'
import { getEmotionBadgeClass } from '@/lib/types'

interface EmotionLegendProps {
  emotions: string[]
  className?: string
}

export function EmotionLegend({ emotions, className = "" }: EmotionLegendProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {emotions.map((emotion) => (
        <Badge key={emotion} className={getEmotionBadgeClass(emotion)}>
          {emotion}
        </Badge>
      ))}
    </div>
  )
}