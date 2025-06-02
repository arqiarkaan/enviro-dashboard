import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SensorCard } from '@/components/SensorCard';
import { ChartSection } from '@/components/ChartSection';
import { SettingsPanel } from '@/components/SettingsPanel';
import { AlarmStatus } from '@/components/AlarmStatus';
import { FanControl } from '@/components/FanControl';
import {
  Thermometer,
  Gauge,
  Fan,
  Bell,
  Settings,
  BarChart,
} from 'lucide-react';
import {
  listenRealtimeData,
  listenSettings,
  updateSettings,
} from '@/lib/firebaseHelpers';

const SensorCardSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-5 w-24 bg-muted rounded" />
      <div className="h-7 w-7 bg-muted rounded-xl" />
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div>
          <div className="h-10 w-24 bg-muted rounded mb-2" />
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
        <div className="h-8 w-16 bg-muted rounded-lg" />
      </div>
    </CardContent>
  </Card>
);

const FanControlSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader className="pb-3">
      <div className="h-6 w-32 bg-muted rounded mb-2" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="h-4 w-24 bg-muted rounded" />
      <div className="h-4 w-24 bg-muted rounded" />
      <div className="h-6 w-32 bg-muted rounded" />
      <div className="h-8 w-32 bg-muted rounded" />
    </CardContent>
  </Card>
);

const AlarmStatusSkeleton = ({ className = '' }) => (
  <Card className={`animate-pulse ${className}`}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 bg-muted rounded-full" />
        <div className="flex-1">
          <div className="h-4 w-32 bg-muted rounded mb-2" />
          <div className="h-4 w-48 bg-muted rounded" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const MotionStatusSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader className="pb-3">
      <div className="h-5 w-24 bg-muted rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-4 w-24 bg-muted rounded" />
    </CardContent>
  </Card>
);

const LastUpdateSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader className="pb-3">
      <div className="h-5 w-32 bg-muted rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-4 w-32 bg-muted rounded" />
    </CardContent>
  </Card>
);

const ChartSectionSkeleton = () => (
  <Card className="backdrop-blur-sm border shadow-lg animate-pulse">
    <CardHeader className="pb-3">
      <div className="h-6 w-40 bg-muted rounded mb-2" />
      <div className="h-4 w-64 bg-muted rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-72 w-full bg-muted rounded mb-4" />
      <div className="flex flex-wrap justify-center gap-6 mt-4 mb-2">
        <div className="h-4 w-16 bg-muted rounded" />
        <div className="h-4 w-16 bg-muted rounded" />
        <div className="h-4 w-16 bg-muted rounded" />
      </div>
    </CardContent>
  </Card>
);

