'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

interface MousePosition {
  x: number
  y: number
}

export default function InteractiveHero() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [viewportCenter, setViewportCenter] = useState({ x: 0, y: 0 })
  const frameRef = useRef<number | undefined>(undefined)
  const lastMousePos = useRef({ x: 0, y: 0 })

  // Cache viewport dimensions to avoid reflows
  useEffect(() => {
    const updateViewportCenter = () => {
      setViewportCenter({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      })
    }

    // Set initial values
    updateViewportCenter()

    // Update on resize, but throttled
    const handleResize = () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      frameRef.current = requestAnimationFrame(updateViewportCenter)
    }

    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Store mouse position to avoid multiple calculations
      lastMousePos.current = { x: e.clientX, y: e.clientY }
      
      // Use requestAnimationFrame to throttle updates and avoid reflows
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      
      frameRef.current = requestAnimationFrame(() => {
        // Use cached viewport center to avoid layout reflows
        setMousePosition({
          x: (lastMousePos.current.x - viewportCenter.x) / 30,
          y: (lastMousePos.current.y - viewportCenter.y) / 30
        })
      })
    }

    // Listen to mouse movement on entire document
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [viewportCenter])

  return (
    <div id="hero-container" className="order-first lg:order-last flex justify-center lg:justify-end relative">
      <div className="relative w-[500px] h-[600px] min-h-[600px]">
        {/* Background Shapes */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${mousePosition.x * -0.5}px, 0px)`
          }}
        >
          {/* Shape 1 - Top Left */}
          <div 
            className="absolute top-40 left-12 animate-spin-slow"
            style={{
              transform: `translate(${mousePosition.x * -0.3}px, 0px)`
            }}
          >
            <Image
              src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/shapes/6465e9cdad1ed7a73d3719d1_shape-1-home-hero-veterinary-x-template.svg"
              alt=""
              width={0}
              height={0}
              style={{ width: '100px', height: 'auto' }}
            />
          </div>

          {/* Shape 2 - Top Right */}
          <div 
            className="absolute top-20 right-[-80] animate-spin-slow"
            style={{
              transform: `translate(${mousePosition.x * 0.2}px, 0px)`
            }}
          >
            <Image
              src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/shapes/6465e9cdad1ed7a73d3719d3_shape-2-home-hero-veterinary-x-template.svg"
              alt=""
              width={0}
              height={0}
              style={{ width: '160px', height: 'auto' }}
            />
          </div>

          {/* Shape 3 - Bottom Left */}
          <div 
            className="absolute bottom-0 left-0 animate-spin-slow"
            style={{
              transform: `translate(${mousePosition.x * -0.1}px, 0px)`
            }}
          >
            <Image
              src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/shapes/6465e9cdad1ed7a73d3719d2_shape-3-home-hero-veterinary-x-template.svg"
              alt=""
              width={0}
              height={0}
              style={{ width: '240px', height: 'auto' }}
            />
          </div>

          {/* Shape 4 - Bottom Right */}
          <div 
            className="absolute bottom-[-50] right-[-140] animate-spin-slow"
            style={{
              transform: `translate(${mousePosition.x * 0.1}px, 0px)`
            }}
          >
            <Image
              src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/shapes/6465e9cdad1ed7a73d3719d0_shape-4-home-hero-veterinary-x-template.svg"
              alt=""
              width={0}
              height={0}
              style={{ width: '220px', height: 'auto' }}
            />
          </div>

       
        </div>

        {/* Main Image */}
        <div 
          className="relative z-10 mt-15 flex items-end justify-center h-full"
          style={{
            transform: `translate(${mousePosition.x * 0.1}px, 0px)`
          }}
        >
          <div className="relative">
            <Image
              src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/synnefront.png"
              alt="Synne Fyhn Stephansen - Dyrlæge"
              width={600}
              height={750}
              className="scale-100 lg:scale-125"
              priority
              fetchPriority="high"
            />
            {/* Rounded mask at the bottom */}
            {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-[#fffaf6] rounded-t-[50px]"></div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
