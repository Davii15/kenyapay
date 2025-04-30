"use client"

import { useState, useEffect } from "react"

interface GreetingProps {
  userName?: string
  className?: string
}

export function Greeting({ userName, className = "" }: GreetingProps) {
  const [greeting, setGreeting] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // Determine greeting based on time of day
    updateGreeting(currentTime)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    updateGreeting(currentTime)
  }, [currentTime, userName])

  const updateGreeting = (date: Date) => {
    const hours = date.getHours()
    let greetingText = ""

    if (hours >= 5 && hours < 12) {
      greetingText = "Good morning"
    } else if (hours >= 12 && hours < 18) {
      greetingText = "Good afternoon"
    } else {
      greetingText = "Good evening"
    }

    if (userName) {
      greetingText += `, ${userName}`
    }

    setGreeting(greetingText)
  }

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold">{greeting}</h2>
      <p className="text-muted-foreground">
        {currentTime.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  )
}
