"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { STORIES, DOT_HEX, type Story } from "@/lib/atlas-data"

export function StoryCards() {
  return (
    <section id="stories" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <h2 className="text-balance font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Three questions. The same map.
        </h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          These aren&apos;t features — they&apos;re things people actually ask. Each one is a handful
          of dots, connected. Open any of them live.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {STORIES.map((story, i) => (
          <StoryCard key={story.id} story={story} index={i} />
        ))}
      </div>
    </section>
  )
}

function StoryCard({ story, index }: { story: Story; index: number }) {
  const reduced = useReducedMotion()
  const pos = (id: string) => story.nodes.find((n) => n.id === id)!

  return (
    <motion.div
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group flex flex-col rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/40"
    >
      <div className="rounded-xl border border-border/60 bg-background/40 p-2">
        <svg viewBox="0 0 100 46" className="h-24 w-full">
          {story.edges.map(([from, to], ei) => {
            const a = pos(from)
            const b = pos(to)
            const my = (a.y + b.y) / 2 - 14
            return (
              <motion.path
                key={`${story.id}-${ei}`}
                d={`M ${a.x} ${a.y * 0.42 + 4} Q ${(a.x + b.x) / 2} ${my * 0.42} ${b.x} ${b.y * 0.42 + 4}`}
                fill="none"
                    stroke="rgba(70,95,140,0.45)"
                strokeWidth={1}
                initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: 0.2 + ei * 0.18 }}
              />
            )
          })}
          {story.nodes.map((n, ni) => (
            <motion.circle
              key={n.id}
              cx={n.x}
              cy={n.y * 0.42 + 4}
              r={3}
              fill={DOT_HEX[n.color]}
              initial={reduced ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.35, delay: 0.15 + ni * 0.12, type: "spring", stiffness: 350, damping: 22 }}
              style={{ transformOrigin: `${n.x}px ${n.y * 0.42 + 4}px` }}
            />
          ))}
        </svg>
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">{story.question}</h3>
      <p className="mt-1.5 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
        {story.caption}
      </p>
      <Link
        href={`/explorer?story=${story.id}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5"
      >
        See it live
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </motion.div>
  )
}
