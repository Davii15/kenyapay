"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Star, Users, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type BusinessAd = {
  id: string
  name: string
  description: string
  imageUrl: string
  rating: number
  visitors: number
  growth: number
  ctaText: string
  ctaLink: string
}

// Sample business ads
const businessAds: BusinessAd[] = [
  {
    id: "safari-adventures",
    name: "Safari Adventures Kenya",
    description: "Experience the best safari tours in Kenya with our expert guides and luxury accommodations.",
    imageUrl: "/placeholder.svg?height=600&width=1200",
    rating: 4.8,
    visitors: 12500,
    growth: 32,
    ctaText: "Book a Safari",
    ctaLink: "/business/safari-adventures",
  },
  {
    id: "coastal-retreats",
    name: "Coastal Retreats",
    description: "Discover our beachfront properties along Kenya's beautiful coastline for the perfect getaway.",
    imageUrl: "/placeholder.svg?height=600&width=1200",
    rating: 4.7,
    visitors: 9800,
    growth: 28,
    ctaText: "View Properties",
    ctaLink: "/business/coastal-retreats",
  },
  {
    id: "nairobi-food-tours",
    name: "Nairobi Food Tours",
    description: "Taste the authentic flavors of Kenya with our guided culinary experiences in Nairobi.",
    imageUrl: "/placeholder.svg?height=600&width=1200",
    rating: 4.9,
    visitors: 7500,
    growth: 45,
    ctaText: "Book a Food Tour",
    ctaLink: "/business/nairobi-food-tours",
  },
]

export function BusinessAdvertising() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === businessAds.length - 1 ? 0 : prev + 1))

    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  const prevSlide = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === 0 ? businessAds.length - 1 : prev - 1))

    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return
    setIsAnimating(true)
    setCurrentSlide(index)

    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  // Auto-rotate slides
  useEffect(() => {
    slideTimerRef.current = setInterval(() => {
      nextSlide()
    }, 8000)

    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current)
      }
    }
  }, [currentSlide])

  // Reset timer when manually changing slides
  const resetTimer = () => {
    if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current)
      slideTimerRef.current = setInterval(() => {
        nextSlide()
      }, 8000)
    }
  }

  return (
    <section className="w-full bg-gradient-to-b from-background to-background/95 py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold text-primary md:text-4xl">Featured Businesses</h2>
        <p className="mb-12 text-center text-muted-foreground">Discover top-rated experiences from our partners</p>

        {/* Ad Carousel */}
        <div className="relative mx-auto mb-16 max-w-6xl overflow-hidden rounded-xl">
          {/* Carousel slides */}
          <div className="relative h-[400px] md:h-[500px]">
            {businessAds.map((ad, index) => (
              <div
                key={ad.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  currentSlide === index ? "opacity-100" : "opacity-0 pointer-events-none",
                )}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={ad.imageUrl || "/placeholder.svg"}
                    alt={ad.name}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <h3 className="mb-2 text-2xl font-bold text-white md:text-3xl">{ad.name}</h3>
                    <p className="mb-6 max-w-2xl text-white/90">{ad.description}</p>

                    <div className="mb-6 flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-medium text-white">{ad.rating} Rating</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium text-white">{ad.visitors.toLocaleString()} Visitors</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-medium text-white">{ad.growth}% Growth</span>
                      </div>
                    </div>

                    <Button asChild size="lg" className="font-medium">
                      <Link href={ad.ctaLink}>{ad.ctaText}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={() => {
              prevSlide()
              resetTimer()
            }}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-all hover:bg-black/50 md:left-6"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={() => {
              nextSlide()
              resetTimer()
            }}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-all hover:bg-black/50 md:right-6"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Pagination indicators */}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {businessAds.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  goToSlide(index)
                  resetTimer()
                }}
                className={cn(
                  "h-2 w-8 rounded-full transition-all",
                  currentSlide === index ? "bg-white" : "bg-white/40 hover:bg-white/60",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Advertise your business section */}
        <Card className="mx-auto max-w-4xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative hidden h-full min-h-[300px] md:block">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Advertise your business"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="flex flex-col justify-center p-8">
              <h3 className="mb-2 text-2xl font-bold">Advertise Your Business</h3>
              <p className="mb-6 text-muted-foreground">
                Join our platform and showcase your business to thousands of tourists visiting Kenya every day.
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <span>Increase your visibility and bookings</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <span>Reach international tourists</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  <span>Build your reputation with reviews</span>
                </li>
              </ul>
              <Button asChild>
                <Link href="/business/signup">Get Started</Link>
              </Button>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  )
}
