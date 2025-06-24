export interface NewLocationPayload {
  id: string
  name: string
  category: string
  description: string
  lat: number
  lng: number
  connectTo: string[] // list of node names
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export async function addLocationToBackend(payload: NewLocationPayload) {
  const res = await fetch(`${API_BASE_URL}/api/node`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Backend error: ${res.status} ${text}`)
  }
} 