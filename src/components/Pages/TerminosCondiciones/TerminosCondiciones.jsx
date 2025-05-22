import React, { useState } from "react";
import "./TerminosCondiciones.css";
import { useNavigate } from "react-router-dom";


const TerminosCondiciones = () => {
    const [showFull, setShowFull] = useState(false);
    const navigate = useNavigate();


    return (
        <div className="tc-container">
            <div className="tc-header">
                <h2>Términos y Condiciones de Uso</h2>
                <p className="tc-date">Última actualización: 01 de mayo de 2025</p>
            </div>
            <div className={`tc-content ${showFull ? "tc-full" : "tc-collapsed"}`}>
                <h3>Aviso Legal</h3>
                <p>
                    Gracias por visitar el Sitio de GVA Abogados. El acceso y uso de este Sitio implica la aceptación de estos Términos y Condiciones, así como de la Política de Privacidad. Si no está de acuerdo, por favor absténgase de usarlo.
                </p>
                <h4>Requisito de edad</h4>
                <p>
                    Solo pueden acceder y usar este Sitio las personas que sean mayores de edad según la ley aplicable. Se recomienda la supervisión de padres o tutores para menores.
                </p>
                <h4>Acuerdo de uso del Sitio</h4>
                <p>
                    El ingreso al Sitio implica su compromiso de aceptar y cumplir estos Términos y Condiciones. GVA Abogados puede cancelar el acceso en cualquier momento.
                </p>
                <h4>Transmisión electrónica de información</h4>
                <p>
                    La transmisión de información a través de este Sitio puede no ser segura. No envíe información confidencial o reservada salvo autorización expresa y por escrito.
                </p>
                <h4>Inexistencia de vínculo contractual</h4>
                <p>
                    Este Sitio no constituye asesoría legal ni crea una relación abogado-cliente. Para asesoría, consulte directamente a un profesional.
                </p>
                <h4>Modificación de los Términos y Condiciones</h4>
                <p>
                    GVA Abogados puede modificar estos Términos y Condiciones en cualquier momento y sin previo aviso. Revise periódicamente esta página.
                </p>
                <h4>Propiedad intelectual</h4>
                <p>
                    Todo el contenido del Sitio es propiedad de GVA Abogados o de terceros licenciantes. Está prohibida su reproducción, publicación o transferencia sin autorización.
                </p>
                <h4>Uso del Sitio</h4>
                <p>
                    El uso del Sitio debe ser legítimo y conforme a la ley. No se permite la transmisión de información falsa, dañina, ilegal o no autorizada.
                </p>
                <h4>Licencia limitada</h4>
                <p>
                    Se concede una licencia limitada, no exclusiva y revocable para acceder y descargar contenidos solo para uso personal informativo.
                </p>
                <h4>Responsabilidad</h4>
                <p>
                    El usuario asume el riesgo del uso del Sitio. GVA Abogados no será responsable por daños directos o indirectos derivados del uso del Sitio.
                </p>
                <h3>Política de Privacidad y Tratamiento de Datos</h3>
                <p>
                    GVA Abogados recolecta y trata datos personales conforme a la Ley 1581 de 2012 y demás normas aplicables. Los titulares tienen derecho a conocer, actualizar, rectificar y suprimir sus datos, así como a revocar la autorización otorgada.
                </p>
                <ul>
                    <li><b>Finalidades:</b> Cumplimiento de obligaciones legales, prestación de servicios, control y prevención de fraude, y demás finalidades informadas al momento de la recolección.</li>
                    <li><b>Seguridad:</b> Se han adoptado medidas técnicas y administrativas para proteger los datos personales.</li>
                    <li><b>Contacto para consultas y reclamos:</b> administrativo@gomezvalencia.com, Calle 22 norte No. 9-18, Armenia, Quindío, Tel: 316-284-4083.</li>
                </ul>
                <h4>Vigencia</h4>
                <p>
                    Esta política rige desde el 1 de enero de 2025. GVA Abogados podrá modificarla en cualquier momento.
                </p>
                <h4>Ley aplicable</h4>
                <p>
                    Estos Términos y Condiciones se rigen por la ley colombiana.
                </p>
                <h4>Contacto</h4>
                <p>
                    Si tiene dudas sobre estos términos, puede escribir a: administrativo@gomezvalencia.com
                </p>
                {/* Puedes agregar aquí el resto de las secciones relevantes, siguiendo la estructura del documento fuente */}
            </div>
            <div className="tc-footer">
                <button
                    type="button"
                    className="tc-btn"
                    onClick={() => navigate(-1)}>
                    Volver atrás
                </button>
                {!showFull && (
                    <button className="tc-btn" onClick={() => setShowFull(true)}>
                        Leer todos los términos
                    </button>
                )}
                {showFull && (
                    <button className="tc-btn" onClick={() => setShowFull(false)}>
                        Mostrar menos
                    </button>
                )}
            </div>
        </div>
    );
};

export default TerminosCondiciones;
