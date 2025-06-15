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

export interface SolarWindParameterDataPoint {
  time: string;
  bz: number;
  speed: number;
  density: number;
}

export type GeoeffectivenessLevel = "Low" | "Moderate" | "High" | "Severe" | "Extreme";

export interface ConfusionMatrixData {
  categories: GeoeffectivenessLevel[];
  matrix: number[][]; // matrix[actual_idx][predicted_idx] = count
}
