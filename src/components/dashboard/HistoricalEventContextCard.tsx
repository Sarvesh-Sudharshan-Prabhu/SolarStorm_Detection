
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { HistoricalSolarEvent, KpIndexPredictionResult } from "@/types";
import { Landmark, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HistoricalEventContextCardProps {
  currentPrediction: KpIndexPredictionResult | null;
}

const historicalEvents: HistoricalSolarEvent[] = [
  {
    name: "The Carrington Event",
    year: "1859",
    estimatedKp: 9, // Max Kp
    description: "Largest recorded geomagnetic storm. Caused widespread telegraph disruptions, auroras seen worldwide.",
    impactSummary: "Telegraph systems failed, some operators received shocks. Auroras visible in Caribbean."
  },
  {
    name: "Quebec Blackout",
    year: "1989",
    estimatedKp: 9,
    description: "Major geomagnetic storm that caused a 9-hour power outage for 6 million people in Quebec, Canada.",
    impactSummary: "Power grid collapse, satellite disruptions, radio interference."
  },
  {
    name: "Halloween Solar Storms",
    year: "2003",
    estimatedKp: 9,
    description: "Series of powerful solar flares and CMEs. Caused power outages in Sweden, damaged transformers in South Africa.",
    impactSummary: "Power outages, satellite damage, GPS disruptions, airline rerouting."
  },
  {
    name: "St. Patrick's Day Storm",
    year: "2015",
    estimatedKp: 8,
    description: "Strong G4 geomagnetic storm, one of the strongest of solar cycle 24. Auroras visible at lower latitudes.",
    impactSummary: "Radio blackouts, aurora displays."
  },
];

const KpIndexTooltip = ({ children }: { children: React.ReactNode }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="underline decoration-dotted cursor-help">{children}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs">The Kp-index is a global geomagnetic activity index. It ranges from 0 (calm) to 9 (extreme storm).</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);


export function HistoricalEventContextCard({ currentPrediction }: HistoricalEventContextCardProps) {
  const currentKp = currentPrediction?.kpIndex;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center gap-2">
          <Landmark className="h-6 w-6 text-primary" />
          <span>Historical Solar Storms Context</span>
        </CardTitle>
        <CardDescription>Comparing current forecast to past significant events.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="font-semibold">Current Predicted <KpIndexTooltip>Kp-index</KpIndexTooltip>: </span>
          {currentKp !== undefined ? (
            <span className={`font-bold text-2xl ${currentKp >= 7 ? 'text-red-500' : currentKp >= 5 ? 'text-orange-400' : 'text-green-400'}`}>
              {currentKp.toFixed(1)}
            </span>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          )}
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {historicalEvents.map((event) => (
            <div key={event.name} className="p-3 border rounded-md bg-card-foreground/5">
              <h4 className="font-semibold text-md text-primary-foreground">{event.name} ({event.year})</h4>
              {event.estimatedKp !== undefined && (
                <p className="text-sm">
                  Estimated <KpIndexTooltip>Kp-index</KpIndexTooltip>: <span className="font-bold">{event.estimatedKp}</span>
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
              <p className="text-xs mt-1"><span className="font-medium">Impacts:</span> {event.impactSummary}</p>
              {currentKp !== undefined && event.estimatedKp !== undefined && (
                 <div className="text-xs mt-1 flex items-center gap-1">
                  {currentKp > event.estimatedKp ? <TrendingUp className="h-3 w-3 text-red-500" /> : currentKp < event.estimatedKp ? <TrendingDown className="h-3 w-3 text-green-500" /> : null}
                  {currentKp > event.estimatedKp ? <span>Current forecast is stronger than this event.</span> :
                   currentKp < event.estimatedKp ? <span>Current forecast is weaker than this event.</span> :
                   <span>Current forecast is comparable to this event.</span>}
                 </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
