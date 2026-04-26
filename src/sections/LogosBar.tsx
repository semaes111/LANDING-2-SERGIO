import { useEffect, useRef } from 'react'

const logos = [
  'NEJM',
  'The Lancet',
  'JAMA',
  'BMJ',
  'Nature Medicine',
  'SEEDO',
  'AEMPS',
  'ESC Guidelines 2024',
]

export default function LogosBar() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let x = 0
    let raf: number
    const speed = 0.4

    const animate = () => {
      x -= speed
      const first = track.children[0] as HTMLElement | undefined
      if (first) {
        const w = first.offsetWidth + 80 // gap
        if (Math.abs(x) >= w) {
          x += w
          track.appendChild(first)
        }
      }
      track.style.transform = `translateX(${x}px)`
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #000000',
        borderBottom: '1px solid #000000',
        padding: '28px 0',
        overflow: 'hidden',
      }}
    >
      <p
        style={{
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.24em',
          color: 'rgba(0,0,0,0.45)',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        Basado en evidencia de
      </p>
      <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div
          ref={trackRef}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '80px',
            willChange: 'transform',
          }}
        >
          {[...logos, ...logos].map((name, i) => (
            <span
              key={`${name}-${i}`}
              style={{
                fontSize: 'clamp(14px, 2vw, 20px)',
                fontWeight: 400,
                letterSpacing: '0.06em',
                color: '#000000',
                opacity: 0.5,
                whiteSpace: 'nowrap',
                transition: 'opacity 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.opacity = '0.5'
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
