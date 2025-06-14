"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { LatLngExpression } from "leaflet"

const defaultCenter: LatLngExpression = [21.0285, 105.8542]  // e.g., Hanoi

export default function LeafletMap() {
  return (
    <MapContainer center={defaultCenter} zoom={16} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={defaultCenter}>
        <Popup>You are here</Popup>
      </Marker>
    </MapContainer>
  )
}
