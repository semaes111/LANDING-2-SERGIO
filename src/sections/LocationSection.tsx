import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function LocationSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      gsap.from('.loc-animate', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 70%', once: true },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="ubicacion"
      ref={sectionRef}
      style={{
        backgroundColor: '#0b0b0b',
        padding: '120px clamp(20px, 4vw, 60px)',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
          gap: '60px',
          alignItems: 'start',
        }}
      >
        {/* Left: map placeholder with iframe embed */}
        <div className="loc-animate">
          <div
            style={{
              width: '100%',
              aspectRatio: '16/10',
              backgroundColor: '#1a1a1a',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <iframe
              title="Centro NextHorizont Health"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3202.0!2d-2.8142!3d36.7793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQ2JzQ1LjUiTiAywrA0OCc1MS4xIlc!5e0!3m2!1ses!2ses!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Right: info */}
        <div>
          <p
            className="loc-animate"
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.24em',
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            Ubicación y contacto
          </p>
          <h2
            className="loc-animate"
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#ffffff',
              marginBottom: '32px',
            }}
          >
            Centro NextHorizont Health · Consulta Dr. Martínez Escobar
          </h2>

          <div className="loc-animate" style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.78)', marginBottom: '8px' }}>
              C/ Bulevar de El Ejido 231, Portal I, 3B
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.78)' }}>
              04700 El Ejido (Almería) · España
            </p>
          </div>

          <div className="loc-animate" style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Horario
            </p>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)' }}>
              Lunes a viernes 09:00 – 14:00 y 16:30 – 20:30
              <br />
              Sábados 09:00 – 14:00 (telemedicina)
            </p>
          </div>

          <div className="loc-animate" style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Contacto directo
            </p>
            <p style={{ fontSize: '14px', lineHeight: 2, color: 'rgba(255,255,255,0.75)' }}>
              ✉️ hola@nexthorizont.com
              <br />
              💬 WhatsApp Business
              <br />
              📞 Teléfono disponible en consulta
            </p>
          </div>

          <div className="loc-animate" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href="https://maps.google.com/?q=Calle+Bulevar+de+El+Ejido+231,+04700+El+Ejido,+Almería"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.14em',
                color: '#ffffff',
                border: '1px solid #ffffff',
                padding: '14px 28px',
                textTransform: 'uppercase',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Cómo llegar
            </a>
            <button
              onClick={() => document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.14em',
                color: '#0b0b0b',
                backgroundColor: '#ffffff',
                border: '1px solid #ffffff',
                padding: '14px 28px',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              Reservar online
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
