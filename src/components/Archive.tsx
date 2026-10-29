import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { CATEGORIES, WORKS, type Category, type Work } from "../data/works"
import { useLenis } from "../lib/smooth-scroll"

type Filter = Category | "all"

export function Archive({ filter, setFilter }: { filter: Filter; setFilter: (f: Filter) => void }) {
  const list = filter === "all" ? WORKS : WORKS.filter((w) => w.category === filter)
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="archive" className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <div className="mb-10 flex flex-col gap-8 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50">(05) — Archive</p>
          <h2 className="text-[clamp(2.75rem,7vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.045em]">
            The <span className="font-serif-i font-normal text-saffron">full</span> drawer
          </h2>
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter work">
          {[{ id: "all" as const, label: "All", accent: "var(--color-bone)" }, ...CATEGORIES].map((c) => {
            const on = filter === c.id
            const n = c.id === "all" ? WORKS.length : WORKS.filter((w) => w.category === c.id).length
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={on}
                onClick={() => setFilter(c.id)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${
                  on ? "border-transparent text-ink" : "border-bone/15 text-bone/70 hover:border-bone/40 hover:text-bone"
                }`}
                style={on ? { background: c.accent } : undefined}
              >
                {c.label} <sup className="font-mono text-[9px]">{n}</sup>
              </button>
            )
          })}
        </div>
      </div>

      <motion.ul layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
        <AnimatePresence mode="popLayout">
          {list.map((w, i) => (
            <motion.li
              key={w.slug}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 8) * 0.03 }}
            >
              <TiltCard work={w} onOpen={() => setOpen(i)} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Lightbox list={list} index={open} setIndex={setOpen} />
    </section>
  )
}

function TiltCard({ work, onOpen }: { work: Work; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const cat = CATEGORIES.find((c) => c.id === work.category)!

  const move = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== "mouse") return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg) translateZ(0)`
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`)
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`)
  }
  const leave = () => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0)"
  }

  return (
    <button
      ref={ref}
      onClick={onOpen}
      onPointerMove={move}
      onPointerLeave={leave}
      data-cursor="Open"
      className="group relative block w-full overflow-hidden rounded-2xl bg-ink-2 text-left transition-transform duration-300 ease-out [transform-style:preserve-3d]"
    >
      <div className="relative aspect-[1.414/1] overflow-hidden">
        <img
          src={work.img}
          alt={`${work.title} — ${work.deliverable}`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgb(255 255 255 / 0.55), transparent 55%)" }}
        />
      </div>
      <div className="flex items-start justify-between gap-4 p-4">
        <div>
          <p className="text-lg font-bold leading-tight tracking-tight">{work.title}</p>
          <p className="font-serif-i text-bone/55">{work.deliverable}</p>
        </div>
        <span className="mt-1 shrink-0 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ink" style={{ background: cat.accent }}>
          {cat.label.split(" ")[0]}
        </span>
      </div>
    </button>
  )
}

function Lightbox({ list, index, setIndex }: { list: Work[]; index: number | null; setIndex: (i: number | null) => void }) {
  const lenis = useLenis()
  const work = index === null ? null : list[index]
  const step = useCallback(
    (d: number) => setIndex(index === null ? null : (index + d + list.length) % list.length),
    [index, list.length, setIndex]
  )

  useEffect(() => {
    if (index === null) return
    lenis?.stop()
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null)
      if (e.key === "ArrowRight") step(1)
      if (e.key === "ArrowLeft") step(-1)
    }
    window.addEventListener("keydown", key)
    return () => {
      window.removeEventListener("keydown", key)
      lenis?.start()
    }
  }, [index, lenis, setIndex, step])

  return (
    <AnimatePresence>
      {work && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col bg-ink/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          role="dialog"
          aria-modal="true"
          aria-label={work.title}
        >
          <div className="flex items-center justify-between px-5 py-4 md:px-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50">
              {String(index! + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
            </p>
            <button onClick={() => setIndex(null)} className="rounded-full border border-bone/20 px-4 py-2 text-sm hover:bg-bone hover:text-ink">
              Close ✕
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24" onClick={() => setIndex(null)}>
            <AnimatePresence mode="wait">
              <motion.img
                key={work.slug}
                src={work.img}
                alt={`${work.title} — ${work.deliverable}`}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.96, rotateX: 8 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
              />
            </AnimatePresence>
            <button
              onClick={(e) => (e.stopPropagation(), step(-1))}
              className="absolute left-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-bone/10 text-xl hover:bg-saffron hover:text-ink md:left-6"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              onClick={(e) => (e.stopPropagation(), step(1))}
              className="absolute right-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-bone/10 text-xl hover:bg-saffron hover:text-ink md:right-6"
              aria-label="Next"
            >
              →
            </button>
          </div>
          <div className="px-5 py-5 md:px-10">
            <p className="text-2xl font-extrabold tracking-tight md:text-3xl">{work.title}</p>
            <p className="font-serif-i text-lg text-bone/60">
              {work.deliverable} — {work.client}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
