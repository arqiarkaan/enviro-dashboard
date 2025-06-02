import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Download } from 'lucide-react';
import { fetchHistory } from '@/lib/firebaseHelpers';

// SVG Logo Grafik
function ChartLogo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-2"
    >
      <rect x="3" y="13" width="3" height="7" rx="1" fill="#3b82f6" />
      <rect x="8.5" y="9" width="3" height="11" rx="1" fill="#ef4444" />
      <rect x="14" y="5" width="3" height="15" rx="1" fill="#f59e0b" />
      <rect x="19.5" y="2" width="3" height="18" rx="1" fill="#10b981" />
    </svg>
  );
}

export function ChartSection() {
  // Pilihan waktu: 6, 8, 24 jam
  const [timeRange, setTimeRange] = useState<'6' | '8' | '24'>('24');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchHistory(48).then((data) => {
      // Sort by timestamp ascending
      const sorted = data.sort(
        (a, b) => Number(a.timestamp) - Number(b.timestamp)
      );
      setHistory(sorted);
      setLoading(false);
    });
  }, []);

  // Filter data sesuai range waktu
  const filteredData = (() => {
    const n = parseInt(timeRange, 10);
    const lastN = history.slice(-n);
    return lastN.map((row) => ({
      time: row.timestamp
        ? new Date(Number(row.timestamp) * 1000).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '-',
      fullTime: row.timestamp ? new Date(Number(row.timestamp) * 1000) : null,
      temperature: row.temperature,
      humidity: row.humidity,
      gas: row.gas,
    }));
  })();

  const handleExportData = () => {
    const csvContent = [
      ['Waktu', 'Suhu (°C)', 'Kelembapan (%)', 'Gas (ppm)'],
      ...filteredData.map((row) => [
        row.time,
        row.temperature?.toFixed(1),
        row.humidity?.toFixed(1),
        row.gas?.toFixed(0),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `sensor-data-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{`Waktu: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${
                typeof entry.value === 'number'
                  ? entry.value.toFixed(1)
                  : entry.value
              }${
                entry.name === 'Suhu'
                  ? '°C'
                  : entry.name === 'Kelembapan'
                  ? '%'
                  : 'ppm'
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="backdrop-blur-sm border shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2 sm:gap-0">
          <div className="flex flex-col items-center sm:flex-row sm:items-center w-full sm:w-auto">
            <ChartLogo />
            <div className="sm:ml-2 text-center sm:text-left w-full sm:w-auto">
              <CardTitle className="text-lg sm:text-lg font-semibold">
                Grafik History
              </CardTitle>
              <div className="text-sm text-muted-foreground -mt-1">
                Riwayat data sensor dalam rentang waktu tertentu
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <Select
              value={timeRange}
              onValueChange={(value: '6' | '8' | '24') => setTimeRange(value)}
            >
              <SelectTrigger className="w-full sm:w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 Jam</SelectItem>
                <SelectItem value="8">8 Jam</SelectItem>
                <SelectItem value="24">24 Jam</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="h-8 w-full sm:w-auto"
              disabled={loading || filteredData.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground py-10 animate-pulse">
            Memuat data grafik dari Firebase...
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <div style={{ minWidth: 600 }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="time"
                    fontSize={12}
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis fontSize={12} tick={{ fill: 'currentColor' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Suhu"
                    dot={{ fill: '#ef4444', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Kelembapan"
                    dot={{ fill: '#3b82f6', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gas"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Gas"
                    dot={{ fill: '#f59e0b', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-6 mt-4 mb-2">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: '#ef4444' }}
            />
            <span className="text-xs">Suhu</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: '#3b82f6' }}
            />
            <span className="text-xs">Kelembapan</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: '#f59e0b' }}
            />
            <span className="text-xs">Gas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
