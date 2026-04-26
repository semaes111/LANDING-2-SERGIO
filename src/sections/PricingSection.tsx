import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import WordsPullUp from '../components/effects/WordsPullUp'
import TiltCard from '../components/effects/TiltCard'
import GlareCard from '../components/effects/GlareCard'

gsap.registerPlugin(ScrollTrigger)

const plans = [
  {
    name: 'Primera consulta',
    price: '99€',
    period: 'primera visita',
    secondaryPrice: null as { price: string; label: string } | null,
    features: [
      'Pre-evaluación IA (gratuita)',
      'Consulta médica con Dr. Martínez Escobar',
      'Plan individualizado',
      'Receta GLP-1 (si procede)',
      'WhatsApp directo para preguntas',
    ],
    cta: 'Reservar',
    highlighted: false,
  },
  {
    name: 'Seguimiento',
    price: '79€',
    period: 'visita seguimiento',
    secondaryPrice: { price: '29€', label: 'renovación de receta sin consulta' },
    features: [
      'Revisión clínica con Dr.',
      'Ajuste de dosis si procede',
      'Evaluación de tolerancia',
      'Renovación de prescripción',
      'WhatsApp directo para preguntas',
    ],
    cta: 'Reservar',
    highlighted: false,
  },
  {
    name: 'Programa 90D',
    price: '499€',
    period: 'pago único',
    secondaryPrice: null as { price: string; label: string } | null,
    features: [
      'Primera consulta + 2 seguimientos incluidos',
      'Curso digital Reset 90 días',
      'Comunidad privada premium',
      'Sesiones live con el equipo',
      'WhatsApp directo para preguntas',
      'Garantía 30 días',
    ],
    cta: 'Inscribirme',
    highlighted: true,
  },
]

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.pricing-card', {
        y: 60,
        opacity: 0,
        duration: 0.9,
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
      id="precios"
      ref={sectionRef}
      style={{
        backgroundColor: '#f4f4f5',
        padding: '120px clamp(20px, 4vw, 60px)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.24em',
              color: 'rgba(0,0,0,0.5)',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            Puertas de entrada
          </p>
          <WordsPullUp
            text="Elige tu punto de partida"
            as="h2"
            style={{
              fontSize: 'clamp(32px, 4.5vw, 56px)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#000000',
              margin: 0,
            }}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '2px',
            backgroundColor: '#1a1a1a',
            border: '1px solid #1a1a1a',
          }}
        >
          {plans.map((plan) => (
            <TiltCard key={plan.name} maxTilt={6} scaleOnHover={1.015}>
              {plan.highlighted ? (
                <GlareCard>
                  <PricingCard plan={plan} />
                </GlareCard>
              ) : (
                <PricingCard plan={plan} />
              )}
            </TiltCard>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginTop: '64px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.24em',
              color: 'rgba(0,0,0,0.5)',
              textTransform: 'uppercase',
              marginBottom: '28px',
              textAlign: 'center',
            }}
          >
            Preguntas frecuentes
          </p>
          <FAQItem
            q="¿Incluye el medicamento?"
            a="No. El medicamento se prescribe y se compra en farmacia con receta privada."
          />
          <FAQItem
            q="¿Hay financiación?"
            a="Sí. Pago en 3 plazos sin intereses con Klarna disponible en el checkout."
          />
          <FAQItem
            q="¿Reembolso?"
            a="30 días de garantía en el programa 90D. Membership cancelable en cualquier momento."
          />
          <FAQItem
            q="¿Telemedicina?"
            a="Sí. Todas las modalidades disponibles presencial u online, con horario flexible."
          />
        </div>
      </div>
    </section>
  )
}

function PricingCard({ plan }: { plan: typeof plans[0] }) {
  const [hovered, setHovered] = useState(false)
  const isHighlight = plan.highlighted

  return (
    <div
      className="pricing-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: isHighlight ? '#000000' : '#ffffff',
        padding: '40px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.12)' : 'none',
      }}
    >
      <p
        style={{
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.24em',
          color: isHighlight ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
          textTransform: 'uppercase',
        }}
      >
        {plan.name}
      </p>
      <div>
        <p
          style={{
            fontSize: 'clamp(36px, 4vw, 52px)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: isHighlight ? '#ffffff' : '#000000',
            marginBottom: '6px',
          }}
        >
          {plan.price}
        </p>
        <p
          style={{
            fontSize: '13px',
            color: isHighlight ? 'rgba(255,255,255,0.7)' : '#666666',
          }}
        >
          {plan.period}
        </p>
        {plan.secondaryPrice && (
          <div
            style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: isHighlight
                ? '1px solid rgba(255,255,255,0.18)'
                : '1px solid rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'baseline',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: 'clamp(20px, 2vw, 26px)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                color: isHighlight ? '#ffffff' : '#000000',
              }}
            >
              {plan.secondaryPrice.price}
            </span>
            <span
              style={{
                fontSize: '12px',
                lineHeight: 1.4,
                color: isHighlight ? 'rgba(255,255,255,0.7)' : '#666666',
              }}
            >
              {plan.secondaryPrice.label}
            </span>
          </div>
        )}
      </div>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '12px 0 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {plan.features.map((f) => (
          <li
            key={f}
            style={{
              fontSize: '14px',
              lineHeight: 1.5,
              color: isHighlight ? 'rgba(255,255,255,0.85)' : '#333333',
              paddingLeft: '16px',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: '8px',
                width: '5px',
                height: '1px',
                backgroundColor: isHighlight ? '#ffffff' : '#000000',
              }}
            />
            {f}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
        <button
          onClick={() => document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            width: '100%',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.14em',
            color: isHighlight ? '#000000' : '#ffffff',
            backgroundColor: isHighlight ? '#ffffff' : '#000000',
            border: '1px solid #000000',
            padding: '14px 24px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            transition: 'all 0.25s ease',
            fontFamily: '"Helvetica Neue", sans-serif',
          }}
        >
          {plan.cta}
        </button>
      </div>
    </div>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{
        borderBottom: '1px solid #e5e5e5',
        padding: '18px 0',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          textAlign: 'left',
          fontSize: '15px',
          fontWeight: 500,
          color: '#000000',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {q}
        <span style={{ fontSize: '18px', marginLeft: '12px' }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.6,
            color: '#555555',
            marginTop: '12px',
            maxWidth: '680px',
          }}
        >
          {a}
        </p>
      )}
    </div>
  )
}
