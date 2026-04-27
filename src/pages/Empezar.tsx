import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Clock, ShieldCheck, FileText, ChevronDown } from 'lucide-react'
import WordsPullUp from '../components/effects/WordsPullUp'
import TextRevealOnScroll from '../components/effects/TextRevealOnScroll'

gsap.registerPlugin(ScrollTrigger)

/**
 * /empezar — Patient registration entry page for Centro NextHorizont Health.
 *
 * This page is the first step of the new patient funnel:
 *   1. User clicks "Empezar evaluación gratis" CTA on home
 *   2. Lands here, reads the value prop (5 min, RGPD, doctor reads first)
 *   3. Fills in name + phone + consent
 *   4. POST to /api/registro (Vercel Edge Function)
 *   5. Edge Function generates a token, inserts in clinica_enlaces_pacientes
 *   6. Returns redirectUrl pointing to formulario1.nexthorizont.ai/?t=...
 *   7. Browser navigates to the questionnaire
 *
 * Design decisions:
 *   - Three-band layout (black hero / white form / light grey FAQ) matching
 *     the rest of the site's editorial rhythm (Quiénes Somos pattern).
 *   - WordsPullUp on the H1 for entrance animation consistency.
 *   - TextRevealOnScroll on the lead paragraph (same as Philosophy/QS).
 *   - GSAP per-element ScrollTriggers for benefit cards and FAQ items.
 *   - Form state machine: idle → submitting → error|success.
 *   - Validation matches server-side regex exactly (defense in depth).
 *   - Submit button disabled unless all 3 conditions: name OK, phone OK,
 *     consent ticked.
 *   - On success the browser navigates away (window.location.href), so we
 *     don't bother managing post-success UI state for long — just brief
 *     loading message before the redirect happens.
 *   - Error states are surfaced inline below the form, in red, with a
 *     retry-friendly tone ("Inténtalo de nuevo").
 */

// Same regex as the Edge Function (api/registro.ts) for client-side
// validation. Defense in depth: identical rules client and server.
const NAME_REGEX = /^[\p{L}\p{M}\s'’\-\.]{3,80}$/u
const PHONE_REGEX = /^[+\d\s\-()]{6,20}$/

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'error'; message: string }
  | { status: 'success' }

