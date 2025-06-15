
import { config } from 'dotenv';
config();

import '@/ai/flows/kp-index-forecasting.ts';
import '@/ai/flows/analyze-solar-image-flow.ts';
import '@/ai/tools/get-realtime-solar-wind-tool.ts'; // Added import for the new tool
