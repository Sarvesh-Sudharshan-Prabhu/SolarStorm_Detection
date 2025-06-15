
'use client';

import { TrendingUp, Info } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip, // Renamed to avoid conflict
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { HistoricalDataPoint } from '@/types';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const generateMockTrendData = (hours: number): HistoricalDataPoint[] => {
  const data = [];
  const now = new Date();
  for (let i = hours - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      date: `${time.getHours().toString().padStart(2, '0')}:00`,
      kpIndex: parseFloat((Math.random() * 7 + 1).toFixed(1)), 
    });
  }
  return data;
};

const KpIndexTooltipContent = (
  <p className="max-w-xs">
    The Kp-index is a global geomagnetic activity index (0-9). Higher values mean stronger solar activity.
  </p>
);

const CustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex justify-center space-x-4 text-sm text-muted-foreground">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center">
          <svg className="w-3 h-3 mr-1" viewBox="0 0 10 10" fill={entry.color}><circle cx="5" cy="5" r="5"/></svg>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="underline decoration-dotted cursor-help">{entry.value}</span>
              </TooltipTrigger>
              <TooltipContent>{KpIndexTooltipContent}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
      ))}
    </ul>
  );
};

export function LiveTrendChart() {
  const [timeframe, setTimeframe] = useState<string>("24"); // Default to 24 hours
  const [chartData, setChartData] = useState<HistoricalDataPoint[]>([]);
  const [mounted, setMounted] = useState(false);

   useEffect(() => {
    setMounted(true);
    setChartData(generateMockTrendData(parseInt(timeframe)));
  }, [timeframe]);

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
            <TrendingUp className="h-6 w-6 text-primary" />
            <span>Kp-index Trend</span>
          </CardTitle>
          <CardDescription>Visualizing solar activity over a selected period.</CardDescription>
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
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
                <CardTitle className="text-xl font-headline flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span>{timeframe}-Hour Kp-index Trend</span>
                </CardTitle>
                <CardDescription>Visualizing solar activity over the past {timeframe} hours.</CardDescription>
            </div>
            <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-full sm:w-[120px] text-xs">
                    <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="6">Last 6 Hours</SelectItem>
                    <SelectItem value="12">Last 12 Hours</SelectItem>
                    <SelectItem value="24">Last 24 Hours</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[300px] pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" stroke={mutedColor} tick={{ fill: mutedColor, fontSize: 12 }} />
            <YAxis stroke={mutedColor} tick={{ fill: mutedColor, fontSize: 12 }} domain={[0, 9]} />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--foreground))',
                borderRadius: 'var(--radius)',
              }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              cursor={{ fill: 'hsla(var(--accent), 0.2)'}}
            />
            <Legend content={<CustomLegend />} />
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
