import LegalLayout from './LegalLayout'

export default function ComplianceAI() {
  return (
    <LegalLayout title="Compliance EU AI Act">
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>1. Alcance y aplicabilidad</h2>
        <p>
          El presente documento describe el cumplimiento de NextHorizont AI SL con el
          <strong>Reglamento (UE) 2024/1689</strong> del Parlamento Europeo y del Consejo, de 13 de
          junio de 2024, por el que se establecen normas armonizadas en materia de sistemas de
          inteligencia artificial (EU AI Act), cuya vigencia plena se producirá el
          <strong>2 de agosto de 2026</strong>.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>2. Clasificación del sistema de IA</h2>
        <p style={{ marginBottom: '16px' }}>
          Los sistemas de inteligencia artificial desplegados por NextHorizont AI SL en el sitio
          web nexthorizont.com y en la plataforma de seguimiento clínico se clasifican en la
          <strong>zona verde (Green Zone)</strong> del EU AI Act, concretamente como:
        </p>
        <ul style={{ listStyle: 'disc', paddingLeft: '24px', marginBottom: '16px' }}>
          <li>
            <strong>Sistemas de IA de uso limitado (Art. 52):</strong> pre-consulta inteligente
            que recoge síntomas y datos de salud para preparar la visita médica.
          </li>
          <li>
            <strong>Sistemas de apoyo administrativo y educativo:</strong> recordatorios de dosis,
            alertas de adherencia, contenido educativo personalizado y dashboards de progreso.
          </li>
        </ul>
        <p>
          <strong>En ningún caso</strong> nuestros sistemas de IA toman decisiones diagnósticas,
          terapéuticas o de prescripción de forma autónoma. Todas las decisiones clínicas son
          siempre realizadas por el <strong>Dr. Sergio Martínez Escobar</strong>, médico colegiado
          nº 04/1809464, o por personal médico cualificado bajo su supervisión directa.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>3. Transparencia hacia los usuarios</h2>
        <p style={{ marginBottom: '16px' }}>
          De conformidad con el artículo 52 del EU AI Act, informamos expresamente a los usuarios
          cuando interactúan con un sistema de inteligencia artificial:
        </p>
        <ul style={{ listStyle: 'disc', paddingLeft: '24px', marginBottom: '16px' }}>
          <li>
            Cada componente de IA de la plataforma incluye un <strong>aviso visible</strong> que
            indica: "Sistema educativo y administrativo. No toma decisiones clínicas autónomas."
          </li>
          <li>
            La calculadora de IMC y la pre-evaluación incluyen el <strong>disclaimer</strong>:
            "Este informe es educativo y no constituye diagnóstico médico."
          </li>
          <li>
            Los resultados generados por IA están claramente <strong>etiquetados</strong> y son
            revisados por personal médico antes de cualquier acción clínica.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>4. Medidas de mitigación de riesgos</h2>
        <p style={{ marginBottom: '16px' }}>
          Aunque clasificados en zona verde, NextHorizont AI SL implementa las siguientes medidas
          de gobernanza de IA:
        </p>
        <ul style={{ listStyle: 'disc', paddingLeft: '24px', marginBottom: '16px' }}>
          <li>
            <strong>Revisión humana en el bucle (human-in-the-loop):</strong> todo output de IA
            relacionado con datos de salud es revisado por el equipo médico antes de contactar
            al paciente.
          </li>
          <li>
            <strong>Logging de interacciones:</strong> registramos las interacciones con los
            sistemas de IA para auditoría, trazabilidad y mejora continua.
          </li>
          <li>
            <strong>Formación del personal:</strong> el equipo médico y administrativo recibe
            formación sobre el funcionamiento, límites y uso apropiado de los sistemas de IA.
          </li>
          <li>
            <strong>Actualización y mantenimiento:</strong> los modelos y sistemas de IA se
            actualizan regularmente para corregir sesgos, mejorar precisión y mantener seguridad.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>5. Protección de datos en sistemas de IA</h2>
        <p>
          Los sistemas de IA de NextHorizont AI SL procesan datos de salud (categoría especial
          según art. 9 RGPD). Garantizamos que dichos datos: (a) no se utilizan para entrenar
          modelos de IA de terceros sin consentimiento expreso; (b) se anonimizan cuando se
          utilizan para análisis estadístico o mejora de algoritmos; (c) se almacenan en
          infraestructura ubicada en la Unión Europea; (d) se protegen con cifrado en tránsito
          (TLS 1.3) y en reposo (AES-256).
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>6. Documentación técnica</h2>
        <p>
          NextHorizont AI SL mantiene documentación técnica actualizada de todos los sistemas de
          IA desplegados, incluyendo: descripción del sistema, datos de entrenamiento, métricas de
          rendimiento, medidas de mitigación de riesgos y procedimientos de supervisión humana.
          Dicha documentación está disponible para las autoridades competentes a solicitud.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>7. Reclasificación futura</h2>
        <p>
          NextHorizont AI SL se compromete a reevaluar la clasificación de sus sistemas de IA
          ante cualquier cambio significativo en su funcionalidad o en la regulación aplicable.
          En caso de que un sistema de IA evolucione hacia una categoría de riesgo superior
          (por ejemplo, sistema de IA de alto riesgo en el ámbito sanitario), se procederá a
          su registro conforme al art. 6 del Reglamento y a la implementación de los requisitos
          exigidos para dicha categoría.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>8. Contacto y responsable de compliance</h2>
        <p>
          Para cualquier consulta relacionada con el cumplimiento del EU AI Act, puedes
          contactar con nuestro Delegado de Protección de Datos y responsable de compliance:
          <br />
          <strong>Email:</strong> dpo@nexthorizont.com
          <br />
          <strong>Dirección postal:</strong> C/ Bulevar de El Ejido 231, Portal I, 3B,
          04700 El Ejido (Almería), España
        </p>
      </section>
    </LegalLayout>
  )
}
