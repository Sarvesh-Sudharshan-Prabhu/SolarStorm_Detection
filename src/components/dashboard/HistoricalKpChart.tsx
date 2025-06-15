
'use client';

import { CalendarDays, Info } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
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


const generateMockHistoricalData = (days: number): HistoricalDataPoint[] => {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      kpIndex: parseFloat((Math.random() * 8 + 1).toFixed(1)), 
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
          <svg className="w-3 h-3 mr-1" viewBox="0 0 32 32" fill={entry.color}><path d="M0,4h32v24h-32z"/></svg>
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


export function HistoricalKpChart() {
  const [timeframe, setTimeframe] = useState<string>("30"); // Default to 30 days
  const [chartData, setChartData] = useState<HistoricalDataPoint[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setChartData(generateMockHistoricalData(parseInt(timeframe)));
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
            <CalendarDays className="h-6 w-6 text-primary" />
            <span>Historical Kp-index</span>
          </CardTitle>
          <CardDescription>Reviewing solar activity over a selected period.</CardDescription>
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
                <CalendarDays className="h-6 w-6 text-primary" />
                <span>{timeframe}-Day Historical Kp-index</span>
                </CardTitle>
                <CardDescription>Reviewing solar activity over the past {timeframe} days.</CardDescription>
            </div>
            <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-full sm:w-[120px] text-xs">
                    <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="7">Last 7 Days</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                    <SelectItem value="90">Last 90 Days</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[300px] pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
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
            <Bar dataKey="kpIndex" name="Kp-index" fill={accentColor} radius={[4, 4, 0, 0]} barSize={15} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
