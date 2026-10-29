/*
  Adapted from "Tweenly Curved Carousel" by Manjunath Irukulla (21st.dev, MIT License).

  MIT License — Copyright (c) 2026 Manjunath Irukulla
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software
  and associated documentation files (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge, publish, distribute,
  sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions: The above copyright notice and this
  permission notice shall be included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.

  Changes: Chouara poster palette, editorial captions, local utils.
*/
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { useReducedMotion } from "../../lib/use-reduced-motion"
import { cn } from "../../lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export interface CurvedCarouselImage {
  src: string
  alt?: string
  title?: string
  caption?: string
}

export interface CurvedCarouselProps {
  images: CurvedCarouselImage[]
  mode?: "scroll" | "drag" | "auto"
  intro?: boolean
  introShape?: "rounded" | "circle"
  radius?: number
  curve?: "inside" | "outside"
  cardWidth?: number
  cardAspect?: string
  gap?: number
  perspective?: number
  tilt?: number
  visible?: number
  dim?: number
  cardRadius?: number
  scrollLength?: number
  snap?: boolean
  speed?: number
  showCaptions?: boolean
  background?: string
  height?: string
  scroller?: HTMLElement | null
  onIntroComplete?: () => void
  onIndexChange?: (index: number) => void
  onProgress?: (p: number) => void
  className?: string
  children?: React.ReactNode
}

const POSTER_PALETTE = ["#f4b22e", "#e2552d", "#1ba88f", "#3b3fb6"]

const inOut = gsap.parseEase("power4.inOut")
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function parseAspect(aspect: string) {
  const [w, h] = aspect.split("/").map((v) => parseFloat(v))
  return w && h ? w / h : 0.75
}

function CardMedia({ image, index }: { image: CurvedCarouselImage; index: number }) {
  const ref = useRef<HTMLImageElement>(null)
  const [failed, setFailed] = useState<string | null>(null)

  useEffect(() => {
    const img = ref.current
    if (!img?.complete || img.naturalWidth !== 0) return
    const id = requestAnimationFrame(() => setFailed(image.src))
    return () => cancelAnimationFrame(id)
  }, [image.src])

  const title = image.title ?? image.alt ?? `No. ${index + 1}`

  return (
    <>
      <div
        className="absolute inset-0 flex flex-col justify-start gap-[4cqw] overflow-hidden p-[7cqw] text-ink [container-type:inline-size]"
        style={{ background: POSTER_PALETTE[index % POSTER_PALETTE.length] }}
        aria-hidden={!!image.src && failed !== image.src}
      >
        <span className="font-mono text-[6cqw] tracking-[0.08em] opacity-80">{String(index + 1).padStart(2, "0")}</span>
        <span className="break-words font-display text-[19cqw] font-extrabold uppercase leading-[0.86]">{title}</span>
      </div>
      {image.src && failed !== image.src && (
        <img
          ref={ref}
          src={image.src}
          alt={image.alt ?? image.title ?? ""}
          onError={() => setFailed(image.src)}
          draggable={false}
          loading="lazy"
          className="absolute inset-0 size-full object-cover text-transparent"
        />
      )}
    </>
  )
}

function Caption({ image, index, total }: { image: CurvedCarouselImage; index: number; total: number }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/60 to-transparent p-[clamp(0.9rem,6%,1.4rem)] pt-16 text-bone">
      <p className="font-mono text-[10px] tabular-nums uppercase tracking-[0.18em] text-saffron">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
      {image.title && <p className="mt-1 text-xl font-bold leading-none tracking-tight">{image.title}</p>}
      {image.caption && <p className="font-serif-i mt-1 text-base leading-snug text-bone/70">{image.caption}</p>}
    </div>
  )
}

