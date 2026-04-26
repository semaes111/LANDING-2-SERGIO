import { Link } from 'react-router'
import Footer from '../sections/Footer'

interface LegalLayoutProps {
  title: string
  children: React.ReactNode
}

export default function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #000000',
          padding: '20px clamp(20px, 4vw, 60px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: '18px',
            fontWeight: 400,
            letterSpacing: '0.14em',
            color: '#000000',
            textDecoration: 'none',
            textTransform: 'uppercase',
          }}
        >
          NEXTHORIZONT
        </Link>
        <Link
          to="/"
          style={{
            fontSize: '12px',
            letterSpacing: '0.14em',
            color: '#666666',
            textDecoration: 'none',
            textTransform: 'uppercase',
          }}
        >
          ← Volver
        </Link>
      </header>

      <main
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '80px clamp(20px, 4vw, 60px) 120px',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: '#000000',
            marginBottom: '16px',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: '#888888',
            marginBottom: '60px',
          }}
        >
          Última actualización: abril 2026
        </p>
        <div
          style={{
            fontSize: '15px',
            lineHeight: 1.8,
            color: '#333333',
          }}
        >
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}
