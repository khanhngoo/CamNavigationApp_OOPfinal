"use client"

import dynamic from "next/dynamic"

// Dynamically import the client-only map component to avoid SSR issues with Leaflet
const LeafletMapClient = dynamic<{ categoryFilter?: string }>(() => import("./leaflet-map-client"), {
  ssr: false,
  loading: () => <p className="text-center text-sm text-gray-500">Loading map…</p>,
})

interface LeafletMapProps {
  categoryFilter?: string
  addMode?: boolean
  onMapClick?: (lat: number, lng: number) => void
}

export default function LeafletMap(props: LeafletMapProps) {
  return <LeafletMapClient {...props} />
}
