// src/components/pages/inventory/VehiclesPage.tsx
'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function InventoryVehicles() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Vehicles</CardTitle>
          <Button variant="default" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">
            No vehicles available. Use the button above to register a vehicle.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
