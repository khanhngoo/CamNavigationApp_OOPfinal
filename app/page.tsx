"use client"

import { useState, useRef, useEffect } from "react"
import { Compass } from "lucide-react"
import ChatInput from "@/components/chat-input"
import ChatMessages from "@/components/chat-messages"
import CampusMap from "@/components/campus-map"
import type { Message } from "@/lib/types"
import { processPrompt } from "@/lib/ai-navigation"
import LeafletMap from "@/components/leaflet-map"

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi there! I'm your campus navigation assistant. Where would you like to go today?",
      timestamp: new Date(),
    },
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showMap, setShowMap] = useState(true) // Default to showing map
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
          <button
            onClick={() => setShowMap(!showMap)}
            className="rounded-md bg-white/20 px-3 py-1 text-sm text-white hover:bg-white/30"
          >
            {showMap ? "Hide Map" : "Show Map"}
          </button>
        </div>
      </header>

      <div className="container flex flex-1 flex-col overflow-hidden p-0 md:flex-row md:gap-4 md:p-4">
        {/* On mobile: Map on top (if shown), chat below */}
        {/* On desktop: Chat on left (smaller), map on right (larger) */}

        {/* Map - Larger on both mobile and desktop */}
        {showMap && (
          <div className="h-[50vh] w-full md:h-auto md:w-2/3 md:flex-shrink-0">
            <LeafletMap />
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
    </main>
  )
}
