import { useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { CurvedCarousel } from "./ui/curved-carousel"
import { CATEGORIES, WORKS } from "../data/works"

export function SelectedWorks() {
  const featured = useMemo(() => WORKS.filter((w) => w.featured), [])
  const images = useMemo(
    () => featured.map((w) => ({ src: w.img, alt: `${w.title} — ${w.deliverable}`, title: w.title, caption: w.deliverable })),
    [featured]
  )
  const [index, setIndex] = useState(0)
  const bar = useRef<HTMLDivElement>(null)
  const active = featured[index]
  const cat = CATEGORIES.find((c) => c.id === active.category)!

  return (
    <div id="work" className="relative">
      <CurvedCarousel
        images={images}
        mode="scroll"
        intro
        introShape="circle"
        cardAspect="1.414 / 1"
        cardWidth={40}
        radius={2.4}
        gap={36}
        visible={2}
        dim={0.7}
        cardRadius={22}
        scrollLength={featured.length * 0.75}
        showCaptions={false}
        background="var(--color-ink)"
        onIndexChange={setIndex}
        onProgress={(p) => {
          if (bar.current) bar.current.style.transform = `scaleX(${p})`
        }}
      >
        {/* Behind-the-ring typography */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-outline select-none text-[clamp(4rem,17vw,17rem)] font-extrabold uppercase leading-[0.8] tracking-[-0.06em] opacity-25">
            Selected
          </span>
          <span className="font-serif-i -mt-[0.1em] select-none text-[clamp(3.5rem,13vw,13rem)] leading-none text-saffron/20">
            works
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-[3000] mx-auto flex max-w-[1600px] items-start justify-between px-5 pt-24 font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50 md:px-10 md:pt-28">
          <span>(02) — Selected works</span>
          <span className="tabular-nums">
            {String(index + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3000] mx-auto flex max-w-[1600px] items-end justify-between gap-6 px-5 pb-8 md:px-10 md:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: cat.accent }}>
                {cat.label}
              </p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] md:text-5xl">{active.title}</h3>
              <p className="font-serif-i mt-1 text-lg text-bone/60 md:text-xl">
                {active.deliverable} — {active.client}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="hidden w-56 md:block">
            <div className="h-px w-full bg-bone/15">
              <div ref={bar} className="h-px origin-left bg-saffron" style={{ transform: "scaleX(0)" }} />
            </div>
            <p className="mt-3 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-bone/40">Keep scrolling</p>
          </div>
        </div>
      </CurvedCarousel>
    </div>
  )
}
