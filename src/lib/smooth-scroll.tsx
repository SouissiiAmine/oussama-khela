import { createContext, useContext, useEffect, useState } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "./use-reduced-motion"

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<Lenis | null>(null)

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (reduced) return
    const instance = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 })
    instance.on("scroll", ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [reduced])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export function useLenis() {
  return useContext(LenisContext)
}

/** Scroll to a section id, smoothly when Lenis is running. */
export function useScrollTo() {
  const lenis = useLenis()
  return (target: string | number) => {
    if (lenis) {
      lenis.scrollTo(typeof target === "number" ? target : `#${target}`, { duration: 1.6, offset: 0 })
      return
    }
    if (typeof target === "number") window.scrollTo({ top: target })
    else document.getElementById(target)?.scrollIntoView()
  }
}
