// src/components/infrastructure/MapPage.tsx
'use client';

import * as React from 'react';
import { Layers, Plus, Minus, Maximize, Cable, Warehouse, Box, Power, TowerControl, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useLocale } from '@/contexts/LocaleContext';
import { MapComponent } from '@/components/map-component';

export function MapPage() {
  const { t } = useLocale();
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const iconSize = 'h-3 w-3';

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen">
        <Card className="flex-1 flex flex-col overflow-hidden border-0 rounded-none shadow-none">
          <CardContent className="flex-1 p-0 relative">
            <MapComponent apiKey={googleMapsApiKey} />

            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              {[{ Icon: Plus, key: 'zoom_in' }, { Icon: Minus, key: 'zoom_out' }, { Icon: Maximize, key: 'fullscreen' }, { Icon: Layers, key: 'layers' }].map(({ Icon, key }) => (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="bg-background border border-border">
                      <Icon className={iconSize} />
                      <span className="sr-only">{t(`maps_page.${key}_tooltip`, key)}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p className="text-xs">{t(`maps_page.${key}_tooltip`, key)}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {[{ Icon: Cable, key: 'add_cable' }, { Icon: Warehouse, key: 'add_fosc' }, { Icon: Box, key: 'add_fdh' }, { Icon: Power, key: 'add_poll' }, { Icon: TowerControl, key: 'add_tower' }, { Icon: Building, key: 'add_pop' }].map(({ Icon, key }) => (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="bg-background border border-border">
                      <Icon className={iconSize} />
                      <span className="sr-only">{t(`maps_page.${key}_tooltip`, key)}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="text-xs">{t(`maps_page.${key}_tooltip`, key)}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
