import { Link } from 'react-router'

export default function Footer() {
  return (
    <footer
      id="footer"
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #000000',
        padding: '80px clamp(20px, 4vw, 60px) 0',
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      {/* Top: Navigation + Office Info */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '48px',
          paddingBottom: '80px',
        }}
      >
        {/* Col 1: Programa */}
        <div>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.18em',
              color: '#000000',
              marginBottom: '20px',
              textTransform: 'uppercase',
            }}
          >
            Programa
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <FooterLink to="/#works">Tratamiento</FooterLink>
            <FooterLink to="/#capabilities">Cómo funciona</FooterLink>
            <FooterLink to="/#precios">Precios</FooterLink>
            <FooterLink to="/#calculadora">Calcula tu IMC</FooterLink>
            <FooterLink to="/#ubicacion">Llegar</FooterLink>
          </ul>
        </div>

        {/* Col 2: Clínica */}
        <div>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.18em',
              color: '#000000',
              marginBottom: '20px',
              textTransform: 'uppercase',
            }}
          >
            Clínica
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <FooterLink to="/#equipo">Equipo</FooterLink>
            <FooterLink to="/#ubicacion">Centro NICA</FooterLink>
            <FooterLink to="/#hero">Telemedicina</FooterLink>
            <FooterLink to="/#ubicacion">Contacto</FooterLink>
          </ul>
        </div>

        {/* Col 3: Compañía */}
        <div>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.18em',
              color: '#000000',
              marginBottom: '20px',
              textTransform: 'uppercase',
            }}
          >
            Compañía
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <FooterLink to="/">Sobre NextHorizont</FooterLink>
            <FooterLink to="/">Press kit</FooterLink>
            <FooterLink to="/">Carreras</FooterLink>
            <FooterLink to="/">Blog</FooterLink>
          </ul>
        </div>

        {/* Col 4: Legal */}
        <div>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.18em',
              color: '#000000',
              marginBottom: '20px',
              textTransform: 'uppercase',
            }}
          >
            Legal
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <FooterLink to="/aviso-legal">Aviso legal</FooterLink>
            <FooterLink to="/privacidad">Privacidad RGPD</FooterLink>
            <FooterLink to="/cookies">Cookies</FooterLink>
            <FooterLink to="/compliance-ai">Compliance AI Act</FooterLink>
            <FooterLink to="/">Política sanitaria</FooterLink>
          </ul>
        </div>

        {/* Col 5: Contact */}
        <div>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.18em',
              color: '#000000',
              marginBottom: '20px',
              textTransform: 'uppercase',
            }}
          >
            Contacto
          </p>
          <p style={{ fontSize: '14px', color: '#666666', lineHeight: 2 }}>
            hola@nexthorizont.com
            <br />
            WhatsApp Business
            <br />
            Instagram: @noadelgazo
            <br />
            TikTok: @noadelgazo
          </p>
        </div>
      </div>

      {/* Legal strip */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          paddingBottom: '32px',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            color: '#888888',
            lineHeight: 1.6,
            maxWidth: '900px',
          }}
        >
          NextHorizont AI SL · Centro autorizado por la Consejería de Salud ·
          Dr. Sergio Martínez Escobar · Médico colegiado nº 04/1809464 · Colegio de Médicos de Almería.
          Información médica con finalidad informativa y educativa; no sustituye consulta presencial.
          Tratamientos farmacológicos sujetos a prescripción individualizada. Cumplimiento RGPD y EU AI Act.
          DPO: dpo@nexthorizont.com
        </p>
      </div>

      {/* Bottom: Giant Wordmark */}
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          lineHeight: 0.85,
          paddingBottom: '0',
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: 'clamp(80px, 18vw, 320px)',
            fontWeight: 400,
            letterSpacing: '-0.04em',
            color: '#000000',
            whiteSpace: 'nowrap',
            transform: 'translateY(15%)',
            userSelect: 'none',
          }}
        >
          NEXTHORIZONT
        </span>
      </div>
    </footer>
  )
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  const isHash = to.startsWith('/#')
  const handleClick = (e: React.MouseEvent) => {
    if (isHash) {
      e.preventDefault()
      const id = to.replace('/#', '')
      document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <li>
      <Link
        to={isHash ? '/' : to}
        onClick={handleClick}
        style={{
          fontSize: '14px',
          color: '#666666',
          textDecoration: 'none',
          transition: 'color 0.2s ease',
          display: 'inline-block',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.color = '#000000'
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.color = '#666666'
        }}
      >
        {children}
      </Link>
    </li>
  )
}
