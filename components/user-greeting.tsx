"use client"

import { useState, useEffect } from "react"

interface UserGreetingProps {
  userName?: string
  className?: string
}

export function UserGreeting({ userName, className = "" }: UserGreetingProps) {
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const getCurrentGreeting = () => {
      const currentHour = new Date().getHours()

      if (currentHour < 12) {
        return "Good morning"
      } else if (currentHour < 18) {
        return "Good afternoon"
      } else {
        return "Good evening"
      }
    }

    setGreeting(getCurrentGreeting())

    // Update greeting if user keeps the app open across time boundaries
    const intervalId = setInterval(() => {
      setGreeting(getCurrentGreeting())
    }, 60000) // Check every minute

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className={className}>
      <h1 className="text-2xl font-bold tracking-tight">
        {greeting}, {userName || "Admin"}
      </h1>
      <p className="text-muted-foreground">Here's what's happening with your platform today</p>
    </div>
  )
}
