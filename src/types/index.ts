import type { KpIndexForecastingOutput } from '@/ai/flows/kp-index-forecasting';

export interface SolarWindDataInput {
  bz: number;
  bt: number;
  speed: number;
  density: number;
  dst: number;
}

export interface KpIndexPredictionResult extends KpIndexForecastingOutput {
  timestamp: string;
}

export interface HistoricalDataPoint {
  date: string;
  kpIndex: number;
}

// SatelliteImage type removed
