import { Badge } from '@/components/ui/badge'
import { VideoData } from '@/lib/types'

interface NerDisplayProps {
  data: VideoData
  maxDisplay?: number
}

export function NerDisplay({ data, maxDisplay = 5 }: NerDisplayProps) {
  const nerEntities: Array<{ text: string; type: string; color: string }> = []

  // Collect all entities with their types
  const entityFields = [
    { field: data.NER_Brand, type: 'BRAND', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    { field: data.NER_Location, type: 'LOCATION', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    { field: data.NER_Organization, type: 'ORG', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
    { field: data.NER_Person, type: 'PERSON', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
    { field: data.NER_Product, type: 'PRODUCT', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300' }
  ]

  entityFields.forEach(({ field, type, color }) => {
    if (Array.isArray(field)) {
      field.forEach(entity => {
        if (entity && entity.trim()) {
          nerEntities.push({
            text: entity.trim(),
            type,
            color
          })
        }
      })
    }
  })

  if (nerEntities.length === 0) {
    return (
      <span className="text-xs text-muted-foreground italic">No entities</span>
    )
  }

  const displayEntities = nerEntities.slice(0, maxDisplay)
  const remainingCount = nerEntities.length - displayEntities.length

  return (
    <div className="flex flex-wrap gap-1">
      {displayEntities.map((entity, index) => (
        <Badge 
          key={index} 
          variant="outline" 
          className={`text-xs ${entity.color}`}
          title={`${entity.type}: ${entity.text}`}
        >
          {entity.text}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-xs">
          +{remainingCount} more
        </Badge>
      )}
    </div>
  )
}