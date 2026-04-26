import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

/**
 * Glare Card — wrapper that overlays a subtle moving sheen on a card.
 *
 * Design choices for medical/sober brand:
 * - Sheen runs every 6 seconds (frequent enough to notice, infrequent
 *   enough not to distract during a 15-second pricing comparison)
 * - 0.3s duration crossing — quick swipe, not a slow drag
 * - Diagonal -30deg angle — feels premium without being gimmicky
 * - White at 0.18 opacity max (very subtle on dark cards, invisible on
 *   light ones — works best when card has dark background like Membership)
 * - Pause on hover so the user can read the card without the sheen interfering
 *
 * Architecture:
 * - This is a WRAPPER. Place it around any card; the sheen overlays the
 *   wrapped content via absolute positioning + pointer-events:none.
 * - The wrapper itself doesn't change the layout — it adds a relative
 *   container only if the child doesn't already have one.
 *
 * Usage:
 *   <GlareCard>
 *     <YourPricingCard />
 *   </GlareCard>
 */

type GlareCardProps = {
  children: ReactNode
  /** Interval between sheen runs in milliseconds. Default 6000 */
  intervalMs?: number
  /** Duration of each sheen swipe in milliseconds. Default 1200 */
  durationMs?: number
  /** Inline styles passed to the wrapper */
  style?: CSSProperties
  className?: string
}

export default function GlareCard({
  children,
  intervalMs = 6000,
  durationMs = 1200,
  style,
  className,
}: GlareCardProps) {
  const sheenRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sheen = sheenRef.current
    const wrapper = wrapperRef.current
    if (!sheen || !wrapper) return

    let intervalId: number | undefined
    let isPaused = false

    function runSheen() {
      if (!sheen || isPaused) return
      sheen.style.transition = 'none'
      sheen.style.transform = 'translateX(-150%) skewX(-30deg)'
      sheen.style.opacity = '0'

      // Force reflow so the transition restart works
      sheen.getBoundingClientRect()

      sheen.style.transition = `transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${durationMs}ms ease`
      sheen.style.transform = 'translateX(150%) skewX(-30deg)'
      sheen.style.opacity = '1'
    }

    // First run after a brief delay so user sees something happen quickly
    const initialTimeout = window.setTimeout(runSheen, 1500)
    intervalId = window.setInterval(runSheen, intervalMs)

    const handleEnter = () => {
      isPaused = true
    }
    const handleLeave = () => {
      isPaused = false
    }

    wrapper.addEventListener('mouseenter', handleEnter)
    wrapper.addEventListener('mouseleave', handleLeave)

    return () => {
      window.clearTimeout(initialTimeout)
      if (intervalId) window.clearInterval(intervalId)
      wrapper.removeEventListener('mouseenter', handleEnter)
      wrapper.removeEventListener('mouseleave', handleLeave)
    }
  }, [intervalMs, durationMs])

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      className={className}
    >
      {children}
      <div
        ref={sheenRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          background:
            'linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)',
          transform: 'translateX(-150%) skewX(-30deg)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
    </div>
  )
}
