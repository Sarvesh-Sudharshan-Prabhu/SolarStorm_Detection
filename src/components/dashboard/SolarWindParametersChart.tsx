
'use client';

import { Activity, Info } from 'lucide-react';
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
import type { SolarWindParameterDataPoint } from '@/types';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const generateMockSolarWindData = (hours: number): SolarWindParameterDataPoint[] => {
  const data = [];
  const now = new Date();
  for (let i = hours - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: `${time.getHours().toString().padStart(2, '0')}:00`,
      bz: parseFloat((Math.random() * 20 - 10).toFixed(1)), 
      speed: parseFloat((Math.random() * 500 + 300).toFixed(0)), 
      density: parseFloat((Math.random() * 14 + 1).toFixed(1)), 
    });
  }
  return data;
};

const glossary: Record<string, { term: string; definition: string }> = {
  bz: { term: "Bz (nT)", definition: "The north-south component of the Interplanetary Magnetic Field (IMF). A southward Bz (negative values) is a key indicator for geomagnetic storms." },
  speed: { term: "Speed (km/s)", definition: "The speed of the solar wind. Higher speeds can lead to stronger geomagnetic effects." },
  density: { term: "Density (p/cm³)", definition: "The number of solar wind particles (protons) per cubic centimeter. Higher density can also contribute to stronger geomagnetic effects." }
};

const CustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex justify-center space-x-4 text-sm text-muted-foreground">
      {payload.map((entry: any, index: number) => {
        const termKey = entry.dataKey;
        const gloss = glossary[termKey as keyof typeof glossary];
        return (
          <li key={`item-${index}`} className="flex items-center">
             <svg className="w-3 h-3 mr-1" viewBox="0 0 10 10" fill={entry.color}><circle cx="5" cy="5" r="5"/></svg>
            {gloss ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="underline decoration-dotted cursor-help">{gloss.term}</span>
                  </TooltipTrigger>
                  <TooltipContent><p className="max-w-xs">{gloss.definition}</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <span>{entry.value}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export function SolarWindParametersChart() {
  const [timeframe, setTimeframe] = useState<string>("24"); // Default to 24 hours
  const [chartData, setChartData] = useState<SolarWindParameterDataPoint[]>([]);
  const [mounted, setMounted] = useState(false);

   useEffect(() => {
    setMounted(true);
    setChartData(generateMockSolarWindData(parseInt(timeframe)));
  }, [timeframe]);

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
            <span>Solar Wind Parameters</span>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
                <CardTitle className="text-xl font-headline flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                <span>Solar Wind Parameters ({timeframe}h)</span>
                </CardTitle>
                <CardDescription>Tracking key solar wind conditions over the past {timeframe} hours.</CardDescription>
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
            <XAxis dataKey="time" stroke={mutedColor} tick={{ fill: mutedColor, fontSize: 12 }} />
            <YAxis yAxisId="left" stroke={mutedColor} tick={{ fill: mutedColor, fontSize: 12 }} domain={[-25, 25]} />
            <YAxis yAxisId="rightSpeed" orientation="right" stroke={mutedColor} tick={{ fill: mutedColor, fontSize: 12 }} domain={[200, 1000]} />
            <YAxis yAxisId="rightDensity" orientation="right" stroke={mutedColor} tick={{ fill: mutedColor, fontSize: 12 }} domain={[0, 30]} dx={50} />
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
