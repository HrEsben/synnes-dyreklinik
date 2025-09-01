'use client'

import { useAlert } from './alert-context'

export default function DynamicSpacer() {
  const { alert } = useAlert()

  // Adjust height based on whether alert is present
  // Alert banner is approximately 52px tall (py-3 + text + borders) + 8px spacing
  const hasAlert = alert && alert.message
  const spacerHeight = hasAlert 
    ? "h-[138px] lg:h-[148px]" // Navigation + Alert height + spacing
    : "h-[78px] lg:h-[88px]"   // Just navigation height

  return <div className={spacerHeight} aria-hidden="true" />
}
