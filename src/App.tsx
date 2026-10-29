import { useCallback, useState } from "react"
import { SmoothScroll, useScrollTo } from "./lib/smooth-scroll"
import { Preloader } from "./components/Preloader"
import { Cursor } from "./components/Cursor"
import { Nav } from "./components/Nav"
import { Hero } from "./components/hero/Hero"
import { Manifesto, Marquee } from "./components/Manifesto"
import { SelectedWorks } from "./components/SelectedWorks"
import { Services } from "./components/Services"
import { EditSuite } from "./components/EditSuite"
import { Archive } from "./components/Archive"
import { About } from "./components/About"
import { Contact } from "./components/Contact"
import type { Category } from "./data/works"

function Page() {
  const [ready, setReady] = useState(false)
  const [filter, setFilter] = useState<Category | "all">("all")
  const scrollTo = useScrollTo()

  const pick = useCallback(
    (c: Category) => {
      setFilter(c)
      scrollTo("archive")
    },
    [scrollTo]
  )

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <div className="grain" aria-hidden />
      <Nav visible={ready} />
      <main>
        <Hero ready={ready} />
        <Manifesto />
        <Marquee />
        <SelectedWorks />
        <Services onPick={pick} />
        <EditSuite />
        <Archive filter={filter} setFilter={setFilter} />
        <About />
        <Contact />
      </main>
    </>
  )
}

export default function App() {
  return (
    <SmoothScroll>
      <Page />
    </SmoothScroll>
  )
}
