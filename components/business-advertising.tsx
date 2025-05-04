"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ExternalLink, Building2, TrendingUp, Users, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Types for our advertisements
type Advertisement = {
  id: string
  title: string
  description: string
  businessName: string
  imageUrl: string
  ctaText: string
  ctaLink: string
  stats?: {
    icon: React.ReactNode
    value: string
    label: string
  }[]
}

// Sample advertisements - in a real app, these would come from your database
const sampleAds: Advertisement[] = [
  {
    id: "ad1",
    title: "Experience Luxury Safari Tours",
    description:
      "Join us for an unforgettable adventure through Kenya's most beautiful wildlife reserves. Special discount for KenyaPay users!",
    businessName: "Safari Adventures Ltd",
    imageUrl: "/placeholder.svg?height=600&width=1200",
    ctaText: "Book Now",
    ctaLink: "#book-safari",
    stats: [
      { icon: <Users className="h-4 w-4" />, value: "5,000+", label: "Happy Tourists" },
      { icon: <TrendingUp className="h-4 w-4" />, value: "98%", label: "Satisfaction" },
      { icon: <Globe className="h-4 w-4" />, value: "12+", label: "Destinations" },
    ],
  },
  {
    id: "ad2",
    title: "Authentic Kenyan Cuisine Experience",
    description: "Taste the authentic flavors of Kenya with our special menu. Get 15% off when you pay with KenyaPay!",
    businessName: "Savanna Restaurant",
    imageUrl: "/placeholder.svg?height=600&width=1200",
    ctaText: "View Menu",
    ctaLink: "#menu",
    stats: [
      { icon: <Users className="h-4 w-4" />, value: "10,000+", label: "Customers" },
      { icon: <TrendingUp className="h-4 w-4" />, value: "4.8/5", label: "Rating" },
      { icon: <Building2 className="h-4 w-4" />, value: "3", label: "Locations" },
    ],
  },
  {
    id: "ad3",
    title: "Handcrafted Kenyan Souvenirs",
    description:
      "Take a piece of Kenya home with our handcrafted souvenirs. Exclusive 10% discount for KenyaPay users!",
    businessName: "Maasai Crafts",
    imageUrl: "/placeholder.svg?height=600&width=1200",
    ctaText: "Shop Now",
    ctaLink: "#shop",
    stats: [
      { icon: <Users className="h-4 w-4" />, value: "3,000+", label: "Artisans" },
      { icon: <TrendingUp className="h-4 w-4" />, value: "100%", label: "Authentic" },
      { icon: <Building2 className="h-4 w-4" />, value: "5", label: "Locations" },
    ],
  },
]

export function BusinessAdvertising() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  // Auto-rotate advertisements
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % sampleAds.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [autoplay])

  const currentAd = sampleAds[currentAdIndex]

  const nextAd = () => {
    setAutoplay(false)
    setCurrentAdIndex((prev) => (prev + 1) % sampleAds.length)
  }

  const prevAd = () => {
    setAutoplay(false)
    setCurrentAdIndex((prev) => (prev - 1 + sampleAds.length) % sampleAds.length)
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-green-950">
      <div className="container">
        <div className="flex flex-col items-center justify-center gap-4 text-center mb-12">
          <div className="inline-block rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400">
            Featured Businesses
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Discover Amazing Kenyan Businesses
          </h2>
          <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            These businesses accept KenyaPay and offer special deals for our users
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Ad display area */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAd.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Background image */}
                <div className="relative aspect-[21/9] md:aspect-[21/8] w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>
                  <img
                    src={currentAd.imageUrl || "/placeholder.svg"}
                    alt={currentAd.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content overlay */}
                <div className="absolute inset-0 z-20 flex items-center">
                  <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      {/* Left side - Ad content */}
                      <div className="text-white p-6 md:p-10">
                        <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-sm font-medium mb-4">
                          {currentAd.businessName}
                        </div>
                        <h3 className="text-2xl md:text-4xl font-bold mb-4">{currentAd.title}</h3>
                        <p className="text-white/80 mb-6 max-w-md">{currentAd.description}</p>

                        {/* Stats */}
                        {currentAd.stats && (
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            {currentAd.stats.map((stat, index) => (
                              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                                <div className="flex justify-center mb-1">{stat.icon}</div>
                                <div className="font-bold text-lg">{stat.value}</div>
                                <div className="text-xs text-white/70">{stat.label}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        <Button className="bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white border-none">
                          {currentAd.ctaText} <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>

                      {/* Right side - empty space for image focus */}
                      <div></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <button
              onClick={prevAd}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-all"
              aria-label="Previous advertisement"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={nextAd}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-all"
              aria-label="Next advertisement"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Pagination indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {sampleAds.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setAutoplay(false)
                  setCurrentAdIndex(index)
                }}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  index === currentAdIndex
                    ? "bg-green-600 w-6"
                    : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600",
                )}
                aria-label={`Go to advertisement ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Call to action for businesses */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Are You a Business Owner?</h3>
          <p className="text-muted-foreground mb-6">
            Showcase your business here and reach thousands of tourists using KenyaPay. Get featured in our premium
            advertising space and boost your visibility.
          </p>
          <Button className="bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white border-none">
            Advertise Your Business
          </Button>
        </div>
      </div>
    </section>
  )
}
