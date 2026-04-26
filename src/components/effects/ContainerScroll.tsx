import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef, type CSSProperties, type ReactNode } from 'react'

/**
 * Container Scroll — Apple-style "card lifts from background" scroll-driven effect.
 *
 * Design choices for medical/sober brand:
 * - As the user scrolls, the wrapped child rotates from 10° rotateX to 0°
 *   AND scales from 0.85 to 1, creating depth perception
 * - The header text shrinks slightly as the visual gets bigger — natural
 *   attention shift from text to content
 * - Triggers when section enters viewport, peaks when section is centered
 * - Uses motion's useScroll + useTransform for native 60fps scroll-linked
 *   animation (no JS frame loops, all GPU-accelerated transforms)
 * - On mobile (<768px): minimal effect (no rotateX, slight scale only)
 *
 * Usage:
 *   <ContainerScroll header={<h2>...</h2>}>
 *     <video src="..." autoPlay loop muted />
 *   </ContainerScroll>
 *
 * Don't add transforms to direct children — motion's transform owns them.
 */

type ContainerScrollProps = {
  children: ReactNode
  /** Optional header content rendered above the scaling visual */
  header?: ReactNode
  /** Inline styles passed to the outer section */
  style?: CSSProperties
  className?: string
  /** Background color of the outer section. Default '#0b0b0b' */
  backgroundColor?: string
}

export default function ContainerScroll({
  children,
  header,
  style,
  className,
  backgroundColor = '#0b0b0b',
}: ContainerScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    isMobile ? [0, 0, 0] : [10, 0, 0]
  )
  const scale = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    isMobile ? [0.95, 1, 1] : [0.85, 1, 1]
  )
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 1, 1])
  const headerY = useTransform(scrollYProgress, [0, 0.4], [40, 0])

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        backgroundColor,
        padding: 'clamp(80px, 10vw, 140px) clamp(20px, 4vw, 60px)',
        perspective: '1000px',
        ...style,
      }}
      className={className}
    >
      {header && (
        <Header opacity={headerOpacity} y={headerY}>
          {header}
        </Header>
      )}
      <motion.div
        style={{
          rotateX,
          scale,
          transformStyle: 'preserve-3d',
          transformOrigin: 'top center',
          willChange: 'transform',
          maxWidth: '1400px',
          margin: '0 auto',
          marginTop: header ? 'clamp(40px, 5vw, 80px)' : 0,
        }}
      >
        {children}
      </motion.div>
    </section>
  )
}

function Header({
  children,
  opacity,
  y,
}: {
  children: ReactNode
  opacity: MotionValue<number>
  y: MotionValue<number>
}) {
  return (
    <motion.div
      style={{
        opacity,
        y,
        textAlign: 'center',
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {children}
    </motion.div>
  )
}
