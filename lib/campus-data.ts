import type { Location } from "./store"

interface CampusDataType {
  userLocation: { lat: number; lng: number }
  locations: Location[]
}

// Sample campus data
export const campusData: CampusDataType = {
  userLocation: { lat: 34.0689, lng: -118.4452 }, // Sample coordinates

  locations: [
    {
      id: "loc-1",
      name: "Campus Café",
      category: "dining",
      description: "Popular café with coffee, sandwiches, and snacks",
      coordinates: { lat: 34.0695, lng: -118.446 },
      openHours: "7:00 AM - 8:00 PM",
    },
    {
      id: "loc-2",
      name: "Student Union Food Court",
      category: "dining",
      description: "Multiple food options including pizza, burgers, and salads",
      coordinates: { lat: 34.0701, lng: -118.4445 },
      openHours: "10:00 AM - 9:00 PM",
    },
    {
      id: "loc-3",
      name: "Healthy Bites",
      category: "dining",
      description: "Vegetarian and vegan options with fresh ingredients",
      coordinates: { lat: 34.0682, lng: -118.447 },
      openHours: "8:00 AM - 7:00 PM",
    },
    {
      id: "loc-4",
      name: "Main Library",
      category: "academic",
      description: "Quiet study spaces, research materials, and computer labs",
      coordinates: { lat: 34.0705, lng: -118.443 },
      openHours: "7:00 AM - 12:00 AM",
    },
    {
      id: "loc-5",
      name: "Science Building Study Lounge",
      category: "academic",
      description: "Collaborative study space with whiteboards",
      coordinates: { lat: 34.0675, lng: -118.444 },
      openHours: "8:00 AM - 10:00 PM",
    },
    {
      id: "loc-6",
      name: "Campus Recreation Center",
      category: "recreation",
      description: "Gym equipment, basketball courts, and swimming pool",
      coordinates: { lat: 34.071, lng: -118.448 },
      openHours: "6:00 AM - 11:00 PM",
    },
    {
      id: "loc-7",
      name: "Student Health Center",
      category: "health",
      description: "Medical services and mental health resources",
      coordinates: { lat: 34.068, lng: -118.4425 },
      openHours: "9:00 AM - 5:00 PM",
    },
    {
      id: "loc-8",
      name: "Campus Bookstore",
      category: "shopping",
      description: "Textbooks, school supplies, and campus merchandise",
      coordinates: { lat: 34.0692, lng: -118.4438 },
      openHours: "8:30 AM - 6:30 PM",
    },
  ],
}
