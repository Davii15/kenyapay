"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Users, TrendingUp, Globe, Award, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  badge?: string
  location: string
  category: string
}

// Sample business ads
const businessAds: BusinessAd[] = [
  {
    id: "safari-adventures",
    name: "Safari Adventures Kenya",
    description:
      "Experience the best safari tours in Kenya with our expert guides and luxury accommodations. Special discounts for KenyaPay users!",
    imageUrl: "/placeholder.svg?height=600&width=1200",
    rating: 4.8,
    visitors: 12500,
    growth: 32,
    ctaText: "Book a Safari",
    ctaLink: "/business/safari-adventures",
    badge: "Featured",
    location: "Nairobi",
    category: "Tours",
  },
  {
    id: "coastal-retreats",
    name: "Coastal Retreats",
    description:
      "Discover our beachfront properties along Kenya's beautiful coastline for the perfect getaway. Exclusive 15% discount when paying with KenyaPay!",
    imageUrl: "/placeholder.svg?height=600&width=1200",
    rating: 4.7,
    visitors: 9800,
    growth: 28,
    ctaText: "View Properties",
    ctaLink: "/business/coastal-retreats",
    location: "Mombasa",
    category: "Accommodation",
  },
  {
    id: "nairobi-food-tours",
    name: "Nairobi Food Tours",
    description:
      "Taste the authentic flavors of Kenya with our guided culinary experiences in Nairobi. Book through KenyaPay and get a free welcome drink!",
    imageUrl: "/placeholder.svg?height=600&width=1200",
    rating: 4.9,
    visitors: 7500,
    growth: 45,
    ctaText: "Book a Food Tour",
    ctaLink: "/business/nairobi-food-tours",
    badge: "New",
    location: "Nairobi",
    category: "Food & Drink",
  },
]

