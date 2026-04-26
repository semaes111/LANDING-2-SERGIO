import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CheckCheck, Stethoscope, Pill, Sparkles, ClipboardCheck, ShieldCheck, Video } from 'lucide-react'
import NumberFlow from '@number-flow/react'
import WordsPullUp from '../components/effects/WordsPullUp'
import TiltCard from '../components/effects/TiltCard'
import GlareCard from '../components/effects/GlareCard'
import { Card, CardContent, CardHeader } from '../components/ui/card'

gsap.registerPlugin(ScrollTrigger)

/**
 * Pricing Section — Centro NextHorizont Health
 *
 * Visual style adapted from a 21st.dev/shadcn pricing component, but tailored
 * for a sober medical brand:
 *   - Black/white palette (no blue gradients) — matches the rest of the site
 *   - €, not $
 *   - 3 plans (no Monthly/Yearly toggle — irrelevant for a clinic)
 *   - secondaryPrice on Seguimiento card (79€ visit + 29€ prescription renewal)
 *   - Programa 90D is the highlighted plan (Glare Card sheen + thick black border + 'Recomendado' badge)
 *   - 3D TiltCard wraps every card (max 6° tilt — subtle medical feel)
 *   - WordsPullUp on the section heading (kept from previous implementation)
 *   - NumberFlow for animated price numbers when card enters viewport
 *
 * Architectural decisions:
 *   - Uses shadcn's Card from /src/components/ui/card.tsx (already in project).
 *   - Tailwind utility classes drive flex/sizing; inline styles cover colors/typography
 *     to stay consistent with the rest of the site's pattern.
 *   - 'features' array uses {text, icon} pairs with medical icons.
 *   - 'includes' subsection preserved from source pattern (with checkmarks).
 */

type Feature = { text: string; icon: React.ReactNode }
type Plan = {
  name: string
  description: string
  price: number
  period: string
  secondaryPrice: { price: number; label: string } | null
  buttonText: string
  highlighted: boolean
  features: Feature[]
  includes: string[]
}

