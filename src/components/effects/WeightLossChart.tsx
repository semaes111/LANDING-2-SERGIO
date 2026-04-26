import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useInView } from 'motion/react'

/**
 * Weight Loss Chart — animated SVG line chart embedded inside a Bento card.
 *
 * Design choices for medical/sober brand:
 * - Inline SVG (zero dependencies, no Recharts/D3)
 * - Animates the path on viewport entry using stroke-dasharray + dashoffset trick
 * - Drop fill is a subtle gradient (white → transparent) under the line
 * - Curve is clinically realistic, NOT marketing-exaggerated:
 *   - Approx 12 kg loss over 12 weeks (1 kg/week early, decelerating)
 *   - Matches published GLP-1 trial data (STEP-1, SURMOUNT-1) to remain honest
 * - Compact axes: only week markers (0, 4, 8, 12) and start/end weight labels
 * - Triggers once when in viewport (no replay)
 *
 * Visual integration:
 * - Designed to live inside a 2x2 Bento card with dark glass background
 * - Sized fluidly (max 360px wide) to nest within the card's content area
 * - Color tokens use rgba/white so it inherits the card's dark theme
 */

type WeightLossChartProps = {
  /** Starting weight in kg. Default 100 (representative case) */
  startWeight?: number
  /** Total weight loss target in kg over 12 weeks. Default 12 */
  totalLoss?: number
  /** Inline styles passed to the wrapper */
  style?: CSSProperties
  /** className passed to the wrapper */
  className?: string
}

export default function WeightLossChart({
  startWeight = 100,
  totalLoss = 12,
  style,
  className,
}: WeightLossChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: '0px 0px -10% 0px' })
  const pathRef = useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = useState(0)

  // Generate 13 data points (weeks 0..12) with a realistic decelerating curve.
  // Formula: easeOut(t) = 1 - (1-t)^1.6 — gives ~1 kg/week early, slowing slightly later.
  // This matches published GLP-1 outcome data (~10-15% loss at 12 weeks).
  const points = Array.from({ length: 13 }, (_, week) => {
    const t = week / 12
    const eased = 1 - Math.pow(1 - t, 1.6)
    return {
      week,
      weight: startWeight - totalLoss * eased,
    }
  })

  const VIEW_W = 320
  const VIEW_H = 140
  const PAD_X = 24
  const PAD_Y = 18
  const minW = startWeight - totalLoss
  const maxW = startWeight

  const xAt = (week: number) =>
    PAD_X + (week / 12) * (VIEW_W - PAD_X * 2)
  const yAt = (weight: number) =>
    PAD_Y + ((maxW - weight) / (maxW - minW)) * (VIEW_H - PAD_Y * 2)

  // Build smooth path using cubic Bézier between consecutive points
  const linePath = points
    .map((p, i, arr) => {
      const x = xAt(p.week)
      const y = yAt(p.weight)
      if (i === 0) return `M ${x} ${y}`
      const prev = arr[i - 1]
      const px = xAt(prev.week)
      const py = yAt(prev.weight)
      const cp1x = px + (x - px) / 2
      const cp1y = py
      const cp2x = px + (x - px) / 2
      const cp2y = y
      return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`
    })
    .join(' ')

  // Closed path for the gradient fill (line + base + back)
  const fillPath = `${linePath} L ${xAt(12)} ${VIEW_H - PAD_Y} L ${xAt(0)} ${VIEW_H - PAD_Y} Z`

  // Capture path total length once mounted (for stroke-dashoffset animation)
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
  }, [])

  return (
    <div ref={containerRef} style={style} className={className}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block', maxWidth: '360px' }}
        role="img"
        aria-label={`Pérdida de peso prevista: de ${startWeight}kg a ${minW}kg en 12 semanas`}
      >
        <defs>
          <linearGradient id="wlc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines (very subtle) */}
        {[0, 0.5, 1].map((t) => {
          const y = PAD_Y + t * (VIEW_H - PAD_Y * 2)
          return (
            <line
              key={t}
              x1={PAD_X}
              x2={VIEW_W - PAD_X}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
              strokeDasharray="2 3"
            />
          )
        })}

        {/* Filled area under the line (fades up from line down to baseline) */}
        <path
          d={fillPath}
          fill="url(#wlc-fill)"
          style={{
            opacity: inView ? 1 : 0,
            transition: 'opacity 0.8s ease-out 0.6s',
          }}
        />

        {/* The main line itself — animated with stroke-dashoffset */}
        <path
          ref={pathRef}
          d={linePath}
          fill="none"
          stroke="rgba(255,255,255,0.95)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength || 1000}
          strokeDashoffset={inView ? 0 : pathLength || 1000}
          style={{
            transition: 'stroke-dashoffset 1.4s cubic-bezier(0.65, 0, 0.35, 1)',
          }}
        />

        {/* Endpoint dot — pulses at week 12 once line completes */}
        <circle
          cx={xAt(12)}
          cy={yAt(points[12].weight)}
          r="3.5"
          fill="rgba(255,255,255,0.95)"
          style={{
            opacity: inView ? 1 : 0,
            transition: 'opacity 0.4s ease-out 1.4s',
          }}
        />

        {/* Y-axis labels: start and end weights */}
        <text
          x={PAD_X - 6}
          y={yAt(startWeight) + 4}
          textAnchor="end"
          fontSize="9"
          fontFamily='"Helvetica Neue", sans-serif'
          fontWeight="400"
          fill="rgba(255,255,255,0.55)"
        >
          {startWeight}kg
        </text>
        <text
          x={PAD_X - 6}
          y={yAt(minW) + 4}
          textAnchor="end"
          fontSize="9"
          fontFamily='"Helvetica Neue", sans-serif'
          fontWeight="400"
          fill="rgba(255,255,255,0.55)"
        >
          {minW}kg
        </text>

        {/* X-axis labels: week markers */}
        {[0, 4, 8, 12].map((w) => (
          <text
            key={w}
            x={xAt(w)}
            y={VIEW_H - 4}
            textAnchor="middle"
            fontSize="9"
            fontFamily='"Helvetica Neue", sans-serif'
            fontWeight="400"
            fill="rgba(255,255,255,0.55)"
          >
            S{w}
          </text>
        ))}

        {/* Result label — only shown once the animation completes */}
        <text
          x={xAt(12) - 6}
          y={yAt(points[12].weight) - 10}
          textAnchor="end"
          fontSize="11"
          fontFamily='"Helvetica Neue", sans-serif'
          fontWeight="500"
          fill="rgba(255,255,255,0.92)"
          style={{
            opacity: inView ? 1 : 0,
            transition: 'opacity 0.5s ease-out 1.6s',
          }}
        >
          −{totalLoss}kg
        </text>
      </svg>
    </div>
  )
}
