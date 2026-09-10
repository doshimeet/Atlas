"use client"

import { useEffect, useRef, useState } from "react"
import { animate, useInView, useReducedMotion } from "framer-motion"
import { EVIDENCE } from "@/lib/atlas-data"

export function EvidenceStrip() {
  return (
    <section className="border-y border-border/60 bg-card/30">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4">
        {EVIDENCE.map((item) => (
          <Stat key={item.label} {...item} />
        ))}
      </div>
    </section>
  )
}

function Stat({
  value,
  prefix,
  suffix,
  label,
  gloss,
}: {
  value: number
  prefix: string
  suffix: string
  label: string
  gloss: string
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [display, setDisplay] = useState(reduced ? value : 0)

  useEffect(() => {
    if (!inView || reduced) return
    const decimals = value % 1 !== 0 ? 1 : 0
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Number(v.toFixed(decimals))),
    })
    return () => controls.stop()
  }, [inView, reduced, value])

  const formatted = value % 1 !== 0 ? display.toFixed(1) : Math.round(display).toLocaleString("en-US")

  return (
    <div ref={ref} className="flex flex-col">
      <div className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {prefix}
        {formatted}
        {suffix && <span className="ml-0.5 text-xl text-muted-foreground">{suffix}</span>}
      </div>
      <div className="mt-1 text-sm font-medium text-foreground/90">{label}</div>
      <div className="text-xs text-muted-foreground">{gloss}</div>
    </div>
  )
}
