"use client"

import L from "leaflet"
import "leaflet/dist/leaflet.css"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet"
import { useLocationStore } from "@/lib/store"
import { useEffect, useMemo } from "react"

// Fix Leaflet's default icon paths (needed for markers to appear)
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
})

const defaultCenter: [number, number] = [20.988626, 105.945269]

function RouteLayer() {
  const { selectedRoute } = useLocationStore()
  const map = useMap()

  // Memoise polyline positions
  const linePositions = useMemo(() => selectedRoute?.path ?? [], [selectedRoute])

  useEffect(() => {
    if (!selectedRoute) return

    // Build bounds from full path + endpoints
    const points = selectedRoute.path as [number, number][]

    const bounds = L.latLngBounds(points)
    map.fitBounds(bounds, { padding: [50, 50] })
  }, [selectedRoute, map])

  if (!selectedRoute) return null

  return (
    <>
      {/* Always show starting point marker */}
      <Marker position={defaultCenter as [number, number]} opacity={1}>
        <Popup>Building E</Popup>
      </Marker>

      {/* Route polyline */}
      <Polyline positions={linePositions} pathOptions={{ color: "#16a34a", weight: 4 }} />

      {/* Alternative paths */}
      {selectedRoute.altPaths?.map((p, idx) => (
        <Polyline key={`alt-${idx}`} positions={p} pathOptions={{ color: "#facc15", weight: 3, opacity: 0.7 }} />
      ))}

      {/* Render marker for each node in path */}
      {selectedRoute.path.map((coord, idx) => {
        const isEndpoint = idx === 0 || idx === selectedRoute.path.length - 1
        const name = selectedRoute.nodeNames?.[idx] ?? `Node ${idx + 1}`
        return (
          <Marker key={idx} position={coord as [number, number]} opacity={isEndpoint ? 1 : 0.6}>
            <Popup>{name}</Popup>
          </Marker>
        )
      })}
    </>
  )
}

// Utility layer that logs lat/lng to console on click
function ClickLogger() {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      // Round to 6 decimals for easy copy
      console.log(`Clicked at: ${lat.toFixed(14)}, ${lng.toFixed(14)}`)
    },
  })
  return null
}

// Handler for add-mode clicks
function AddClickHandler({ onAdd }: { onAdd: (lat:number,lng:number)=>void }) {
  useMapEvents({
    click(e){ onAdd(e.latlng.lat,e.latlng.lng) }
  })
  return null
}

export default function LeafletMapClient({ categoryFilter = "all", addMode = false, onMapClick }: { categoryFilter?: string; addMode?: boolean; onMapClick?: (lat:number,lng:number)=>void }) {
  const { locations } = useLocationStore()

  return (
    <MapContainer
      center={defaultCenter}
      zoom={18}
      maxZoom={50}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
        maxZoom={50}
      />
      <ClickLogger />
      {addMode && onMapClick && <AddClickHandler onAdd={onMapClick} />}
      {categoryFilter !== "none" && locations
        .filter(loc => categoryFilter === "all" || loc.category === categoryFilter)
        .map(loc => (
          <Marker key={loc.id} position={[loc.coordinates.lat, loc.coordinates.lng] as [number, number]}>
            <Popup>
              <div className="font-semibold">{loc.name}</div>
              <div className="text-sm text-gray-600">{loc.description}</div>
              {loc.openHours && (
                <div className="text-xs mt-1">Hours: {loc.openHours}</div>
              )}
            </Popup>
          </Marker>
        ))}
      <RouteLayer />
    </MapContainer>
  )
} 