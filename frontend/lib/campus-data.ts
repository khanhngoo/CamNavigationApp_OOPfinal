import type { Location } from "./store"

interface CampusDataType {
  userLocation: { lat: number; lng: number }
  locations: Location[]
}

// Test data matching the Spring-Boot backend
export const campusData: CampusDataType = {
  // User starts at the door of Building E
  userLocation: { lat: 20.98875937257091, lng: 105.94526076082822 },

  locations: [
    {
      id: "building-e",
      name: "Building E",
      category: "food-and-drink",
      description: "Engineering building.",
      coordinates: { lat: 20.988626, lng: 105.945269 },
      status: "open",
      openHours: "6:00 AM - 5:00 PM",
    },
    {
      id: "a117",
      name: "A117",
      category: "academic",
      description: "Lecture hall A117.",
      coordinates: { lat: 20.989119786867963, lng: 105.94534407471079 },
      status: "open",
      openHours: "always",
    },
    {
      id: "library",
      name: "Library",
      category: "academic",
      description: "Main campus library.",
      coordinates: { lat: 20.98931050124268, lng: 105.94496118414739 },
      status: "open",
      openHours: "8:00 AM - 9:00 PM",
    },
    {
      id: "vinuni-store",
      name: "VinUniversity Store",
      category: "store",
      description: "Campus convenience store for students and staff.",
      coordinates: { lat: 20.98881519377598, lng: 105.94501107931139 },
      status: "open",
      openHours: "6:00 AM - 5:00 PM",
    },
    {
      id: "highlands-coffee",
      name: "Highlands Coffee",
      category: "food-and-drink",
      description: "Popular coffee chain inside campus.",
      coordinates: { lat: 20.98902972397877, lng: 105.94479918479919 },
      status: "open",
      openHours: "6:00 AM - 5:00 PM",
    },
    {
      id: "fresh-garden-cafe",
      name: "Fresh Garden Cafe",
      category: "food-and-drink",
      description: "Cafe that sells banh mi too.",
      coordinates: { lat: 20.98891828517566, lng: 105.94496414065361 },
      status: "open",
      openHours: "6:00 AM - 5:00 PM",
    },
  ] as Location[],
}

// Push new locations (easier than editing big literal above)
campusData.locations.push(
  {
    id: "building-i-door-1",
    name: "Building I Door 1",
    category: "path",
    description: "Main entrance of Building I.",
    coordinates: { lat: 20.98898339549769, lng: 105.94459936022758 },
  },
  {
    id: "building-c-door-1",
    name: "Building C Door 1",
    category: "path",
    description: "Primary entrance of Building C.",
    coordinates: { lat: 20.98904746235655, lng: 105.94449542462827 },
  },
  {
    id: "vinamilk-vending",
    name: "Vinamilk Vending Machine",
    category: "food-and-drink",
    description: "Milk vending machine for quick drinks.",
    coordinates: { lat: 20.98898339549769, lng: 105.94438612461092 },
  },
  {
    id: "auditorium-secret-path",
    name: "Auditorium Secret Path",
    category: "path",
    description: "Shortcut behind Auditorium.",
    coordinates: { lat: 20.98923882802536, lng: 105.94542950391771 },
  },
  {
    id: "entrepreneurship-lab",
    name: "Entrepreneurship Lab",
    category: "academic",
    description: "Innovation and entrepreneurship workspace.",
    coordinates: { lat: 20.98897421327370, lng: 105.94524644315244 },
    openHours: "always",
  },
  {
    id: "super-lab",
    name: "Super Lab",
    category: "academic",
    description: "Advanced research laboratory.",
    coordinates: { lat: 20.98944292330945, lng: 105.94516128301623 },
    status: "open",
    openHours: "always",
  },
  {
    id: "library-entrance",
    name: "Library Entrance",
    category: "path",
    description: "Main public entrance of the Library.",
    coordinates: { lat: 20.98912238089781, lng: 105.94475761055948 },
    status: "open",
    openHours: "8:00 AM - 9:00 PM",
  },
  {
    id: "room-247",
    name: "247 Room",
    category: "academic",
    description: "24/7 study room open around the clock.",
    coordinates: { lat: 20.98944939258201, lng: 105.94478845596315 },
    openHours: "always",
  },
  {
    id: "changemaker-display",
    name: "ChangeMaker Award Display",
    category: "landmark",
    description: "Display cabinet showcasing ChangeMaker awards.",
    coordinates: { lat: 20.98899800357806, lng: 105.94470128417015 },
  },
  {
    id: "building-e-door-1",
    name: "Building E Door 1",
    category: "path",
    description: "Side entrance of Building E.",
    coordinates: { lat: 20.98847273781853, lng: 105.94549521803856 },
  },
  {
    id: "walking-path-1",
    name: "Walking Path 1",
    category: "path",
    description: "Pedestrian walkway across campus.",
    coordinates: { lat: 20.98831976973192, lng: 105.94540268182757 },
  },
  {
    id: "building-i-lookout",
    name: "Building I Lookout View",
    category: "landmark",
    description: "Scenic lookout point on Building I terrace.",
    coordinates: { lat: 20.98872420616275, lng: 105.94470262527467 },
  },
  {
    id: "center-square",
    name: "Center Square",
    category: "landmark",
    description: "Central gathering square of campus.",
    coordinates: { lat: 20.98816158428634, lng: 105.94431437551977 },
  },
)
