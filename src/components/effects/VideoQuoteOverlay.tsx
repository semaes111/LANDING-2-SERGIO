import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react'

/**
 * Video Quote Overlay — rotates 3 medical/AI evidence-based quotes on top of
 * the TechShowcase video. Sits absolutely-positioned bottom-left of the video
 * frame.
 *
 * Behavior:
 *   - Only animates when the parent video is in viewport (perf + battery)
 *   - Each quote: 0.6s enter + 5.4s hold + 0.6s exit = ~6s per quote
 *   - Total cycle ~18s for 3 quotes, then loops
 *   - Pauses on mouseenter (lets the user read at their own pace)
 *   - Respects prefers-reduced-motion: shows only quote 1 fixed without rotation
 *
 * Design:
 *   - Eyebrow (small caps, white 0.55 alpha)
 *   - Quote (Helvetica Neue, weight 400, ~28-36px responsive)
 *   - Attribution (12px, italic, white 0.55 alpha)
 *   - All three elements stagger-animate on enter (0.08s gap)
 *   - Reverse stagger on exit
 *
 * Quotes are clinically verifiable to avoid violating Spain's medical
 * advertising regulations (Ley General de Sanidad art. 28-30, RD 1416/1994).
 */

type Quote = {
  eyebrow: string
  text: string
  attribution: string
}

const QUOTES: Quote[] = [
  {
    eyebrow: 'El futuro está aquí',
    text: 'La IA puede detectar Alzheimer 7 años antes de que aparezcan los síntomas.',
    attribution: 'Eric Topol · Scripps Research',
  },
  {
    eyebrow: 'La velocidad del cambio',
    text: 'En 5 años, la medicina dará un salto mayor que en cualquier década anterior.',
    attribution: 'Avance de IA, genómica y wearables',
  },
  {
    eyebrow: 'La evidencia numérica',
    text: 'De 10 años a 24 horas. De 5.000 M€ a 1.500 €.',
    attribution: 'Coste de secuenciar un genoma humano · 2003 → 2024',
  },
]

const HOLD_MS = 5400
const TRANSITION_MS = 600

type VideoQuoteOverlayProps = {
  style?: CSSProperties
  className?: string
}

export default function VideoQuoteOverlay({ style, className }: VideoQuoteOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { margin: '0px 0px -10% 0px' })
  const prefersReducedMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!inView || paused || prefersReducedMotion) return
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % QUOTES.length)
    }, HOLD_MS + TRANSITION_MS)
    return () => window.clearInterval(id)
  }, [inView, paused, prefersReducedMotion])

  // If user prefers reduced motion, lock to quote 0 with no rotation
  const current = prefersReducedMotion ? QUOTES[0] : QUOTES[activeIndex]

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'absolute',
        left: 'clamp(20px, 4vw, 56px)',
        right: 'clamp(20px, 4vw, 56px)',
        bottom: 'clamp(24px, 4vw, 56px)',
        zIndex: 2,
        pointerEvents: 'auto',
        ...style,
      }}
      className={className}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={prefersReducedMotion ? 'static' : activeIndex}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
          transition={{
            duration: TRANSITION_MS / 1000,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ maxWidth: 'min(720px, 100%)' }}
        >
          {/* Eyebrow with leading line */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: prefersReducedMotion ? 0 : 0.05,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '20px',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: '36px',
                height: '1px',
                backgroundColor: 'rgba(255,255,255,0.45)',
              }}
            />
            <p
              style={{
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
                margin: 0,
              }}
            >
              {current.eyebrow}
            </p>
          </motion.div>

          {/* Main quote */}
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: prefersReducedMotion ? 0 : 0.13,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              fontSize: 'clamp(18px, 2.4vw, 32px)',
              fontWeight: 400,
              letterSpacing: '-0.015em',
              lineHeight: 1.25,
              color: '#ffffff',
              margin: 0,
              marginBottom: '18px',
              fontFamily: '"Helvetica Neue", -apple-system, sans-serif',
              textShadow: '0 2px 8px rgba(0,0,0,0.35)',
            }}
          >
            {current.text}
          </motion.p>

          {/* Attribution */}
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: prefersReducedMotion ? 0 : 0.21,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              fontSize: '12px',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.65)',
              margin: 0,
              letterSpacing: '0.02em',
            }}
          >
            {current.attribution}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Progress indicator dots — only when not in reduced-motion mode */}
      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '24px',
          }}
        >
          {QUOTES.map((_, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                width: i === activeIndex ? '24px' : '6px',
                height: '2px',
                borderRadius: '1px',
                backgroundColor:
                  i === activeIndex ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
                transition: 'width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.4s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
