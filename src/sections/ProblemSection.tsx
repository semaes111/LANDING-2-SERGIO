import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: '70%', label: 'españoles con exceso de peso' },
  { value: '95%', label: 'fracaso de dietas convencionales a 5 años' },
  { value: '-15%', label: 'pérdida media con GLP-1 + seguimiento médico' },
]

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          once: true,
        },
      })
      gsap.from(statsRef.current?.children || [], {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          once: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="problem"
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 540px), 1fr))',
          gap: '80px',
          alignItems: 'center',
        }}
      >
        {/* Left: text */}
        <div ref={textRef}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.24em',
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            La realidad médica
          </p>
          <h2
            style={{
              fontSize: 'clamp(32px, 4.5vw, 56px)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#ffffff',
              marginBottom: '36px',
            }}
          >
            La obesidad es una enfermedad metabólica crónica, no un fallo de carácter.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '520px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.78)' }}>
              El 70% de adultos en España tienen sobrepeso u obesidad, según datos de AESAN. No es un problema de voluntad: es un desajuste metabólico complejo.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.78)' }}>
              Las hormonas de hambre (grelina) y saciedad (leptina), junto con la resistencia a la insulina, hacen que el organismo luche contra la pérdida de peso.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.78)' }}>
              Las dietas convencionales fracasan en el 95% de los casos a 5 años porque no abordan la fisiología subyacente. Nuestro enfoque sí lo hace.
            </p>
          </div>
        </div>

        {/* Right: stats */}
        <div
          ref={statsRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.value}
              style={{
                borderLeft: '1px solid rgba(255,255,255,0.25)',
                paddingLeft: '28px',
              }}
            >
              <p
                style={{
                  fontSize: 'clamp(48px, 6vw, 72px)',
                  fontWeight: 400,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  color: '#ffffff',
                  marginBottom: '10px',
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontSize: '14px',
                  lineHeight: 1.5,
                  color: 'rgba(255,255,255,0.65)',
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
