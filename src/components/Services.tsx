import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { CATEGORIES, WORKS, type Category } from "../data/works"
import { ZelligeStar } from "./ZelligeStar"

/**
 * Index of disciplines. Hovering a row floods it with the discipline's dye colour from the side
 * the pointer came in, runs a marquee of what's inside, and floats a fanned stack of the work
 * after the cursor. Clicking jumps to the archive filtered to it.
 */
export function Services({ onPick }: { onPick: (c: Category) => void }) {
  const root = useRef<HTMLElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<Category | null>(null)
  // Read once, synchronously: re-running the reveal tweens after mount would freeze them at their start
  const [fine] = useState(() => window.matchMedia("(hover: hover) and (pointer: fine)").matches)

  useGSAP(
    () => {
      // Hand the dye layers' resting offset over to GSAP (percent, not the px it would parse)
      gsap.set("[data-flood]", { y: 0, yPercent: 101 })
      gsap.set("[data-flood-inner]", { y: 0, yPercent: -101 })

      // Lines draw in, labels rise out of their masks
      gsap.from("[data-rule]", {
        scaleX: 0,
        duration: 1.4,
        stagger: 0.08,
        ease: "expo.inOut",
        scrollTrigger: { trigger: "[data-rows]", start: "top 80%" },
      })
      gsap.from("[data-rise]", {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.06,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-rows]", start: "top 80%" },
      })
      gsap.from("[data-head]", {
        yPercent: 105,
        duration: 1.3,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      })

      if (!fine || !preview.current) return
      const xTo = gsap.quickTo(preview.current, "x", { duration: 0.7, ease: "power3" })
      const yTo = gsap.quickTo(preview.current, "y", { duration: 0.7, ease: "power3" })
      const rTo = gsap.quickTo(preview.current, "rotate", { duration: 0.6, ease: "power3" })
      let lastX = 0
      const move = (e: PointerEvent) => {
        xTo(e.clientX)
        yTo(e.clientY)
        rTo(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.7))
        lastX = e.clientX
      }
      window.addEventListener("pointermove", move)
      return () => window.removeEventListener("pointermove", move)
    },
    { scope: root }
  )

  /** Slide the dye layer in from (or out towards) the edge nearest the pointer */
  const flood = (li: HTMLElement, clientY: number | null, entering: boolean) => {
    const layer = li.querySelector<HTMLElement>("[data-flood]")
    const inner = li.querySelector<HTMLElement>("[data-flood-inner]")
    if (!layer || !inner) return
    const r = li.getBoundingClientRect()
    const top = clientY === null ? false : clientY - r.top < r.height / 2
    const edge = top ? -101 : 101
    gsap.killTweensOf([layer, inner])
    if (entering) {
      gsap.fromTo(layer, { yPercent: edge }, { yPercent: 0, duration: 0.65, ease: "expo.out" })
      gsap.fromTo(inner, { yPercent: -edge }, { yPercent: 0, duration: 0.65, ease: "expo.out" })
    } else {
      gsap.to(layer, { yPercent: edge, duration: 0.55, ease: "expo.out" })
      gsap.to(inner, { yPercent: -edge, duration: 0.55, ease: "expo.out" })
    }
  }

  const stack = hover ? WORKS.filter((w) => w.category === hover).slice(0, 3) : []
  const total = WORKS.length

  return (
    <section id="services" ref={root} className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      {/* Header */}
      <div className="mb-16 grid gap-10 md:mb-24 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div>
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50">(03) — Services</p>
          <h2 className="text-[clamp(3rem,9vw,9.5rem)] font-extrabold leading-[0.84] tracking-[-0.055em]">
            <span className="block overflow-hidden pb-[0.05em]">
              <span data-head className="block">What I</span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span data-head className="block">
                <span className="font-serif-i font-normal text-zellige">make</span>
                <ZelligeStar className="ml-4 inline-block size-[0.45em] align-middle text-henna" />
              </span>
            </span>
          </h2>
        </div>
        <div className="md:justify-self-end">
          <p className="max-w-sm text-bone/65">
            Seven disciplines, one pair of hands. Pick one to jump straight into the work — or take the whole set and get a
            brand that holds together from the logo to the last frame of the reel.
          </p>
          <dl className="mt-8 flex gap-10 font-mono text-[11px] uppercase tracking-[0.18em] text-bone/45">
            <div>
              <dt>Disciplines</dt>
              <dd className="mt-1 font-display text-3xl font-extrabold tracking-tight text-bone">07</dd>
            </div>
            <div>
              <dt>Projects</dt>
              <dd className="mt-1 font-display text-3xl font-extrabold tracking-tight text-bone">{total}</dd>
            </div>
            <div>
              <dt>Designer</dt>
              <dd className="mt-1 font-display text-3xl font-extrabold tracking-tight text-saffron">01</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Rows */}
      <ul data-rows className="relative">
        <span data-rule className="absolute inset-x-0 top-0 h-px origin-left bg-bone/15" />
        {CATEGORIES.map((c, i) => {
          const works = WORKS.filter((w) => w.category === c.id)
          const marquee = [c.label, ...c.tags]
          return (
            <li
              key={c.id}
              className="relative overflow-hidden"
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return
                setHover(c.id)
                flood(e.currentTarget, e.clientY, true)
              }}
              onPointerLeave={(e) => {
                if (e.pointerType !== "mouse") return
                setHover((h) => (h === c.id ? null : h))
                flood(e.currentTarget, e.clientY, false)
              }}
            >
              <button
                onClick={() => onPick(c.id)}
                onFocus={(e) => e.currentTarget.matches(":focus-visible") && flood(e.currentTarget.parentElement!, null, true)}
                onBlur={(e) => !e.currentTarget.parentElement!.matches(":hover") && flood(e.currentTarget.parentElement!, null, false)}
                className="relative grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-3 py-7 text-left outline-none md:grid-cols-[4rem_minmax(0,1.8fr)_minmax(0,1fr)_auto] md:gap-x-8 md:py-10"
              >
                <span className="overflow-hidden">
                  <span data-rise className="block font-mono text-xs tabular-nums text-bone/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <span className="overflow-hidden pb-[0.1em]">
                  <span data-rise className="block text-[clamp(2rem,4.6vw,4.75rem)] font-extrabold leading-[0.95] tracking-[-0.045em]">
                    {c.label}
                  </span>
                </span>
                <span className="col-span-3 col-start-2 row-start-2 flex flex-wrap gap-1.5 md:col-span-1 md:col-start-3 md:row-start-1">
                  {c.tags.map((t) => (
                    <span key={t} className="rounded-full border border-bone/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-bone/55">
                      {t}
                    </span>
                  ))}
                </span>
                <span className="flex items-center gap-3">
                  <span className="hidden font-mono text-xs tabular-nums text-bone/45 sm:inline">({String(works.length).padStart(2, "0")})</span>
                  <span className="flex size-11 items-center justify-center rounded-full border border-bone/20 text-lg md:size-14">↗</span>
                </span>
              </button>

              {/* Dye layer */}
              <div
                data-flood
                aria-hidden
                className="pointer-events-none absolute inset-0 overflow-hidden"
                style={{ background: c.accent, transform: "translateY(101%)" }}
              >
                <div data-flood-inner className="flex h-full items-center" style={{ transform: "translateY(-101%)" }}>
                  <div
                    className="animate-marquee flex shrink-0 items-center whitespace-nowrap text-[clamp(2rem,5.2vw,5rem)] font-extrabold leading-none tracking-[-0.045em] text-ink"
                    style={{ ["--marquee-speed" as string]: `${18 + i * 2}s` }}
                  >
                    {[0, 1].map((copy) => (
                      <span key={copy} className="flex shrink-0 items-center">
                        {marquee.map((t, k) => (
                          <span key={k} className="flex items-center gap-6 pr-6 md:gap-10 md:pr-10">
                            <span className={k === 0 ? "" : "font-serif-i font-normal"}>{t}</span>
                            <ZelligeStar className="size-[0.42em]" hole={false} />
                          </span>
                        ))}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <span data-rule className="absolute inset-x-0 bottom-0 h-px origin-left bg-bone/15" />
            </li>
          )
        })}
      </ul>

      {/* Cursor-following stack of the hovered discipline's work */}
      {fine && (
        <div ref={preview} className="pointer-events-none fixed left-0 top-0 z-30" aria-hidden>
          <div
            className={`relative -ml-[160px] -mt-[115px] h-[230px] w-[320px] transition-[opacity,scale] duration-500 ease-out-expo ${
              hover ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            {stack.map((w, i) => (
              <img
                key={w.slug}
                src={w.img}
                alt=""
                className="absolute inset-0 size-full rounded-2xl object-cover shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] ring-4 ring-ink"
                style={{
                  transform: `translate(${(i - 1) * 28}px, ${(i - 1) * -16}px) rotate(${(i - 1) * 8}deg)`,
                  zIndex: 3 - Math.abs(i - 1),
                }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