export function BusinessAdvertising() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Check if component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  // Auto-rotate slides when visible
  useEffect(() => {
    if (isVisible) {
      slideTimerRef.current = setInterval(() => {
        nextSlide()
      }, 8000)
    } else if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current)
    }

    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current)
      }
    }
  }, [isVisible, currentSlide])

  // Reset timer when manually changing slides
  const resetTimer = () => {
    if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current)
      if (isVisible) {
        slideTimerRef.current = setInterval(() => {
          nextSlide()
        }, 8000)
      }
    }
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-gradient-to-b from-white to-amber-50/30 py-20 dark:from-gray-900 dark:to-amber-950/20"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-40 h-64 w-64 rounded-full bg-green-400/5 blur-3xl"></div>
        <div className="absolute -right-20 bottom-40 h-64 w-64 rounded-full bg-amber-400/5 blur-3xl"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="inline-block rounded-full bg-gradient-to-r from-amber-600/20 to-green-600/20 px-4 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-300">
            Discover Kenya
          </span>
          <h2 className="mt-3 bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl lg:text-5xl">
            Featured Businesses
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Explore top-rated experiences from our trusted partners across Kenya
          </p>
        </motion.div>

        {/* Ad Carousel */}
        <div className="relative mx-auto mb-16 max-w-6xl overflow-hidden rounded-2xl shadow-2xl">
          <div className="relative h-[400px] md:h-[500px]">
            <AnimatePresence mode="wait">
              {businessAds.map((ad, index) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, x: index > currentSlide ? 100 : -100 }}
                  animate={{
                    opacity: currentSlide === index ? 1 : 0,
                    x: currentSlide === index ? 0 : index > currentSlide ? 100 : -100,
                  }}
                  exit={{ opacity: 0, x: index < currentSlide ? -100 : 100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={cn("absolute inset-0", currentSlide === index ? "z-10" : "z-0")}
                >
                  <div className="relative h-full w-full">
                    {/* Background image */}
                    <div className="absolute inset-0">
                      <Image
                        src={ad.imageUrl || "/placeholder.svg"}
                        alt=""
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30"></div>
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center">
                      <div className="container px-6 md:px-10">
                        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                          <div className="text-white">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1, duration: 0.5 }}
                              className="mb-2 flex items-center gap-3"
                            >
                              <Badge
                                className={cn(
                                  "bg-white/20 text-white hover:bg-white/30",
                                  ad.category === "Tours" && "bg-blue-500/20 hover:bg-blue-500/30",
                                  ad.category === "Accommodation" && "bg-purple-500/20 hover:bg-purple-500/30",
                                  ad.category === "Food & Drink" && "bg-orange-500/20 hover:bg-orange-500/30",
                                )}
                              >
                                {ad.category}
                              </Badge>

                              <div className="flex items-center gap-1 text-amber-300">
                                <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                                <span className="text-sm font-medium">{ad.rating}</span>
                              </div>

                              <div className="flex items-center gap-1 text-white/70">
                                <Globe className="h-4 w-4" />
                                <span className="text-sm">{ad.location}</span>
                              </div>
                            </motion.div>

                            {ad.badge && (
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="mb-3"
                              >
                                <Badge
                                  className={cn(
                                    "bg-gradient-to-r px-3 py-1 text-white",
                                    ad.badge === "Featured" && "from-amber-500 to-orange-500",
                                    ad.badge === "New" && "from-green-500 to-emerald-500",
                                  )}
                                >
                                  {ad.badge}
                                </Badge>
                              </motion.div>
                            )}

                            <motion.h3
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3, duration: 0.5 }}
                              className="mb-3 text-3xl font-bold md:text-4xl"
                            >
                              {ad.name}
                            </motion.h3>

                            <motion.p
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4, duration: 0.5 }}
                              className="mb-6 max-w-md text-white/80"
                            >
                              {ad.description}
                            </motion.p>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5, duration: 0.5 }}
                              className="mb-6 grid grid-cols-3 gap-3"
                            >
                              <div className="rounded-lg bg-white/10 p-3 text-center backdrop-blur-sm">
                                <Users className="mx-auto mb-1 h-5 w-5 text-blue-300" />
                                <div className="font-bold">{ad.visitors.toLocaleString()}</div>
                                <div className="text-xs text-white/70">Visitors</div>
                              </div>
                              <div className="rounded-lg bg-white/10 p-3 text-center backdrop-blur-sm">
                                <TrendingUp className="mx-auto mb-1 h-5 w-5 text-green-300" />
                                <div className="font-bold">+{ad.growth}%</div>
                                <div className="text-xs text-white/70">Growth</div>
                              </div>
                              <div className="rounded-lg bg-white/10 p-3 text-center backdrop-blur-sm">
                                <Award className="mx-auto mb-1 h-5 w-5 text-amber-300" />
                                <div className="font-bold">Top 10</div>
                                <div className="text-xs text-white/70">Ranked</div>
                              </div>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6, duration: 0.5 }}
                            >
                              <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                              >
                                <Link href={ad.ctaLink}>{ad.ctaText}</Link>
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              prevSlide()
              resetTimer()
            }}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/50 md:left-6"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              nextSlide()
              resetTimer()
            }}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/50 md:right-6"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>

          {/* Pagination indicators */}
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {businessAds.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  goToSlide(index)
                  resetTimer()
                }}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  currentSlide === index ? "w-10 bg-white" : "w-2.5 bg-white/40 hover:bg-white/60",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Advertise your business section */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Card className="mx-auto max-w-4xl overflow-hidden border-0 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative hidden h-full min-h-[300px] md:block">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Advertise your business"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                    <Clock className="h-4 w-4 text-amber-300" />
                    <span className="text-sm font-medium text-white">Limited time offer</span>
                  </div>
                </div>
              </div>
              <CardContent className="flex flex-col justify-center bg-gradient-to-br from-amber-50 to-green-50 p-8 dark:from-amber-950/30 dark:to-green-950/30">
                <h3 className="mb-2 text-2xl font-bold">Advertise Your Business</h3>
                <p className="mb-6 text-muted-foreground">
                  Join our platform and showcase your business to thousands of tourists visiting Kenya every day.
                </p>
                <ul className="mb-6 space-y-3">
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-amber-500/20 to-green-500/20">
                      <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span>Increase your visibility and bookings</span>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-amber-500/20 to-green-500/20">
                      <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span>Reach international tourists</span>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-amber-500/20 to-green-500/20">
                      <Star className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span>Build your reputation with reviews</span>
                  </motion.li>
                </ul>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Button
                    asChild
                    className="bg-gradient-to-r from-amber-500 to-green-500 text-white hover:from-amber-600 hover:to-green-600"
                  >
                    <Link href="/business/signup">Get Started</Link>
                  </Button>
                </motion.div>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
