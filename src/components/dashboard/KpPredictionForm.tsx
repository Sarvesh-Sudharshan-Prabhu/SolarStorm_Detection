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
import { handleKpIndexPrediction, type PredictionResult } from '@/app/actions';
import type { KpIndexPredictionResult } from '@/types';
import { WandSparkles, Loader2 } from 'lucide-react';
import React from 'react';

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

export function KpPredictionForm({ onPredictionResult }: KpPredictionFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bz: -5.0,
      bt: 10.0,
      speed: 450,
      density: 5.0,
      dst: -20,
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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center gap-2">
          <WandSparkles className="h-6 w-6 text-accent" />
          <span>Predict Kp-index</span>
        </CardTitle>
        <CardDescription>Input solar wind data to forecast Kp-index using AI.</CardDescription>
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
                    <FormLabel>Bz GSM (nT)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="-5.0" {...field} />
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
                    <FormLabel>Bt (nT)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="10.0" {...field} />
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
                    <FormLabel>Solar Wind Speed (km/s)</FormLabel>
                    <FormControl>
                      <Input type="number" step="10" placeholder="450" {...field} />
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
                    <FormLabel>Solar Wind Density (protons/cm³)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="5.0" {...field} />
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
                    <FormLabel>Dst Index (nT)</FormLabel>
                    <FormControl>
                      <Input type="number" step="1" placeholder="-20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="modelDataUri"
                render={({ field }) => (
                  <FormItem>
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
