"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { ANCHORS, DOT_HEX, NARRATION, type DotColor } from "@/lib/atlas-data"

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

type Point = {
  id: string
  label?: string
  tip?: string
  color: DotColor
  x: number
  y: number
  vx: number
  vy: number
  homeX: number
  homeY: number
  r: number
  glow: number
}

const FILLER = 28
const K = 0.02 // spring stiffness toward home
const DAMP = 0.9
const REPEL_RADIUS = 110
const LINK_DIST = 132

export function LivingAtlasHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !wrapRef.current) return
    const canvas: HTMLCanvasElement = canvasRef.current
    const wrap: HTMLDivElement = wrapRef.current
    const rawCtx = canvas.getContext("2d")
    if (!rawCtx) return
    const ctx: CanvasRenderingContext2D = rawCtx

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let w = 0
    let h = 0
    let dpr = 1
    const points: Point[] = []
    const mouse = { x: -9999, y: -9999, active: false }

    // idle narration state
    let lastInteract = performance.now()
    let narration: { from: Point; to: Point; t: number; done: boolean } | null = null

    function seed() {
      points.length = 0
      for (const a of ANCHORS) {
        points.push({
          id: a.id,
          label: a.label,
          tip: a.tip,
          color: a.color,
          x: a.x * w,
          y: a.y * h,
          homeX: a.x * w,
          homeY: a.y * h,
          vx: 0,
          vy: 0,
          r: a.r,
          glow: 0,
        })
      }
      for (let i = 0; i < FILLER; i++) {
        const hx = Math.random() * w
        const hy = Math.random() * h
        const colors: DotColor[] = ["grey", "grey", "blue", "green", "navy"]
        points.push({
          id: `f${i}`,
          color: colors[i % colors.length],
          x: hx,
          y: hy,
          homeX: hx,
          homeY: hy,
          vx: 0,
          vy: 0,
          r: 1.6 + Math.random() * 2.2,
          glow: 0,
        })
      }
    }

    function resize() {
      if (!wrap || !canvas || !ctx) return
      const rect = wrap.getBoundingClientRect()
      w = rect.width
      h = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    function drawThread(a: Point, b: Point, progress: number, pulse: boolean) {
      const mx = (a.x + b.x) / 2
      const my = (a.y + b.y) / 2 - 60
      // sample quadratic bezier up to `progress`
      ctx.beginPath()
      const steps = 40
      const end = Math.floor(steps * progress)
      for (let i = 0; i <= end; i++) {
        const t = i / steps
        const x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * mx + t * t * b.x
        const y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * my + t * t * b.y
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = "rgba(31,95,209,0.9)"
      ctx.lineWidth = 1.8
      ctx.stroke()

      if (pulse && progress < 1) {
        const t = progress
        const x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * mx + t * t * b.x
        const y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * my + t * t * b.y
        ctx.beginPath()
        ctx.arc(x, y, 3.4, 0, Math.PI * 2)
        ctx.fillStyle = "#1f5fd1"
        ctx.fill()
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h)

      // proximity threads (calm, low alpha)
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const d = Math.hypot(dx, dy)
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.2
            ctx.beginPath()
            ctx.moveTo(points[i].x, points[i].y)
            ctx.lineTo(points[j].x, points[j].y)
            ctx.strokeStyle = `rgba(70,95,140,${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      // physics
      const ampl = narration ? 0.5 : 1 // calm particles while a story animates
      for (const p of points) {
        const fx = (p.homeX - p.x) * K
        const fy = (p.homeY - p.y) * K
        p.vx += fx
        p.vy += fy

        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const d = Math.hypot(dx, dy)
          if (d < REPEL_RADIUS && d > 0.01) {
            const force = ((REPEL_RADIUS - d) / REPEL_RADIUS) * 1.4 * ampl
            p.vx += (dx / d) * force
            p.vy += (dy / d) * force
          }
        }

        p.vx *= DAMP
        p.vy *= DAMP
        p.x += p.vx
        p.y += p.vy

        // glow ease toward target
        const target = p.label ? 0.35 : 0.12
        p.glow += (target - p.glow) * 0.08
      }

      // draw dots
      for (const p of points) {
        const hex = DOT_HEX[p.color]
        if (p.label) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r + 7, 0, Math.PI * 2)
          ctx.fillStyle = hexToRgba(hex, 0.14)
          ctx.fill()
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = hex
        ctx.globalAlpha = p.label ? 1 : 0.5
        ctx.fill()
        ctx.globalAlpha = 1

        if (p.label) {
          ctx.font = "500 12px var(--font-inter), system-ui, sans-serif"
          ctx.fillStyle = "rgba(20,34,60,0.82)"
          ctx.textAlign = "left"
          ctx.fillText(p.label, p.x + p.r + 8, p.y + 4)
        }
      }

      // idle auto-narration (runs once)
      const idle = performance.now() - lastInteract
      if (!narration && idle > 4000) {
        const from = points.find((p) => p.id === NARRATION.from)
        const to = points.find((p) => p.id === NARRATION.to)
        if (from && to) narration = { from, to, t: 0, done: false }
      }
      if (narration) {
        if (!narration.done) {
          narration.t += 1 / 60 / 0.9 // ~900ms
          if (narration.t >= 1) {
            narration.t = 1
            narration.done = true
          }
        }
        drawThread(narration.from, narration.to, narration.t, !narration.done)
      }

      raf = requestAnimationFrame(frame)
    }

    function staticDraw() {
      // reduced-motion: single calm frame, no loop
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y)
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.2
            ctx.beginPath()
            ctx.moveTo(points[i].x, points[i].y)
            ctx.lineTo(points[j].x, points[j].y)
            ctx.strokeStyle = `rgba(70,95,140,${alpha})`
            ctx.stroke()
          }
        }
      }
      for (const p of points) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = DOT_HEX[p.color]
        ctx.globalAlpha = p.label ? 1 : 0.5
        ctx.fill()
        ctx.globalAlpha = 1
        if (p.label) {
          ctx.font = "500 12px system-ui, sans-serif"
          ctx.fillStyle = "rgba(20,34,60,0.82)"
          ctx.fillText(p.label, p.x + p.r + 8, p.y + 4)
        }
      }
      const from = points.find((p) => p.id === NARRATION.from)
      const to = points.find((p) => p.id === NARRATION.to)
      if (from && to) drawThread(from, to, 1, false)
    }

    function onMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
      lastInteract = performance.now()
      narration = null

      // hover detection on labeled anchors
      let hit: Point | null = null
      for (const p of points) {
        if (!p.label) continue
        if (Math.hypot(p.x - mouse.x, p.y - mouse.y) < p.r + 12) {
          hit = p
          break
        }
      }
      if (hit) setTooltip({ x: hit.x, y: hit.y, text: hit.tip! })
      else setTooltip(null)
    }

    function onLeave() {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
      setTooltip(null)
    }

    let raf = 0
    let visible = true
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (reduced) return
        if (visible && !document.hidden) {
          cancelAnimationFrame(raf)
          raf = requestAnimationFrame(frame)
        } else {
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0.05 },
    )

    function onVisibility() {
      if (reduced) return
      if (document.hidden || !visible) cancelAnimationFrame(raf)
      else {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(frame)
      }
    }

    resize()
    io.observe(wrap)
    window.addEventListener("resize", resize)
    document.addEventListener("visibilitychange", onVisibility)

    if (reduced) {
      staticDraw()
    } else {
      canvas.addEventListener("pointermove", onMove)
      canvas.addEventListener("pointerleave", onLeave)
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVisibility)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(20,36,63,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,36,63,0.035)_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:radial-gradient(120%_90%_at_50%_0%,#000,transparent_75%)]" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-8 pt-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-6 lg:pt-20">
        {/* Copy */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
          }}
          className="relative z-10 max-w-xl"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm"
          >
            <span className="size-1.5 rounded-full bg-primary" aria-hidden />
            World Bank operational memory
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Every project tells a story. We show you the threads.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            1,842 operations, 190 countries, 80 years — connected into one living map. Move through
            it, and watch how money, places, people, and documents actually touch.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/explorer"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:scale-[1.03]"
            >
              Explore the Atlas
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <a
              href="#stories"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm text-foreground/90 transition-colors hover:bg-accent"
            >
              See what it reveals
            </a>
          </motion.div>
        </motion.div>

        {/* Canvas */}
        <motion.div
          ref={wrapRef}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative h-[340px] w-full rounded-2xl border border-border bg-card shadow-sm sm:h-[420px] lg:h-[520px]"
        >
          <canvas
            ref={canvasRef}
            className="size-full rounded-2xl"
            role="img"
            aria-label="Interactive map of World Bank projects and their connections. The same stories are available as buttons below."
          />
          {tooltip && (
            <div
              className="pointer-events-none absolute z-20 max-w-[240px] -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs leading-relaxed text-popover-foreground shadow-lg backdrop-blur"
              style={{ left: tooltip.x, top: tooltip.y - 14 }}
            >
              {tooltip.text}
            </div>
          )}
          <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-muted-foreground/70">
            Move through the map — hover a labeled dot
          </span>
        </motion.div>
      </div>
    </section>
  )
}

function hexToRgba(hex: string, a: number) {
  const n = Number.parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r},${g},${b},${a})`
}
