import { create } from "zustand"

export interface Location {
  id: string
  name: string
  category: string
  description: string
  coordinates: {
    lat: number
    lng: number
  }
  openHours?: string
}

export interface Route {
  id: string
  destination: Location
  distance: number
  duration: number
  path: Array<[number, number]> // Array of [lat, lng] coordinates
}

interface LocationState {
  locations: Location[]
  routes: Route[]
  selectedLocation: string | null
  selectedRoute: Route | null
  setLocations: (locations: Location[]) => void
  setRoutes: (routes: Route[]) => void
  setSelectedLocation: (locationId: string) => void
  clearRoutes: () => void
}

export const useLocationStore = create<LocationState>((set, get) => ({
  locations: [],
  routes: [],
  selectedLocation: null,
  selectedRoute: null,

  setLocations: (locations) => set({ locations }),

  setRoutes: (routes) =>
    set({
      routes,
      selectedLocation: null,
      selectedRoute: null,
    }),

  setSelectedLocation: (locationId) => {
    set({ selectedLocation: locationId })
    const { routes } = get()
    const selectedRoute = routes.find((route) => route.destination.id === locationId) || null
    set({ selectedRoute })
  },

  clearRoutes: () => set({ routes: [], selectedLocation: null, selectedRoute: null }),
}))
