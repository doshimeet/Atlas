"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { CHIPS, DOT_HEX, resolvePair } from "@/lib/atlas-data"

export function ConnectSandbox() {
  const reduced = useReducedMotion()
  const [selected, setSelected] = useState<string[]>([])

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return [id]
      return [...prev, id]
    })
  }

  const a = selected[0] ? CHIPS.find((c) => c.id === selected[0])! : null
  const b = selected[1] ? CHIPS.find((c) => c.id === selected[1])! : null
  const caption = a && b ? resolvePair(a.id, b.id) : null

  return (
    <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
      <div className="rounded-2xl border border-border bg-card/50 p-6 sm:p-8">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-lg font-semibold tracking-tight">Connect two things</h2>
          <p className="text-sm text-muted-foreground">
            Tap any two. We&apos;ll draw the thread between them — you can&apos;t pick a wrong pair.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5" role="group" aria-label="Pick two things to connect">
          {CHIPS.map((chip) => {
            const active = selected.includes(chip.id)
            return (
              <button
                key={chip.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(chip.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
                  active
                    ? "border-primary/60 bg-primary/15 text-foreground"
                    : "border-border bg-background/40 text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground"
                }`}
              >
                <span className="size-2 rounded-full" style={{ backgroundColor: DOT_HEX[chip.color] }} aria-hidden />
                {chip.label}
              </button>
            )
          })}
        </div>

        {/* mini stage */}
        <div className="mt-6 rounded-xl border border-border/70 bg-background/40 p-4">
          <svg viewBox="0 0 100 44" className="h-28 w-full" role="img" aria-label={caption ?? "Pick two chips to draw a thread"}>
            {a && b && (
              <motion.path
                key={`${a.id}-${b.id}`}
                d="M 16 22 Q 50 2 84 22"
                fill="none"
                stroke={DOT_HEX.blue}
                strokeWidth={1.2}
                initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            )}
            {/* left dot */}
            <circle cx="16" cy="22" r={a ? 4 : 2.4} fill={a ? DOT_HEX[a.color] : "#c2c9d6"} />
            {/* right dot */}
            <circle cx="84" cy="22" r={b ? 4 : 2.4} fill={b ? DOT_HEX[b.color] : "#c2c9d6"} />
          </svg>

          <div className="min-h-[2.5rem]">
            <AnimatePresence mode="wait">
              {caption ? (
                <motion.p
                  key={`${a!.id}-${b!.id}`}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: reduced ? 0 : 0.5 }}
                  className="text-pretty text-center text-sm leading-relaxed text-foreground"
                >
                  {caption}
                </motion.p>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  {selected.length === 1 ? "Now pick one more." : "Pick two things above."}
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
