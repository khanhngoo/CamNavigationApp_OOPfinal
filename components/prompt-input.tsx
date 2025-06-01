"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { processPrompt } from "@/lib/ai-navigation"

export default function PromptInput() {
  const [prompt, setPrompt] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsProcessing(true)
    try {
      // Process the prompt and update the global state
      await processPrompt(prompt)
    } catch (error) {
      console.error("Error processing prompt:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="mb-4 overflow-hidden shadow-md">
      <CardHeader className="bg-primary/5 pb-2">
        <CardTitle className="text-primary">Where do you want to go?</CardTitle>
        <CardDescription>Ask in natural language like "I want to eat" or "Where can I study?"</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Enter your request..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 border-gray-300 focus-visible:ring-primary"
          />
          <Button type="submit" disabled={isProcessing} className="bg-primary hover:bg-primary/90 text-white">
            {isProcessing ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
