import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

/**
 * Mobile Sticky CTA — fixed bottom bar with a single high-conversion CTA.
 *
 * Design choices for medical/sober brand:
 * - Visible ONLY on viewport width ≤ 768px (mobile + small tablet)
 * - Appears after scrollY > 200px so it doesn't compete with the hero
 * - Slides up from below with cubic-bezier(0.34, 1.56, 0.64, 1) overshoot
 *   when entering, slides back down smoothly on early scroll
 * - Black solid background — high contrast, no gradient (consistent with
 *   the medical/sober palette of the rest of the site)
 * - Respects safe-area-inset-bottom for iPhone notch / home indicator
 * - Click action: navigates to /empezar (rich registration page that
 *   leads into the clinical questionnaire). Previously this CTA pointed
 *   at #calculadora (BMI calculator) but after HITO 1 the entry point
 *   for the new patient funnel is /empezar.
 *
 * Why this exists:
 * - Desktop has the Header with always-visible 'Empezar evaluación' CTA
 * - Mobile collapses the menu, so without this sticky bar a user 30+
 *   scrolls deep would have no quick way to convert
 *
 * Coexistence with WhatsAppFloat:
 * - WhatsApp button is bottom-right corner (60×60)
 * - This sticky bar spans full width
 * - WhatsAppFloat's bottom offset is increased on mobile to clear this bar
 *   (see WhatsAppFloat.tsx — handles its own mobile offset)
 */

const SHOW_AFTER_SCROLL = 200

export default function MobileStickyCTA() {
  const [visible, setVisible] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check viewport size — only render on mobile
    const checkMobile = () => {
      setIsMobileViewport(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Show/hide on scroll
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_SCROLL)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Don't render at all on desktop — saves DOM weight
  if (!isMobileViewport) return null

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate('/empezar')
  }

  return (
    <div
      role="region"
      aria-label="Empezar evaluación"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9998,
        backgroundColor: '#000000',
        padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 4vw, 20px) calc(clamp(12px, 2.5vw, 16px) + env(safe-area-inset-bottom, 0px))',
        borderTop: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.18)',
        transform: visible ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <a
        href="/empezar"
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '14px 22px',
          backgroundColor: '#ffffff',
          color: '#000000',
          textDecoration: 'none',
          borderRadius: '999px',
          fontSize: '15px',
          fontWeight: 500,
          letterSpacing: '0.02em',
          fontFamily: '"Helvetica Neue", sans-serif',
          minHeight: '52px',
          boxSizing: 'border-box',
        }}
      >
        <span>Empezar evaluación gratis</span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#666666',
          }}
        >
          <span>5 min</span>
          <span style={{ fontSize: '18px', color: '#000000' }}>→</span>
        </span>
      </a>
    </div>
  )
}