export function CurvedCarousel({
  images,
  mode = "scroll",
  intro = true,
  introShape = "rounded",
  radius = 2.2,
  curve = "inside",
  cardWidth = 24,
  cardAspect = "3 / 4",
  gap = 24,
  perspective = 1400,
  tilt = 1,
  visible = 3,
  dim = 0.55,
  cardRadius = 18,
  scrollLength = 6,
  snap = false,
  speed = 0.15,
  showCaptions = true,
  background = "var(--background)",
  height = "100svh",
  scroller,
  onIntroComplete,
  onIndexChange,
  onProgress,
  className,
  children,
}: CurvedCarouselProps) {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [size, setSize] = useState({ w: 0, h: 0 })
  const n = images.length

  const posRef = useRef(0)
  const activeRef = useRef(-1)
  const introDoneRef = useRef(false)
  const sequenceRef = useRef("")
  const callbacks = useRef({ onIntroComplete, onIndexChange, onProgress })
  useEffect(() => {
    callbacks.current = { onIntroComplete, onIndexChange, onProgress }
  }, [onIntroComplete, onIndexChange, onProgress])

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height: h } = entry.contentRect
      setSize((s) => (Math.abs(s.w - width) < 1 && Math.abs(s.h - h) < 1 ? s : { w: width, h }))
    })
    ro.observe(root)
    return () => ro.disconnect()
  }, [reduced])

  const ratio = parseAspect(cardAspect)
  const cw = size.w
    ? Math.min(Math.max((size.w * cardWidth) / 100, Math.min(size.w * 0.62, 200)), size.h * 0.74 * ratio)
    : 0
  const ch = cw / ratio
  const ready = cw > 0 && n > 0

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || !ready || reduced) return
      if (mode === "scroll" && scroller === null) return

      const sequence = `${mode}|${intro}|${introShape}|${n}`
      if (sequenceRef.current !== sequence) {
        sequenceRef.current = sequence
        introDoneRef.current = false
        posRef.current = 0
      }

      const cards = gsap.utils.toArray<HTMLElement>("[data-cc-card]", root)
      const media = cards.map((c) => c.querySelector<HTMLElement>("[data-cc-media]"))
      const shades = cards.map((c) => c.querySelector<HTMLElement>("[data-cc-shade]"))
      const captions = cards.map((c) => c.querySelector<HTMLElement>("[data-cc-caption]"))

      const W = size.w
      const H = size.h
      const step = cw + gap
      const R = Math.max(radius, 0.4) * cw
      const stepAngle = step / R
      const sign = curve === "inside" ? 1 : -1
      const wrap = mode !== "scroll" || n > 2 * visible + 1
      const circle = Math.min(cw, ch) * 0.62

      const render = (pos: number, introP: number) => {
        let sx = 1
        let sy = 1
        let rv = cardRadius
        let ringP = 1
        if (introP < 1) {
          if (introShape === "circle") {
            const a = inOut(clamp01(introP / 0.5))
            const b = inOut(clamp01((introP - 0.5) / 0.5))
            sx = lerp(lerp(W / cw, circle / cw, a), 1, b)
            sy = lerp(lerp(H / ch, circle / ch, a), 1, b)
            rv = lerp(lerp(0, circle / 2, a), cardRadius, b)
            ringP = inOut(clamp01((introP - 0.45) / 0.55))
          } else {
            const e = inOut(introP)
            sx = lerp(W / cw, 1, e)
            sy = lerp(H / ch, 1, e)
            rv = lerp(0, cardRadius, e)
            ringP = inOut(clamp01((introP - 0.25) / 0.75))
          }
        }

        for (let i = 0; i < n; i++) {
          const card = cards[i]
          let d = i - pos
          if (wrap) d = ((((d + n / 2) % n) + n) % n) - n / 2
          const isIntroCard = introP < 1 && i === 0
          const dd = isIntroCard ? 0 : d * (1 + (1 - ringP) * 0.9)
          const abs = Math.abs(dd)
          const angle = dd * stepAngle
          const depth = sign * R * (1 - Math.cos(angle))
          let opacity = clamp01(visible + 0.6 - abs) * (isIntroCard ? 1 : ringP)
          if (Math.abs(angle) > 1.45 || depth > perspective - 80) opacity = 0

          if (opacity <= 0.001) {
            card.style.visibility = "hidden"
            continue
          }
          card.style.visibility = "visible"
          card.style.opacity = String(opacity)
          card.style.zIndex = String(isIntroCard ? 2000 : 1000 - Math.round(abs * 10))

          const x = R * Math.sin(angle)
          const ry = ((-sign * angle * 180) / Math.PI) * tilt
          const s = 1 - Math.min(abs, visible) * 0.04
          card.style.transform = `perspective(${perspective}px) translate3d(${x}px, 0px, ${depth}px) rotateY(${ry}deg) scale(${s * sx}, ${s * sy})`
          card.style.borderRadius = isIntroCard ? `${rv / sx}px / ${rv / sy}px` : `${cardRadius}px`

          const m = media[i]
          if (m) {
            const k = Math.max(sx, sy)
            m.style.transform = isIntroCard ? `scale(${k / sx}, ${k / sy})` : "none"
          }
          const shade = shades[i]
          if (shade) shade.style.opacity = String(Math.min(0.92, dim * Math.min(abs, 2.5) * 0.7))
          const cap = captions[i]
          if (cap) cap.style.opacity = String(isIntroCard ? 0 : clamp01(1 - abs * 1.6))
        }

        if (introP >= 1 && !introDoneRef.current) {
          introDoneRef.current = true
          callbacks.current.onIntroComplete?.()
        } else if (introP < 1) {
          introDoneRef.current = false
        }

        const active = ((Math.round(pos) % n) + n) % n
        if (active !== activeRef.current) {
          activeRef.current = active
          callbacks.current.onIndexChange?.(active)
        }
      }

      if (mode === "scroll") {
        const introFrac = intro ? Math.min(0.4, Math.max(0.12, 1.2 / Math.max(scrollLength, 1))) : 0
        const hold = 0.04
        const span = 1 - introFrac - hold
        const fromProgress = (p: number) => {
          const introP = intro ? clamp01(p / introFrac) : 1
          const pos = n > 1 ? clamp01((p - introFrac) / span) * (n - 1) : 0
          posRef.current = pos
          render(pos, introP)
          callbacks.current.onProgress?.(p)
        }
        const points = [0, ...images.map((_, k) => introFrac + (n > 1 ? (k / (n - 1)) * span : 0)), 1]
        const state = { p: 0 }
        fromProgress(0)
        gsap.to(state, {
          p: 1,
          ease: "none",
          onUpdate: () => fromProgress(state.p),
          scrollTrigger: {
            trigger: root,
            scroller: scroller ?? undefined,
            start: "top top",
            end: () => `+=${root.offsetHeight * Math.max(scrollLength, 1)}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            snap: snap ? { snapTo: points, duration: { min: 0.25, max: 0.7 }, ease: "power4.inOut", delay: 0.08 } : undefined,
          },
        })
        const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 100)
        return () => window.clearTimeout(refresh)
      }

      const view = { intro: intro && !introDoneRef.current ? 0 : 1 }
      const draw = () => render(posRef.current, view.intro)
      draw()

      const cleanups: (() => void)[] = []

      if (view.intro < 1) {
        const io = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return
            io.disconnect()
            gsap.to(view, { intro: 1, duration: introShape === "circle" ? 2.2 : 1.6, ease: "none", delay: 0.2, onUpdate: draw })
          },
          { threshold: 0.35 }
        )
        io.observe(root)
        cleanups.push(() => io.disconnect())
      }

      if (mode === "auto") {
        let target = speed
        let current = speed
        const tick = (_time: number, dt: number) => {
          if (view.intro < 1) return
          const sec = Math.min(dt, 64) / 1000
          current += (target - current) * Math.min(1, sec * 4)
          posRef.current += current * sec
          if (posRef.current > n * 1000) posRef.current -= n * 1000
          draw()
        }
        const pause = () => (target = 0)
        const resume = () => (target = speed)
        gsap.ticker.add(tick)
        root.addEventListener("pointerenter", pause)
        root.addEventListener("pointerleave", resume)
        cleanups.push(() => {
          gsap.ticker.remove(tick)
          root.removeEventListener("pointerenter", pause)
          root.removeEventListener("pointerleave", resume)
        })
      } else {
        const proxy = { pos: posRef.current }
        let tween: gsap.core.Tween | null = null
        let dragging = false
        let startX = 0
        let startPos = 0
        let samples: { t: number; pos: number }[] = []

        const glideTo = (to: number, duration: number) => {
          tween?.kill()
          proxy.pos = posRef.current
          tween = gsap.to(proxy, {
            pos: to,
            duration,
            ease: "power4.out",
            onUpdate: () => {
              posRef.current = proxy.pos
              draw()
            },
          })
        }
        const down = (e: PointerEvent) => {
          if (view.intro < 1 || (e.pointerType === "mouse" && e.button !== 0)) return
          tween?.kill()
          dragging = true
          startX = e.clientX
          startPos = posRef.current
          samples = [{ t: performance.now(), pos: startPos }]
          root.setPointerCapture(e.pointerId)
        }
        const move = (e: PointerEvent) => {
          if (!dragging) return
          posRef.current = startPos - (e.clientX - startX) / step
          const now = performance.now()
          samples.push({ t: now, pos: posRef.current })
          samples = samples.filter((s) => now - s.t < 100)
          draw()
        }
        const up = (e: PointerEvent) => {
          if (!dragging) return
          dragging = false
          if (root.hasPointerCapture(e.pointerId)) root.releasePointerCapture(e.pointerId)
          const first = samples[0]
          const last = samples[samples.length - 1]
          const dt = last && first ? (last.t - first.t) / 1000 : 0
          const velocity = dt > 0.01 ? (last.pos - first.pos) / dt : 0
          let to = posRef.current + velocity * 0.35
          if (snap) to = Math.round(to)
          glideTo(to, Math.min(1.4, Math.max(0.6, Math.abs(velocity) * 0.25)))
        }
        root.addEventListener("pointerdown", down)
        root.addEventListener("pointermove", move)
        root.addEventListener("pointerup", up)
        root.addEventListener("pointercancel", up)
        cleanups.push(() => {
          tween?.kill()
          root.removeEventListener("pointerdown", down)
          root.removeEventListener("pointermove", move)
          root.removeEventListener("pointerup", up)
          root.removeEventListener("pointercancel", up)
        })
      }

      return () => cleanups.forEach((fn) => fn())
    },
    {
      scope: rootRef,
      dependencies: [
        ready, reduced, mode, size.w, size.h, cw, ch, images, intro, introShape, radius, curve, gap,
        perspective, tilt, visible, dim, cardRadius, scrollLength, snap, speed, scroller,
      ],
      revertOnUpdate: true,
    }
  )

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    })
    return () => cancelAnimationFrame(id)
  }, [ready, reduced, mode, size.w, size.h, scrollLength, images.length, intro, scroller])

  if (reduced) {
    return (
      <section
        ref={rootRef}
        className={cn("relative w-full overflow-hidden", className)}
        style={{ background }}
        aria-roledescription="carousel"
      >
        {children}
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 py-10 [scrollbar-width:none]">
          {images.map((image, i) => (
            <div
              key={i}
              className="relative w-[min(70vw,320px)] shrink-0 snap-center overflow-hidden"
              style={{ aspectRatio: cardAspect, borderRadius: cardRadius }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
            >
              <CardMedia image={image} index={i} />
              {showCaptions && <Caption image={image} index={i} total={n} />}
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      ref={rootRef}
      className={cn(
        "relative w-full overflow-hidden select-none",
        mode === "drag" && "cursor-grab touch-pan-y outline-none active:cursor-grabbing",
        className
      )}
      style={{ height, background }}
      aria-roledescription="carousel"
    >
      {children}
      {ready &&
        images.map((image, i) => (
          <div
            key={i}
            data-cc-card
            className="absolute left-1/2 top-1/2 overflow-hidden shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)] will-change-transform"
            style={{ width: cw, height: ch, marginLeft: -cw / 2, marginTop: -ch / 2, visibility: "hidden" }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}`}
          >
            <div data-cc-media className="absolute inset-0 will-change-transform">
              <CardMedia image={image} index={i} />
            </div>
            <div data-cc-shade className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
            {showCaptions && (
              <div data-cc-caption className="opacity-0">
                <Caption image={image} index={i} total={n} />
              </div>
            )}
          </div>
        ))}
    </section>
  )
}

export default CurvedCarousel
