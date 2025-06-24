"use client"

import { useState, useRef, useEffect } from "react"
import { Compass } from "lucide-react"
import ChatInput from "@/components/chat-input"
import ChatMessages from "@/components/chat-messages"
import CampusMap from "@/components/campus-map"
import type { Message } from "@/lib/types"
import { processPrompt } from "@/lib/ai-navigation"
import LeafletMap from "@/components/leaflet-map"
import { useLocationStore } from "@/lib/store"
import { campusData } from "@/lib/campus-data"
import { addLocationToBackend } from "@/lib/backend"

export default function Home() {
  const { setLocations, locations } = useLocationStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi there! I'm your campus navigation assistant. Where would you like to go today?",
      timestamp: new Date(),
    },
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showMap, setShowMap] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [addMode, setAddMode] = useState(false)
  const [newCoords, setNewCoords] = useState<{lat:number;lng:number}|null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize store with campus data
  useEffect(() => {
    console.log("Initializing store with locations:", campusData.locations)
    setLocations(campusData.locations)
  }, [setLocations])

  const handleSendMessage = async (content: string) => {
    // Add user message to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsProcessing(true)

    try {
      // Process the prompt
      const routes = await processPrompt(content)
      console.log("Generated routes:", routes)

      // Create assistant response
      let responseContent = ""

      if (routes && routes.length > 0) {
        responseContent = `I found ${routes.length} places that match your request. Here are some options:`
        setShowMap(true)
      } else {
        responseContent = "I couldn't find any places matching your request. Could you try asking differently?"
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        routes: routes,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error processing message:", error)

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMapClickAdd = (lat:number,lng:number)=>{
    setNewCoords({lat,lng})
    setAddMode(false)
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <main className="flex h-screen flex-col bg-gray-50">
      <header className="border-b bg-primary p-4 shadow-md">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-white" />
            <h1 className="text-xl font-bold text-white">Campus Navigator</h1>
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md bg-white/20 px-3 py-1 text-sm hover:bg-white/30 backdrop-blur"
            >
              <option value="all">All Markers</option>
              <option value="academic">Academic</option>
              <option value="food-and-drink">Food & Drink</option>
              <option value="store">Store</option>
              <option value="path">Path</option>
              <option value="landmark">Landmark</option>
              <option value="recreation">Recreation</option>
            </select>
            <button
              onClick={() => setAddMode((v) => !v)}
              className={`rounded-md px-3 py-1 text-sm text-white ${addMode ? "bg-green-600" : "bg-white/20 hover:bg-white/30"}`}
            >
              {addMode ? "Cancel Add" : "Add Location"}
            </button>
            <button
              onClick={() => setShowMap(!showMap)}
              className="rounded-md bg-white/20 px-3 py-1 text-sm text-white hover:bg-white/30"
            >
              {showMap ? "Hide Map" : "Show Map"}
            </button>
          </div>
        </div>
      </header>

      <div className="container flex flex-1 flex-col overflow-hidden p-0 md:flex-row md:gap-4 md:p-4">
        {/* On mobile: Map on top (if shown), chat below */}
        {/* On desktop: Chat on left (smaller), map on right (larger) */}

        {/* Map - Larger on both mobile and desktop */}
        {showMap && (
          <div className="h-[50vh] w-full md:h-auto md:w-2/3 md:flex-shrink-0">
            <LeafletMap categoryFilter={categoryFilter} addMode={addMode} onMapClick={handleMapClickAdd} />
          </div>
        )}

        {/* Chat section - Smaller to give map more space */}
        <div className={`flex flex-1 flex-col overflow-hidden ${showMap ? "md:w-1/3" : "w-full"}`}>
          <div className="flex-1 overflow-y-auto p-4">
            <ChatMessages messages={messages} />
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t bg-white p-4">
            <ChatInput onSendMessage={handleSendMessage} isProcessing={isProcessing} />
          </div>
        </div>
      </div>

      {/* Modal for adding location */}
      {newCoords && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
          <div className="bg-white p-6 rounded-lg w-80 space-y-3">
            <h2 className="text-lg font-semibold">Add New Location</h2>
            <form onSubmit={(e)=>{
              e.preventDefault()
              const form = e.target as HTMLFormElement
              const name = (form.elements.namedItem("name") as HTMLInputElement).value
              const category = (form.elements.namedItem("category") as HTMLSelectElement).value
              const description = (form.elements.namedItem("description") as HTMLInputElement).value
              const id = name.toLowerCase().replace(/\s+/g,"-")+"-"+Date.now()
              const newLoc = {id,name,category,description,coordinates:{lat:newCoords.lat,lng:newCoords.lng},status:"open",openHours:"always"}
              campusData.locations.push(newLoc as any)
              setLocations([...locations,newLoc as any])

              // send to backend (fire-and-forget)
              const selectedOptions = Array.from((form.elements.namedItem("connectTo") as HTMLSelectElement).selectedOptions).map(o=>o.value)
              addLocationToBackend({
                id,
                name,
                category,
                description,
                lat:newCoords.lat,
                lng:newCoords.lng,
                connectTo: selectedOptions,
              }).catch(err=>console.error("Backend add node failed",err))
              setNewCoords(null)
            }} className="space-y-2">
              <input name="name" placeholder="Name" className="w-full border p-1 text-sm" required/>
              <input name="description" placeholder="Description" className="w-full border p-1 text-sm" />
              <select name="category" className="w-full border p-1 text-sm">
                <option value="academic">Academic</option>
                <option value="food-and-drink">Food & Drink</option>
                <option value="store">Store</option>
                <option value="landmark">Landmark</option>
                <option value="path">Path</option>
              </select>
              <select multiple name="connectTo" className="w-full border p-1 text-sm h-24">
                {locations.map(loc=> (
                  <option key={loc.id} value={loc.name}>{loc.name}</option>
                ))}
              </select>
              <div className="text-xs text-gray-500">Lat: {newCoords.lat.toFixed(5)} Lng: {newCoords.lng.toFixed(5)}</div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={()=>setNewCoords(null)} className="px-3 py-1 text-sm border rounded">Cancel</button>
                <button type="submit" className="px-3 py-1 text-sm bg-primary text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
