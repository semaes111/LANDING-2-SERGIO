import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const capabilities = [
  {
    title: 'Pre-consulta inteligente',
    desc: 'Anamnesis asistida que prepara tu visita y ahorra 20 min al médico.',
  },
  {
    title: 'Recordatorios y adherencia',
    desc: 'Plan de dosis sincronizado · alertas de efectos secundarios.',
  },
  {
    title: 'Educación personalizada',
    desc: 'Contenido nutricional y ejercicio adaptado a tu cohorte clínica.',
  },
  {
    title: 'Análisis de progreso',
    desc: 'Dashboards con tendencias de peso, composición corporal, biomarcadores.',
  },
]

export default function TechnologySection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.tech-animate', {
        y: 40,
        opacity: 0,
        duration: 0.8,
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
      id="tecnologia"
      ref={sectionRef}
      style={{
        backgroundColor: '#0b0b0b',
        padding: '120px clamp(20px, 4vw, 60px)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div className="tech-animate" style={{ maxWidth: '720px', marginBottom: '72px' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.24em',
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            Tecnología responsable
          </p>
          <h2
            style={{
              fontSize: 'clamp(32px, 4.5vw, 56px)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#ffffff',
              marginBottom: '24px',
            }}
          >
            Atención médica humana, amplificada por inteligencia artificial responsable.
          </h2>
        </div>

        {/* Two-column: image + grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
            gap: '60px',
            alignItems: 'start',
          }}
        >
          {/* Left: biomarcadores image */}
          <div className="tech-animate">
            <img
              src="/images/biomarcadores-clinicos.png"
              alt="Dashboard de biomarcadores clínicos con monitor de tendencias, fonendoscopio y receta médica"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Right: capabilities grid */}
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                gap: '2px',
                backgroundColor: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.18)',
              }}
            >
              {capabilities.map((cap, i) => (
                <div
                  key={cap.title}
                  className="tech-card"
                  style={{
                    backgroundColor: 'rgba(11,11,11,0.55)',
                    padding: '36px 32px',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.14em',
                      color: 'rgba(255,255,255,0.55)',
                      fontVariantNumeric: 'tabular-nums',
                      display: 'block',
                      marginBottom: '16px',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    style={{
                      fontSize: 'clamp(18px, 1.6vw, 22px)',
                      fontWeight: 500,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.2,
                      color: '#ffffff',
                      marginBottom: '12px',
                    }}
                  >
                    {cap.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      lineHeight: 1.55,
                      color: 'rgba(255,255,255,0.72)',
                    }}
                  >
                    {cap.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="tech-animate"
          style={{
            marginTop: '48px',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '24px 28px',
            backgroundColor: 'rgba(255,255,255,0.03)',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.65)',
            }}
          >
            <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Disclaimer:</strong>{' '}
            El diagnóstico, la indicación de tratamiento y cualquier decisión clínica son siempre realizados por el Dr. Martínez Escobar. Los sistemas de IA actúan como apoyo educativo y administrativo, conformes con EU AI Act 2024/1689 · Green Zone. No toman decisiones diagnósticas autónomas.
          </p>
        </div>
      </div>
    </section>
  )
}
