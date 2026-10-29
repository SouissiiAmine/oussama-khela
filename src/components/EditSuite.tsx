import { useMemo, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { WORKS } from "../data/works"

gsap.registerPlugin(ScrollTrigger)

/**
 * Drop a showreel in /public (e.g. "/reel.mp4") to have the program monitor scrub the real
 * video with the scroll. Until then the monitor plays the portfolio stills as a reel.
 */
const REEL_SRC: string | null = null

const FPS = 25
const DURATION = 48 // seconds shown on the timeline

const CLIP_SLUGS = [
  "soiree-orientale",
  "magistral-stationery",
  "mielii-social",
  "lumens-packaging",
  "venezia-poster",
  "glowup-social",
  "plata-o-plomo",
  "los-tacos",
]
const CLIP_WEIGHTS = [1.2, 1, 0.8, 1.1, 0.9, 1, 1.3, 0.9]

const TITLES = [
  { at: 0.02, w: 0.16, label: "Title — Soirée Orientale", color: "bg-saffron" },
  { at: 0.3, w: 0.12, label: "Lower third", color: "bg-zellige" },
  { at: 0.55, w: 0.14, label: "Logo sting", color: "bg-henna" },
  { at: 0.82, w: 0.15, label: "End card", color: "bg-saffron" },
]

function timecode(p: number) {
  const total = Math.floor(p * DURATION * FPS)
  const f = total % FPS
  const s = Math.floor(total / FPS) % 60
  const m = Math.floor(total / FPS / 60)
  return `00:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`
}

/** Deterministic pseudo-waveform */
function wave(n: number, seed: number) {
  return Array.from({ length: n }, (_, i) => {
    const v = Math.abs(Math.sin(i * 0.37 + seed) * Math.cos(i * 0.11 + seed * 2) + Math.sin(i * 1.7) * 0.25)
    return 0.15 + Math.min(1, v) * 0.85
  })
}

export function EditSuite() {
  const root = useRef<HTMLElement>(null)
  const head = useRef<HTMLDivElement>(null)
  const tc = useRef<HTMLSpanElement>(null)
  const kb = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(0)

  const clips = useMemo(() => {
    const total = CLIP_WEIGHTS.reduce((a, b) => a + b, 0)
    let acc = 0
    return CLIP_SLUGS.map((slug, i) => {
      const w = CLIP_WEIGHTS[i] / total
      const clip = { work: WORKS.find((x) => x.slug === slug)!, start: acc, w }
      acc += w
      return clip
    })
  }, [])
  const a1 = useMemo(() => wave(140, 1.3), [])
  const a2 = useMemo(() => wave(140, 4.1), [])

  useGSAP(
    () => {
      let current = 0
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "+=260%",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress
          if (head.current) head.current.style.left = `${p * 100}%`
          if (tc.current) tc.current.textContent = timecode(p)
          let idx = clips.findIndex((c) => p >= c.start && p < c.start + c.w)
          if (idx < 0) idx = clips.length - 1
          if (idx !== current) {
            current = idx
            setActive(idx)
          }
          const local = (p - clips[idx].start) / clips[idx].w
          if (kb.current) kb.current.style.transform = `scale(${1.04 + local * 0.14}) translateX(${(local - 0.5) * -3}%)`
          const v = video.current
          if (v && v.duration) v.currentTime = p * v.duration
        },
      })
      gsap.from("[data-es-reveal]", {
        y: 50,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      })
    },
    { scope: root, dependencies: [clips] }
  )

  const clip = clips[active]

  return (
    // Wrapper keeps GSAP's pin-spacer out of React's sibling list
    <div>
    <section id="motion" ref={root} className="relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-ink-2">
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-5 px-5 pb-5 pt-24 md:px-10 md:pb-8 md:pt-28">
        {/* Header + monitor */}
        <div className="grid min-h-0 flex-1 gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)]">
          <div className="flex flex-col justify-between gap-4">
            <div>
              <p data-es-reveal className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50">
                (04) — Motion & edit
              </p>
              <h2 data-es-reveal className="text-[clamp(2.5rem,6vw,6rem)] font-extrabold leading-[0.88] tracking-[-0.045em]">
                Cut on the <span className="font-serif-i font-normal text-henna">beat</span>.
              </h2>
              <p data-es-reveal className="mt-5 hidden max-w-sm text-bone/60 sm:block">
                Production and editing for brands and artists: promo spots, event recaps, social reels, title design and
                colour. Scroll to scrub the timeline.
              </p>
            </div>
            <ul data-es-reveal className="hidden flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-bone/60 md:flex">
              {["Premiere Pro", "Reels 9:16", "Promo spots", "Titles", "Colour", "Sound sync"].map((t) => (
                <li key={t} className="rounded-full border border-bone/15 px-3 py-1.5">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Program monitor */}
          <div data-es-reveal className="relative min-h-0 overflow-hidden rounded-2xl border border-bone/10 bg-black">
            <div className="absolute inset-0">
              {REEL_SRC ? (
                <video ref={video} src={REEL_SRC} muted playsInline preload="auto" className="size-full object-cover" />
              ) : (
                <div ref={kb} className="size-full will-change-transform">
                  {clips.map((c, i) => (
                    <img
                      key={c.work.slug}
                      src={c.work.img}
                      alt={i === active ? c.work.title : ""}
                      className="absolute inset-0 size-full object-cover transition-opacity duration-300"
                      style={{ opacity: i === active ? 1 : 0 }}
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Monitor chrome: safe areas, REC, timecode */}
            <div className="pointer-events-none absolute inset-[6%] border border-dashed border-white/25" />
            <div className="pointer-events-none absolute inset-[11%] border border-white/10" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2">
              <span className="absolute left-1/2 top-0 h-full w-px bg-white/40" />
              <span className="absolute left-0 top-1/2 h-px w-full bg-white/40" />
            </div>
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-md bg-black/60 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-white backdrop-blur">
              <span className="size-2 animate-rec rounded-full bg-henna" /> Program
            </div>
            <div className="absolute right-4 top-4 rounded-md bg-black/60 px-2.5 py-1 font-mono text-[11px] tabular-nums text-saffron backdrop-blur">
              <span ref={tc}>00:00:00:00</span>
            </div>
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
              <div className="rounded-md bg-black/60 px-3 py-2 backdrop-blur">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
                  Clip {String(active + 1).padStart(2, "0")}
                </p>
                <p className="text-sm font-bold text-white md:text-base">{clip.work.title}</p>
              </div>
              <p className="rounded-md bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/70 backdrop-blur">
                1920 × 1080 · {FPS} fps
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div data-es-reveal className="relative shrink-0 rounded-2xl border border-bone/10 bg-ink p-3 md:p-4">
          <div className="mb-2 flex justify-between pl-10 font-mono text-[9px] tabular-nums text-bone/35 md:pl-14">
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i}>{timecode(i / 6).slice(3, 8)}</span>
            ))}
          </div>
          <div className="relative flex flex-col gap-1.5">
            <Track label="V2">
              {TITLES.map((t) => (
                <div
                  key={t.label}
                  className={`absolute inset-y-0 overflow-hidden rounded-[5px] px-2 text-[10px] font-semibold leading-7 text-ink ${t.color}`}
                  style={{ left: `${t.at * 100}%`, width: `${t.w * 100}%` }}
                >
                  <span className="truncate">{t.label}</span>
                </div>
              ))}
            </Track>
            <Track label="V1" tall>
              {clips.map((c, i) => (
                <div
                  key={c.work.slug}
                  className={`absolute inset-y-0 overflow-hidden rounded-[5px] border-2 transition-colors ${
                    i === active ? "border-saffron" : "border-ink"
                  }`}
                  style={{ left: `${c.start * 100}%`, width: `${c.w * 100}%` }}
                >
                  <div className="flex h-full">
                    {[0, 1, 2].map((k) => (
                      <img key={k} src={c.work.img} alt="" className="h-full min-w-0 flex-1 object-cover opacity-80" loading="lazy" />
                    ))}
                  </div>
                </div>
              ))}
            </Track>
            <Track label="A1">
              <Wave bars={a1} className="bg-zellige/80" />
            </Track>
            <Track label="A2" className="hidden md:flex">
              <Wave bars={a2} className="bg-indigo" />
            </Track>

            {/* Playhead */}
            <div className="pointer-events-none absolute inset-y-[-8px] left-10 right-0 md:left-14">
              <div ref={head} className="absolute inset-y-0 w-px bg-henna" style={{ left: "0%" }}>
                <span className="absolute -left-[6px] -top-1 size-3 rotate-45 rounded-[2px] bg-henna" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}

function Track({ label, tall, className = "", children }: { label: string; tall?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex items-stretch gap-2 ${className}`}>
      <span className="flex w-8 shrink-0 items-center justify-center rounded-[5px] bg-ink-3 font-mono text-[10px] text-bone/50 md:w-12">
        {label}
      </span>
      <div className={`relative flex-1 rounded-[5px] bg-ink-3/60 ${tall ? "h-12 md:h-16" : "h-7"}`}>{children}</div>
    </div>
  )
}

function Wave({ bars, className }: { bars: number[]; className: string }) {
  return (
    <div className="absolute inset-0 flex items-center gap-[2px] overflow-hidden px-1">
      {bars.map((h, i) => (
        <span key={i} className={`min-w-0 flex-1 rounded-full ${className}`} style={{ height: `${h * 85}%` }} />
      ))}
    </div>
  )
}
