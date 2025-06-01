import type { Route } from "./store"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  routes?: Route[]
}
