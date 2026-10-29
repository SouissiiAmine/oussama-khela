import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { EDUCATION, EXPERIENCE } from "../data/works"

const TOOLS = [
  { k: "Ps", name: "Photoshop", c: "#31a8ff", bg: "#001e36" },
  { k: "Ai", name: "Illustrator", c: "#ff9a00", bg: "#330000" },
  { k: "Id", name: "InDesign", c: "#ff3366", bg: "#49021f" },
  { k: "Lr", name: "Lightroom", c: "#31a8ff", bg: "#001e36" },
  { k: "Pr", name: "Premiere Pro", c: "#9999ff", bg: "#00005b" },
]

const SKILLS = ["Drawing & painting", "Branding", "Typography", "Layout & grid", "Illustration", "Photography & retouching", "Video production", "Design thinking"]

export function About() {
  const root = useRef<HTMLElement>(null)
  const [openJob, setOpenJob] = useState(0)

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-portrait]",
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: "[data-portrait]", start: "top 80%" } }
      )
      gsap.to("[data-portrait-img]", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      })
      gsap.to("[data-sticker]", {
        rotate: 18,
        y: -60,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      })
      gsap.from("[data-ab-reveal]", {
        y: 50,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-ab-text]", start: "top 80%" },
      })
    },
    { scope: root }
  )

  return (
    <section id="about" ref={root} className="relative overflow-hidden bg-bone text-ink">
      <div className="zellige-pattern pointer-events-none absolute inset-0 opacity-[0.06] invert" />
      <div className="relative mx-auto grid max-w-[1600px] gap-14 px-5 py-28 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-20 md:px-10 md:py-40">
        {/* Portrait */}
        <div className="relative md:sticky md:top-28 md:self-start">
          <div data-portrait className="group relative aspect-[4/5] overflow-hidden rounded-[28px] bg-ink">
            <img
              data-portrait-img
              src="/img/portrait-cover.webp"
              alt="Portrait of Oussama Khela"
              className="absolute inset-0 h-[115%] w-full object-cover object-top grayscale transition-[filter] duration-700 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-saffron mix-blend-multiply transition-opacity duration-700 group-hover:opacity-0" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-bone">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Oussama Khela</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Fès, MA</span>
            </div>
          </div>
          <img
            data-sticker
            src="/img/portrait-illustrated.webp"
            alt="Illustrated self-portrait"
            className="absolute -bottom-10 -right-4 w-28 rotate-[-8deg] rounded-2xl border-4 border-bone shadow-2xl md:-right-10 md:w-40"
          />
        </div>

        {/* Text */}
        <div data-ab-text>
          <p data-ab-reveal className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
            (06) — About
          </p>
          <h2 data-ab-reveal className="text-[clamp(2.5rem,6vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.045em]">
            Arts first. <span className="font-serif-i font-normal text-henna">Always</span>.
          </h2>
          <p data-ab-reveal className="mt-8 max-w-xl text-lg leading-relaxed text-ink/75">
            The arts have always been my passion — so I specialised in what came naturally, drawing, and turned it into a
            profession. That road led me into graphic design. I learn fast, I organise well and I communicate clearly; I love
            teamwork and taking a project from first sketch to final delivery with the client.{" "}
            <span className="font-serif-i text-xl text-ink">Their satisfaction is reflected in mine.</span>
          </p>

          {/* Experience */}
          <div data-ab-reveal className="mt-16">
            <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Experience</h3>
            <ul className="border-t border-ink/15">
              {EXPERIENCE.map((job, i) => {
                const on = openJob === i
                return (
                  <li key={job.company} className="border-b border-ink/15">
                    <button
                      onClick={() => setOpenJob(on ? -1 : i)}
                      aria-expanded={on}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span>
                        <span className="block text-2xl font-extrabold tracking-tight md:text-3xl">{job.company}</span>
                        <span className="font-serif-i text-lg text-ink/60">
                          {job.role} · {job.place}
                        </span>
                      </span>
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-lg transition-all duration-500 ${
                          on ? "rotate-45 border-transparent bg-ink text-bone" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>
                    <div className={`grid transition-[grid-template-rows] duration-500 ease-out-expo ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <p className="overflow-hidden pr-14 text-ink/70">
                        <span className="block pb-6">{job.text}</span>
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="mt-16 grid gap-12 sm:grid-cols-2">
            <div data-ab-reveal>
              <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Education</h3>
              <ul className="space-y-4">
                {EDUCATION.map((e) => (
                  <li key={e.title} className="grid grid-cols-[4.5rem_1fr] gap-3">
                    <span className="font-mono text-xs tabular-nums text-henna">{e.year}</span>
                    <span className="font-semibold leading-snug">{e.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div data-ab-reveal>
              <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Toolkit</h3>
              <ul className="flex flex-wrap gap-2">
                {TOOLS.map((t) => (
                  <li
                    key={t.k}
                    title={t.name}
                    className="flex size-14 items-center justify-center rounded-xl border-2 text-xl font-bold transition-transform hover:-translate-y-1 hover:rotate-[-6deg]"
                    style={{ color: t.c, background: t.bg, borderColor: t.c }}
                  >
                    {t.k}
                  </li>
                ))}
              </ul>
              <h3 className="mb-3 mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Languages</h3>
              <p className="text-lg font-semibold">
                Français · English · <span lang="ar">العربية</span>
              </p>
            </div>
          </div>

          <div data-ab-reveal className="mt-14 flex flex-wrap gap-2">
            {SKILLS.map((s) => (
              <span key={s} className="rounded-full border border-ink/20 px-4 py-2 text-sm">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
