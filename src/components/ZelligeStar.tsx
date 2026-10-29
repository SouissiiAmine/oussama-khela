/** The khatam — the 8-point star of Moroccan zellige — as points around (0,0). */
export function starPoints(R: number) {
  const r = (R * Math.cos(Math.PI / 4)) / Math.cos(Math.PI / 8)
  const pts: [number, number][] = []
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 - Math.PI / 2
    const rad = i % 2 === 0 ? R : r
    pts.push([Math.cos(a) * rad, Math.sin(a) * rad])
  }
  return pts
}

const PATH = "M" + starPoints(46).map(([x, y]) => `${(x + 50).toFixed(2)} ${(y + 50).toFixed(2)}`).join("L") + "Z"

export function ZelligeStar({
  className,
  fill = "currentColor",
  hole = true,
  strokeOnly = false,
  pathRef,
}: {
  className?: string
  fill?: string
  hole?: boolean
  strokeOnly?: boolean
  pathRef?: React.Ref<SVGPathElement>
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <path
        ref={pathRef}
        d={PATH}
        fill={strokeOnly ? "none" : fill}
        stroke={strokeOnly ? fill : "none"}
        strokeWidth={strokeOnly ? 1.5 : 0}
        strokeLinejoin="round"
      />
      {hole && !strokeOnly && <circle cx="50" cy="50" r="13" fill="var(--color-ink)" />}
    </svg>
  )
}
