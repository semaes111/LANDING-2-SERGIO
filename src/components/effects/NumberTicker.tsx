import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'

/**
 * Number Ticker — animates from 0 to target value when scrolled into view.
 *
 * Design choices for medical/sober brand:
 * - 1.8s duration with ease-out cubic (fast start, slow end — feels confident)
 * - Triggers once (no re-animation, professional feel)
 * - Optional prefix/suffix strings ('+' for "50+ publicaciones", '€' for prices)
 * - Locale-aware number formatting via toLocaleString (es-ES separators)
 * - rAF-based, not setInterval — 60fps smooth
 *
 * Usage:
 *   <NumberTicker value={480} suffix="" />
 *   <NumberTicker value={50} suffix="+" />
 *   <NumberTicker value={15} suffix="+" />
 *   <NumberTicker value={99} prefix="" suffix="€" />
 */

type NumberTickerProps = {
  /** Target value to animate to */
  value: number
  /** String prepended to the number (e.g., '€') */
  prefix?: string
  /** String appended to the number (e.g., '+', '%') */
  suffix?: string
  /** Animation duration in milliseconds. Default 1800 */
  duration?: number
  /** Locale for number formatting. Default 'es-ES' */
  locale?: string
  /** Inline styles passed to the wrapping span */
  style?: React.CSSProperties
  /** className passed to the wrapping span */
  className?: string
}

export default function NumberTicker({
  value,
  prefix = '',
  suffix = '',
  duration = 1800,
  locale = 'es-ES',
  style,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!inView) return

    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(value * eased))

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    let rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [inView, value, duration])

  return (
    <span ref={ref} style={style} className={className}>
      {prefix}
      {displayValue.toLocaleString(locale)}
      {suffix}
    </span>
  )
}
