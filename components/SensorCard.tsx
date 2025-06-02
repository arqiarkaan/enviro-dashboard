import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Droplets, Wind, Radar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  icon: any; // We'll override this with specific icons
  threshold: number;
  type: 'temperature' | 'humidity' | 'gas' | 'distance';
  motionDetected?: boolean;
  useGradient?: boolean; // New prop to control gradient
  className?: string; // Tambahan agar bisa custom class
}

const getIconForType = (type: string) => {
  switch (type) {
    case 'temperature':
      return Thermometer;
    case 'humidity':
      return Droplets;
    case 'gas':
      return Wind;
    case 'distance':
      return Radar;
    default:
      return Thermometer;
  }
};

const getGradientForType = (type: string) => {
  switch (type) {
    case 'temperature':
      return 'bg-gradient-to-br from-red-500/10 via-orange-500/5 to-red-600/10';
    case 'humidity':
      return 'bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-blue-600/10';
    case 'gas':
      return 'bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-orange-600/10';
    case 'distance':
      return 'bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-purple-600/10';
    default:
      return 'bg-gradient-to-br from-gray-500/10 via-gray-400/5 to-gray-600/10';
  }
};

const getIconColorForType = (type: string) => {
  switch (type) {
    case 'temperature':
      return 'text-red-500';
    case 'humidity':
      return 'text-blue-500';
    case 'gas':
      return 'text-yellow-500';
    case 'distance':
      return 'text-purple-500';
    default:
      return 'text-gray-500';
  }
};

export function SensorCard({
  title,
  value,
  unit,
  threshold,
  type,
  motionDetected,
  useGradient = true, // Default to true for backward compatibility
  className, // Tambahan agar bisa custom class
}: SensorCardProps) {
  const isExceeded =
    type === 'distance' ? value < threshold : value > threshold;
  const Icon = getIconForType(type);
  const gradientClass = useGradient ? getGradientForType(type) : '';
  const iconColorClass = getIconColorForType(type);

  const getStatusColor = () => {
    if (type === 'distance' && motionDetected) return 'destructive';
    return isExceeded ? 'destructive' : 'secondary';
  };

  const getCardBorderColor = () => {
    if (isExceeded || (type === 'distance' && motionDetected)) {
      return 'border-red-500/50 shadow-red-500/20';
    }
    return 'border-border/50';
  };

  return (
    <Card
      className={cn(
        'transition-all duration-300 backdrop-blur-sm border shadow-lg hover:shadow-xl',
        gradientClass,
        getCardBorderColor(),
        className // Tambahkan agar custom class diterapkan
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <div
          className={cn(
            'p-3 rounded-xl bg-white/20 backdrop-blur-sm',
            iconColorClass
          )}
        >
          <Icon className="h-7 w-7" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold">
              {value.toFixed(1)}
              <span className="text-lg font-normal text-muted-foreground ml-1">
                {unit}
              </span>
            </div>
            <p className="text-base text-muted-foreground mt-1">
              Threshold: {threshold}
              {unit}
            </p>
          </div>
          <Badge
            variant={getStatusColor()}
            className={cn(
              'shadow-sm text-base px-4 py-2 rounded-lg border-2',
              isExceeded || (type === 'distance' && motionDetected)
                ? 'border-red-500'
                : 'border-gray-300'
            )}
          >
            {isExceeded || (type === 'distance' && motionDetected)
              ? 'Alert'
              : 'Normal'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
