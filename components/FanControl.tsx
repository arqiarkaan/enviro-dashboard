import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Fan } from 'lucide-react';

interface FanControlProps {
  fanStatus: boolean;
  manualControl: boolean;
  onFanControl: (manual: boolean, status?: boolean) => void;
}

export function FanControl({
  fanStatus,
  manualControl,
  onFanControl,
}: FanControlProps) {
  return (
    <Card className="backdrop-blur-sm border-border/50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Fan className="h-5 w-5" />
          Kontrol Kipas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fan Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge variant={fanStatus ? 'default' : 'secondary'}>
            {fanStatus ? 'ON' : 'OFF'}
          </Badge>
        </div>

        {/* Mode */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Mode:</span>
          <Badge variant="outline">
            {manualControl ? 'Manual' : 'Otomatis'}
          </Badge>
        </div>

        {/* Manual Control Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="manual-mode"
            checked={manualControl}
            onCheckedChange={(checked) => onFanControl(checked)}
          />
          <Label htmlFor="manual-mode" className="text-sm">
            Mode Manual
          </Label>
        </div>

        {/* Manual ON/OFF Buttons */}
        {manualControl && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={fanStatus ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFanControl(true, true)}
            >
              ON
            </Button>
            <Button
              variant={!fanStatus ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFanControl(true, false)}
            >
              OFF
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
