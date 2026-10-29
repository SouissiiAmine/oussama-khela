import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Float, Lightformer, MeshTransmissionMaterial, Text } from "@react-three/drei"
import * as THREE from "three"
import { starPoints } from "../ZelligeStar"

const SAFFRON = "#f4b22e"
const HENNA = "#e2552d"
const ZELLIGE = "#1ba88f"
const BONE = "#ede5d8"

function useStarGeometry(R: number, depth: number, holeR: number) {
  return useMemo(() => {
    const shape = new THREE.Shape()
    starPoints(R).forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)))
    shape.closePath()
    if (holeR > 0) {
      const hole = new THREE.Path()
      hole.absarc(0, 0, holeR, 0, Math.PI * 2, true)
      shape.holes.push(hole)
    }
    const g = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSegments: 12,
      bevelSize: R * 0.07,
      bevelThickness: R * 0.1,
      curveSegments: 64,
    })
    g.center()
    return g
  }, [R, depth, holeR])
}

/** Normalised page scroll through the hero: 0 at top, 1 one viewport down. */
function useHeroScroll() {
  const p = useRef(0)
  useEffect(() => {
    const on = () => (p.current = Math.min(1.5, window.scrollY / window.innerHeight))
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])
  return p
}

function GlassStar({ ready, mobile }: { ready: boolean; mobile: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const geo = useStarGeometry(1.6, 0.55, 0.42)
  const scroll = useHeroScroll()
  const scale = useRef(0)
  const width = useThree((s) => s.viewport.width)

  useFrame((state, dt) => {
    const g = ref.current
    if (!g) return
    const target = ready ? Math.min(1, width / 5.4) : 0
    scale.current = THREE.MathUtils.damp(scale.current, target, 3, dt)
    const s = scale.current * (1 + scroll.current * 0.6)
    g.scale.setScalar(Math.max(0.0001, s))
    const { x, y } = state.pointer
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -y * 0.5 + scroll.current * 1.4, 2.5, dt)
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, x * 0.7 + scroll.current * 2, 2.5, dt)
    g.rotation.z += dt * 0.12
    g.position.y = THREE.MathUtils.damp(g.position.y, scroll.current * 1.2, 4, dt)
  })

  return (
    <group ref={ref}>
      <mesh geometry={geo}>
        <MeshTransmissionMaterial
          backside
          backsideThickness={0.6}
          samples={mobile ? 4 : 8}
          resolution={mobile ? 384 : 1024}
          thickness={1.1}
          roughness={0.04}
          ior={1.42}
          chromaticAberration={0.55}
          anisotropicBlur={0.2}
          distortion={0.35}
          distortionScale={0.4}
          temporalDistortion={0.08}
          clearcoat={1}
          attenuationDistance={2.4}
          attenuationColor="#fff4dc"
          color="#ffffff"
        />
      </mesh>
    </group>
  )
}

function Tile({
  position,
  color,
  kind,
  size = 0.3,
  speed = 1,
}: {
  position: [number, number, number]
  color: string
  kind: "star" | "square" | "drop"
  size?: number
  speed?: number
}) {
  const star = useStarGeometry(size, size * 0.4, 0)
  return (
    <Float speed={speed * 1.6} rotationIntensity={2} floatIntensity={1.4} floatingRange={[-0.25, 0.25]}>
      <mesh position={position} geometry={kind === "star" ? star : undefined} rotation={[0.4, 0.6, 0.2]}>
        {kind === "square" && <boxGeometry args={[size * 1.3, size * 1.3, size * 0.45]} />}
        {kind === "drop" && <sphereGeometry args={[size * 0.75, 48, 48]} />}
        <meshPhysicalMaterial color={color} roughness={0.25} metalness={0.15} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
    </Float>
  )
}

function Lettering({ ready }: { ready: boolean }) {
  const { viewport, camera } = useThree()
  const vp = viewport.getCurrentViewport(camera, [0, 0, -1.6])
  const group = useRef<THREE.Group>(null)
  const scroll = useHeroScroll()
  const reveal = useRef(0)
  const big = Math.min(vp.width / 3.15, vp.height / 1.9)
  const portrait = vp.width < vp.height

  useFrame((_, dt) => {
    reveal.current = THREE.MathUtils.damp(reveal.current, ready ? 1 : 0, 2.2, dt)
    if (!group.current) return
    group.current.position.y = (1 - reveal.current) * -1.2 - scroll.current * 1.5
    group.current.position.z = -1.6 - scroll.current * 1.5
  })

  return (
    <group ref={group} position={[0, 0, -1.6]}>
      <Text
        font="/fonts/bricolage-800.woff"
        fontSize={big}
        letterSpacing={-0.045}
        anchorX="center"
        anchorY="middle"
        position={[0, -big * 0.08, 0]}
        color={BONE}
      >
        KHELA
      </Text>
      <Text
        font="/fonts/instrument-serif-italic.woff"
        fontSize={big * (portrait ? 0.42 : 0.3)}
        anchorX={portrait ? "left" : "right"}
        anchorY="bottom"
        position={portrait ? [-big * 1.5, big * 0.42, 0.2] : [big * 1.5, big * 0.24, 0.2]}
        color={SAFFRON}
      >
        Oussama
      </Text>
    </group>
  )
}

function Scene({ ready, mobile }: { ready: boolean; mobile: boolean }) {
  return (
    <>
      <color attach="background" args={["#0e0c0a"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />

      <Lettering ready={ready} />
      <GlassStar ready={ready} mobile={mobile} />

      {/* Coloured shapes behind/around the glass so the refraction picks up the palette */}
      <Tile position={[-3.4, -0.2, 0.4]} color={SAFFRON} kind="star" size={0.34} />
      <Tile position={[3.9, -1.6, -0.4]} color={HENNA} kind="star" size={0.42} speed={0.8} />
      <Tile position={[3.2, 1.9, -1.2]} color={ZELLIGE} kind="square" size={0.26} speed={1.2} />
      <Tile position={[-3.1, -1.9, -0.2]} color={ZELLIGE} kind="drop" size={0.22} speed={1.4} />
      <Tile position={[0.9, -2.3, -2.2]} color={SAFFRON} kind="square" size={0.2} speed={0.9} />
      <Tile position={[-1.4, 2.4, -2.4]} color={HENNA} kind="drop" size={0.16} speed={1.1} />

      <Environment resolution={256} frames={1}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="ring" color={SAFFRON} intensity={10} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={10} />
          <Lightformer form="rect" color={HENNA} intensity={6} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 4, 1]} />
          <Lightformer form="rect" color={ZELLIGE} intensity={5} rotation-y={Math.PI / 2} position={[-10, -2, 0]} scale={[20, 3, 1]} />
        </group>
      </Environment>
    </>
  )
}

export default function HeroScene({ ready }: { ready: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)
  const [mobile] = useState(() => window.innerWidth < 768)

  // Stop rendering once the hero has scrolled away
  useEffect(() => {
    const el = host.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={host} className="absolute inset-0">
      <Canvas
        frameloop={inView ? "always" : "never"}
        dpr={[1, mobile ? 1.5 : 2]}
        camera={{ position: [0, 0, 8], fov: 35 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Scene ready={ready} mobile={mobile} />
      </Canvas>
    </div>
  )
}
