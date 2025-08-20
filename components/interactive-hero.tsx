'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface MousePosition {
  x: number
  y: number
}

export default function InteractiveHero() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate position relative to viewport center
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 30,
        y: (e.clientY - window.innerHeight / 2) / 30
      })
    }

    // Listen to mouse movement on entire document
    document.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div id="hero-container" className="order-first lg:order-last flex justify-center lg:justify-end relative">
      <div className="relative w-[500px] h-[600px]">
        {/* Background Shapes */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${mousePosition.x * -0.5}px, 0px)`
          }}
        >
          {/* Shape 1 - Top Left */}
          <div className="absolute top-40 left-12 animate-spin-slow">
            <Image
              src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/shapes/6465e9cdad1ed7a73d3719d1_shape-1-home-hero-veterinary-x-template.svg"
              alt=""
              width={100}
              height={100}
              style={{
                transform: `translate(${mousePosition.x * -0.3}px, 0px)`
              }}
            />
          </div>

          {/* Shape 2 - Top Right */}
          <div className="absolute top-20 right-[-80] animate-spin-slow">
            <Image
              src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/shapes/6465e9cdad1ed7a73d3719d3_shape-2-home-hero-veterinary-x-template.svg"
              alt=""
              width={160}
              height={160}
        
              style={{
                transform: `translate(${mousePosition.x * 0.2}px, 0px)`
              }}
            />
          </div>

          {/* Shape 3 - Bottom Left */}
          <div className="absolute bottom-0 left-0 animate-spin-slow">
            <Image
              src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/shapes/6465e9cdad1ed7a73d3719d2_shape-3-home-hero-veterinary-x-template.svg"
              alt=""
              width={240}
              height={240}
            
              style={{
                transform: `translate(${mousePosition.x * -0.1}px, 0px)`
              }}
            />
          </div>

          {/* Shape 4 - Bottom Right */}
          <div className="absolute bottom-[-50] right-[-140] animate-spin-slow">
            <Image
              src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/shapes/6465e9cdad1ed7a73d3719d0_shape-4-home-hero-veterinary-x-template.svg"
              alt=""
              width={220}
              height={220}
       
              style={{
                transform: `translate(${mousePosition.x * 0.1}px, 0px)`
              }}
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
            />
            {/* Rounded mask at the bottom */}
            {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-[#fffaf6] rounded-t-[50px]"></div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
