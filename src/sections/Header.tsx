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

/**
 * Each nav item declares ONE of three navigation modes:
 *   - target:  in-home anchor (e.g. '#works'). If user is NOT on home,
 *              we navigate to '/' first then scroll after a tick.
 *   - route:   React Router internal path (e.g. '/quienes-somos')
 *   - href:    fully-external URL (opened in same tab unless `external: true`)
 *
 * The 'Cursos' subdomain is intentionally listed even though it does not
 * exist yet — it's a known future product and pretending it doesn't exist
 * in mobile would surprise users. It opens in a new tab so visitors don't
 * lose the current centro.nexthorizont.com session if cursos isn't live yet.
 */
type NavItem =
  | { label: string; target: string }
  | { label: string; route: string }
  | { label: string; href: string; external?: boolean }

const navItems: NavItem[] = [
  { label: 'Programas',      target: '#works' },
  { label: 'Cómo funciona',  target: '#capabilities' },
  { label: 'Cursos',         href: 'https://cursos.nexthorizont.com', external: true },
  { label: 'Contacto',       target: '#footer' },
  { label: 'Sobre nosotros', route: '/quienes-somos' },
]

export default function Header({ scrollRef, forceLight = false }: HeaderProps) {
  const [isCompact, setIsCompact] = useState(false)
  const [overHeroRaw, setOverHeroRaw] = useState(true)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
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

  /**
   * Body scroll lock while mobile overlay is open.
   * Without this, the user can still scroll the page behind the overlay,
   * which feels broken (overlay slides relative to the page).
   * Restore the original overflow on cleanup so navigation away doesn't
   * leave the body permanently locked.
   */
  useEffect(() => {
    if (!mobileOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [mobileOpen])

  /**
   * Escape key closes the mobile overlay (a11y + usability convention).
   */
  useEffect(() => {
    if (!mobileOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

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

  /**
   * Unified handler that routes a NavItem to its correct destination based
   * on which discriminant key is set. Used by both the desktop nav and the
   * mobile overlay so the behavior is identical in both contexts.
   * Always closes the mobile overlay after firing — the user just chose a
   * destination, leaving the overlay open would feel broken.
   */
  const handleNavItemClick = (item: NavItem) => {
    setMobileOpen(false)
    if ('target' in item) {
      handleAnchorClick(item.target)
    } else if ('route' in item) {
      navigate(item.route)
    } else if ('href' in item) {
      if (item.external) {
        window.open(item.href, '_blank', 'noopener,noreferrer')
      } else {
        window.location.href = item.href
      }
    }
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
              onClick={() => handleNavItemClick(item)}
            />
          ))}
        </div>

        {/* Primary CTA — always visible, even on small screens */}
        <CtaButton
          overHero={overHero}
          onClick={() => navigate('/empezar')}
        />

        {/* Hamburger trigger — visible only on small screens (CSS controlled) */}
        <button
          className="header-hamburger"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-overlay"
          style={{
            display: 'none', // overridden by media query below
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            marginLeft: '8px',
            padding: 0,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: textColor,
            transition: 'color 0.25s ease',
          }}
        >
          {/* Three bars icon — pure SVG, no extra deps */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <line x1="3" y1="7" x2="21" y2="7" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="17" x2="21" y2="17" />
          </svg>
        </button>
      </nav>

      {/* ============= Mobile fullscreen overlay ============= */}
      {mobileOpen && (
        <MobileOverlay
          items={navItems}
          onItemClick={handleNavItemClick}
          onClose={() => setMobileOpen(false)}
          onCtaClick={() => {
            setMobileOpen(false)
            navigate('/empezar')
          }}
        />
      )}

      {/* Responsive rules:
          - <900px: hide desktop anchor items, show hamburger
          - >=900px: hide hamburger (default), show desktop items
          The CTA stays visible at all widths (per UX decision). */}
      <style>{`
        @media (max-width: 900px) {
          .header-nav-items { display: none !important; }
          .header-hamburger { display: inline-flex !important; }
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
  const [pressed, setPressed] = useState(false)

  // Filled solid color contrasted with the header background.
  // Over hero (transparent header) -> filled white CTA with black text.
  // Off hero (white header)        -> filled black CTA with white text.
  const filledBg = overHero ? '#ffffff' : '#000000'
  const filledFg = overHero ? '#000000' : '#ffffff'

  // On hover invert: become outline transparent with the original-side colors.
  const hoverFg = overHero ? '#ffffff' : '#000000'
  const hoverBorder = overHero ? '#ffffff' : '#000000'

  // Brand "medical sky" blue for the pulse + halo.
  // Chosen to harmonize with:
  //   - The Hero's procedural shader, whose dominant tone is cyan-blue
  //     (cos(len-0.05)*0.45+0.55 emits ~rgb(140,200,225))
  //   - The Spatial section's blue molecule visualization
  // Saturation is moderate (not electric blue) to feel "clinical light"
  // rather than "marketing accent".
  const pulseBlue = '#5BB9FF'
  // Pulse ring is slightly more transparent for a softer expanding wave.
  // The halo (box-shadow on the button) is denser to give the feeling that
  // the button itself is glowing.
  const haloIntensity = hovered ? 0.65 : 0.45
  const pulseAnimation = pressed ? 'none' : 'cta-pulse-ring 2.4s ease-out infinite'

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        marginLeft: '12px',
        alignItems: 'center',
      }}
    >
      {/* Inject keyframes once. Multiple instances of <style> with same content
          are deduplicated by the browser, so this is safe to render in each
          CtaButton render. We do this here (rather than a global stylesheet)
          to keep the animation co-located with the only consumer. */}
      <style>{`
        @keyframes cta-pulse-ring {
          0%   { transform: scale(1);   opacity: 0.7; }
          75%  { transform: scale(1.6); opacity: 0;   }
          100% { transform: scale(1.6); opacity: 0;   }
        }
        @keyframes cta-halo-breathe {
          0%, 100% { box-shadow: 0 0 0 0 rgba(91,185,255,0.0), 0 0 14px 2px rgba(91,185,255,0.45); }
          50%      { box-shadow: 0 0 0 0 rgba(91,185,255,0.0), 0 0 22px 5px rgba(91,185,255,0.65); }
        }
        @keyframes cta-halo-breathe-strong {
          0%, 100% { box-shadow: 0 0 0 0 rgba(91,185,255,0.0), 0 0 22px 5px rgba(91,185,255,0.65); }
          50%      { box-shadow: 0 0 0 0 rgba(91,185,255,0.0), 0 0 32px 9px rgba(91,185,255,0.85); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-pulse-ring,
          .cta-halo-button { animation: none !important; box-shadow: 0 0 14px 2px rgba(91,185,255,0.45) !important; }
        }
      `}</style>

      {/* Expanding pulse ring — pure CSS, position: absolute, behind the button */}
      <span
        className="cta-pulse-ring"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '4px',
          border: `1.5px solid ${pulseBlue}`,
          pointerEvents: 'none',
          opacity: 0,
          animation: pulseAnimation,
          transformOrigin: 'center',
          willChange: 'transform, opacity',
        }}
      />

      <button
        className="cta-halo-button"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onClick={onClick}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
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
          // Halo: animated box-shadow breathing in the brand blue.
          // We use the exported keyframe both for idle and hover (different
          // intensity range), so the transition is smooth.
          animation: hovered
            ? 'cta-halo-breathe-strong 2.4s ease-in-out infinite'
            : 'cta-halo-breathe 2.4s ease-in-out infinite',
          // Inline fallback for the very first frame before keyframes kick in
          boxShadow: `0 0 14px 2px rgba(91,185,255,${haloIntensity})`,
          willChange: 'box-shadow',
        }}
      >
        <span>Evaluación gratis</span>
        <span aria-hidden="true">→</span>
      </button>
    </span>
  )
}

// ====================================================================
// MobileOverlay — Fullscreen menu on small screens
// ====================================================================

/**
 * Fullscreen overlay menu shown on screens <900px when the user taps the
 * hamburger button. Renders a list of nav items + the primary CTA in a
 * vertically-stacked layout that's easy to tap with a thumb.
 *
 * Implementation choices:
 *   - position: fixed + inset: 0 — covers entire viewport
 *   - z-index: 100 — above everything including the cookie banner (z:50)
 *     and the floating WhatsApp button (z:40)
 *   - Backdrop tap closes the overlay (forgiving UX)
 *   - Slide-in animation from right (200ms) — feels polished without
 *     blocking interaction
 *   - Pulse + halo animations on the CTA inside the overlay are intentionally
 *     dropped — overlay is already dark and inviting, more visual noise
 *     would dilute the focus on choosing a destination
 */
function MobileOverlay({
  items,
  onItemClick,
  onClose,
  onCtaClick,
}: {
  items: NavItem[]
  onItemClick: (item: NavItem) => void
  onClose: () => void
  onCtaClick: () => void
}) {
  return (
    <>
      <style>{`
        @keyframes mobile-overlay-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes mobile-overlay-slide-in {
          from { transform: translateY(-12px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>

      <div
        id="mobile-nav-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 24px 40px',
          animation: 'mobile-overlay-fade-in 0.2s ease-out',
          willChange: 'opacity',
        }}
      >
        {/* Top row: brand + close button */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '48px',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.18em',
              fontFamily: '"Helvetica Neue", sans-serif',
              color: '#ffffff',
            }}
          >
            NEXTHORIZONT
          </span>
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            style={{
              width: '44px',
              height: '44px',
              padding: 0,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav items list — large tap targets, vertical stack */}
        <nav
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            flex: 1,
            animation: 'mobile-overlay-slide-in 0.25s ease-out 0.05s both',
          }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => onItemClick(item)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                padding: '20px 4px',
                fontSize: '24px',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                color: '#ffffff',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                width: '100%',
              }}
            >
              <span>{item.label}</span>
              <span aria-hidden="true" style={{ opacity: 0.4, fontSize: '20px' }}>→</span>
            </button>
          ))}
        </nav>

        {/* Bottom CTA — same Evaluación gratis but full-width inside the overlay */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            marginTop: '32px',
          }}
        >
          <button
            onClick={onCtaClick}
            style={{
              width: '100%',
              padding: '20px 24px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.16em',
              color: '#0a0a0a',
              backgroundColor: '#ffffff',
              border: '1px solid #ffffff',
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontFamily: '"Helvetica Neue", sans-serif',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: '0 0 18px 3px rgba(91,185,255,0.5)',
            }}
          >
            <span>Evaluación gratis</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </>
  )
}
