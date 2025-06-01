import { useLocationStore } from "./store"
import { campusData } from "./campus-data"

// Mock function to simulate AI processing
export async function processPrompt(prompt: string) {
  try {
    // In a real implementation, this would use the AI SDK to process the prompt
    // const { text } = await generateText({
    //   model: openai('gpt-4o'),
    //   prompt: `Given the user prompt "${prompt}", identify what category of location they're looking for on campus.`,
    //   system: 'You are a campus navigation assistant. Identify the category of location the user is looking for.',
    // });

    // For demo purposes, we'll simulate the AI response
    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate processing time

    // Simulate AI categorization based on the prompt
    let category = ""
    if (
      prompt.toLowerCase().includes("eat") ||
      prompt.toLowerCase().includes("food") ||
      prompt.toLowerCase().includes("hungry") ||
      prompt.toLowerCase().includes("lunch") ||
      prompt.toLowerCase().includes("dinner") ||
      prompt.toLowerCase().includes("breakfast")
    ) {
      category = "dining"
    } else if (
      prompt.toLowerCase().includes("study") ||
      prompt.toLowerCase().includes("library") ||
      prompt.toLowerCase().includes("quiet") ||
      prompt.toLowerCase().includes("book") ||
      prompt.toLowerCase().includes("research")
    ) {
      category = "academic"
    } else if (
      prompt.toLowerCase().includes("gym") ||
      prompt.toLowerCase().includes("exercise") ||
      prompt.toLowerCase().includes("workout") ||
      prompt.toLowerCase().includes("sport") ||
      prompt.toLowerCase().includes("fitness")
    ) {
      category = "recreation"
    } else if (
      prompt.toLowerCase().includes("health") ||
      prompt.toLowerCase().includes("doctor") ||
      prompt.toLowerCase().includes("nurse") ||
      prompt.toLowerCase().includes("sick") ||
      prompt.toLowerCase().includes("medical")
    ) {
      category = "health"
    } else if (
      prompt.toLowerCase().includes("book") ||
      prompt.toLowerCase().includes("shop") ||
      prompt.toLowerCase().includes("store") ||
      prompt.toLowerCase().includes("buy") ||
      prompt.toLowerCase().includes("purchase")
    ) {
      category = "shopping"
    } else {
      category = "general"
    }

    // Find relevant locations from our campus data
    const relevantLocations = campusData.locations.filter(
      (location) => location.category === category || category === "general",
    )

    // Generate routes to these locations
    const routes = relevantLocations.map((location) => ({
      id: `route-${location.id}`,
      destination: location,
      distance: Math.floor(Math.random() * 500) + 100, // Random distance between 100-600m
      duration: Math.floor(Math.random() * 10) + 2, // Random duration between 2-12 min
      path: generateRandomPath(campusData.userLocation, location.coordinates),
    }))

    // Sort routes by distance
    routes.sort((a, b) => a.distance - b.distance)

    // Update the store with the new routes
    useLocationStore.getState().setRoutes(routes)

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
