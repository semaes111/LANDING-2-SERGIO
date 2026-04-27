import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

interface HeaderProps {
  scrollRef: React.MutableRefObject<{ y: number; speed: number }>
  forceLight?: boolean
}

/**
 * Header — Centro NextHorizont Health top navigation.
 *
 * Layout:
 *   [Logo]        [Programas | Cómo funciona | Contacto | Sobre nosotros | EMPEZAR EVALUACIÓN]
 *
 * Behaviors:
 *   - Floating navbar: hides on scroll-down, reappears on scroll-up
 *     (after a 200px threshold from top to avoid hiding at page-load)
 *   - Compact mode: shrinks from 88px to 64px after scrolling >100px
 *   - Over-hero mode: while user is on the dark hero (first 85vh of home),
 *     header is transparent with white text. Otherwise, white bg + black text
 *   - forceLight prop: forces non-hero mode (used on /quienes-somos, /empezar
 *     and other inner pages where the page itself manages the dark hero)
 *   - Primary CTA on the right: navigates to /empezar regardless of context
 *
 * Item routing:
 *   Programas      -> #works            (Programs grid section on home)
 *   Cómo funciona  -> #capabilities      (Capabilities/Bento section on home)
 *   Contacto       -> #footer            (Footer with location + WhatsApp)
 *   Sobre nosotros -> /quienes-somos     (Dedicated page)
 *
 * If user clicks an in-home anchor while NOT on home (e.g. they're on
 * /quienes-somos), navigate('/') first, then scroll to the anchor after
 * a 100ms tick to allow React to mount the home content.
 */

const navItems = [
  { label: 'Programas', target: '#works' },
  { label: 'Cómo funciona', target: '#capabilities' },
  { label: 'Contacto', target: '#footer' },
] as const

export default function Header({ scrollRef, forceLight = false }: HeaderProps) {
  const [isCompact, setIsCompact] = useState(false)
  const [overHeroRaw, setOverHeroRaw] = useState(true)
  const [hidden, setHidden] = useState(false)
  const rafRef = useRef<number>(0)
  const lastYRef = useRef<number>(0)

  useEffect(() => {
    const check = () => {
      const y = scrollRef.current.y
      setIsCompact(y > 100)
      setOverHeroRaw(y < window.innerHeight * 0.85)

      // Floating Navbar: hide on scroll down (after threshold), show on scroll up.
      const lastY = lastYRef.current
      const delta = y - lastY
      if (Math.abs(delta) > 4) {
        if (y > 200 && delta > 0) {
          setHidden(true)
        } else if (delta < 0) {
          setHidden(false)
        }
        lastYRef.current = y
      }

      rafRef.current = requestAnimationFrame(check)
    }
    rafRef.current = requestAnimationFrame(check)
    return () => cancelAnimationFrame(rafRef.current)
  }, [scrollRef])

  const overHero = overHeroRaw && !forceLight
  const navigate = useNavigate()

  const handleAnchorClick = (target: string) => {
    if (window.location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const el = document.querySelector(target)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      return
    }
    const el = document.querySelector(target)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const textColor = overHero ? '#ffffff' : '#000000'

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: isCompact ? '64px' : '88px',
        backgroundColor: overHero ? 'transparent' : '#ffffff',
        borderBottom: overHero
          ? '1px solid rgba(255,255,255,0.18)'
          : '1px solid #000000',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(16px, 4vw, 60px)',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition:
          'height 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s ease, border-color 0.4s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          fontSize: 'clamp(14px, 1.4vw, 18px)',
          fontWeight: 500,
          letterSpacing: '0.22em',
          cursor: 'pointer',
          color: textColor,
          transition: 'color 0.4s ease',
          whiteSpace: 'nowrap',
        }}
        onClick={() => {
          if (window.location.pathname !== '/') {
            navigate('/')
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }}
      >
        NEXTHORIZONT
      </div>

      <nav
        style={{
          display: 'flex',
          alignItems: 'stretch',
          height: '100%',
        }}
      >
        {/* Anchor items (hidden on small screens via the CSS rule below) */}
        <div className="header-nav-items" style={{ display: 'flex', height: '100%' }}>
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              label={item.label}
              overHero={overHero}
              onClick={() => handleAnchorClick(item.target)}
            />
          ))}
          <NavItem
            label="Sobre nosotros"
            overHero={overHero}
            onClick={() => navigate('/quienes-somos')}
          />
        </div>

        {/* Primary CTA — always visible, even on small screens */}
        <CtaButton
          overHero={overHero}
          onClick={() => navigate('/empezar')}
        />
      </nav>

      {/* Responsive: collapse anchor items below 900px, keep CTA visible */}
      <style>{`
        @media (max-width: 900px) {
          .header-nav-items { display: none !important; }
        }
      `}</style>
    </header>
  )
}

// ---------------------- Components ----------------------

function NavItem({
  label,
  overHero,
  onClick,
}: {
  label: string
  overHero: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  const baseColor = overHero ? '#ffffff' : '#000000'
  const hoverBg = overHero ? '#ffffff' : '#000000'
  const hoverFg = overHero ? '#000000' : '#ffffff'

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px',
        fontSize: '13px',
        fontWeight: 400,
        letterSpacing: '0.08em',
        backgroundColor: hovered ? hoverBg : 'transparent',
        color: hovered ? hoverFg : baseColor,
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.25s ease, color 0.25s ease',
        whiteSpace: 'nowrap',
        fontFamily: '"Helvetica Neue", sans-serif',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </button>
  )
}

function CtaButton({
  overHero,
  onClick,
}: {
  overHero: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  // Filled solid color contrasted with the header background.
  // Over hero (transparent header) -> filled white CTA with black text.
  // Off hero (white header)        -> filled black CTA with white text.
  const filledBg = overHero ? '#ffffff' : '#000000'
  const filledFg = overHero ? '#000000' : '#ffffff'

  // On hover invert: become outline transparent with the original-side colors.
  const hoverFg = overHero ? '#ffffff' : '#000000'
  const hoverBorder = overHero ? '#ffffff' : '#000000'

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginLeft: '12px',
        padding: '10px 20px',
        alignSelf: 'center',
        fontSize: '12px',
        fontWeight: 500,
        letterSpacing: '0.14em',
        backgroundColor: hovered ? 'transparent' : filledBg,
        color: hovered ? hoverFg : filledFg,
        border: `1px solid ${hovered ? hoverBorder : filledBg}`,
        cursor: 'pointer',
        transition:
          'background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease',
        whiteSpace: 'nowrap',
        fontFamily: '"Helvetica Neue", sans-serif',
        textTransform: 'uppercase',
      }}
    >
      <span>Empezar evaluación</span>
      <span aria-hidden="true">→</span>
    </button>
  )
}
