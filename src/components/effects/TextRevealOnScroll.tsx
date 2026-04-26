import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef, type CSSProperties } from 'react'

/**
 * Text Reveal on Scroll — words fade from light gray to full color as the
 * paragraph scrolls into and through the viewport.
 *
 * Design choices for medical/sober brand:
 * - INLINE behavior (no sticky, no enforced minHeight) — respects existing layouts
 * - Word opacity tied to the natural scroll progress as the element enters viewport
 * - Starts at 0.18 opacity (very light gray, ghostly), ends at 1 (full color)
 * - useScroll + useTransform for native scroll-linked animation (60fps, no JS frame loops)
 * - Drop-in replacement for a <p> tag — preserves all parent styling
 *
 * Usage:
 *   <TextRevealOnScroll
 *     text="La obesidad es una enfermedad metabólica..."
 *     style={{ fontSize: '28px', lineHeight: 1.5 }}
 *   />
 */

type TextRevealProps = {
  text: string
  style?: CSSProperties
  className?: string
}

export default function TextRevealOnScroll({
  text,
  style,
  className,
}: TextRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    // Start animating when the top of element hits 80% of viewport, end at 30%
    offset: ['start 0.8', 'start 0.3'],
  })

  const words = text.split(' ')

  return (
    <p
      ref={ref}
      style={style}
      className={className}
    >
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        >
          {word}
        </Word>
      ))}
    </p>
  )
}

function Word({
  children,
  progress,
  range,
}: {
  children: React.ReactNode
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span
      style={{
        opacity,
        display: 'inline-block',
        marginRight: '0.25em',
      }}
    >
      {children}
    </motion.span>
  )
}
