import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlarmStatusProps {
  status: string;
  className?: string;
}

export function AlarmStatus({ status, className }: AlarmStatusProps) {
  const isNormal = status === 'NORMAL';
  const alarms = isNormal ? [] : status.split(',');

  const getAlarmMessage = (alarm: string) => {
    switch (alarm) {
      case 'ALARM_TEMP':
        return 'Suhu Tinggi';
      case 'ALARM_HUMIDITY':
        return 'Kelembapan Tinggi';
      case 'ALARM_GAS':
        return 'Gas Terdeteksi';
      case 'ALARM_MOTION':
        return 'Gerakan Terdeteksi';
      default:
        return alarm;
    }
  };

  // Gradient & glassy style
  const cardBg = isNormal
    ? 'bg-gradient-to-br from-green-100/60 via-white/60 to-green-200/40 dark:from-green-900/30 dark:via-slate-900/60 dark:to-green-900/10 backdrop-blur-md border border-green-200/40 dark:border-green-800/40'
    : 'bg-gradient-to-br from-red-100/60 via-white/60 to-orange-100/40 dark:from-red-900/30 dark:via-slate-900/60 dark:to-orange-900/10 backdrop-blur-md border border-red-200/40 dark:border-red-800/40';

  return (
    <Card className={cn(cardBg, 'shadow-lg', className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div
            className={
              isNormal
                ? 'flex items-center justify-center rounded-full bg-green-100 text-green-600 min-w-[56px] min-h-[56px] flex-shrink-0'
                : 'flex items-center justify-center rounded-full bg-red-100 text-red-600 min-w-[56px] min-h-[56px] flex-shrink-0'
            }
            style={{ fontSize: 0 }}
          >
            {isNormal ? (
              <CheckCircle className="w-10 h-10" />
            ) : (
              <AlertTriangle className="w-10 h-10" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg mb-1">
              Status: {isNormal ? 'Normal' : 'Peringatan Aktif'}
            </h3>
            {!isNormal && (
              <div className="flex flex-wrap gap-2 mt-2">
                {alarms.map((alarm, index) => (
                  <Badge key={index} variant="destructive">
                    {getAlarmMessage(alarm)}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
