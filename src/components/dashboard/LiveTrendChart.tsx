'use client';

import { BarChart, TrendingUp } from 'lucide-react';
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
import type { HistoricalDataPoint } from '@/types';
import { useTheme } from 'next-themes'; // Assuming next-themes for theme detection
import { useEffect, useState } from 'react';

// Mock data for the last 24 hours
const generateMockTrendData = (): HistoricalDataPoint[] => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      date: `${time.getHours().toString().padStart(2, '0')}:00`,
      kpIndex: parseFloat((Math.random() * 7 + 1).toFixed(1)), // Kp between 1 and 8
    });
  }
  return data;
};


export function LiveTrendChart() {
  const [chartData, setChartData] = useState<HistoricalDataPoint[]>([]);
  const [mounted, setMounted] = useState(false);

   useEffect(() => {
    setMounted(true);
    setChartData(generateMockTrendData());
  }, []);


  // Recharts uses inline styles that might not pick up CSS variables directly for all elements.
  // We can use theme-aware colors.
  const foregroundColor = "hsl(var(--foreground))";
  const mutedColor = "hsl(var(--muted-foreground))";
  const gridColor = "hsl(var(--border))";
  const primaryColor = "hsl(var(--primary))";
  const accentColor = "hsl(var(--accent))";


  if (!mounted) {
    // Render a placeholder or null during server rendering and initial client mount
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span>24-Hour Kp-index Trend</span>
          </CardTitle>
          <CardDescription>Visualizing solar activity over the past day.</CardDescription>
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
          <TrendingUp className="h-6 w-6 text-primary" />
          <span>24-Hour Kp-index Trend</span>
        </CardTitle>
        <CardDescription>Visualizing solar activity over the past day.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
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
            <Line
              type="monotone"
              dataKey="kpIndex"
              name="Kp-index"
              stroke={primaryColor}
              strokeWidth={2}
              dot={{ r: 3, fill: primaryColor }}
              activeDot={{ r: 6, fill: primaryColor, stroke: accentColor, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
