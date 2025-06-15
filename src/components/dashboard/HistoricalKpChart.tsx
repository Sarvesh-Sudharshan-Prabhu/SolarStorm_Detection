'use client';

import { BarChart3, CalendarDays } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { HistoricalDataPoint } from '@/types';
import { useEffect, useState } from 'react';

// Mock data for the last 30 days
const generateMockHistoricalData = (): HistoricalDataPoint[] => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      kpIndex: parseFloat((Math.random() * 8 + 1).toFixed(1)), // Kp between 1 and 9
    });
  }
  return data;
};


export function HistoricalKpChart() {
  const [chartData, setChartData] = useState<HistoricalDataPoint[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setChartData(generateMockHistoricalData());
  }, []);

  const foregroundColor = "hsl(var(--foreground))";
  const mutedColor = "hsl(var(--muted-foreground))";
  const gridColor = "hsl(var(--border))";
  const primaryColor = "hsl(var(--primary))";
  const accentColor = "hsl(var(--accent))";

  if (!mounted) {
    return (
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            <span>30-Day Historical Kp-index</span>
          </CardTitle>
          <CardDescription>Reviewing solar activity over the past month.</CardDescription>
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
          <CalendarDays className="h-6 w-6 text-primary" />
          <span>30-Day Historical Kp-index</span>
        </CardTitle>
        <CardDescription>Reviewing solar activity over the past month.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" stroke={mutedColor} tick={{ fill: mutedColor, fontSize: 12 }} />
            <YAxis stroke={mutedColor} tick={{ fill: mutedColor, fontSize: 12 }} domain={[0, 9]} />
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
            <Bar dataKey="kpIndex" name="Kp-index" fill={accentColor} radius={[4, 4, 0, 0]} barSize={15} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
