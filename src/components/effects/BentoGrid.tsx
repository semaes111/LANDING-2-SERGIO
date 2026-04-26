import { motion, useInView } from 'motion/react'
import { useRef, type CSSProperties, type ReactNode } from 'react'

/**
 * Bento Grid — asymmetric grid layout inspired by iOS 17 / iPadOS widgets.
 *
 * Design choices for medical/sober brand:
 * - 4-column desktop grid with cards spanning 1, 2, or 3 columns
 * - 2-column tablet grid (medium screens)
 * - Single column on mobile (auto-stack, no horizontal scroll)
 * - Cards fade up on scroll-in with stagger (motion's useInView, triggers once)
 * - No gradients on card backgrounds — solid colors with subtle border
 * - Hover: subtle border color shift + 0.5% scale (very gentle, medical-grade)
 *
 * Architecture:
 * - <BentoGrid> is the container (handles grid layout + responsiveness)
 * - <BentoCard> is each cell (handles colspan/rowspan, hover, content)
 * - Children are arbitrary React nodes — full flexibility for icons, images,
 *   stats, etc.
 *
 * Usage:
 *   <BentoGrid>
 *     <BentoCard colSpan={2} rowSpan={2}>
 *       <h3>Big card</h3>
 *     </BentoCard>
 *     <BentoCard><h3>Small card</h3></BentoCard>
 *   </BentoGrid>
 */

type BentoGridProps = {
  children: ReactNode
  style?: CSSProperties
  className?: string
}

export function BentoGrid({ children, style, className }: BentoGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridAutoRows: 'minmax(180px, auto)',
        gap: '16px',
        width: '100%',
        ...style,
      }}
      className={className}
      data-bento-grid
    >
      {children}
    </div>
  )
}

type BentoCardProps = {
  children: ReactNode
  /** Columns to span on desktop. Default 1, max 4 */
  colSpan?: 1 | 2 | 3 | 4
  /** Rows to span on desktop. Default 1 */
  rowSpan?: 1 | 2 | 3
  /** Stagger index for entrance animation. Default 0 */
  index?: number
  /** Background color override. Default subtle dark glass */
  background?: string
  /** Border color override */
  borderColor?: string
  /** Inline styles passed to the card wrapper */
  style?: CSSProperties
  className?: string
}

export function BentoCard({
  children,
  colSpan = 1,
  rowSpan = 1,
  index = 0,
  background = 'rgba(20, 20, 20, 0.85)',
  borderColor = 'rgba(255, 255, 255, 0.12)',
  style,
  className,
}: BentoCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.08,
      }}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        backgroundColor: background,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: `1px solid ${borderColor}`,
        borderRadius: '20px',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s ease, transform 0.3s ease',
        cursor: 'default',
        ...style,
      }}
      className={className}
      whileHover={{
        scale: 1.005,
        transition: { duration: 0.2 },
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.25)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = borderColor
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Responsive grid override for smaller screens.
 * Inject this CSS once (any component does it via useEffect or as a global rule).
 * We export a string so the integrator can append it to the Capabilities section style block.
 */
export const BENTO_RESPONSIVE_CSS = `
  @media (max-width: 1024px) {
    [data-bento-grid] {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    [data-bento-grid] > * {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }
  }
  @media (max-width: 600px) {
    [data-bento-grid] {
      grid-template-columns: 1fr !important;
      gap: 12px !important;
    }
  }
`
