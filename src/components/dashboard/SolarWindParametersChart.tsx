'use client';

import { Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SolarWindParameterDataPoint } from '@/types';
import { useEffect, useState } from 'react';

// Mock data for the last 24 hours
const generateMockSolarWindData = (): SolarWindParameterDataPoint[] => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: `${time.getHours().toString().padStart(2, '0')}:00`,
      bz: parseFloat((Math.random() * 20 - 10).toFixed(1)), // Bz between -10 and 10 nT
      speed: parseFloat((Math.random() * 500 + 300).toFixed(0)), // Speed between 300 and 800 km/s
      density: parseFloat((Math.random() * 14 + 1).toFixed(1)), // Density between 1 and 15 p/cm³
    });
  }
  return data;
};


export function SolarWindParametersChart() {
  const [chartData, setChartData] = useState<SolarWindParameterDataPoint[]>([]);
  const [mounted, setMounted] = useState(false);

   useEffect(() => {
    setMounted(true);
    setChartData(generateMockSolarWindData());
  }, []);

  const foregroundColor = "hsl(var(--foreground))";
  const mutedColor = "hsl(var(--muted-foreground))";
  const gridColor = "hsl(var(--border))";
  const primaryColor = "hsl(var(--primary))";
  const accentColor = "hsl(var(--accent))";
  const chartColor3 = "hsl(var(--chart-3))";


  if (!mounted) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span>Solar Wind Parameters (24h)</span>
          </CardTitle>
          <CardDescription>Tracking key solar wind conditions.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Loading chart data...</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span>Solar Wind Parameters (24h)</span>
        </CardTitle>
        <CardDescription>Tracking key solar wind conditions.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="time" stroke={mutedColor} tick={{ fill: mutedColor, fontSize: 12 }} />
            <YAxis yAxisId="left" stroke={mutedColor} tick={{ fill: mutedColor, fontSize: 12 }} domain={[-15, 15]} />
            <YAxis yAxisId="rightSpeed" orientation="right" stroke={mutedColor} tick={{ fill: mutedColor, fontSize: 12 }} domain={[200, 1000]} />
            <YAxis yAxisId="rightDensity" orientation="right" stroke={mutedColor} tick={{ fill: mutedColor, fontSize: 12 }} domain={[0, 20]} dx={50} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--foreground))',
                borderRadius: 'var(--radius)',
              }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              cursor={{ fill: 'hsla(var(--accent), 0.2)'}}
            />
            <Legend wrapperStyle={{ color: foregroundColor, fontSize: 12 }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="bz"
              name="Bz (nT)"
              stroke={primaryColor}
              strokeWidth={2}
              dot={{ r: 2, fill: primaryColor }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="rightSpeed"
              type="monotone"
              dataKey="speed"
              name="Speed (km/s)"
              stroke={accentColor}
              strokeWidth={2}
              dot={{ r: 2, fill: accentColor }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="rightDensity"
              type="monotone"
              dataKey="density"
              name="Density (p/cm³)"
              stroke={chartColor3}
              strokeWidth={2}
              dot={{ r: 2, fill: chartColor3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
