import { useRef, useState, type CSSProperties, type ReactNode } from 'react'

/**
 * 3D Tilt Card — wrapper that applies a subtle perspective rotation following the cursor.
 *
 * Design choices for medical/sober brand:
 * - maxTilt: 8° (subtle, sophisticated — not 20° which feels gimmicky)
 * - perspective: 1000px (gentle depth)
 * - scale: 1.02 on hover (very subtle lift)
 * - rAF-throttled mouse tracking (60fps, no jank on rapid movement)
 * - Disabled on touch devices — pointer events from finger taps cause
 *   unintended rotations; mobile users get clean hover-less interaction.
 * - Cursor leaving the card resets to flat in 0.4s easing — feels natural.
 *
 * Usage:
 *   <TiltCard>
 *     <YourPricingCard />
 *   </TiltCard>
 *
 * Note: TiltCard is a wrapper. Don't apply transforms to children directly,
 * the wrapper handles all transform math. Keep child cards' own transforms
 * additive via transform-origin or use absolute positioning inside.
 */

type TiltCardProps = {
  children: ReactNode
  /** Maximum tilt in degrees. Default 8 (subtle for medical brand) */
  maxTilt?: number
  /** Scale on hover. Default 1.02 */
  scaleOnHover?: number
  /** Inline styles passed to the outer wrapper */
  style?: CSSProperties
  /** className passed to the outer wrapper */
  className?: string
}

export default function TiltCard({
  children,
  maxTilt = 8,
  scaleOnHover = 1.02,
  style,
  className,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const [transform, setTransform] = useState<string>('')

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return

    cancelAnimationFrame(rafRef.current)
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    rafRef.current = requestAnimationFrame(() => {
      const rotateY = (x - 0.5) * maxTilt * 2
      const rotateX = (0.5 - y) * maxTilt * 2
      setTransform(
        `perspective(1000px) rotateY(${rotateY.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg) scale(${scaleOnHover})`
      )
    })
  }

  const handleMouseLeave = () => {
    cancelAnimationFrame(rafRef.current)
    setTransform('perspective(1000px) rotateY(0) rotateX(0) scale(1)')
  }

  // Detect touch device once at mount — no tilt, just regular hover
  const isTouchDevice =
    typeof window !== 'undefined' && 'ontouchstart' in window

  if (isTouchDevice) {
    return (
      <div style={style} className={className}>
        {children}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform: transform || 'perspective(1000px) rotateY(0) rotateX(0) scale(1)',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}
      className={className}
    >
      {children}
    </div>
  )
}
