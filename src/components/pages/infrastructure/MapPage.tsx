// src/components/infrastructure/MapPage.tsx
'use client';

import * as React from 'react';
import {
  Layers,
  Plus,
  Minus,
  Maximize,
  Cable,
  Warehouse,
  Box,
  Power,
  TowerControl,
  Building,
  Settings,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useLocale } from '@/contexts/LocaleContext';
import { MapComponent } from '@/components/map-component';

export function MapPage() {
  const { t } = useLocale();
  const iconSize = 'h-3 w-3';

  const [activeTool, setActiveTool] = React.useState<string | null>(null);
  const [apiKey, setApiKey] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleZoomIn = () => console.log('Zoom In');
  const handleZoomOut = () => console.log('Zoom Out');
  const handleFullscreen = () => {
    const doc = document as any;
    const elem = document.documentElement;

    if (doc.fullscreenElement) {
      doc.exitFullscreen();
    } else {
      elem.requestFullscreen().catch((err: any) => {
        console.error('Fullscreen error:', err);
      });
    }
  };
  const handleLayerToggle = () => console.log('Toggle Layers');

  const controlButtons = [
    { Icon: Plus, key: 'zoom_in', onClick: handleZoomIn },
    { Icon: Minus, key: 'zoom_out', onClick: handleZoomOut },
    { Icon: Maximize, key: 'fullscreen', onClick: handleFullscreen },
    { Icon: Layers, key: 'layers', onClick: handleLayerToggle },
  ];

  const objectTools = [
    { Icon: Cable, key: 'add_cable' },
    { Icon: Warehouse, key: 'add_fosc' },
    { Icon: Box, key: 'add_fdh' },
    { Icon: Power, key: 'add_poll' },
    { Icon: TowerControl, key: 'add_tower' },
    { Icon: Building, key: 'add_pop' },
  ];

  const handleSaveApiKey = () => {
    fetch('/api/inventory/maps/save-env', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
        value: apiKey,
      }),
    })
      .then((res) => res.ok && setDialogOpen(false))
      .catch((err) => console.error('Error saving .env:', err));
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen">
        <Card className="flex-1 flex flex-col overflow-hidden border-0 rounded-none shadow-none">
          <CardContent className="flex-1 p-0 relative">
            <MapComponent apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} />

            {/* Top-right controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              {controlButtons.map(({ Icon, key, onClick }) => (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-background border border-border"
                      onClick={onClick}
                    >
                      <Icon className={iconSize} />
                      <span className="sr-only">
                        {t(`maps_page.${key}_tooltip`) || key.replace(/_/g, ' ')}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p className="text-xs">
                      {t(`maps_page.${key}_tooltip`) || key.replace(/_/g, ' ')}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Object tools + Settings */}
            <div className="absolute top-4 left-4 z-10">
              <Card className="bg-background p-2 rounded-xl shadow-sm border">
                <div className="flex flex-col gap-2">
                  {objectTools.map(({ Icon, key }) => (
                    <Tooltip key={key}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={activeTool === key ? 'default' : 'outline'}
                          size="icon"
                          className="bg-background border border-border"
                          onClick={() => setActiveTool(key)}
                        >
                          <Icon className={iconSize} />
                          <span className="sr-only">
                            {t(`maps_page.${key}_tooltip`) || key.replace(/_/g, ' ')}
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="text-xs">
                          {t(`maps_page.${key}_tooltip`) || key.replace(/_/g, ' ')}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}

                  {/* Separator */}
                  <div className="border-t border-muted my-2" />

                  {/* Gear Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-background border border-border"
                          >
                            <Settings className={iconSize} />
                            <span className="sr-only">
                              {t('maps_page.settings') || 'Settings'}
                            </span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Map Configuration</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Google Maps API Key</label>
                            <Input
                              placeholder="Enter API Key"
                              value={apiKey}
                              onChange={(e) => setApiKey(e.target.value)}
                            />
                          </div>
                          <DialogFooter className="mt-4">
                            <Button onClick={handleSaveApiKey}>Save</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-xs">{t('maps_page.settings') || 'Settings'}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
