import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { SatelliteImage as SatelliteImageProps } from '@/types';
import { ExternalLink } from 'lucide-react';

export function SatelliteImageCard({ image }: { image: SatelliteImageProps }) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-accent/30 transition-shadow duration-300 group">
      <CardContent className="p-0">
        <div className="aspect-video relative">
          <Image
            src={image.src}
            alt={image.alt}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={image.dataAiHint}
          />
        </div>
      </CardContent>
      <CardFooter className="p-3 bg-card/70 backdrop-blur-sm">
        <div className="text-xs">
          <p className="font-semibold text-foreground">{image.source}</p>
          <p className="text-muted-foreground">Captured: {image.timestamp}</p>
           <a 
            href={image.src.startsWith('https://placehold.co') ? `https://images.nasa.gov/` : image.src} // Placeholder link to NASA images
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-accent transition-colors inline-flex items-center gap-1 mt-1"
          >
            View Source <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
