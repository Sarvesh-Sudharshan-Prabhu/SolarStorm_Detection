
import type { KpIndexForecastingOutput as AIKpIndexOutput } from '@/ai/flows/kp-index-forecasting';
import type { AnalyzeSolarImageOutput as AISolarImageOutput } from '@/ai/flows/analyze-solar-image-flow';

export interface SolarWindDataInput {
  bz: number;
  bt: number;
  speed: number;
  density: number;
  dst: number;
}

// Extended KpIndexForecastingOutput from AI flow
export interface KpIndexForecastingOutput extends AIKpIndexOutput {
  auroraVisibilityForecast?: string; // Added for Aurora Forecast
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

// Extended AnalyzeSolarImageOutput from AI flow
export interface AnalyzeSolarImageOutput extends AISolarImageOutput {
  sunspotGroups?: string;
  solarFlares?: string;
  otherPhenomena?: string;
}

export interface SolarImageAnalysisDisplayResult extends AnalyzeSolarImageOutput {
  timestamp: string;
  imagePreviewUrl?: string;
}

// For Historical Event Context
export interface HistoricalSolarEvent {
  name: string;
  year: string; // Or Date
  estimatedKp?: number; // Kp might not always be known, or is an estimate
  description: string;
  impactSummary: string;
}

// Glossary Term type (optional, could be defined inline if simple)
export interface GlossaryTerm {
  term: string;
  definition: string;
}
