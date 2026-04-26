import LegalLayout from './LegalLayout'

export default function Privacidad() {
  return (
    <LegalLayout title="Política de Privacidad (RGPD)">
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>1. Responsable del tratamiento</h2>
        <p>
          <strong>Responsable:</strong> NextHorizont AI SL
          <br />
          <strong>CIF:</strong> [pendiente de completar]
          <br />
          <strong>Dirección:</strong> C/ Bulevar de El Ejido 231, Portal I, 3B, 04700 El Ejido (Almería), España
          <br />
          <strong>Email DPO:</strong> dpo@nexthorizont.com
          <br />
          <strong>Delegado de Protección de Datos (DPO):</strong> dpo@nexthorizont.com
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>2. Datos que tratamos y finalidad</h2>
        <p style={{ marginBottom: '16px' }}>
          Tratamos los datos personales que nos proporcionas directamente a través de formularios
          de contacto, calculadora IMC, solicitud de consulta o suscripción a programas:
        </p>
        <ul style={{ listStyle: 'disc', paddingLeft: '24px', marginBottom: '16px' }}>
          <li>Datos de contacto: nombre, email, teléfono</li>
          <li>Datos de salud: peso, altura, edad, sexo, comorbilidades (categoría especial RGPD art. 9)</li>
          <li>Datos de navegación: cookies técnicas y analíticas (con consentimiento)</li>
        </ul>
        <p>
          <strong>Finalidades:</strong> gestión de citas médicas, envío de informes de pre-evaluación,
          seguimiento clínico, cumplimiento de obligaciones legales sanitarias, comunicaciones
          informativas y educativas con base en interés legítimo.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>3. Base jurídica del tratamiento</h2>
        <p style={{ marginBottom: '16px' }}>
          La base jurídica para el tratamiento de datos personales es:
        </p>
        <ul style={{ listStyle: 'disc', paddingLeft: '24px', marginBottom: '16px' }}>
          <li><strong>Ejecución de un contrato / relación precontractual</strong> (art. 6.1.b RGPD) para la gestión de consultas y programas médicos.</li>
          <li><strong>Cumplimiento de obligaciones legales</strong> (art. 6.1.c RGPD) en materia sanitaria.</li>
          <li><strong>Consentimiento explícito</strong> (art. 9.2.a RGPD) para datos de salud, recogido de forma separada, específica e informada en cada formulario que lo solicite.</li>
          <li><strong>Interés legítimo</strong> (art. 6.1.f RGPD) para comunicaciones informativas, siempre con opción de oposición.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>4. Conservación de datos</h2>
        <p>
          Conservaremos tus datos personales durante el tiempo necesario para cumplir con la finalidad
          para la que fueron recogidos y para determinar las posibles responsabilidades que se pudieran
          derivar de dicha finalidad y del tratamiento de los datos. Los plazos de conservación de
          datos de salud se ajustan a la normativa sanitaria vigente (generalmente 15 años para
          historias clínicas según Ley 41/2002).
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>5. Tus derechos</h2>
        <p style={{ marginBottom: '16px' }}>
          Como titular de los datos, tienes derecho a:
        </p>
        <ul style={{ listStyle: 'disc', paddingLeft: '24px', marginBottom: '16px' }}>
          <li>Acceder a tus datos personales</li>
          <li>Solicitar la rectificación de datos inexactos</li>
          <li>Solicitar la supresión cuando, entre otros motivos, los datos ya no sean necesarios</li>
          <li>Solicitar la limitación del tratamiento</li>
          <li>Oponerte al tratamiento</li>
          <li>Solicitar la portabilidad de los datos</li>
          <li>Retirar el consentimiento otorgado en cualquier momento</li>
        </ul>
        <p>
          Para ejercer estos derechos, envía un email a <strong>dpo@nexthorizont.com</strong> indicando
          claramente qué derecho deseas ejercer. Te responderemos en un plazo máximo de 30 días.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>6. Seguridad de la información</h2>
        <p>
          NextHorizont AI SL adopta las medidas técnicas y organizativas necesarias para garantizar
          la seguridad de los datos de carácter personal y evitar su alteración, pérdida, tratamiento
          o acceso no autorizado, habida cuenta del estado de la tecnología, la naturaleza de los
          datos almacenados y los riesgos a que están expuestos. Los datos de salud se tratan como
          categoría especial conforme al artículo 9 del RGPD, con medidas de seguridad reforzadas.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>7. Cesiones y transferencias internacionales</h2>
        <p style={{ marginBottom: '16px' }}>
          No cedemos tus datos personales a terceros, salvo en los siguientes supuestos:
        </p>
        <ul style={{ listStyle: 'disc', paddingLeft: '24px', marginBottom: '16px' }}>
          <li>Prestadores de servicios que actúan como encargados de tratamiento (alojamiento web, proveedores de email, plataformas de pago), siempre con contrato de encargado de tratamiento.</li>
          <li>Obligación legal o requerimiento de autoridad competente.</li>
        </ul>
        <p>
          En caso de transferencia internacional de datos, garantizamos que se dispone de una base
          válida (decisión de adecuación, cláusulas contractuales tipo u otras garantías).
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>8. Derecho a reclamar ante la AEPD</h2>
        <p>
          Si consideras que el tratamiento de tus datos personales vulnera la normativa, tienes
          derecho a presentar una reclamación ante la <strong>Agencia Española de Protección de
          Datos (AEPD)</strong> a través de su sitio web: <strong>www.aepd.es</strong>.
        </p>
      </section>
    </LegalLayout>
  )
}
