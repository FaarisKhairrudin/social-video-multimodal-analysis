import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/useFilters'
import { getEmotionBadgeClass, getTopicColor } from '@/lib/types'
import { Filter, TrendingUp } from 'lucide-react'

interface TopicStats {
  count: number
  dominantEmotion: string
  keywords: string[]
  emotions: Map<string, number>
  entityCount: number
  topBrands: string[]
  topProducts: string[]
  topLocations: string[]
}

interface TopicCardProps {
  topic: string
  stats: TopicStats
  viewMode: 'grid' | 'list'
}

export function TopicCard({ topic, stats, viewMode }: TopicCardProps) {
  const { setFilters } = useAppStore()

  const handleFilterByTopic = () => {
    setFilters({ topics: [topic] })
  }

  const topKeywords = stats.keywords.slice(0, 5)
  const entityCount = stats.entityCount
  const topicColor = getTopicColor(topic)

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-lg">{topic}</h3>
                <Badge 
                  variant="secondary" 
                  className={`bg-${topicColor}-100 text-${topicColor}-800 dark:bg-${topicColor}-900 dark:text-${topicColor}-300`}
                >
                  {stats.count} videos
                </Badge>
                <Badge className={getEmotionBadgeClass(stats.dominantEmotion)}>
                  {stats.dominantEmotion}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {topKeywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Videos: {stats.count}</span>
                </div>
              </div>

              {/* Top Entities in List View - Compact */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                {stats.topBrands.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">🏢 Brands:</span>
                    <div className="flex flex-wrap gap-1">
                      {stats.topBrands.slice(0, 2).map((brand, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                          {brand}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {stats.topProducts.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-pink-600 dark:text-pink-400 font-medium">🛍️ Products:</span>
                    <div className="flex flex-wrap gap-1">
                      {stats.topProducts.slice(0, 2).map((product, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {stats.topLocations.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-green-600 dark:text-green-400 font-medium">📍 Locations:</span>
                    <div className="flex flex-wrap gap-1">
                      {stats.topLocations.slice(0, 2).map((location, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              size="sm" 
              onClick={handleFilterByTopic}
              className="ml-4"
            >
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">{topic}</CardTitle>
          <Badge 
            variant="secondary" 
            className={`bg-${topicColor}-100 text-${topicColor}-800 dark:bg-${topicColor}-900 dark:text-${topicColor}-300 shrink-0`}
          >
            {stats.count}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Dominant Emotion</span>
            <Badge className={getEmotionBadgeClass(stats.dominantEmotion)}>
              {stats.dominantEmotion}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Videos</span>
            <span className="font-medium">{stats.count}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Top Keywords</h4>
          <div className="flex flex-wrap gap-1">
            {topKeywords.map((keyword, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Top Entities Section */}
        <div className="space-y-3">
          {/* Top Brands */}
          {stats.topBrands.length > 0 && (
            <div className="space-y-1">
              <h5 className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                🏢 Top Brands
              </h5>
              <div className="flex flex-wrap gap-1">
                {stats.topBrands.map((brand, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                    {brand}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Top Products */}
          {stats.topProducts.length > 0 && (
            <div className="space-y-1">
              <h5 className="text-xs font-medium text-pink-600 dark:text-pink-400 flex items-center gap-1">
                🛍️ Top Products
              </h5>
              <div className="flex flex-wrap gap-1">
                {stats.topProducts.map((product, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800">
                    {product}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Top Locations */}
          {stats.topLocations.length > 0 && (
            <div className="space-y-1">
              <h5 className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                📍 Top Locations
              </h5>
              <div className="flex flex-wrap gap-1">
                {stats.topLocations.map((location, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                    {location}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Button 
          size="sm" 
          onClick={handleFilterByTopic}
          className="w-full mt-auto"
        >
          <Filter className="h-3 w-3 mr-1" />
          Filter Dashboard by this Topic
        </Button>
      </CardContent>
    </Card>
  )
}