export default function Empezar() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' })

  // Live validation flags for UX (button enabled/disabled, fields red)
  const nombreValid = NAME_REGEX.test(nombre.trim())
  const telefonoValid = PHONE_REGEX.test(telefono.trim())
  const formValid = nombreValid && telefonoValid && consent

  // ---------------------- Page entrance animations ----------------------

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>('.emp-fade-up')
      elements.forEach((el) => {
        gsap.from(el, {
          y: 32,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        })
      })
    }, root)

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 50)

    return () => {
      window.clearTimeout(refreshTimer)
      ctx.revert()
    }
  }, [])

  // ---------------------- Submit handler ----------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formValid) return
    if (submitState.status === 'submitting') return // idempotency: prevent double-click

    setSubmitState({ status: 'submitting' })

    try {
      const res = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          telefono: telefono.trim(),
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok && data.ok && data.redirectUrl) {
        // Success: navigate to the clinical questionnaire with the token.
        // We use window.location.href instead of React Router because the
        // questionnaire is on a separate subdomain (formulario1.nexthorizont.ai).
        setSubmitState({ status: 'success' })
        window.location.href = data.redirectUrl
        return
      }

      // Server returned an error
      const errorMsg =
        typeof data.error === 'string'
          ? data.error
          : 'No se pudo crear el registro. Inténtalo de nuevo.'
      setSubmitState({ status: 'error', message: errorMsg })
    } catch (err) {
      // Network error
      setSubmitState({
        status: 'error',
        message: 'Sin conexión. Revisa tu internet e inténtalo de nuevo.',
      })
    }
  }

  // ---------------------- Render ----------------------

  return (
    <div ref={sectionRef} style={{ backgroundColor: '#0a0a0a' }}>
      {/* ============= BAND 1: HERO (black) ============= */}
      <section
        style={{
          minHeight: '90vh',
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          padding: 'clamp(120px, 14vw, 180px) clamp(20px, 6vw, 80px) clamp(80px, 8vw, 120px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <p
            className="emp-fade-up"
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.24em',
              color: 'rgba(255,255,255,0.55)',
              textTransform: 'uppercase',
              margin: 0,
              marginBottom: '24px',
            }}
          >
            Primera evaluación · Sin coste
          </p>

          <WordsPullUp
            text="Empezamos por entender tu situación"
            as="h1"
            style={{
              fontSize: 'clamp(40px, 6.5vw, 88px)',
              fontWeight: 400,
              letterSpacing: '-0.035em',
              lineHeight: 1.02,
              color: '#ffffff',
              margin: 0,
              marginBlockEnd: '32px',
              maxWidth: '900px',
            }}
          />

          <TextRevealOnScroll
            text="Un cuestionario clínico de 5 minutos. Sin tecnicismos. Tu doctor lo verá antes de tu consulta para que el tiempo juntos sea sólo lo que importa."
            style={{
              fontSize: 'clamp(16px, 1.5vw, 20px)',
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.92)',
              maxWidth: '700px',
              margin: 0,
              marginBlockEnd: '56px',
            }}
          />

          {/* 3 benefits row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '32px',
              maxWidth: '900px',
              marginBottom: '56px',
            }}
          >
            <BenefitItem
              icon={<Clock size={22} strokeWidth={1.5} />}
              title="5 minutos"
              detail="Preguntas cortas, lenguaje claro"
            />
            <BenefitItem
              icon={<ShieldCheck size={22} strokeWidth={1.5} />}
              title="Datos cifrados"
              detail="RGPD · sólo tu doctor accede"
            />
            <BenefitItem
              icon={<FileText size={22} strokeWidth={1.5} />}
              title="Tu doctor lo lee antes"
              detail="No pierdes la consulta explicando"
            />
          </div>

          {/* CTA scroll-to-form */}
          <a
            href="#registro-form"
            className="emp-fade-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '18px 32px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.16em',
              color: '#0a0a0a',
              backgroundColor: '#ffffff',
              border: '1px solid #ffffff',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
              fontFamily: '"Helvetica Neue", sans-serif',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent'
              ;(e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#ffffff'
              ;(e.currentTarget as HTMLAnchorElement).style.color = '#0a0a0a'
            }}
          >
            Comenzar mi evaluación
            <ChevronDown size={16} />
          </a>
        </div>
      </section>

      {/* ============= BAND 2: FORM (white) ============= */}
      <section
        id="registro-form"
        style={{
          backgroundColor: '#ffffff',
          color: '#0a0a0a',
          padding: 'clamp(80px, 10vw, 140px) clamp(20px, 6vw, 80px)',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
          <p
            className="emp-fade-up"
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.24em',
              color: 'rgba(10,10,10,0.55)',
              textTransform: 'uppercase',
              margin: 0,
              marginBottom: '20px',
            }}
          >
            Paso 1 de 2
          </p>
          <h2
            className="emp-fade-up"
            style={{
              fontSize: 'clamp(32px, 4.5vw, 56px)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              margin: 0,
              marginBottom: '20px',
            }}
          >
            Tus datos básicos
          </h2>
          <p
            className="emp-fade-up"
            style={{
              fontSize: '17px',
              lineHeight: 1.55,
              color: 'rgba(10,10,10,0.65)',
              margin: 0,
              marginBottom: '48px',
            }}
          >
            Sólo el nombre y el teléfono. Lo clínico lo cuentas en el cuestionario.
          </p>

          <form
            onSubmit={handleSubmit}
            className="emp-fade-up"
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            <Field
              label="Nombre completo"
              name="nombre"
              placeholder="María García López"
              value={nombre}
              onChange={setNombre}
              autoComplete="name"
              hasError={nombre.length > 0 && !nombreValid}
              errorMessage="3-80 caracteres, sólo letras"
            />
            <Field
              label="Teléfono"
              name="telefono"
              type="tel"
              placeholder="+34 600 000 000"
              value={telefono}
              onChange={setTelefono}
              autoComplete="tel"
              hasError={telefono.length > 0 && !telefonoValid}
              errorMessage="6-20 caracteres, dígitos y + - ( ) espacios"
            />

            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '14px',
                lineHeight: 1.5,
                color: 'rgba(10,10,10,0.75)',
                cursor: 'pointer',
                marginTop: '8px',
              }}
            >
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{
                  marginTop: '2px',
                  width: '18px',
                  height: '18px',
                  accentColor: '#0a0a0a',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />
              <span>
                Acepto el tratamiento de mis datos según la{' '}
                <a
                  href="/privacidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0a0a0a', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                >
                  Política de Privacidad
                </a>{' '}
                (RGPD).
              </span>
            </label>

            <button
              type="submit"
              disabled={!formValid || submitState.status === 'submitting'}
              style={{
                marginTop: '16px',
                padding: '20px 32px',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.16em',
                color: '#ffffff',
                backgroundColor: '#0a0a0a',
                border: '1px solid #0a0a0a',
                cursor: !formValid || submitState.status === 'submitting' ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.25s ease',
                fontFamily: '"Helvetica Neue", sans-serif',
                opacity: !formValid || submitState.status === 'submitting' ? 0.4 : 1,
              }}
              onMouseEnter={(e) => {
                if (!formValid || submitState.status === 'submitting') return
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#0a0a0a'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0a0a0a'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#ffffff'
              }}
            >
              {submitState.status === 'submitting'
                ? 'Generando tu enlace...'
                : submitState.status === 'success'
                  ? 'Redirigiendo...'
                  : 'Comenzar evaluación  →'}
            </button>

            {submitState.status === 'error' && (
              <div
                style={{
                  border: '1px solid rgba(220, 38, 38, 0.4)',
                  backgroundColor: 'rgba(254, 226, 226, 0.4)',
                  padding: '14px 18px',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  color: '#991b1b',
                  borderRadius: '4px',
                }}
              >
                {submitState.message}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ============= BAND 3: FAQ (light grey) ============= */}
      <section
        style={{
          backgroundColor: '#f4f4f5',
          color: '#0a0a0a',
          padding: 'clamp(80px, 10vw, 140px) clamp(20px, 6vw, 80px)',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <p
            className="emp-fade-up"
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.24em',
              color: 'rgba(10,10,10,0.55)',
              textTransform: 'uppercase',
              margin: 0,
              marginBottom: '20px',
            }}
          >
            Preguntas frecuentes
          </p>
          <h2
            className="emp-fade-up"
            style={{
              fontSize: 'clamp(32px, 4.5vw, 48px)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              margin: 0,
              marginBottom: '56px',
            }}
          >
            Lo que probablemente te estás preguntando
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <FaqItem
              q="¿Cuánto tarda realmente?"
              a="Entre 4 y 7 minutos. El cuestionario tiene 5 pasos y la mayoría son botones (no escribir). Si te paras, lo retomas con el mismo enlace durante 7 días."
            />
            <FaqItem
              q="¿Es realmente gratis? ¿Qué hay después?"
              a="El cuestionario clínico es gratis y sin compromiso. Te sirve a ti (entiendes tu situación) y a tu doctor (te recibe sabiendo lo que importa). Si después decides venir a consulta, los precios son 99€ la primera, 79€ los seguimientos mensuales."
            />
            <FaqItem
              q="¿Quién verá mis datos?"
              a="Sólo el doctor que te atienda y el equipo clínico autorizado. Cumplimos RGPD: datos cifrados, derecho a borrado, no se venden ni se ceden a terceros. Política completa en el enlace de Privacidad."
            />
            <FaqItem
              q="¿Y si no quiero ir a consulta presencial?"
              a="Sin problema. Algunos pacientes vienen sólo a por evaluación de prescripción (29€) o seguimiento online. El cuestionario te sirve igual: te dice qué tipo de abordaje encaja con tu caso."
            />
            <FaqItem
              q="¿Y si me equivoco al rellenar?"
              a="Puedes ir hacia atrás en cualquier momento. Cuando llegues a tu consulta, el doctor revisará todo contigo y matizamos lo que haga falta. No es un examen."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

// ---------------------- Helper components ----------------------

function BenefitItem({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode
  title: string
  detail: string
}) {
  return (
    <div
      className="emp-fade-up"
      style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
    >
      <div style={{ color: 'rgba(255,255,255,0.85)' }}>{icon}</div>
      <h3
        style={{
          fontSize: '17px',
          fontWeight: 500,
          color: '#ffffff',
          margin: 0,
          letterSpacing: '-0.005em',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '14px',
          lineHeight: 1.55,
          color: 'rgba(255,255,255,0.65)',
          margin: 0,
        }}
      >
        {detail}
      </p>
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  autoComplete,
  hasError,
  errorMessage,
}: {
  label: string
  name: string
  type?: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
  hasError?: boolean
  errorMessage?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        htmlFor={name}
        style={{
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.18em',
          color: 'rgba(10,10,10,0.6)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        style={{
          padding: '14px 0',
          fontSize: '17px',
          fontFamily: 'inherit',
          color: '#0a0a0a',
          backgroundColor: 'transparent',
          border: 'none',
          borderBottom: hasError
            ? '1px solid #dc2626'
            : '1px solid rgba(10,10,10,0.2)',
          outline: 'none',
          transition: 'border-color 0.2s ease',
        }}
        onFocus={(e) => {
          if (!hasError) {
            ;(e.currentTarget as HTMLInputElement).style.borderBottomColor =
              '#0a0a0a'
          }
        }}
        onBlur={(e) => {
          if (!hasError) {
            ;(e.currentTarget as HTMLInputElement).style.borderBottomColor =
              'rgba(10,10,10,0.2)'
          }
        }}
      />
      {hasError && errorMessage && (
        <span
          style={{
            fontSize: '12px',
            color: '#dc2626',
            marginTop: '2px',
          }}
        >
          {errorMessage}
        </span>
      )}
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div
      className="emp-fade-up"
      style={{
        borderTop: '1px solid rgba(10,10,10,0.12)',
        paddingTop: '24px',
      }}
    >
      <h3
        style={{
          fontSize: '20px',
          fontWeight: 500,
          color: '#0a0a0a',
          margin: 0,
          marginBottom: '12px',
          letterSpacing: '-0.01em',
        }}
      >
        {q}
      </h3>
      <p
        style={{
          fontSize: '16px',
          lineHeight: 1.6,
          color: 'rgba(10,10,10,0.7)',
          margin: 0,
        }}
      >
        {a}
      </p>
    </div>
  )
}
