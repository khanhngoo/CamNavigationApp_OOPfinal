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
  status?: string
  openHours?: string
}

export interface Route {
  id: string
  destination: Location
  distance: number
  duration: number
  path: Array<[number, number]> // Array of [lat, lng] coordinates
  nodeNames?: string[] // names corresponding to each coordinate in path
  altPaths?: Array<Array<[number, number]>>
  altWeights?: number[]
}

interface LocationState {
  locations: Location[]
  routes: Route[]
  selectedLocation: string | null
  selectedRoute: Route | null
  isNavigating: boolean
  navigationError: string | null
  setLocations: (locations: Location[]) => void
  setRoutes: (routes: Route[]) => void
  setSelectedLocation: (locationId: string) => void
  clearRoutes: () => void
  stopNavigation: () => void
}


export const useLocationStore = create<LocationState>((set, get) => ({
  locations: [],
  routes: [],
  selectedLocation: null,
  selectedRoute: null,
  isNavigating: false,
  navigationError: null,

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

  stopNavigation: () => {
    console.log("Stopping navigation")
    set({
      selectedRoute: null,
      selectedLocation: null,
      isNavigating: false,
      navigationError: null
    })
  }
}))
