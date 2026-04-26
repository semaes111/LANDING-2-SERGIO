import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function BMICalculator() {
  const sectionRef = useRef<HTMLElement>(null)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ weight: '', height: '', age: '', sex: 'mujer' })
  const [comorbidities, setComorbidities] = useState<string[]>([])
  const [email, setEmail] = useState('')
  const [bmi, setBmi] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const computeBMI = () => {
    const w = parseFloat(form.weight)
    const h = parseFloat(form.height) / 100
    if (w && h) return parseFloat((w / (h * h)).toFixed(1))
    return null
  }

  const nextStep = () => {
    if (step === 1) {
      const val = computeBMI()
      if (val) {
        setBmi(val)
        setStep(2)
      }
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      gsap.from('.bmi-animate', {
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
      id="calculadora"
      ref={sectionRef}
      style={{
        backgroundColor: '#f4f4f5',
        padding: '120px clamp(20px, 4vw, 60px)',
      }}
    >
      <div className="bmi-animate" style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
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
            Evaluación gratuita
          </p>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#000000',
            }}
          >
            ¿Eres candidato/a al programa? Calcula tu IMC y recibe una pre-evaluación médica gratuita.
          </h2>
        </div>

        {submitted ? (
          <div
            style={{
              border: '1px solid #1a1a1a',
              padding: '36px 28px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
            }}
          >
            <p style={{ fontSize: '18px', fontWeight: 500, color: '#000000', marginBottom: '12px' }}>
              Informe enviado
            </p>
            <p style={{ fontSize: '14px', color: '#555555', lineHeight: 1.6 }}>
              Hemos enviado tu pre-evaluación a {email}. Nuestro equipo médico revisará tus datos y te contactará en 24-48 horas. Este informe es educativo y no constituye diagnóstico médico.
            </p>
            <button
              onClick={() => {
                setSubmitted(false)
                setStep(1)
                setBmi(null)
                setForm({ weight: '', height: '', age: '', sex: 'mujer' })
                setComorbidities([])
                setEmail('')
              }}
              style={{
                marginTop: '24px',
                fontSize: '13px',
                letterSpacing: '0.14em',
                padding: '14px 32px',
                border: '1px solid #000',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              Calcular de nuevo
            </button>
          </div>
        ) : (
          <div
            style={{
              border: '1px solid #1a1a1a',
              padding: '40px 32px',
              backgroundColor: '#ffffff',
            }}
          >
            {/* Step indicator */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '36px',
              }}
            >
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    flex: 1,
                    height: '3px',
                    backgroundColor: s <= step ? '#000000' : '#e5e5e5',
                    transition: 'background-color 0.3s ease',
                  }}
                />
              ))}
            </div>

            {step === 1 && (
              <div className="bmi-animate" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <p style={{ fontSize: '14px', color: '#555555', marginBottom: '8px' }}>Paso 1 · Datos básicos</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Input label="Peso (kg)" value={form.weight} onChange={(v) => setForm({ ...form, weight: v })} />
                  <Input label="Altura (cm)" value={form.height} onChange={(v) => setForm({ ...form, height: v })} />
                  <Input label="Edad" value={form.age} onChange={(v) => setForm({ ...form, age: v })} />
                  <div>
                    <label style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#666666', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      Sexo
                    </label>
                    <select
                      value={form.sex}
                      onChange={(e) => setForm({ ...form, sex: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 0',
                        fontSize: '15px',
                        border: 'none',
                        borderBottom: '1px solid #000000',
                        background: 'transparent',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="mujer">Mujer</option>
                      <option value="hombre">Hombre</option>
                    </select>
                  </div>
                </div>
                {bmi !== null && (
                  <div style={{ padding: '16px', backgroundColor: '#f4f4f5', borderLeft: '3px solid #000000' }}>
                    <p style={{ fontSize: '14px', color: '#000000' }}>
                      Tu IMC: <strong>{bmi}</strong> — {bmiCategory(bmi)}
                    </p>
                  </div>
                )}
                <button
                  onClick={nextStep}
                  style={{
                    padding: '14px 28px',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.14em',
                    color: '#ffffff',
                    backgroundColor: '#000000',
                    border: 'none',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    alignSelf: 'flex-start',
                  }}
                >
                  Continuar →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bmi-animate" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ fontSize: '14px', color: '#555555', marginBottom: '8px' }}>Paso 2 · Comorbilidades</p>
                <p style={{ fontSize: '13px', color: '#777777' }}>Selecciona las que apliquen (opcional):</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  {['Diabetes tipo 2', 'Hipertensión', 'Dislipemia', 'SAOS', 'Hígado graso', 'Prediabetes'].map((c) => (
                    <label
                      key={c}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '14px',
                        color: '#333333',
                        padding: '8px 0',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={comorbidities.includes(c)}
                        onChange={() => {
                          setComorbidities((prev) =>
                            prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
                          )
                        }}
                        style={{ accentColor: '#000000' }}
                      />
                      {c}
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      padding: '14px 28px',
                      fontSize: '13px',
                      fontWeight: 500,
                      letterSpacing: '0.14em',
                      color: '#000000',
                      backgroundColor: 'transparent',
                      border: '1px solid #000000',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                    }}
                  >
                    ← Atrás
                  </button>
                  <button
                    onClick={nextStep}
                    style={{
                      padding: '14px 28px',
                      fontSize: '13px',
                      fontWeight: 500,
                      letterSpacing: '0.14em',
                      color: '#ffffff',
                      backgroundColor: '#000000',
                      border: 'none',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                    }}
                  >
                    Continuar →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form className="bmi-animate" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ fontSize: '14px', color: '#555555', marginBottom: '8px' }}>Paso 3 · Recibe tu informe</p>
                <div>
                  <label style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#666666', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    style={{
                      width: '100%',
                      padding: '10px 0',
                      fontSize: '15px',
                      border: 'none',
                      borderBottom: '1px solid #000000',
                      background: 'transparent',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <p style={{ fontSize: '12px', color: '#777777', lineHeight: 1.5 }}>
                  Al enviar, aceptas recibir comunicaciones de NextHorizont con fines informativos y educativos. Puedes ejercer tus derechos RGPD en dpo@nexthorizont.com.
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    style={{
                      padding: '14px 28px',
                      fontSize: '13px',
                      fontWeight: 500,
                      letterSpacing: '0.14em',
                      color: '#000000',
                      backgroundColor: 'transparent',
                      border: '1px solid #000000',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                    }}
                  >
                    ← Atrás
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '14px 28px',
                      fontSize: '13px',
                      fontWeight: 500,
                      letterSpacing: '0.14em',
                      color: '#ffffff',
                      backgroundColor: '#000000',
                      border: 'none',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                    }}
                  >
                    Enviar y recibir informe
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#666666', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
        {label}
      </label>
      <input
        type="number"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 0',
          fontSize: '15px',
          border: 'none',
          borderBottom: '1px solid #000000',
          background: 'transparent',
          outline: 'none',
          fontFamily: 'inherit',
        }}
      />
    </div>
  )
}

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'Bajo peso'
  if (bmi < 25) return 'Peso normal'
  if (bmi < 30) return 'Sobrepeso'
  if (bmi < 35) return 'Obesidad grado I'
  if (bmi < 40) return 'Obesidad grado II'
  return 'Obesidad grado III'
}
