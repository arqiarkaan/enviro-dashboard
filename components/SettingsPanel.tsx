import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface SettingsPanelProps {
  thresholds: {
    tempThreshold: number;
    humidityThreshold: number;
    gasThreshold: number;
    distanceThreshold: number;
  };
  onThresholdUpdate: (thresholds: any) => void;
  onClose: () => void;
}

export function SettingsPanel({
  thresholds,
  onThresholdUpdate,
  onClose,
}: SettingsPanelProps) {
  // Map Firebase keys to form fields
  const [values, setValues] = useState({
    temperature: thresholds.tempThreshold,
    humidity: thresholds.humidityThreshold,
    gas: thresholds.gasThreshold,
    distance: thresholds.distanceThreshold,
  });
  const { toast } = useToast();

  useEffect(() => {
    setValues({
      temperature: thresholds.tempThreshold,
      humidity: thresholds.humidityThreshold,
      gas: thresholds.gasThreshold,
      distance: thresholds.distanceThreshold,
    });
  }, [thresholds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Map back to Firebase keys
    onThresholdUpdate({
      tempThreshold: values.temperature,
      humidityThreshold: values.humidity,
      gasThreshold: values.gas,
      distanceThreshold: values.distance,
    });
    toast({
      title: 'Pengaturan Disimpan',
      description: 'Threshold berhasil diperbarui',
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setValues((prev) => ({ ...prev, [field]: numValue }));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Pengaturan Threshold</h2>
        <p className="text-muted-foreground">
          Atur batas nilai untuk setiap sensor
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="temp-threshold">Suhu (°C)</Label>
            <Input
              id="temp-threshold"
              type="number"
              value={values.temperature}
              onChange={(e) => handleInputChange('temperature', e.target.value)}
              placeholder="30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="humidity-threshold">Kelembapan (%)</Label>
            <Input
              id="humidity-threshold"
              type="number"
              value={values.humidity}
              onChange={(e) => handleInputChange('humidity', e.target.value)}
              placeholder="70"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gas-threshold">Gas (ppm)</Label>
            <Input
              id="gas-threshold"
              type="number"
              value={values.gas}
              onChange={(e) => handleInputChange('gas', e.target.value)}
              placeholder="1000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="distance-threshold">Jarak (cm)</Label>
            <Input
              id="distance-threshold"
              type="number"
              value={values.distance}
              onChange={(e) => handleInputChange('distance', e.target.value)}
              placeholder="100"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">Simpan Pengaturan</Button>
        </div>
      </form>
    </div>
  );
}
