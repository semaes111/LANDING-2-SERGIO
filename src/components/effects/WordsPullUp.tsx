import { motion, useInView } from 'motion/react'
import { useRef, type CSSProperties } from 'react'

/**
 * Words Pull-Up effect — words rise from below with stagger when scrolled into view.
 *
 * Design choices for medical/sober brand:
 * - 0.12s stagger between words (subtle, not bouncy)
 * - cubic-bezier(0.34, 1.56, 0.64, 1) — minimal overshoot, feels confident not playful
 * - 20px translateY — small enough to feel polished, not distracting
 * - 0.5s per word duration — slow enough to read, fast enough to not block
 * - Triggers once (no re-animation on re-scroll, professional feel)
 *
 * Usage:
 *   <WordsPullUp text="El cuidado médico que mereces" />
 *   <WordsPullUp text="Precios" as="h2" style={{ fontSize: '48px' }} />
 *
 * Replaces the wrapped element entirely — pass styles via the `style` prop, NOT className,
 * because the project uses inline styles per its existing convention (see Hero, Pricing, etc).
 */

type WordsPullUpProps = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  style?: CSSProperties
  className?: string
  /** Stagger delay between words in seconds. Default 0.12 */
  stagger?: number
  /** Initial offset in pixels. Default 20 */
  yOffset?: number
}

export default function WordsPullUp({
  text,
  as = 'h2',
  style,
  className,
  stagger = 0.12,
  yOffset = 20,
}: WordsPullUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const words = text.split(' ')

  const Tag = motion[as] as typeof motion.div

  return (
    <Tag
      ref={ref as React.RefObject<HTMLSpanElement>}
      style={{
        ...style,
        display: style?.display ?? 'block',
        overflow: 'hidden',
      }}
      className={className}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{
            display: 'inline-block',
            paddingRight: '0.25em',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : `translateY(${yOffset}px)`,
            transition: `opacity 0.5s ease-out ${i * stagger}s, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * stagger}s`,
          }}
        >
          {word}
        </span>
      ))}
    </Tag>
  )
}
