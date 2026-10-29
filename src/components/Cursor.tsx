import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

/**
 * Dot + ring cursor. Any element with data-cursor="Label" grows the ring and shows the label.
 * Only takes over on fine pointers; the native cursor is hidden once the first move arrives.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState("")
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    const d = dot.current
    const r = ring.current
    if (!d || !r) return

    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "power3" })
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "power3" })
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3" })
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3" })

    let shown = false
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      if (!shown) {
        shown = true
        // Jump straight to the pointer on first move instead of gliding in from (0,0)
        gsap.set([d, r], { x: e.clientX, y: e.clientY })
        document.documentElement.classList.add("has-cursor")
        setActive(true)
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button")
      if (!el) {
        setLabel("")
        r.dataset.state = "idle"
        return
      }
      const text = el.dataset.cursor ?? ""
      setLabel(text)
      r.dataset.state = text ? "label" : "link"
    }
    const leaveWindow = () => setActive(false)
    const enterWindow = () => shown && setActive(true)
    const down = () => gsap.to(r, { scale: 0.8, duration: 0.2 })
    const up = () => gsap.to(r, { scale: 1, duration: 0.3 })

    window.addEventListener("pointermove", move)
    window.addEventListener("pointerover", over)
    window.addEventListener("pointerdown", down)
    window.addEventListener("pointerup", up)
    document.documentElement.addEventListener("pointerleave", leaveWindow)
    document.documentElement.addEventListener("pointerenter", enterWindow)
    return () => {
      document.documentElement.classList.remove("has-cursor")
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerover", over)
      window.removeEventListener("pointerdown", down)
      window.removeEventListener("pointerup", up)
      document.documentElement.removeEventListener("pointerleave", leaveWindow)
      document.documentElement.removeEventListener("pointerenter", enterWindow)
    }
  }, [])

  return (
    <div className={`transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`} aria-hidden>
      <div
        ref={ring}
        data-state="idle"
        className="group pointer-events-none fixed left-0 top-0 z-[100] -ml-5 -mt-5 flex size-10 items-center justify-center rounded-full border border-bone/50 transition-[width,height,margin,background-color,border-color] duration-300 ease-out-expo data-[state=label]:-ml-12 data-[state=label]:-mt-12 data-[state=label]:size-24 data-[state=label]:border-saffron data-[state=label]:bg-saffron data-[state=link]:-ml-7 data-[state=link]:-mt-7 data-[state=link]:size-14 data-[state=link]:border-saffron"
      >
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink opacity-0 transition-opacity duration-200 group-data-[state=label]:opacity-100">
          {label}
        </span>
      </div>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[101] -ml-[3px] -mt-[3px] size-1.5 rounded-full bg-saffron mix-blend-difference"
      />
    </div>
  )
}
