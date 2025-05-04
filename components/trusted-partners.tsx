"use client"

import { useEffect, useRef, useState } from "react"

type Partner = {
  name: string
  id: string
}

const partners1: Partner[] = [
  { name: "Kenya Tourism Board", id: "ktb" },
  { name: "Safaricom", id: "safaricom" },
  { name: "Kenya Airways", id: "kq" },
  { name: "Serena Hotels", id: "serena" },
  { name: "Maasai Mara Reserve", id: "mara" },
  { name: "Equity Bank", id: "equity" },
]

const partners2: Partner[] = [
  { name: "Nairobi National Park", id: "nnp" },
  { name: "Sarova Hotels", id: "sarova" },
  { name: "Jambojet", id: "jambojet" },
  { name: "NCBA Bank", id: "ncba" },
  { name: "Tsavo National Park", id: "tsavo" },
  { name: "Fairmont Hotels", id: "fairmont" },
]

export function TrustedPartners() {
  const scrollRef1 = useRef<HTMLDivElement>(null)
  const scrollRef2 = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const animationRef1 = useRef<number>()
  const animationRef2 = useRef<number>()
  const speedFactor = 0.5

  // Duplicate the partners to create a seamless loop
  const extendedPartners1 = [...partners1, ...partners1]
  const extendedPartners2 = [...partners2, ...partners2]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.1 },
    )

    const currentElement = document.getElementById("trusted-partners")
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [])

  useEffect(() => {
    let lastTime1 = 0
    let position1 = 0
    let lastTime2 = 0
    let position2 = 0

    const animate1 = (time: number) => {
      if (lastTime1 === 0) {
        lastTime1 = time
      }
      const delta = time - lastTime1
      lastTime1 = time

      if (scrollRef1.current) {
        position1 += delta * speedFactor * 0.01

        // Reset position when we've scrolled the width of half the content (original partners)
        if (position1 >= scrollRef1.current.scrollWidth / 2) {
          position1 = 0
        }

        scrollRef1.current.style.transform = `translateX(${position1}px)`
      }

      if (isVisible) {
        animationRef1.current = requestAnimationFrame(animate1)
      }
    }

    const animate2 = (time: number) => {
      if (lastTime2 === 0) {
        lastTime2 = time
      }
      const delta = time - lastTime2
      lastTime2 = time

      if (scrollRef2.current) {
        position2 -= delta * speedFactor * 0.01

        // Reset position when we've scrolled the width of half the content (original partners)
        if (Math.abs(position2) >= scrollRef2.current.scrollWidth / 2) {
          position2 = 0
        }

        scrollRef2.current.style.transform = `translateX(${position2}px)`
      }

      if (isVisible) {
        animationRef2.current = requestAnimationFrame(animate2)
      }
    }

    if (isVisible) {
      animationRef1.current = requestAnimationFrame(animate1)
      animationRef2.current = requestAnimationFrame(animate2)
    }

    return () => {
      if (animationRef1.current) {
        cancelAnimationFrame(animationRef1.current)
      }
      if (animationRef2.current) {
        cancelAnimationFrame(animationRef2.current)
      }
    }
  }, [isVisible])

  return (
    <section
      id="trusted-partners"
      className="relative w-full overflow-hidden bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 py-10"
    >
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-2xl font-bold text-primary md:text-3xl">Our Trusted Partners</h2>

        {/* Left to right scrolling text */}
        <div className="relative mb-8 overflow-hidden">
          <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent"></div>
          <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent"></div>

          <div className="flex whitespace-nowrap">
            <div ref={scrollRef1} className="flex items-center gap-12 py-4">
              {extendedPartners1.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex items-center rounded-lg bg-white/80 px-6 py-3 shadow-md transition-all hover:bg-white hover:shadow-lg"
                >
                  <span className="text-lg font-medium text-primary">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right to left scrolling text */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent"></div>
          <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent"></div>

          <div className="flex whitespace-nowrap">
            <div ref={scrollRef2} className="flex items-center gap-12 py-4">
              {extendedPartners2.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex items-center rounded-lg bg-white/80 px-6 py-3 shadow-md transition-all hover:bg-white hover:shadow-lg"
                >
                  <span className="text-lg font-medium text-primary">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