const plans: Plan[] = [
  {
    name: 'Primera consulta',
    description: 'Para quienes empiezan: evaluación clínica completa y plan personalizado.',
    price: 99,
    period: 'primera visita',
    secondaryPrice: null,
    buttonText: 'Reservar',
    highlighted: false,
    features: [
      { text: 'Pre-evaluación con IA (gratuita)', icon: <Sparkles size={18} /> },
      { text: 'Consulta médica con Dr. Martínez Escobar', icon: <Stethoscope size={18} /> },
      { text: 'Plan individualizado y receta GLP-1 si procede', icon: <Pill size={18} /> },
    ],
    includes: [
      'Incluye:',
      'WhatsApp directo para preguntas',
      'Modalidad presencial u online',
      'Sin permanencia',
    ],
  },
  {
    name: 'Seguimiento',
    description: 'Para pacientes en tratamiento: revisión clínica continua y ajuste de dosis.',
    price: 79,
    period: 'visita seguimiento',
    secondaryPrice: { price: 29, label: 'renovación de receta sin consulta' },
    buttonText: 'Reservar',
    highlighted: false,
    features: [
      { text: 'Revisión clínica con el Dr.', icon: <ClipboardCheck size={18} /> },
      { text: 'Ajuste de dosis y evaluación de tolerancia', icon: <Pill size={18} /> },
      { text: 'Renovación de prescripción incluida', icon: <ShieldCheck size={18} /> },
    ],
    includes: [
      'Incluye:',
      'WhatsApp directo para preguntas',
      'Telemedicina disponible',
      'Cancelación gratuita 24h antes',
    ],
  },
  {
    name: 'Programa 90D',
    description: 'El programa completo: acompañamiento médico durante 90 días con resultados sostenibles.',
    price: 499,
    period: 'pago único',
    secondaryPrice: null,
    buttonText: 'Inscribirme',
    highlighted: true,
    features: [
      { text: '1 primera consulta + 4 seguimientos', icon: <Stethoscope size={18} /> },
      { text: 'Curso digital Reset 90 días', icon: <ClipboardCheck size={18} /> },
      { text: 'Sesiones live con el equipo médico', icon: <Video size={18} /> },
    ],
    includes: [
      'Todo lo anterior, más:',
      'Comunidad privada premium',
      'WhatsApp directo prioritario',
      'Garantía 30 días',
    ],
  },
]

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.pricing-card-anim', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
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
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: '#666666',
              marginTop: '20px',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Elige cómo empezar. Todos los planes incluyen acceso directo al equipo médico.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '24px',
            alignItems: 'stretch',
          }}
        >
          {plans.map((plan) => (
            <div key={plan.name} className="pricing-card-anim" style={{ display: 'flex' }}>
              <TiltCard maxTilt={6} scaleOnHover={1.015} style={{ width: '100%', display: 'flex' }}>
                {plan.highlighted ? (
                  <GlareCard style={{ width: '100%', borderRadius: '16px' }}>
                    <PricingCardContent plan={plan} />
                  </GlareCard>
                ) : (
                  <PricingCardContent plan={plan} />
                )}
              </TiltCard>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginTop: '88px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
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
            a="30 días de garantía en el programa 90D. Cancelable en cualquier momento."
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

function PricingCardContent({ plan }: { plan: Plan }) {
  const isHighlight = plan.highlighted

  const handleCTA = () => {
    document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Card
      className="relative w-full h-full flex flex-col"
      style={{
        backgroundColor: isHighlight ? '#0a0a0a' : '#ffffff',
        borderColor: isHighlight ? '#0a0a0a' : '#e5e5e5',
        borderWidth: isHighlight ? '2px' : '1px',
        borderRadius: '16px',
        boxShadow: isHighlight
          ? '0 20px 50px rgba(0,0,0,0.18)'
          : '0 4px 12px rgba(0,0,0,0.04)',
      }}
    >
      <CardHeader className="text-left" style={{ padding: '32px 28px 12px' }}>
        <div className="flex items-start justify-between" style={{ gap: '12px' }}>
          <h3
            style={{
              fontSize: 'clamp(22px, 2.4vw, 28px)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: isHighlight ? '#ffffff' : '#0a0a0a',
              margin: 0,
            }}
          >
            {plan.name}
          </h3>
          {isHighlight && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#0a0a0a',
                backgroundColor: '#ffffff',
                padding: '6px 12px',
                borderRadius: '999px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Recomendado
            </span>
          )}
        </div>
        <p
          style={{
            fontSize: '13px',
            lineHeight: 1.5,
            color: isHighlight ? 'rgba(255,255,255,0.7)' : '#666666',
            margin: '12px 0 22px',
          }}
        >
          {plan.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span
            style={{
              fontSize: 'clamp(40px, 5vw, 56px)',
              fontWeight: 500,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: isHighlight ? '#ffffff' : '#0a0a0a',
              display: 'inline-flex',
              alignItems: 'baseline',
            }}
          >
            <NumberFlow value={plan.price} />
            <span style={{ marginLeft: '2px' }}>€</span>
          </span>
          <span
            style={{
              fontSize: '13px',
              color: isHighlight ? 'rgba(255,255,255,0.6)' : '#888888',
            }}
          >
            / {plan.period}
          </span>
        </div>
        {plan.secondaryPrice && (
          <div
            style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: isHighlight
                ? '1px solid rgba(255,255,255,0.18)'
                : '1px solid #e5e5e5',
              display: 'flex',
              alignItems: 'baseline',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: 'clamp(20px, 2vw, 26px)',
                fontWeight: 500,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                color: isHighlight ? '#ffffff' : '#0a0a0a',
                display: 'inline-flex',
                alignItems: 'baseline',
              }}
            >
              <NumberFlow value={plan.secondaryPrice.price} />
              <span style={{ marginLeft: '2px' }}>€</span>
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
      </CardHeader>

      <CardContent className="flex-1 flex flex-col" style={{ padding: '12px 28px 28px' }}>
        <button
          onClick={handleCTA}
          style={{
            width: '100%',
            padding: '14px 24px',
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: isHighlight ? '#0a0a0a' : '#ffffff',
            backgroundColor: isHighlight ? '#ffffff' : '#0a0a0a',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            fontFamily: '"Helvetica Neue", sans-serif',
            marginBottom: '24px',
            boxShadow: isHighlight ? '0 4px 14px rgba(255,255,255,0.18)' : '0 4px 14px rgba(0,0,0,0.18)',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
          }}
        >
          {plan.buttonText}
        </button>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {plan.features.map((f, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '13.5px',
                lineHeight: 1.5,
                color: isHighlight ? 'rgba(255,255,255,0.85)' : '#333333',
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isHighlight ? 'rgba(255,255,255,0.85)' : '#0a0a0a',
                  paddingTop: '2px',
                }}
              >
                {f.icon}
              </span>
              <span>{f.text}</span>
            </li>
          ))}
        </ul>

        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: isHighlight
              ? '1px solid rgba(255,255,255,0.18)'
              : '1px solid #e5e5e5',
          }}
        >
          <h4
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: isHighlight ? '#ffffff' : '#0a0a0a',
              margin: '0 0 14px',
            }}
          >
            {plan.includes[0]}
          </h4>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {plan.includes.slice(1).map((item, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  color: isHighlight ? 'rgba(255,255,255,0.75)' : '#555555',
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    display: 'inline-flex',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: isHighlight ? '1px solid rgba(255,255,255,0.4)' : '1px solid #0a0a0a',
                    backgroundColor: isHighlight ? 'rgba(255,255,255,0.08)' : '#f4f4f5',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '1px',
                  }}
                >
                  <CheckCheck
                    size={12}
                    color={isHighlight ? '#ffffff' : '#0a0a0a'}
                    strokeWidth={2.4}
                  />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
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
