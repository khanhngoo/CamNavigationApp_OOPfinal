import { useLocationStore } from "./store"
import { campusData } from "./campus-data"
import type { Route } from "./store"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// Function to fetch a route from the backend
async function fetchRoute(locationId: string) {
  const store = useLocationStore.getState()
  const { locations } = store
  
  // Find the destination location
  const destination = locations.find(loc => loc.id === locationId)
  if (!destination) throw new Error("Location not found")

  // Default starting point (Building E Door from your backend)
  const startPoint = "Building E"
  
  // Fetch route from backend
  const response = await fetch(`${API_BASE_URL}/api/path`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      start: startPoint,
      end: destination.name
    })
  })

  if (!response.ok) throw new Error("Failed to fetch route")
  
  const data = await response.json()
  
  // data format: {paths: string[][], weights: number[], coordinates: Array<Array<{lat,lng}>>}
  const paths: string[][] = data.paths
  const weights: number[] = data.weights
  const coordsSets: any[] = data.coordinates

  if (!Array.isArray(paths) || paths.length === 0) throw new Error("Backend returned no paths")

  // helper to get coords for one path (index idx)
  const buildCoords = (names: string[], coordObjects?: Array<{ lat: number; lng: number }>) => {
    if (coordObjects && coordObjects.length === names.length) {
      return coordObjects.map((c) => [c.lat, c.lng] as [number, number])
    }
    return names.map((nodeName) => {
      if (nodeName === "Building E Door") return [campusData.userLocation.lat, campusData.userLocation.lng] as [number, number]
      const loc = campusData.locations.find((l) => l.name === nodeName)
      if (!loc) throw new Error(`Missing coordinates for node '${nodeName}'`)
      return [loc.coordinates.lat, loc.coordinates.lng] as [number, number]
    })
  }

  const primaryPathCoords = buildCoords(paths[0], coordsSets?.[0])

  const altPathsCoords: Array<Array<[number, number]>> = paths.slice(1).map((names, idx) =>
    buildCoords(names, coordsSets?.[idx + 1]),
  )

  return {
    id: `route-${locationId}`,
    destination,
    distance: weights?.[0] ?? 0,
    duration: Math.round((weights?.[0] ?? 0) / 80) || 5,
    path: primaryPathCoords,
    altPaths: altPathsCoords,
    altWeights: weights?.slice(1) ?? [],
    nodeNames: paths[0],
  }
}

// Mock function to simulate AI processing
export async function processPrompt(prompt: string) {
  try {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate AI categorization based on the prompt
    let category = ""
    const lower = prompt.toLowerCase()

    // food-and-drink
    if (
      ["eat", "food", "coffee", "drink", "hungry", "lunch", "dinner", "breakfast", "cafe"].some((k) => lower.includes(k))
    ) {
      category = "food-and-drink"
    }
    // academic
    else if (
      ["study", "library", "class", "lecture", "lab", "research"].some((k) => lower.includes(k))
    ) {
      category = "academic"
    }
    // store
    else if (["shop", "store", "buy", "purchase", "bookstore"].some((k) => lower.includes(k))) {
      category = "store"
    }
    // landmark
    else if (["landmark", "square", "statue", "monument", "lookout"].some((k) => lower.includes(k))) {
      category = "landmark"
    } else {
      category = "general"
    }

    // Find relevant locations from our campus data
    const relevantLocations = campusData.locations.filter(
      (location) => location.category === category || category === "general",
    )

    // For each relevant location, get its route
    const store = useLocationStore.getState()
    store.clearRoutes() // Clear existing routes

    const routes: Route[] = []
    for (const location of relevantLocations) {
      try {
        const route = await fetchRoute(location.id)
        routes.push(route)
      } catch (err) {
        console.error("Failed to get route from backend:", err)
        // Fallback to a simple route for UI testing
        routes.push({
          id: `route-${location.id}`,
          destination: location,
          distance: Math.floor(Math.random() * 500) + 100,
          duration: Math.floor(Math.random() * 10) + 2,
          path: generateRandomPath(campusData.userLocation, location.coordinates),
        })
      }
    }

    // Sort routes by distance
    routes.sort((a, b) => a.distance - b.distance)

    // Update the store with all routes
    store.setRoutes(routes)

    return routes
  } catch (error) {
    console.error("Error processing prompt with AI:", error)
    throw error
  }
}

// Helper function to generate a random path between two points
function generateRandomPath(start: { lat: number; lng: number }, end: { lat: number; lng: number }) {
  const path: Array<[number, number]> = []
  const steps = Math.floor(Math.random() * 3) + 2 // 2-4 waypoints

  path.push([start.lat, start.lng])

  for (let i = 1; i <= steps; i++) {
    const ratio = i / (steps + 1)
    const lat = start.lat + (end.lat - start.lat) * ratio + (Math.random() - 0.5) * 0.001
    const lng = start.lng + (end.lng - start.lng) * ratio + (Math.random() - 0.5) * 0.001
    path.push([lat, lng])
  }

  path.push([end.lat, end.lng])
  return path
}

// ========================== NEW BACKEND INTEGRATION ==========================

interface PathResponse {
  path: string[]
  distance: number
  coordinates: Array<{ lat: number; lng: number }>
}