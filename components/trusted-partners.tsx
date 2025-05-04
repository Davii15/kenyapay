"use client"

import { useEffect, useRef } from "react"

type Partner = {
  name: string
  logo?: string
}

const partners: Partner[] = [
  { name: "Safari Adventures Ltd" },
  { name: "Nairobi National Park" },
  { name: "Kenya Tourism Board" },
  { name: "Maasai Mara Reserve" },
  { name: "Serena Hotels" },
  { name: "Kenya Airways" },
  { name: "Safaricom" },
  { name: "Equity Bank" },
]

const partners2: Partner[] = [
  { name: "Amboseli National Park" },
  { name: "Tsavo East National Park" },
  { name: "Lake Nakuru National Park" },
  { name: "Mount Kenya National Park" },
  { name: "Diani Beach Resort" },
  { name: "Giraffe Centre" },
  { name: "David Sheldrick Wildlife Trust" },
  { name: "Kenya Wildlife Service" },
]

export function TrustedPartners() {
  const scrollRef1 = useRef<HTMLDivElement>(null)
  const scrollRef2 = useRef<HTMLDivElement>(null)

  // Animation for the scrolling text
  useEffect(() => {
    const scroll1 = scrollRef1.current
    const scroll2 = scrollRef2.current

    if (!scroll1 || !scroll2) return

    let animationFrame1: number
    let animationFrame2: number
    let position1 = 0
    let position2 = 0

    const animate1 = () => {
      position1 += 0.5 // Speed of movement
      if (position1 >= scroll1.scrollWidth / 2) {
        position1 = 0
      }
      scroll1.style.transform = `translateX(${position1}px)`
      animationFrame1 = requestAnimationFrame(animate1)
    }

    const animate2 = () => {
      position2 -= 0.5 // Speed of movement in opposite direction
      if (position2 <= -scroll2.scrollWidth / 2) {
        position2 = 0
      }
      scroll2.style.transform = `translateX(${position2}px)`
      animationFrame2 = requestAnimationFrame(animate2)
    }

    animationFrame1 = requestAnimationFrame(animate1)
    animationFrame2 = requestAnimationFrame(animate2)

    return () => {
      cancelAnimationFrame(animationFrame1)
      cancelAnimationFrame(animationFrame2)
    }
  }, [])

  return (
    <section className="relative py-12 overflow-hidden bg-gradient-to-r from-green-900 to-amber-900 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1000')] bg-repeat"></div>
      </div>

      <div className="container mb-8">
        <h2 className="text-3xl font-bold text-center mb-2">Our Trusted Partners</h2>
        <p className="text-center text-green-100 max-w-2xl mx-auto">
          We collaborate with Kenya's leading tourism and financial institutions to provide you with the best
          experience.
        </p>
      </div>

      {/* First scrolling row - left to right */}
      <div className="relative mb-8 overflow-hidden">
        <div className="flex whitespace-nowrap" ref={scrollRef1}>
          {/* Double the partners to create seamless loop */}
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="inline-flex items-center justify-center mx-8 py-4 px-6 bg-white/10 backdrop-blur-sm rounded-lg min-w-[200px]"
            >
              {partner.logo ? (
                <img src={partner.logo || "/placeholder.svg"} alt={partner.name} className="h-8 mr-3" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <span className="text-lg font-bold">{partner.name.charAt(0)}</span>
                </div>
              )}
              <span className="font-semibold">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Second scrolling row - right to left */}
      <div className="relative overflow-hidden">
        <div className="flex whitespace-nowrap" ref={scrollRef2}>
          {/* Double the partners to create seamless loop */}
          {[...partners2, ...partners2].map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="inline-flex items-center justify-center mx-8 py-4 px-6 bg-white/10 backdrop-blur-sm rounded-lg min-w-[200px]"
            >
              {partner.logo ? (
                <img src={partner.logo || "/placeholder.svg"} alt={partner.name} className="h-8 mr-3" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                  <span className="text-lg font-bold">{partner.name.charAt(0)}</span>
                </div>
              )}
              <span className="font-semibold">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient overlays for fade effect */}
      <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-green-900 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-amber-900 to-transparent pointer-events-none"></div>
    </section>
  )
}
