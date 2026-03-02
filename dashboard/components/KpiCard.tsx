import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface KpiCardProps {
  title: string
  value: string
  description: string
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
  }
}

export function KpiCard({ title, value, description, trend }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs font-medium">
            {title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
            {trend && (
              <div className={`text-xs flex items-center space-x-1 ${
                trend.direction === 'up' ? 'text-green-600' : 
                trend.direction === 'down' ? 'text-red-600' : 
                'text-muted-foreground'
              }`}>
                <span>
                  {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}
                </span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}