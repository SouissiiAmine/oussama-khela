import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { CONTACT } from "../data/works"
import { useScrollTo } from "../lib/smooth-scroll"
import { ZelligeStar } from "./ZelligeStar"

function MagneticCTA() {
  const ref = useRef<HTMLAnchorElement>(null)
  const move = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.6, ease: "power3" })
  }
  const leave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" })

  const ring = "Start a project • Start a project • "
  return (
    <a
      ref={ref}
      href={`mailto:${CONTACT.email}?subject=New%20project`}
      onPointerMove={move}
      onPointerLeave={leave}
      data-cursor="Write"
      className="group relative flex size-40 shrink-0 items-center justify-center rounded-full bg-saffron text-ink md:size-52"
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full animate-[spin_14s_linear_infinite]" aria-hidden>
        <defs>
          <path id="cta-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-ink font-mono text-[13px] uppercase tracking-[0.3em]">
          <textPath href="#cta-circle">{ring}</textPath>
        </text>
      </svg>
      <span className="text-4xl transition-transform duration-500 group-hover:rotate-45">↗</span>
    </a>
  )
}

export function Contact() {
  const root = useRef<HTMLElement>(null)
  const scrollTo = useScrollTo()
  const [copied, setCopied] = useState(false)

  useGSAP(
    () => {
      gsap.from("[data-ct-line]", {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      })
    },
    { scope: root }
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${CONTACT.email}`
    }
  }

  return (
    <section id="contact" ref={root} className="relative overflow-hidden bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-28 md:px-10 md:pt-40">
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50">(07) — Contact</p>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="text-[clamp(3.25rem,11vw,12rem)] font-extrabold leading-[0.84] tracking-[-0.055em]">
            <span className="block overflow-hidden pb-[0.04em]">
              <span data-ct-line className="block">Got a brand</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-ct-line className="block">
                to <span className="font-serif-i font-normal text-saffron">build</span>?
              </span>
            </span>
          </h2>
          <MagneticCTA />
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-bone/10 bg-bone/10 md:grid-cols-3">
          <button onClick={copy} data-cursor={copied ? "Copied" : "Copy"} className="group bg-ink p-6 text-left transition-colors hover:bg-saffron hover:text-ink md:p-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">Email {copied ? "— copied!" : ""}</span>
            <span className="mt-3 block break-all text-xl font-bold tracking-tight md:text-2xl">{CONTACT.email}</span>
          </button>
          <a href={CONTACT.phoneHref} className="bg-ink p-6 transition-colors hover:bg-henna hover:text-ink md:p-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">Phone / WhatsApp</span>
            <span className="mt-3 block text-xl font-bold tracking-tight md:text-2xl">{CONTACT.phone}</span>
          </a>
          <div className="bg-ink p-6 md:p-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">Studio</span>
            <span className="mt-3 block text-xl font-bold tracking-tight md:text-2xl">{CONTACT.location}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative mt-16 border-t border-bone/10">
        <div className="zellige-pattern h-24 opacity-[0.08]" />
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-5 py-8 font-mono text-[11px] uppercase tracking-[0.16em] text-bone/50 md:flex-row md:items-center md:justify-between md:px-10">
          <span className="flex items-center gap-3">
            <ZelligeStar className="size-4 text-saffron" /> © {new Date().getFullYear()} Oussama Khela
          </span>
          <span>Designed in Fès — colours from the Chouara</span>
          <button onClick={() => scrollTo("top")} className="text-left hover:text-saffron md:text-right">
            Back to top ↑
          </button>
        </div>
        <div className="pointer-events-none select-none overflow-hidden px-2 pb-2" aria-hidden>
          <p className="text-center text-[21.5vw] font-extrabold leading-[0.75] tracking-[-0.07em] text-bone/[0.04]">KHELA</p>
        </div>
      </footer>
    </section>
  )
}
