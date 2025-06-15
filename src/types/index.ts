import type { KpIndexForecastingOutput } from '@/ai/flows/kp-index-forecasting';
import type { AnalyzeSolarImageOutput as AISolarImageOutput } from '@/ai/flows/analyze-solar-image-flow';

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
  matrix: number[][];
}

// Types for Solar Image Analysis
export type AnalyzeSolarImageOutput = AISolarImageOutput;

export interface SolarImageAnalysisDisplayResult extends AnalyzeSolarImageOutput {
  timestamp: string;
  imagePreviewUrl?: string;
}
