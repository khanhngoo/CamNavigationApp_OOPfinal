"use client"

import type { Message } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { MapPin, Navigation, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLocationStore } from "@/lib/store"

export default function ChatMessages({ messages }: { messages: Message[] }) {
  const { 
    selectedLocation,
    setSelectedLocation,
    stopNavigation
  } = useLocationStore()

  const handleSelectLocation = (locationId: string) => {
    console.log("handleSelectLocation called with:", locationId)
    if (selectedLocation === locationId) {
      console.log("Stopping navigation")
      stopNavigation()
    } else {
      console.log("Setting selected location:", locationId)
      setSelectedLocation(locationId)
    }
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
          <div className={`flex max-w-[95%] gap-2 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <Avatar className="h-6 w-6 flex-shrink-0">
              {message.role === "user" ? (
                <>
                  <AvatarFallback className="bg-primary text-white text-xs">U</AvatarFallback>
                  <AvatarImage src="/placeholder.svg?height=24&width=24" />
                </>
              ) : (
                <>
                  <AvatarFallback className="bg-secondary text-white text-xs">AI</AvatarFallback>
                  <AvatarImage src="/placeholder.svg?height=24&width=24" />
                </>
              )}
            </Avatar>

            <div className="space-y-2">
              <div
                className={`rounded-lg p-2 text-sm ${
                  message.role === "user" ? "bg-primary text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                <p>{message.content}</p>
              </div>

              {message.routes && message.routes.length > 0 && (
                <div className="grid gap-2 sm:grid-cols-1">
                  {message.routes.map((route) => (
                    <Card key={route.id} className="overflow-hidden">
                      <div className="p-2">
                        <div className="mb-1 flex items-center justify-between">
                          <h3 className="font-semibold text-sm">{route.destination.name}</h3>
                          <Badge variant="outline" className="bg-secondary/10 text-secondary text-xs">
                            {route.destination.category}
                          </Badge>
                        </div>

                        <p className="mb-1 text-xs text-gray-600">{route.destination.description}</p>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-primary" />
                            <span>{route.distance}m</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-primary" />
                            <span>{route.duration}min</span>
                          </div>
                        </div>

                        <div className="mt-2 flex justify-end gap-2">
                          <Button
                            size="sm"
                            className={`h-7 text-xs ${
                              selectedLocation === route.destination.id
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-secondary hover:bg-secondary/90"
                            } text-white`}
                            onClick={() => handleSelectLocation(route.destination.id)}
                          >
                            {selectedLocation === route.destination.id ? (
                              <>
                                <X className="mr-1 h-3 w-3" />
                                Stop
                              </>
                            ) : (
                              <>
                                <Navigation className="mr-1 h-3 w-3" />
                                Navigate
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
