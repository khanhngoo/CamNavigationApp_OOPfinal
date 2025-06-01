"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { useLocationStore } from "@/lib/store"
import { MapPin } from "lucide-react"

export default function CampusMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const { selectedRoute, selectedLocation, routes } = useLocationStore()
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // This would be replaced with actual map initialization code
    // using a library like Leaflet or Mapbox
    if (mapRef.current && !mapLoaded) {
      // Simulate map loading
      const timer = setTimeout(() => {
        setMapLoaded(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [mapLoaded])

  useEffect(() => {
    if (mapLoaded && selectedRoute) {
      // This would update the map to show the selected route
      console.log("Drawing route on map:", selectedRoute)
    }
  }, [mapLoaded, selectedRoute, selectedLocation])

  return (
    <Card className="h-full w-full overflow-hidden shadow-lg">
      <div ref={mapRef} className="relative h-full w-full bg-gray-100">
        {!mapLoaded ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="h-full w-full">
            {/* This would be replaced with the actual map component */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="mb-4 text-2xl font-semibold text-primary">Campus Map</p>

                {selectedRoute ? (
                  <div className="space-y-2">
                    <div className="inline-block rounded-full bg-secondary/10 px-4 py-2 text-secondary">
                      <p className="text-lg font-medium">Route to {selectedRoute.destination.name}</p>
                      <p className="text-sm">
                        {selectedRoute.distance}m • {selectedRoute.duration} min
                      </p>
                    </div>

                    <div className="mt-4 h-1 w-32 bg-secondary mx-auto"></div>

                    <p className="mt-4 text-gray-600">{selectedRoute.destination.description}</p>

                    {selectedRoute.destination.openHours && (
                      <p className="text-sm text-gray-500">Open: {selectedRoute.destination.openHours}</p>
                    )}
                  </div>
                ) : routes.length > 0 ? (
                  <div>
                    <p className="text-gray-600">Select a destination to see the route</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {routes.slice(0, 3).map((route) => (
                        <div
                          key={route.id}
                          className="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-sm"
                        >
                          <MapPin className="h-3 w-3 text-primary" />
                          <span>{route.destination.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">Ask where you want to go to see available destinations</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
