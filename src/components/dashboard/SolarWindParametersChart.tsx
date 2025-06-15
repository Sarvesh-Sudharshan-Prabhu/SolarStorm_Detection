
'use client';

import { Activity, Info, Loader2, AlertTriangle } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SolarWindParameterDataPoint, SolarWindDataInput } from '@/types';
import { useEffect, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fetchLatestSolarWindData } from '@/app/actions'; // Import the server action

const MAX_DATA_POINTS = 30; // Show the last 30 data points
const FETCH_INTERVAL = 60 * 1000; // Fetch every 60 seconds

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
  const [chartData, setChartData] = useState<SolarWindParameterDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchLatestSolarWindData();
        if (result.error) {
          throw new Error(result.error);
        }
        if (result.data) {
          const now = new Date();
          const newPoint: SolarWindParameterDataPoint = {
            time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
            bz: result.data.bz,
            speed: result.data.speed,
            density: result.data.density,
          };
          setChartData(prevData => {
            const updatedData = [...prevData, newPoint];
            return updatedData.slice(-MAX_DATA_POINTS); // Keep only the last MAX_DATA_POINTS
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch live solar wind data.";
        console.error("Error fetching solar wind data:", errorMessage);
        setError(errorMessage);
        // Optionally, clear chart data or show a specific error state in the chart
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, FETCH_INTERVAL);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
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
            <span>Live Solar Wind Parameters</span>
          </CardTitle>
          <CardDescription>Tracking key solar wind conditions, updated periodically.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Initializing live data feed...</p>
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
                <span>Live Solar Wind Parameters</span>
                </CardTitle>
                <CardDescription>
                  Tracking key solar wind conditions. Data attempts to update every {FETCH_INTERVAL / 1000 / 60} minute(s).
                  {isLoading && chartData.length > 0 && <span className="text-xs ml-2">(Updating...)</span>}
                </CardDescription>
            </div>
             {isLoading && chartData.length === 0 && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
        </div>
      </CardHeader>
      <CardContent className="h-[300px] pt-6">
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-destructive">
            <AlertTriangle className="h-10 w-10 mb-2" />
            <p className="font-semibold">Error Fetching Data</p>
            <p className="text-xs text-center max-w-md">{error}</p>
            <p className="text-xs mt-2">Using fallback data in Kp Prediction Form if available.</p>
          </div>
        )}
        {!error && chartData.length === 0 && isLoading && (
           <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
            <p>Fetching initial live solar wind data...</p>
          </div>
        )}
        {!error && chartData.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Activity className="h-10 w-10 mb-2" />
            <p>No live data points yet. Waiting for the first update.</p>
          </div>
        )}
        {!error && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="time" stroke={mutedColor} tick={{ fill: mutedColor, fontSize: 12 }} />
              <YAxis yAxisId="left" stroke={mutedColor} tick={{ fill: mutedColor, fontSize: 12 }} domain={[-30, 30]} allowDataOverflow={true} />
              <YAxis yAxisId="rightSpeed" orientation="right" stroke={mutedColor} tick={{ fill: mutedColor, fontSize: 12 }} domain={[200, 1200]} allowDataOverflow={true}/>
              <YAxis yAxisId="rightDensity" orientation="right" stroke={mutedColor} tick={{ fill: mutedColor, fontSize: 12 }} domain={[0, 50]} dx={50} allowDataOverflow={true}/>
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
                isAnimationActive={false}
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
                isAnimationActive={false}
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
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

