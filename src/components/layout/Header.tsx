import { Sun } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="py-4 px-4 md:px-8 border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-md z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Sun className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
          <h1 className="text-2xl font-headline font-bold text-foreground group-hover:text-accent transition-colors">
            Solar Flare Forecaster
          </h1>
        </Link>
        {/* Navigation items can be added here if needed */}
      </div>
    </header>
  );
}
