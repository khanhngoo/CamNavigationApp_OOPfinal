"use client"

import { Clock, MapPin, Navigation } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLocationStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"

export default function RouteDisplay() {
  const { locations, selectedLocation, setSelectedLocation, routes } = useLocationStore()

  if (routes.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-800">Suggested Routes</CardTitle>
          <CardDescription>Enter a prompt to see suggested routes on campus</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-gray-500">
          <p>No routes to display yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-gray-800">Suggested Routes</CardTitle>
        <CardDescription>{routes.length} places found based on your request</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {routes.map((route) => (
          <Card
            key={route.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedLocation === route.destination.id ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => setSelectedLocation(route.destination.id)}
          >
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">{route.destination.name}</h3>
                <Badge variant="outline" className="bg-secondary/10 text-secondary">
                  {route.destination.category}
                </Badge>
              </div>

              <div className="mb-3 text-sm text-gray-600">{route.destination.description}</div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{route.distance} meters</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{route.duration} min</span>
                </div>
                <Button size="sm" variant="secondary" className="text-white">
                  <Navigation className="mr-1 h-3 w-3" />
                  Navigate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
