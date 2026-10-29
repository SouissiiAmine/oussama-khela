import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useScrollTo } from "../lib/smooth-scroll"
import { ZelligeStar } from "./ZelligeStar"
import { CONTACT } from "../data/works"

const LINKS = [
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "motion", label: "Motion" },
  { id: "archive", label: "Archive" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
]

function useFesTime() {
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Casablanca" }).format(new Date())
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 15_000)
    return () => clearInterval(id)
  }, [])
  return t
}

export function Nav({ visible }: { visible: boolean }) {
  const scrollTo = useScrollTo()
  const time = useFesTime()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])

  const go = (id: string) => {
    setOpen(false)
    scrollTo(id)
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={visible ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8"
      >
        <nav
          className={`mx-auto flex max-w-[1600px] items-center justify-between rounded-full border px-3 py-2 transition-colors duration-500 md:px-4 ${
            scrolled ? "border-bone/10 bg-ink/70 backdrop-blur-xl" : "border-transparent bg-transparent"
          }`}
        >
          <button onClick={() => go("top")} className="group flex items-center gap-2.5" aria-label="Back to top">
            <ZelligeStar className="size-7 text-saffron transition-transform duration-700 ease-out-expo group-hover:rotate-[135deg]" />
            <span className="text-sm font-bold tracking-tight">
              Oussama <span className="font-serif-i text-base font-normal text-saffron">Khela</span>
            </span>
          </button>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className="group relative overflow-hidden rounded-full px-4 py-2 text-sm text-bone/80 transition-colors hover:text-ink"
                >
                  <span className="absolute inset-0 translate-y-full rounded-full bg-saffron transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                  <span className="relative">{l.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-bone/60 md:flex">
              <span className="size-2 animate-rec rounded-full bg-henna" />
              <span>Fès {time}</span>
            </div>
            <a
              href={`mailto:${CONTACT.email}`}
              className="hidden rounded-full bg-bone px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-saffron sm:inline-block"
            >
              Hire me
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex size-10 flex-col items-center justify-center gap-1.5 rounded-full border border-bone/20 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className={`h-px w-4 bg-bone transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-4 bg-bone transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-saffron px-6 pb-10 text-ink lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button onClick={() => go(l.id)} className="flex items-baseline gap-3 text-5xl font-extrabold tracking-tight">
                    <span className="font-mono text-xs font-normal">0{i + 1}</span>
                    {l.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="mt-10 flex justify-between font-mono text-xs uppercase tracking-[0.14em]">
              <a href={`mailto:${CONTACT.email}`}>Email</a>
              <span>Fès {time}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
