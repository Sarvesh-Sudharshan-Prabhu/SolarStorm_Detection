'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { KpIndexPredictionResult } from "@/types";
import { Gauge, Zap, AlertTriangle, ShieldAlert, TrendingUp } from "lucide-react";

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

export function KpDisplayCard({ prediction }: KpDisplayCardProps) {
  const { color, icon } = getGeoeffectivenessStyle(prediction?.geoeffectiveness);

  return (
    <Card className="shadow-xl hover:shadow-primary/30 transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-headline flex items-center justify-between">
          <span>Live Kp-index</span>
          <Gauge className="h-6 w-6 text-primary" />
        </CardTitle>
        <CardDescription>Current solar activity forecast</CardDescription>
      </CardHeader>
      <CardContent>
        {prediction ? (
          <div className="space-y-2">
            <p className="text-5xl font-bold text-primary animate-pulse">
              {prediction.kpIndex.toFixed(1)}
            </p>
            <div className={`flex items-center gap-2 text-lg font-medium ${color}`}>
              {icon}
              <span>{prediction.geoeffectiveness}</span>
            </div>
            <p className="text-xs text-muted-foreground">
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
             <p className="text-xs text-muted-foreground">
              Submit solar wind data to generate a forecast.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