const Index = () => {
  const [sensorData, setSensorData] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [thresholds, setThresholds] = useState<any>(null);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  useEffect(() => {
    let unsub1: (() => void) | null = null;
    let unsub2: (() => void) | null = null;
    try {
      unsub1 = listenRealtimeData((data) => {
        if (data === null) {
          setFirebaseError('Tidak ada data realtime dari Firebase.');
        } else {
          setFirebaseError(null);
          setSensorData(data);
        }
      });
      unsub2 = listenSettings((data) => {
        if (data === null) {
          setFirebaseError('Tidak ada data settings dari Firebase.');
        } else {
          setFirebaseError(null);
          setThresholds(data);
        }
      });
    } catch (err: any) {
      setFirebaseError('Gagal terhubung ke Firebase: ' + (err?.message || err));
      console.error('Firebase connection error:', err);
    }
    return () => {
      if (unsub1) unsub1();
      if (unsub2) unsub2();
    };
  }, []);

  useEffect(() => {
    // Debug: log setiap kali manualControl berubah
    if (sensorData) {
      console.log('manualControl (from db):', sensorData.manualControl);
    }
  }, [sensorData]);

  const handleThresholdUpdate = (newThresholds: typeof thresholds) => {
    updateSettings(newThresholds);
    // Firebase update
  };

  const handleFanControl = (manual: boolean, status?: boolean) => {
    console.log('handleFanControl called:', { manual, status });
    updateSettings({
      manualControl: manual,
      ...(status !== undefined ? { fanStatus: status } : {}),
    });
  };

  const isLoading = !sensorData || !thresholds;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950">
      {/* Header */}
      <div className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  E
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    Enviro
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Smart Environment Monitor
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl backdrop-blur-md bg-white/95 dark:bg-slate-900/95">
                  {isLoading ? (
                    <div className="p-8 flex flex-col gap-4">
                      <div className="h-6 w-40 bg-muted rounded mb-2 animate-pulse" />
                      <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                      <div className="h-10 w-full bg-muted rounded animate-pulse" />
                      <div className="h-10 w-full bg-muted rounded animate-pulse" />
                      <div className="h-10 w-full bg-muted rounded animate-pulse" />
                      <div className="h-10 w-full bg-muted rounded animate-pulse" />
                      <div className="flex justify-end gap-2 pt-4">
                        <div className="h-10 w-24 bg-muted rounded animate-pulse" />
                        <div className="h-10 w-32 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <SettingsPanel
                      thresholds={thresholds}
                      onThresholdUpdate={handleThresholdUpdate}
                      onClose={() => setShowSettings(false)}
                    />
                  )}
                </DialogContent>
              </Dialog>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {firebaseError && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded shadow animate-pulse">
            <b>Firebase Error:</b> {firebaseError}
          </div>
        )}
        {/* Status Sensor/Alat */}
        {isLoading ? (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-muted rounded shadow animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* DHT */}
            <Card
              className={
                sensorData.statusDHT === 'ERROR' || sensorData.temperature === 0
                  ? 'border-red-500/70 shadow-red-500/20'
                  : ''
              }
            >
              <CardContent className="py-4 flex items-center gap-3">
                <span className="font-semibold">Sensor Suhu & Kelembapan:</span>
                <span
                  className={
                    sensorData.statusDHT === 'ERROR' ||
                    sensorData.temperature === 0
                      ? 'text-red-600 font-bold'
                      : 'text-green-700'
                  }
                >
                  {sensorData.statusDHT === 'READY' &&
                  sensorData.temperature !== 0
                    ? 'Berfungsi normal'
                    : 'Tidak terhubung atau error'}
                </span>
              </CardContent>
            </Card>
            {/* MQ2 */}
            <Card
              className={
                sensorData.statusMQ2 === 'ERROR'
                  ? 'border-red-500/70 shadow-red-500/20'
                  : ''
              }
            >
              <CardContent className="py-4 flex items-center gap-3">
                <span className="font-semibold">Sensor Gas (MQ2):</span>
                <span
                  className={
                    sensorData.statusMQ2 === 'ERROR'
                      ? 'text-red-600 font-bold'
                      : 'text-green-700'
                  }
                >
                  {sensorData.statusMQ2 === 'READY'
                    ? 'Berfungsi normal'
                    : 'Tidak terhubung atau error'}
                </span>
              </CardContent>
            </Card>
            {/* Ultrasonic */}
            <Card
              className={
                sensorData.statusUltrasonic === 'ERROR'
                  ? 'border-red-500/70 shadow-red-500/20'
                  : ''
              }
            >
              <CardContent className="py-4 flex items-center gap-3">
                <span className="font-semibold">
                  Sensor Jarak (Ultrasonic):
                </span>
                <span
                  className={
                    sensorData.statusUltrasonic === 'ERROR'
                      ? 'text-red-600 font-bold'
                      : 'text-green-700'
                  }
                >
                  {sensorData.statusUltrasonic === 'READY'
                    ? 'Berfungsi normal'
                    : 'Tidak terhubung atau error'}
                </span>
              </CardContent>
            </Card>
            {/* Relay */}
            <Card
              className={
                sensorData.statusRelay === 'ERROR'
                  ? 'border-red-500/70 shadow-red-500/20'
                  : ''
              }
            >
              <CardContent className="py-4 flex items-center gap-3">
                <span className="font-semibold">Relay:</span>
                <span
                  className={
                    sensorData.statusRelay === 'ON'
                      ? 'text-green-700'
                      : sensorData.statusRelay === 'OFF'
                      ? 'text-gray-700'
                      : 'text-red-600 font-bold'
                  }
                >
                  {sensorData.statusRelay === 'ON'
                    ? 'Aktif (menyala)'
                    : sensorData.statusRelay === 'OFF'
                    ? 'Tidak aktif'
                    : 'Error'}
                </span>
              </CardContent>
            </Card>
            {/* ESP32 */}
            {(() => {
              const now = Math.floor(Date.now() / 1000); // detik
              const lastUpdate = sensorData.timestamp || 0; // detik
              const espDisconnected =
                !sensorData.timestamp || now - lastUpdate > 30; // 30 detik
              console.log(
                'timestamp:',
                sensorData.timestamp,
                'now:',
                now,
                'selisih:',
                now - lastUpdate
              );
              return (
                <Card
                  className={
                    espDisconnected ? 'border-red-500/70 shadow-red-500/20' : ''
                  }
                >
                  <CardContent className="py-4 flex items-center gap-3">
                    <span className="font-semibold">ESP32:</span>
                    <span
                      className={
                        espDisconnected
                          ? 'text-red-600 font-bold'
                          : 'text-green-700'
                      }
                    >
                      {espDisconnected
                        ? 'Tidak terhubung atau tidak ada data baru'
                        : 'Terkoneksi dan berjalan normal'}
                    </span>
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        )}
        {/* Alarm Status */}
        {isLoading ? (
          <AlarmStatusSkeleton className="mb-6" />
        ) : (
          <AlarmStatus status={sensorData.alarmStatus} className="mb-6" />
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Sensor Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              <>
                <SensorCardSkeleton />
                <SensorCardSkeleton />
                <SensorCardSkeleton />
                <SensorCardSkeleton />
              </>
            ) : (
              <>
                <SensorCard
                  title="Suhu"
                  value={sensorData.temperature}
                  unit="°C"
                  icon={Thermometer}
                  threshold={thresholds.tempThreshold}
                  type="temperature"
                  useGradient={true}
                />
                <SensorCard
                  title="Kelembapan"
                  value={sensorData.humidity}
                  unit="%"
                  icon={Gauge}
                  threshold={thresholds.humidityThreshold}
                  type="humidity"
                  useGradient={true}
                />
                <SensorCard
                  title="Gas"
                  value={sensorData.gas}
                  unit="ppm"
                  icon={Bell}
                  threshold={thresholds.gasThreshold}
                  type="gas"
                  useGradient={true}
                />
                <SensorCard
                  title="Jarak"
                  value={sensorData.distance}
                  unit="cm"
                  icon={Gauge}
                  threshold={thresholds.distanceThreshold}
                  type="distance"
                  motionDetected={sensorData.motionDetected}
                  useGradient={true}
                />
              </>
            )}
          </div>

          {/* Fan Control */}
          <div className="space-y-4">
            {isLoading ? (
              <FanControlSkeleton />
            ) : (
              <FanControl
                fanStatus={thresholds.fanStatus}
                manualControl={thresholds.manualControl}
                onFanControl={handleFanControl}
              />
            )}
            {/* Motion Status */}
            {isLoading ? (
              <MotionStatusSkeleton />
            ) : (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Status Gerakan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Deteksi:
                    </span>
                    <Badge
                      variant={
                        sensorData.motionDetected ? 'destructive' : 'secondary'
                      }
                      className="shadow-sm"
                    >
                      {sensorData.motionDetected ? 'Terdeteksi' : 'Tidak Ada'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Last Update */}
            {isLoading ? (
              <LastUpdateSkeleton />
            ) : (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Pembaruan Terakhir</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {sensorData.timestamp
                      ? new Date(sensorData.timestamp * 1000).toLocaleString(
                          'id-ID'
                        )
                      : '-'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        {/* Chart Section */}
        {isLoading ? <ChartSectionSkeleton /> : <ChartSection />}
      </div>
    </div>
  );
};

export default Index;
