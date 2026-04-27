import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

interface HeaderProps {
  scrollRef: React.MutableRefObject<{ y: number; speed: number }>
  forceLight?: boolean
}

const navItems = ['Rooms', 'Experiences', 'Contact']
const sectionIds = ['#works', '#capabilities', '#footer']

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

      // Floating Navbar behavior: hide on scroll down (after threshold),
      // show on scroll up. Threshold of 200px prevents hiding right at the top.
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

  const handleNavClick = (index: number) => {
    // If we're not on home, first navigate there (so the section IDs exist),
    // then trigger scroll. If we're already on home, just smooth-scroll.
    if (window.location.pathname !== '/') {
      navigate('/')
      // Wait one tick for home to mount, then scroll
      setTimeout(() => {
        const target = document.querySelector(sectionIds[index])
        if (target) target.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      return
    }
    const target = document.querySelector(sectionIds[index])
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
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
        padding: '0 clamp(20px, 4vw, 60px)',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition:
          'height 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s ease, border-color 0.4s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          fontSize: '18px',
          fontWeight: 500,
          letterSpacing: '0.22em',
          cursor: 'pointer',
          color: textColor,
          transition: 'color 0.4s ease',
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        NEXTHORIZONT
      </div>

      <nav style={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
        {navItems.map((item, i) => (
          <NavItem
            key={item}
            label={item}
            overHero={overHero}
            onClick={() => handleNavClick(i)}
          />
        ))}
        <NavItem
          label="Sobre nosotros"
          overHero={overHero}
          onClick={() => navigate('/quienes-somos')}
        />
      </nav>
    </header>
  )
}

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
        padding: '0 24px',
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
