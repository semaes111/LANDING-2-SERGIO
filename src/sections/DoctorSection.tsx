import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import NumberTicker from '../components/effects/NumberTicker'

gsap.registerPlugin(ScrollTrigger)

export default function DoctorSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.doctor-animate', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          once: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="equipo"
      ref={sectionRef}
      style={{
        backgroundColor: '#ffffff',
        padding: '140px clamp(20px, 4vw, 60px)',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
          gap: '80px',
          alignItems: 'flex-start',
        }}
      >
        {/* Left: image */}
        <div className="doctor-animate" style={{ position: 'relative' }}>
          <img
            src="/images/dr-sergio-martinez.jpg"
            alt="Dr. Sergio Martínez Escobar"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              padding: '40px 28px',
              background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.6))',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.85)',
                textTransform: 'uppercase',
              }}
            >
              Director Médico · Centro NextHorizont Health
            </p>
          </div>
        </div>

        {/* Right: content */}
        <div style={{ paddingTop: '12px' }}>
          <p
            className="doctor-animate"
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.24em',
              color: 'rgba(0,0,0,0.5)',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            Equipo médico
          </p>
          <h2
            className="doctor-animate"
            style={{
              fontSize: 'clamp(32px, 4.5vw, 56px)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#000000',
              marginBottom: '16px',
            }}
          >
            Dr. Sergio Martínez Escobar
          </h2>
          <p
            className="doctor-animate"
            style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: '#555555',
              marginBottom: '36px',
            }}
          >
            Especialista en Medicina Intensiva · Nº Colegiado 04/1809464 · Colegio de Médicos de Almería
          </p>

          <ul
            className="doctor-animate"
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '48px',
            }}
          >
            {[
              'Doctorado en Medicina (Suma Cum Laude)',
              'Especialista en Medicina Intensiva',
              'Postdoctorado en Arizona State University',
              'Postdoctorado en Georgia Institute of Technology',
              '50+ publicaciones internacionales indexadas',
              'Director de Centro NextHorizont Health (480 pacientes/mes)',
              'Ponente en congresos SEEDO y SEMICYUC',
            ].map((item) => (
              <li
                key={item}
                style={{
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: '#333333',
                  paddingLeft: '20px',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '10px',
                    width: '6px',
                    height: '1px',
                    backgroundColor: '#000000',
                  }}
                />
                {item}
              </li>
            ))}
          </ul>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '24px',
              padding: '32px 0',
              margin: '32px 0',
              borderTop: '1px solid #e5e5e5',
              borderBottom: '1px solid #e5e5e5',
              maxWidth: '560px',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <NumberTicker
                value={5000}
                prefix="+"
                style={{
                  fontSize: 'clamp(36px, 4vw, 48px)',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: '#000000',
                  display: 'block',
                }}
              />
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#666666',
                  marginTop: '8px',
                  margin: '8px 0 0',
                }}
              >
                Pacientes atendidos
              </p>
            </div>

            <div style={{ textAlign: 'left' }}>
              <NumberTicker
                value={50}
                suffix="+"
                style={{
                  fontSize: 'clamp(36px, 4vw, 48px)',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: '#000000',
                  display: 'block',
                }}
              />
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#666666',
                  marginTop: '8px',
                  margin: '8px 0 0',
                }}
              >
                Publicaciones indexadas
              </p>
            </div>

            <div style={{ textAlign: 'left' }}>
              <NumberTicker
                value={15}
                suffix="+"
                style={{
                  fontSize: 'clamp(36px, 4vw, 48px)',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: '#000000',
                  display: 'block',
                }}
              />
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#666666',
                  marginTop: '8px',
                  margin: '8px 0 0',
                }}
              >
                Años de experiencia
              </p>
            </div>
          </div>

          <blockquote
            className="doctor-animate"
            style={{
              borderLeft: '1px solid #000000',
              paddingLeft: '24px',
              fontSize: 'clamp(18px, 2vw, 24px)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.4,
              color: '#000000',
              maxWidth: '560px',
            }}
          >
            “La medicina metabólica del siglo XXI combina rigor clínico, tecnología responsable y trato humano. Esa es la única ecuación que respeta al paciente.”
            <footer
              style={{
                fontSize: '13px',
                fontStyle: 'normal',
                color: '#666666',
                marginTop: '16px',
              }}
            >
              — Dr. Sergio Martínez Escobar
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
