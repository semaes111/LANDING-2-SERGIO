import { useEffect, useState } from 'react'

/**
 * Floating WhatsApp button that opens a chat with the clinic in a new tab.
 *
 * Design decisions (matching project conventions):
 * - No external dependencies (SVG inlined, no react-icons or similar)
 * - Inline styles (consistent with existing sections like Hero, Pricing, etc.)
 * - Inline tooltip pulse hint to draw attention without intrusiveness
 * - Smooth fade-in after scroll > 200px so it doesn't compete with hero
 * - Accessible: aria-label, target=_blank with rel=noopener noreferrer
 *
 * To customize: edit WHATSAPP_NUMBER and PREFILLED_MESSAGE constants below.
 */

// E.164 format without spaces — Evolution API instance 'alma'
const WHATSAPP_NUMBER = '34640056272'
const PREFILLED_MESSAGE = 'Hola, me interesa el programa de Centro NextHorizont Health. ¿Pueden darme más información?'

export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    // Show after the user has scrolled past the initial hero
    const onScroll = () => {
      setVisible(window.scrollY > 200)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILLED_MESSAGE)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp con Centro NextHorizont Health"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        bottom: 'clamp(16px, 4vw, 28px)',
        right: 'clamp(16px, 4vw, 28px)',
        zIndex: 9999,
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: hovered
          ? '0 12px 32px rgba(37, 211, 102, 0.45), 0 4px 12px rgba(0,0,0,0.18)'
          : '0 6px 18px rgba(37, 211, 102, 0.32), 0 2px 6px rgba(0,0,0,0.12)',
        transform: visible ? (hovered ? 'scale(1.08)' : 'scale(1)') : 'scale(0)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease, box-shadow 0.25s ease',
        textDecoration: 'none',
        cursor: 'pointer',
      }}
    >
      {/* Tooltip on hover (desktop only via media query in inline style fallback) */}
      <span
        style={{
          position: 'absolute',
          right: 'calc(100% + 12px)',
          top: '50%',
          transform: hovered ? 'translateY(-50%) translateX(0)' : 'translateY(-50%) translateX(8px)',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.02em',
          padding: '8px 14px',
          borderRadius: '6px',
          whiteSpace: 'nowrap',
          opacity: hovered ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          fontFamily: '"Helvetica Neue", sans-serif',
        }}
      >
        Pregúntanos por WhatsApp
      </span>

      {/* Pulse ring (subtle attention grabber) */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          backgroundColor: '#25D366',
          opacity: 0.6,
          animation: 'wa-pulse 2.4s ease-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Official WhatsApp glyph (simplified, single path) */}
      <svg
        viewBox="0 0 32 32"
        width="30"
        height="30"
        fill="#ffffff"
        aria-hidden="true"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <path d="M16.003 3C9.376 3 3.997 8.376 3.997 14.998c0 2.39.69 4.65 1.886 6.567L4 29l7.62-1.852A12.94 12.94 0 0016.003 27C22.624 27 28 21.622 28 14.999 28 8.376 22.624 3 16.003 3zm6.964 17.137c-.295.83-1.736 1.59-2.408 1.69-.62.094-1.394.133-2.247-.142-.518-.165-1.18-.385-2.03-.752-3.572-1.547-5.91-5.155-6.087-5.39-.176-.236-1.45-1.928-1.45-3.677 0-1.748.916-2.61 1.243-2.965.32-.354.7-.443.93-.443l.673.012c.215.01.502-.082.785.6.295.708 1 2.456 1.087 2.633.088.177.146.385.03.62-.117.236-.176.385-.354.591-.176.207-.37.461-.527.62-.176.177-.36.369-.155.723.205.354.91 1.503 1.957 2.435 1.343 1.197 2.475 1.566 2.83 1.743.354.176.56.146.766-.088.207-.236.886-1.034 1.122-1.39.236-.354.471-.295.795-.176.323.118 2.06.972 2.413 1.149.354.176.59.265.677.413.087.147.087.853-.207 1.683z" />
      </svg>

      {/* Pulse keyframes injected once (scoped, idempotent) */}
      <style>{`
        @keyframes wa-pulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          70%  { transform: scale(1.6); opacity: 0;   }
          100% { transform: scale(1.6); opacity: 0;   }
        }
        @media (max-width: 768px) {
          a[aria-label="Contactar por WhatsApp con Centro NextHorizont Health"] {
            bottom: calc(96px + env(safe-area-inset-bottom, 0px)) !important;
          }
        }
        @media (max-width: 640px) {
          a[aria-label="Contactar por WhatsApp con Centro NextHorizont Health"] span:first-child {
            display: none;
          }
        }
      `}</style>
    </a>
  )
}
