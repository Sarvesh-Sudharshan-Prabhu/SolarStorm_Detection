
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { handleKpIndexPrediction, type PredictionResult, fetchLatestSolarWindData, type RealtimeSolarWindResult } from '@/app/actions';
import type { KpIndexPredictionResult } from '@/types';
import { WandSparkles, Loader2, Info, DownloadCloud } from 'lucide-react';
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formSchema = z.object({
  bz: z.coerce.number().min(-100, "Bz must be >= -100").max(100, "Bz must be <= 100"),
  bt: z.coerce.number().min(0, "Bt must be >= 0").max(100, "Bt must be <= 100"),
  speed: z.coerce.number().min(100, "Speed must be >= 100 km/s").max(2000, "Speed must be <= 2000 km/s"),
  density: z.coerce.number().min(0.1, "Density must be >= 0.1 p/cm³").max(100, "Density must be <= 100 p/cm³"),
  dst: z.coerce.number().min(-1000, "Dst must be >= -1000").max(500, "Dst must be <= 500"),
  modelDataUri: z.string().min(1, "Model Data URI is required."),
});

interface KpPredictionFormProps {
  onPredictionResult: (result: KpIndexPredictionResult) => void;
}

const defaultModelUri = "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=="; // Placeholder "Hello, World!"

const glossary: Record<string, string> = {
  bz: "Bz GSM (Interplanetary Magnetic Field, Z-component in Geocentric Solar Magnetospheric coordinates): The north-south direction of the solar wind's magnetic field. A strong southward Bz (negative values) is a key indicator for geomagnetic storms as it allows solar wind energy to more easily enter Earth's magnetosphere.",
  bt: "Bt (Total Interplanetary Magnetic Field strength): The overall strength of the solar wind's magnetic field. Higher Bt values generally indicate a more disturbed solar wind.",
  speed: "Solar Wind Speed: The speed at which charged particles from the sun (solar wind) travel. Faster solar wind can lead to stronger geomagnetic activity.",
  density: "Solar Wind Density: The number of solar wind particles (protons) per cubic centimeter. Higher density can also contribute to stronger geomagnetic effects.",
  dst: "Dst Index (Disturbance Storm Time Index): A measure of geomagnetic storm intensity based on the average change of the horizontal component of Earth's magnetic field at mid-latitude stations. More negative values indicate stronger storms."
};

const FormLabelWithTooltip = ({ fieldName, children }: { fieldName: keyof typeof glossary, children: React.ReactNode }) => (
  <FormLabel>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex items-center gap-1 underline decoration-dotted cursor-help">
            {children} <Info className="h-3 w-3 text-muted-foreground" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" align="start" className="max-w-xs p-2">
          <p>{glossary[fieldName]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </FormLabel>
);


export function KpPredictionForm({ onPredictionResult }: KpPredictionFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isFetchingRealtime, setIsFetchingRealtime] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bz: -20.0,
      bt: 25.0,
      speed: 750,
      density: 15.0,
      dst: -150,
      modelDataUri: defaultModelUri,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const solarWindData = {
        bz: values.bz,
        bt: values.bt,
        speed: values.speed,
        density: values.density,
        dst: values.dst,
      };
      const result: PredictionResult = await handleKpIndexPrediction(solarWindData, values.modelDataUri);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Prediction Error",
          description: result.error,
        });
      } else if (result.data) {
        toast({
          title: "Prediction Successful",
          description: `Kp-index: ${result.data.kpIndex.toFixed(1)}, Geoeffectiveness: ${result.data.geoeffectiveness}`,
        });
        onPredictionResult({ ...result.data, timestamp: new Date().toISOString() });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleFetchRealtimeData() {
    setIsFetchingRealtime(true);
    try {
      const result: RealtimeSolarWindResult = await fetchLatestSolarWindData();
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Failed to Fetch Real-time Data",
          description: result.error,
        });
      } else if (result.data) {
        form.reset({ // Using reset to update multiple fields, or use setValue for individual fields
          bz: result.data.bz,
          bt: result.data.bt,
          speed: result.data.speed,
          density: result.data.density,
          dst: result.data.dst,
          modelDataUri: form.getValues("modelDataUri"), // Keep existing model URI
        });
        toast({
          title: "Real-time Data Loaded",
          description: "Form updated with latest (simulated) solar wind parameters.",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Error Fetching Data",
        description: errorMessage,
      });
    } finally {
      setIsFetchingRealtime(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center gap-2">
          <WandSparkles className="h-6 w-6 text-accent" />
          <span>Predict Kp-index</span>
        </CardTitle>
        <CardDescription>Input solar wind data or load (simulated) real-time values to forecast Kp-index using AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bz"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelWithTooltip fieldName="bz">Bz GSM (nT)</FormLabelWithTooltip>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="-20.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelWithTooltip fieldName="bt">Bt (nT)</FormLabelWithTooltip>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="25.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="speed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelWithTooltip fieldName="speed">Solar Wind Speed (km/s)</FormLabelWithTooltip>
                    <FormControl>
                      <Input type="number" step="10" placeholder="750" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="density"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelWithTooltip fieldName="density">Solar Wind Density (p/cm³)</FormLabelWithTooltip>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="15.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dst"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelWithTooltip fieldName="dst">Dst Index (nT)</FormLabelWithTooltip>
                    <FormControl>
                      <Input type="number" step="1" placeholder="-150" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="modelDataUri"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>ML Model Data URI</FormLabel>
                    <FormControl>
                      <Input placeholder="data:application/octet-stream;base64,..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a data URI for the pre-trained model (e.g., base64 encoded).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={handleFetchRealtimeData} className="w-full sm:w-auto" disabled={isFetchingRealtime || isSubmitting}>
                {isFetchingRealtime ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Data...
                  </>
                ) : (
                  <>
                    <DownloadCloud className="mr-2 h-4 w-4" />
                    Load Real-time Data
                  </>
                )}
              </Button>
              <Button type="submit" className="w-full" disabled={isSubmitting || isFetchingRealtime}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <WandSparkles className="mr-2 h-4 w-4" />
                    Generate Forecast
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
