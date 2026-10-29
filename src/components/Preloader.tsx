import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ZelligeStar } from "./ZelligeStar"

/** Timecode-style counter that counts to 100 frames, then wipes up. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const [frame, setFrame] = useState(0)

  useGSAP(
    () => {
      const p = path.current!
      const len = p.getTotalLength()
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      const counter = { f: 0 }
      const fontsReady = document.fonts?.ready ?? Promise.resolve()

      const tl = gsap.timeline({ paused: true })
      tl.to(p, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 0)
        .to(counter, { f: 100, duration: 1.6, ease: "power2.inOut", onUpdate: () => setFrame(Math.round(counter.f)) }, 0)
        .to("[data-pl-fill]", { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }, 1.4)
        .to("[data-pl-meta]", { opacity: 0, y: -10, duration: 0.3, stagger: 0.04 }, 1.9)
        .to(root.current, { yPercent: -100, duration: 1, ease: "expo.inOut", onStart: onDone }, 2.05)
        .set(root.current, { display: "none" })

      fontsReady.then(() => tl.play())
    },
    { scope: root }
  )

  const tc = `00:00:${String(Math.floor(frame / 25)).padStart(2, "0")}:${String(frame % 25).padStart(2, "0")}`

  return (
    <div ref={root} className="fixed inset-0 z-[200] flex items-center justify-center bg-ink text-bone">
      <div className="relative flex flex-col items-center gap-8">
        <div className="relative size-28">
          <ZelligeStar strokeOnly fill="var(--color-saffron)" pathRef={path} className="absolute inset-0 size-full" />
          <div data-pl-fill className="absolute inset-0" style={{ transform: "scale(0.5)", opacity: 0 }}>
            <ZelligeStar fill="var(--color-saffron)" className="size-full" />
          </div>
        </div>
        <div data-pl-meta className="font-mono text-sm tabular-nums tracking-[0.2em] text-bone/80">
          {tc}
        </div>
      </div>
      <div data-pl-meta className="absolute bottom-8 left-6 font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50 md:left-10">
        Oussama Khela — Portfolio
      </div>
      <div data-pl-meta className="absolute bottom-8 right-6 font-mono text-[11px] tabular-nums uppercase tracking-[0.2em] text-bone/50 md:right-10">
        {String(frame).padStart(3, "0")}%
      </div>
    </div>
  )
}
