import { lazy, Suspense } from "react"
import { motion } from "motion/react"
import { useScrollTo } from "../../lib/smooth-scroll"

const HeroScene = lazy(() => import("./HeroScene"))

const ease = [0.16, 1, 0.3, 1] as const

export function Hero({ ready }: { ready: boolean }) {
  const scrollTo = useScrollTo()
  const show = ready ? "show" : "hide"
  const fade = {
    hide: { opacity: 0, y: 24 },
    show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 1.1, delay: 0.5 + d, ease } }),
  }

  return (
    <section id="top" className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink">
      <h1 className="sr-only">Oussama Khela — graphic designer, infographiste and video editor</h1>

      <Suspense fallback={null}>
        <HeroScene ready={ready} />
      </Suspense>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(14_12_10/0.85)_100%)]" />

      <div className="pointer-events-none absolute inset-0 mx-auto flex max-w-[1600px] flex-col justify-between px-5 pb-6 pt-24 md:px-10 md:pb-10 md:pt-28">
        <div className="flex items-start justify-between gap-6">
          <motion.p
            variants={fade}
            initial="hide"
            animate={show}
            custom={0.1}
            className="max-w-[18rem] text-sm leading-relaxed text-bone/70 md:text-base"
          >
            Designer, <span className="font-serif-i text-lg text-saffron">infographiste</span> & video editor shaping brands
            that look as good on a shop sign as they do in a 9:16 reel.
          </motion.p>
          <motion.div
            variants={fade}
            initial="hide"
            animate={show}
            custom={0.2}
            className="hidden text-right font-mono text-[11px] uppercase leading-6 tracking-[0.18em] text-bone/50 md:block"
          >
            <div>34.0331° N, 5.0003° W</div>
            <div>Fès — Morocco</div>
            <div className="text-zellige">Open for projects</div>
          </motion.div>
        </div>

        <div className="flex items-end justify-between gap-6">
          <motion.ul
            variants={fade}
            initial="hide"
            animate={show}
            custom={0.3}
            className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.14em]"
          >
            {[
              ["Brand identity", "bg-saffron text-ink"],
              ["Print & packaging", "border border-bone/25 text-bone/80"],
              ["Social content", "border border-bone/25 text-bone/80"],
              ["Video editing", "bg-henna text-ink"],
            ].map(([t, c]) => (
              <li key={t} className={`rounded-full px-3 py-1.5 ${c}`}>
                {t}
              </li>
            ))}
          </motion.ul>

          <motion.button
            variants={fade}
            initial="hide"
            animate={show}
            custom={0.4}
            onClick={() => scrollTo("manifesto")}
            data-cursor="Scroll"
            className="pointer-events-auto group hidden shrink-0 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bone/60 sm:flex"
          >
            <span>Scroll</span>
            <span className="relative block h-12 w-px overflow-hidden bg-bone/20">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-saffron" />
            </span>
          </motion.button>
        </div>
      </div>

      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  )
}
