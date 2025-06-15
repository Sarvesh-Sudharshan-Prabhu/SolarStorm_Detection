'use client';

import { Satellite } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SatelliteImageCard } from './SatelliteImageCard';
import type { SatelliteImage } from '@/types';

const mockSatelliteImages: SatelliteImage[] = [
  {
    id: 'sdo-aia-193',
    src: 'https://placehold.co/600x400.png',
    alt: 'SDO AIA 193 Angstrom',
    timestamp: '2024-07-27 10:00 UTC',
    source: 'NASA SDO AIA 193',
    dataAiHint: 'sun corona',
  },
  {
    id: 'goes-suvi-fe-094',
    src: 'https://placehold.co/600x400.png',
    alt: 'GOES SUVI Fe 094',
    timestamp: '2024-07-27 10:05 UTC',
    source: 'NOAA GOES SUVI Fe 094',
    dataAiHint: 'solar flare',
  },
  {
    id: 'soho-lasco-c2',
    src: 'https://placehold.co/600x400.png',
    alt: 'SOHO LASCO C2 Coronal Mass Ejection',
    timestamp: '2024-07-27 09:50 UTC',
    source: 'ESA/NASA SOHO LASCO C2',
    dataAiHint: 'solar wind',
  },
   {
    id: 'ovation-aurora',
    src: 'https://placehold.co/600x400.png',
    alt: 'OVATION Aurora Forecast',
    timestamp: '2024-07-27 10:10 UTC',
    source: 'NOAA SWPC OVATION',
    dataAiHint: 'aurora earth',
  },
];

export function SatelliteImageryFeed() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center gap-2">
          <Satellite className="h-6 w-6 text-primary" />
          <span>Live Satellite Imagery</span>
        </CardTitle>
        <CardDescription>Visual feed of solar activity from various satellites.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {mockSatelliteImages.map((image) => (
            <SatelliteImageCard key={image.id} image={image} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
