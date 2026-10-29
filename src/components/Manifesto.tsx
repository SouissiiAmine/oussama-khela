import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { ZelligeStar } from "./ZelligeStar"

gsap.registerPlugin(ScrollTrigger)

type Token = { t: string; accent?: string }

// Words wrapped in {braces:color} are set in italic serif with that accent
const TEXT =
  "It started with a {pencil:saffron}. Applied arts, then infography, then a career spent turning briefs into {brands:henna}, menus into objects people keep, and footage into {stories:zellige}. One designer, every touchpoint — so the logo, the box, the poster and the reel all speak the same language."

function tokenize(src: string): Token[] {
  return src.split(" ").map((w) => {
    const m = w.match(/^\{(.+):(\w+)\}(.*)$/)
    return m ? { t: m[1] + m[3], accent: m[2] } : { t: w }
  })
}

const STATS = [
  { n: "50+", l: "Products designed at WEM Marketing" },
  { n: "35", l: "Projects in this portfolio" },
  { n: "04", l: "Agencies, from Fès to Dubai" },
  { n: "03", l: "Languages — Français, English, العربية" },
]

export function Manifesto() {
  const root = useRef<HTMLElement>(null)
  const words = tokenize(TEXT)

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: "[data-words]", start: "top 80%", end: "bottom 45%", scrub: true },
        }
      )
      gsap.from("[data-stat]", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-stats]", start: "top 85%" },
      })
      gsap.to("[data-spin]", {
        rotate: 360,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      })
    },
    { scope: root }
  )

  return (
    <section id="manifesto" ref={root} className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-44">
      <div className="mb-12 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50">
        <span data-spin className="inline-block">
          <ZelligeStar className="size-5 text-henna" hole={false} />
        </span>
        <span>(01) — Manifesto</span>
      </div>

      <p data-words className="max-w-[22ch] text-[clamp(2rem,5.6vw,5.5rem)] font-bold leading-[1.02] tracking-[-0.035em] md:max-w-[24ch]">
        {words.map((w, i) => (
          <span key={i} data-word className="inline-block whitespace-pre">
            {w.accent ? (
              <span className="font-serif-i font-normal" style={{ color: `var(--color-${w.accent})` }}>
                {w.t}
              </span>
            ) : (
              w.t
            )}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </p>

      <div data-stats className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-bone/10 bg-bone/10 md:mt-36 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.l} data-stat className="flex min-h-48 flex-col justify-between bg-ink p-5 md:p-7">
            <span className="text-[clamp(3rem,6vw,5.5rem)] font-extrabold leading-none tracking-[-0.05em]">{s.n}</span>
            <span className="mt-6 max-w-[18ch] text-sm text-bone/60">{s.l}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Marquee() {
  const row = ["Logo design", "Brand identity", "Packaging", "Print", "Motion", "Social media", "Illustration", "Video editing", "Retouching", "Signage"]
  const colors = ["text-saffron", "text-henna", "text-zellige"]
  const Item = ({ t, i }: { t: string; i: number }) => (
    <span className="flex shrink-0 items-center gap-8 pr-8">
      <span className={i % 2 ? `font-serif-i font-normal ${colors[i % 3]}` : ""}>{t}</span>
      <ZelligeStar className="size-[0.5em] text-bone/30" hole={false} />
    </span>
  )
  return (
    <div className="relative -rotate-2 border-y border-bone/10 bg-ink-2 py-5 md:py-7" aria-hidden>
      <div className="flex overflow-hidden">
        <div className="animate-marquee flex text-[clamp(2rem,5vw,4.5rem)] font-extrabold uppercase leading-none tracking-[-0.03em]" style={{ ["--marquee-speed" as string]: "45s" }}>
          {[...row, ...row].map((t, i) => (
            <Item key={i} t={t} i={i % row.length} />
          ))}
        </div>
      </div>
    </div>
  )
}
