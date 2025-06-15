
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { KpIndexPredictionResult } from "@/types";
import { Gauge, Zap, AlertTriangle, ShieldAlert, TrendingUp, Sparkles, Eye } from "lucide-react"; // Added Sparkles, Eye
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KpDisplayCardProps {
  prediction: KpIndexPredictionResult | null;
}

const getGeoeffectivenessStyle = (level?: string) => {
  switch (level?.toLowerCase()) {
    case "low":
      return { color: "text-green-400", icon: <TrendingUp className="h-5 w-5" /> };
    case "moderate":
      return { color: "text-yellow-400", icon: <Zap className="h-5 w-5" /> };
    case "high":
      return { color: "text-orange-400", icon: <AlertTriangle className="h-5 w-5" /> };
    case "severe":
      return { color: "text-red-500", icon: <ShieldAlert className="h-5 w-5" /> };
    case "extreme":
      return { color: "text-purple-500", icon: <ShieldAlert className="h-5 w-5" /> };
    default:
      return { color: "text-muted-foreground", icon: <Gauge className="h-5 w-5" /> };
  }
};

const KpIndexTooltipContent = (
  <p className="max-w-xs">
    The Kp-index is a global geomagnetic activity index that quantifies disturbances in the Earth's magnetic field.
    It ranges from 0 (calm) to 9 (extreme storm). Higher values indicate stronger solar activity impacting Earth.
  </p>
);

export function KpDisplayCard({ prediction }: KpDisplayCardProps) {
  const { color, icon } = getGeoeffectivenessStyle(prediction?.geoeffectiveness);

  return (
    <Card className="shadow-xl hover:shadow-primary/30 transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-headline flex items-center justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="underline decoration-dotted cursor-help">Live Kp-index</span>
              </TooltipTrigger>
              <TooltipContent>{KpIndexTooltipContent}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Gauge className="h-6 w-6 text-primary" />
        </CardTitle>
        <CardDescription>Current solar activity forecast</CardDescription>
      </CardHeader>
      <CardContent>
        {prediction ? (
          <div className="space-y-3">
            <p className="text-5xl font-bold text-primary animate-pulse">
              {prediction.kpIndex.toFixed(1)}
            </p>
            <div className={`flex items-center gap-2 text-lg font-medium ${color}`}>
              {icon}
              <span>{prediction.geoeffectiveness}</span>
            </div>
            {prediction.auroraVisibilityForecast && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground border-t border-border pt-2 mt-2">
                <Sparkles className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Aurora Forecast:</p>
                  <p>{prediction.auroraVisibilityForecast}</p>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground pt-1">
              Forecast as of: {new Date(prediction.timestamp).toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-5xl font-bold text-muted-foreground">N/A</p>
            <div className="flex items-center gap-2 text-lg font-medium text-muted-foreground">
              <Gauge className="h-5 w-5" />
              <span>No prediction available</span>
            </div>
            {prediction?.auroraVisibilityForecast === undefined && (
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <span>Aurora forecast pending...</span>
                 </div>
            )}
             <p className="text-xs text-muted-foreground">
              Submit solar wind data to generate a forecast.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
