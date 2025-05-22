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
                    Gracias por visitar el Sitio de GVA Abogados (en adelante el “Sitio”). Agradecemos su interés al considerarnos como sus posibles asesores jurídicos en Colombia.
                    La POLÍTICA DE PRIVACIDAD del Sitio hace parte integral de estos TÉRMINOS Y CONDICIONES. Por lo tanto, siempre que se haga en este texto referencia a los TÉRMINOS Y CONDICIONES, se estará haciendo también referencia a la POLÍTICA DE PRIVACIDAD de GVA Abogados.
                    Por favor dedique algún tiempo para leer y comprender estos TÉRMINOS Y CONDICIONES (en adelante los “TÉRMINOS Y CONDICIONES”) antes de usar este Sitio. El acceso y uso del Sitio indica que usted acepta y se obliga libremente al cumplimiento de estos TÉRMINOS Y CONDICIONES.
                    La escogencia de abogado no debe basarse únicamente en la información contenida en este Sitio.
                    1.	GVA: Este Sitio es operado por Gómez Valencia S.A.S. (“GVA Abogados”), empresa válidamente constituida en Colombia, dedicada a la prestación de servicios legales. Este Sitio contiene información general sobre GVA Abogados. En este Sitio, GVA Abogados no presta ningún tipo de servicio. El único y exclusivo propósito de los materiales, contenidos, información y opiniones incluidas en este Sitio es informativo. Los abogados de GVA Abogados no están autorizados para ejercer el derecho en jurisdicciones diferentes a aquellas en que las agencias y organismos correspondientes les han autorizado para tal efecto. La dirección en la cual usted puede contactar a GVA Abogados es la siguiente: administrativo@gomezvalencia.com. Este Sitio no tiene por finalidad la publicidad de los servicios legales de GVA Abogados, ni la consecución de nuevos clientes. En todo caso, hacemos la siguiente advertencia: LA OBTENCIÓN DE RESULTADOS EN EL PASADO NO GARANTIZAN RESULTADOS SIMILARES.

                </p>
                <h4>Requisito de edad</h4>
                <p>
                    Usted podrá acceder y usar este Sitio si usted es mayor de edad, de conformidad con las leyes aplicables. Si usted no es mayor de edad o no cuenta con las autorizaciones legales y capacidad requeridas para acceder y usar este Sitio, por favor absténgase de usarlo, abandónelo, y no acceda a sus funcionalidades. En todo caso, recomendamos a los padres y tutores de los menores supervisar el acceso de sus hijos al Sitio.
                </p>
                <h4>Acuerdo de uso del Sitio</h4>
                <p>
                    El ingreso a este Sitio indica que usted se ha comprometido a aceptar y cumplir con estos TÉRMINOS Y CONDICIONES. Si usted no está de acuerdo con estos TÉRMINOS Y CONDICIONES, no ingrese a este Sitio, absténgase de hacer uso del Sitio y los Contenidos, y abandónelo inmediatamente. Por favor tenga en cuenta que su derecho de acceder o ingresar a este Sitio podrá ser cancelado en cualquier momento por GVA Abogados sin previa notificación ni justificación alguna.
                </p>
                <h4>Transmisión electrónica de información</h4>
                <p>
                    Si usted decide contactar a GVA Abogados a través de este Sitio, por favor tenga en cuenta que la transmisión electrónica de información a través de las redes globales de comunicaciones puede no ser segura, y por lo tanto no existe garantía sobre la reserva, confidencialidad o seguridad de su información. Sea usted cliente o no de GVA Abogados, le agradecemos abstenerse de transmitir información que esté sujeta a reserva, confidencialidad o secreto de cualquier tipo, dado que GVA Abogados no puede asegurar la reserva, confidencialidad o secreto de esta, ni puede garantizar que tal información será tratada bajo el secreto profesional entre abogado y cliente.
                    GVA Abogados no asegura la integridad o la devolución de la información que usted envíe a través de este Sitio. Por favor no nos envíe su información personal, secreta, confidencial o reservada a través de medios electrónicos o físicos, salvo que GVA Abogados así lo haya autorizado expresamente y por escrito. 
                    Así mismo, absténgase de enviar a GVA Abogados información no solicitada, cadenas de correo o cualquier otra que pueda ser considerada como spam. Hacerlo significará la violación a estos TÉRMINOS Y CONDICIONES.

                </p>
                <h4>Inexistencia de vínculo contractual</h4>
                <p>
                    GVA Abogados no presta servicios legales a través del Sitio La información y materiales de este Sitio no tienen la intención de ser, ni deben ser interpretados como una opinión legal, recomendación legal o asesoría jurídica de ningún tipo. El acceso y uso de este sitio no representa ni crea una relación abogado-cliente o cualquier otro tipo de relación. Usted no puede ni debe utilizar el Sitio, los Contenidos del Sitio y la información contenida en el Sitio como una base o fundamento para elaborar estrategias jurídicas, legales, estructuración de negocios o para decidir sobre acciones legales. En ningún caso usted deberá entender que este Sitio reemplaza la consulta a un abogado. Si usted requiere asesoría jurídica, GVA Abogados le recomienda consultar inmediatamente con un abogado profesional quien podrá atender su caso y presentarle un diagnóstico. Por favor tenga en cuenta que la información contenida en este Sitio no es exhaustiva.
                </p>
                <h4>Modificación de los Términos y Condiciones</h4>
                <p>
                    GVA Abogados se reserva el derecho de modificar, cambiar o terminar estos TÉRMINOS Y CONDICIONES en cualquier momento y bajo su total discreción, sin necesidad de notificarle a usted previamente. GVA Abogados le advierte que es su deber visitar esta página regularmente para tener conocimiento de los cambios. En caso de terminación de estos TÉRMINOS Y CONDICIONES, usted no estará autorizado a acceder al Sitio. No obstante, las restricciones consentidas por usted respecto de la información contenida en este Sitio, las limitaciones de responsabilidad, indemnidades y demás concesiones, sobrevivirán a la terminación de estos TÉRMINOS Y CONDICIONES. GVA Abogados también se reserva el derecho a terminar el Sitio o cualquier porción de éste, en cualquier momento, bajo su total discreción, y sin necesidad de notificarle a usted personalmente.
                </p>
                <h4>Alcance del Contenido</h4>
                <p>
                    GVA Abogados es una firma de abogados cuya práctica legal se desarrolla enteramente en Colombia. Aun cuando algunos de nuestros abogados están autorizados para ejercer la práctica en el exterior, toda la información y Contenidos que usted encuentra en este Sitio tienen un alcance limitado exclusivamente a Colombia.
                </p>
                <h4>Cambios en el Contenido del Sitio</h4>
                <p>
                    GVA Abogados podrá, en cualquier momento, y sin previo aviso, modificar, adicionar, eliminar, suprimir, enmendar, y en cualquier forma cambiar los Contenidos de este Sitio incluyendo cualquier documento, dato, testimonio, reseña, referencia o información incluida en el Sitio. Por favor tenga en cuenta que la ley se encuentra en constante cambio y varía en consideración a un número de factores y circunstancias que incluyen la expedición de cualquier tipo de norma a nivel nacional y local, la expedición de decisiones judiciales a nivel nacional y local, de la actuación de los poderes ejecutivo, judicial y legislativo, entre otros. Por ello, la información contenida en este Sitio sobre el estado de normas o asuntos de interés jurídico puede no estar actualizada, puede no ser completa, y puede, en un momento determinado, no corresponder con la realidad ni ser aplicable a situaciones particulares. Le agracemos a usted no realizar ninguna acción o actuación basado en la información que usted encuentra en este Sitio.
                </p>
                <h4>Derechos propiedad, derechos de propiedad intelectual, marcas y registros</h4>
                <p>
                    Se prohíbe la modificación, reproducción, publicación o transferencia de cualquier Contenido a otras personas, o su uso para cualquier fin. Excepto en la medida en que la ley vigente lo permita, está prohibido desensamblar, descompilar, aplicar ingeniería inversa o intentar por cualquier medio romper la protección del contenido. Todos los contenidos, elementos e información de este Sitio incluyendo todo texto, formato, imágenes, música, marcas, logotipos, enseñas, nombres comerciales, sonidos, gráficos, videos, animación, y demás materiales de este Sitio (los “Contenidos”) son de propiedad de GVA Abogados, sus filiales y afiliadas y controlantes, y aquellos de terceros contratistas, licenciantes o cedentes que corresponda. Algunos de los Contenidos están protegidos por las leyes de derechos de autor y de marca registrada. Cualquier uso no autorizado sobre los Contenidos del Sitio que viole los derechos de propiedad y de propiedad intelectual de GVA Abogados o de terceros, y podrá implicar el inicio de las acciones legales correspondientes por parte de los titulares de los derechos. El acceso a o uso de este Sitio no implicará de ninguna manera la concesión o negación de cualquier licencia, concesión o derecho de uso sobre cualquiera de las marcas, nombres, logotipos, diseños o Contenidos protegidos por el derecho de propiedad intelectual de GVA Abogados o de cualquier tercero, según corresponda. No se permite la creación de páginas web, Sitios de Internet, documentos electrónicos o programas de computador o aplicaciones informáticas de cualquier tipo que contengan hipervínculos o marcas que redirijan al navegante a cualquier Contenido de este Sitio.
                </p>
                <h4>Uso del Sitio</h4>
                <p>
                    El acceso a este Sitio significa que usted ha aceptado que el uso que usted hará de él, de sus Contenidos e información, tendrá propósitos legítimos y legales, y se hará en cumplimiento de estos TÉRMINOS Y CONDICIONES y de todas y cualesquiera leyes aplicables. Particular pero no exclusivamente, el uso de este Sitio, sus Contenidos y la información contenida en el Sitio se encuentra limitado por lo siguiente: Usted acepta que no usará este Sitio, sus Contenidos o la información contenida en éste, para: (a) transmitir a terceros o de cualquier manera publicar información que es falsa, dañina, hostil, abusiva, irritante, problemática, amenazante, tortuosa, difamatoria, vulgar, obscena, pornográfica, infundada, odiosa o perjudicial, o respecto de la cual no se cuenta con las debidas autorizaciones legales o contractuales; (b) ocasionar daño a menores de edad o promover o efectuar daños físicos o materiales a cualquier persona o grupo de personas naturales y jurídicas, o a animales; (c) utilizar la identidad o la información personal de personas (naturales o jurídicas) mencionadas en el Sitio, para cualquier propósito o finalidad; (d) transmitir o emitir material que contenga virus informáticos o cualquier otro código, programa de computador o aplicación destinada a interrumpir, destruir, restringir o perjudicar la funcionalidad de computadores, programas de computador, sistemas de información, redes de telecomunicaciones o infraestructura y servicios de terceros; (e) de manera intencionada o sin intención violar o incumplir cualquier ley aplicable nacional, local, estatal o internacional, incluyendo pero sin limitarse a las normas de privacidad y protección de datos; (f) recolectar, guardar y administrar datos personales sobre personas naturales y jurídicas sin la correspondiente autorización y en incumplimiento de las leyes aplicables; (g) ejecutar, planear, armar, estructurar o realizar prácticas o actividades de carácter criminal; (h) infringir los derechos de propiedad intelectual de GVA Abogados o de terceros, entre otras conductas lesivas de terceros o de las leyes aplicables.
                </p>
                <h3>Licencia para el uso del Sitio</h3>
                <p>
                    Salvo por la licencia mencionada en esta sección, está prohibida la modificación, reproducción, decodificación, des-encriptación, desarme, aplicación de ingeniería de reversa, publicación, hiper-vinculación, transferencia a otras personas, o de cualquier otra manera la alteración o divulgación de los Contenidos y la información contenida en este Sitio sin permiso previo y por escrito de GVA Abogados. GVA Abogados le concede a usted una licencia limitada, no exclusiva y revocable para acceder, observar, imprimir y bajar cualquier Contenido de este Sitio siempre y cuando ello sea para la satisfacción de un interés personal de información. Esta licencia no incluye la autorización para la publicación, distribución, cesión, sublicenciamiento, transferencia, edición, venta, desarrollo de trabajos derivados o cualquier otro uso que no sea estrictamente para satisfacer una necesidad de información personal. En todo caso el Contenido y la información contenida en este Sitio, en todo o en parte, sea este gráfico o documental, no podrá ser reproducido en cualquier forma o incorporado en cualquier otro documento, medio o conjunto de datos que pueda ser recuperado posteriormente a su registro, de forma electrónica, mecánica, óptica o cualquier otra, salvo que su fin sea la satisfacción de los intereses personales aquí autorizados.
                </p>
                <h4>Consecuencias por el mal uso del Sitio</h4>
                <p>
                    Cualquier violación por parte de usted de estos TÉRMINOS Y CONDICIONES, o cualquier queja o información que GVA Abogados reciba de terceros sobre el incumplimiento, abuso o mal uso de estos TÉRMINOS Y CONDICIONES, podrá ser investigada por GVA Abogados, quien podrá tomar todas las medidas e iniciar todas las acciones legales y extra legales en contra de usted, para obtener la cesación de las conductas o los remedios e indemnizaciones a que haya lugar bajo la ley aplicable. La violación de estos TÉRMINOS Y CONDICIONES puede resultar en responsabilidad civil o penal de parte de usted. Si usted no está seguro de que sus acciones respecto del acceso y uso de este Sitio, sus Contenidos y la información en él mencionada, constituyen una violación o abuso de estos TÉRMINOS Y CONDICIONES, por favor no dude en consultarnos previamente. Gustosos atenderemos su consulta. Usted es el único responsable del acceso y uso que usted, con o sin intención, conocimiento o consentimiento, haga de este Sitio, los Contenidos y la información contenida en el Sitio.
                </p>
                <h4>No interferencia con el Sitio</h4>
                <p>
                    Está prohibido cualquier acto, incluyendo el uso de hardware y software, que tenga por objeto o como efecto el daño, la interferencia, la afectación de la integridad, o la interceptación de los sistemas que soportan este Sitio, su funcionamiento o los Contenidos. Están prohibidos los actos que imponen cargas irrazonables o desproporcionadas sobre los sistemas de red del Sitio o cualquier otra infraestructura de red que utilice el Sitio.
                </p>
                <h4>Vínculos a Sitios de terceros</h4>
                <p>
                    Por favor, tenga en cuenta que varios de los Sitios web enlazados o vinculados al Sitio no son operados, controlados o administrados por GVA Abogados, y GVA Abogados no es responsable por la disponiblidad, contenidos, políticas, prácticas, seguridad y bienes y servicios enunciados o promovidos en tales Sitios web, incluyendo sus políticas de privacidad y TÉRMINOS Y CONDICIONES de uso. Cualquier vínculo o enlace que se hace en el Sitio a Sitios web de terceras personas no constituyen el patrocinio, amparo, protección, defensa, garantía, tutela, respaldo o apadrinamiento por parte de GVA Abogados sobre el contenido, políticas, información, servicios o prácticas de tales Sitios web. El acceso y uso que usted haga de los Sitios web de terceras personas enlazados o vinculados al Sitio, usted lo hace bajo su propio riesgo.
                </p>
                <h4>Información y contenidos de terceros</h4>
                <p>
                    El Sitio puede reproducir o contener información proveniente de terceras personas que no trabajan para, ni están vinculadas en manera alguna a GVA Abogados. GVA Abogados no está en posición de verificar la veracidad de tal información. GVA Abogados no garantiza la veracidad y certeza de dicha información y contenidos. GVA Abogados le garantiza a usted que toda la información y contenidos de terceros que ha sido subida a o incluida en el Sitio ha sido previa y válidamente licenciada por los terceros titulares de los derechos morales y patrimoniales sobre la misma, y que GVA Abogados, respecto de tales informaciones y contenidos, no se encuentra en violación de ningún derecho de terceros.
                </p>
                <h4>Publicidad y acceso a servicios de terceros</h4>
                <p>
                    Usted entiende y acepta que cualquier comunicación, negociaciones, acuerdos o preacuerdos, participación en promociones, y cualquier otro tipo de relación que usted efectúe directamente con terceros a través del Sitio, incluyendo cualquier tipo de pago o acuerdo sobre bienes y servicios, y cualquier otro término, condición garantía o declaración asociada con productos y servicios de terceros, constituye un acuerdo existente exclusivamente entre usted y dicho tercero, sin que GVA Abogados tenga ningún tipo de participación, responsabilidad o injerencia en dicha relación.
                </p>
                <h4>Comentarios del usuario</h4>
                <p>
                    Usted podrá enviar a GVA Abogados sus comentarios y cualquier otro contenido incluyendo ideas, sugerencias e inquietudes sobre el Sitio o la información incluida en éste, siempre y cuando tal información no sea ilegal, falsa, dañina, hostil, abusiva, irritante, problemática, amenazante, tortuosa, difamatoria, vulgar, obscena, pornográfica, infundada, violatoria de derechos de propiedad intelectual, injuriosa, odiosa o perjudicial, o respecto de la cual usted no cuente con las debidas autorizaciones legales o contractuales, o que contenga algún tipo de virus informático, o consista en correo masivo, campañas políticas, publicidad, o cualquier forma de spam. El envío de cualquier contenido (incluyendo información personal) a GVA Abogados significa que usted ha otorgado a GVA Abogados una licencia no exclusiva y gratuita para publicar, editar, reproducir, modificar, reorganizar, traducir, adaptar, crear obras derivadas de, transferir a terceros, sublicenciar o de cualquier otra manera divulgar a nivel mundial la información que usted ha enviado, a través del Sitio o de cualquier otro medio, previo el cumplimiento de las normas de propiedad intelectual que resulten aplicables, y sin necesidad de notificarle a usted sobre el uso de tal información, ni requerir permisos, autorizaciones o consentimientos previos o por escrito de su parte. Esta licencia incluye el derecho de GVA Abogados, sus afiliadas, cesionarias y licenciatarias, a su total discreción, de utilizar y transferir entre sí el nombre que usted ha remitido con el contenido o información que usted ha enviado. Esta licencia y autorización se entenderá como el otorgamiento de su consentimiento para el uso de su información personal, de conformidad con las leyes, precedentes y regulaciones aplicables en materia de protección de datos y privacidad.
                </p>
                <h4>Información sobre experiencias y comentarios de usuarios</h4>
                <p>
                    Alguna información incluida en el Sitio que es provista por los usuarios del mismo o por el público en general tiene el fin exclusivo de ser discutida o servir como ejemplo. GVA Abogados sugiere que cualquier información que usted pueda encontrar en el Sitio sea discutida con abogados profesionales antes de formarse una idea o tomar decisiones con base en esa información.
                </p>
                <h4>Colaboración del usuario</h4>
                <p>
                    En caso que usted encuentre que alguno de los Contenidos de este Sitio o alguna de la información a los que usted acceda en este Sitio resulta inapropiada, ineficiente, contraria a la ley o a estos TÉRMINOS Y CONDICIONES, de baja calidad o en cualquier manera perjudicial para usted o para terceros, GVA Abogados le agradece mucho enviar sus comentarios a la dirección de contacto provista en estos TÉRMINOS Y CONDICIONES. GVA Abogados en todo caso se reserva todos los derechos de remover de o mantener la información en el Sitio.
                </p>
                <h4>Mejores esfuerzos</h4>
                <p>
                    GVA Abogados ha utilizado sus mejores esfuerzos para asegurar que todos los Contenidos y la información incluida en este Sitio sean correctos. Sin embargo, GVA Abogados no puede garantizar la veracidad de los Contenidos y la información del Sitio, por lo que no asume ninguna responsabilidad sobre la veracidad, exactitud, autenticidad, correspondencia con la realidad, fidelidad, exhaustividad, completitud, integridad o precisión de cualquier información y Contenidos incluidos en este Sitio.
                </p>
                <h4>No declaraciones ni garantías</h4>
                <p>
                    GVA Abogados, sus afiliadas, empleados, directores, agentes, oficiales, distribuidores, comercializadores, patrocinadores o licenciantes, no otorgan ninguna garantía, ni expresa ni implícita, en relación con este Sitio y todo su Contenido, el cual le es suministrado a usted TAL Y COMO ESTÁ y CON TODAS SUS FALLAS provenientes de la fuente. Cualquier información, originada por GVA Abogados o por cualquier tercero, que usted obtenga a través de este Sitio no tiene ni generará garantía alguna por parte de GVA Abogados. GVA Abogados, sus afiliadas, empleados, directores, agentes, oficiales, distribuidores, comercializadores, patrocinadores o licenciantes, no otorgan ninguna garantía, ni expresa ni implícita, en relación con la información contenida en el Sitio. GVA Abogados, sus afiliadas, empleados, directores, agentes, oficiales, distribuidores, comercializadores, patrocinadores o licenciantes, no otorgan ninguna garantía, ni expresa ni implícita, en relación con los materiales o contenidos que usted transmita a GVA Abogados a través de este Sitio, bien sea que los mismos estén o no sujetos a reserva, confidencialidad o secreto. Se rechazan y se niegan todas y cualquiera garantías explícitas o implícitas, especialmente pero sin limitarse a aquellas sobre la comercialización o comercialidad de la información contenida en el Sitio y del Sitio, sobre la calidad e idoneidad de la información de este Sitio y los Contenidos, sobre la no infracción o la adecuación o idoneidad para un propósito determinado o particular, la veracidad e integridad de los Contenidos y la información, los resultados obtenidos del uso del Sitio, los Contenidos o la información contenida en el Sitio, la seguridad de las redes, la calidad de los Contenidos y la información contenida en el Sitio, las relaciones contractuales, precontractuales y extracontractuales que usted sostenga con terceros a través del Sitio, la ausencia de virus informáticos, de firewalls, la seguridad de los elementos técnicos o componentes empleados en el acceso al Sitio o en los cuales el Sitio se fundamenta, garantías de cumplimiento, y la ausencia de errores. El usuario del Sitio será el único responsable de la operación, desempeño y seguridad de las redes (incluyendo wan, lan e inalámbricas) y los computadores sobre y en los cuales se accede al Sitio. El usuario del Sitio reconoce que el Sitio puede no estar disponible debido a un número de factores, incluyendo mas no limitado a causas de fuerza mayor, acceso no autorizado, virus informáticos, negación del servicio y otros ataques, fallas técnicas del servidor, fallas en la infraestructura de telecomunicaciones o discontinuidad. GVA Abogados renuncia expresamente a cualquier garantía expresa o implícita concerniente al uso del Sitio y/o a la disponibilidad, accesibilidad, seguridad, desempeño, o funcionamiento sin errores del mismo. GVA Abogados niega y rechaza cualquier garantía sobre la corrección de los defectos que pueda tener este Sitio y sus Contenidos, o sobre la no existencia de componentes técnicos o tecnológicos perjudiciales o dañinos.
                </p>
                <h4>No responsabilidad por reclamaciones o daños</h4>
                <p>
                    Usted como usuario del Sitio asume su propio riesgo al acceder a éste y usarlo, incluyendo el riesgo personal y de sus propiedades y las de terceros que pueda surgir por conocer, usar, compartir o bajar cualquier Contenido o información proporcionado en este Sitio o que sea de cualquiera otra manera obtenido por usted a través de este Sitio. Usted como usuario del Sitio será el único responsable por los daños que el acceso al Sitio pueda causar a los sistemas de información y comunicación que usted utiliza para acceder al mismo, incluyendo los daños por virus informático. GVA Abogados, sus afiliadas, empleados, directores, agentes, oficiales, distribuidores, comercializadores, patrocinadores o licenciantes, según lo permita la ley aplicable, no serán responsables en ningún caso, existiendo o no reclamaciones o acciones de cualquier tipo o forma, por cualquier daño, sea éste directo o indirecto, especial, punitivo, ejemplar, emergente, real, eventual o cualquiera otro, que se cause a o sufra el usuario del Sitio o cualquier tercero, incluyendo pero sin limitarse a daños a la integridad humana, propiedad, pérdida de uso, pérdida comercial, pérdida económica, pérdida de datos o pérdida de ganancias, daño que se cause en virtud de responsabilidad contractual, negligencia, y/o responsabilidad extracontractual, por el acceso y uso de los Contenidos de este Sitio o la utilización de la información contenida en el Sitio. EL ACCESO A Y USO DE ESTE SITIO SIGNIFICA QUE USTED HA ACEPTADO MANTENER INDEMNE A GVA Abogados POR O RESPECTO DE CUALQUIER RECLAMO, QUEJA, INVESTIGACIÓN ADMINISTRATIVA O JUDICIAL, ACCIÓN LEGAL O RESPONSABILIDAD PROBADA BASADA EN O RELATIVA A LA VIOLACIÓN DE ESTOS TÉRMINOS Y CONDICIONES POR PARTE DE GVA Abogados. EN CONSECUENCIA, USTED NO PODRÁ DEMANDAR O INSTAURAR ACCIONES DE NINGÚN TIPO, NI RECOBRAR NINGÚN TIPO DE INDEMNIZACIÓN POR DAÑOS O PERJUICIOS DE NINGÚN TIPO DE PARTE DE GVA Abogados COMO RESULTADO DE CUALQUIER DECISIÓN O ACCIÓN DE GVA Abogados EN LA ADMINISTRACIÓN, MANEJO, OPERACIÓN Y EJECUCIÓN DE ESTE SITIO. ESTA INDEMNIDAD APLICA A CUALQUIER VIOLACIÓN POR PARTE DE GVA Abogados DE ESTOS TÉRMINOS Y CONDICIONES.
                </p>
                <h4>Cláusula Compromisoria</h4>
                <p>
                   Cualquier controversia relacionada o que se genere en virtud o con ocasión de la aceptación, interpretación, ejecución de estos TÉRMINOS Y CONDICIONES o del uso o utilización que usted haga de este Sitio, los Contenidos y la información contenida en este Sitio, se resolverá mediante un Tribunal de Arbitramento ante la Cámara de Comercio de Armenia, de conformidad con las siguientes reglas: - El Tribunal se sujetará al reglamento del Centro de Arbitraje y Conciliación de la Cámara de Comercio de Armenia. - El Tribunal estará integrado por tres (3) árbitros, designados por la Cámara de Comercio de Armenia. - El Tribunal decidirá en derecho. - En caso de que la controversia sea de carácter técnico, la Cámara de Comercio designará un perito especializado en el tema. - El término para que el Tribunal se pronuncie de fondo será de tres (3) meses a partir de su constitución. - Los costos que se originen en la constitución y funcionamiento del Tribunal serán sufragados por partes iguales por quienes suscriben este convenio. La solución de una controversia a través del tribunal de arbitramento no suspende la ejecución del Contrato, salvo en los aspectos cuya ejecución dependa directa y necesariamente de la solución de la controversia. 
                </p>
                <h4>Ley aplicable</h4>
                <p>
                   Estos TÉRMINOS Y CONDICIONES serán interpretados y ejecutados exclusivamente de acuerdo a las leyes de la República de Colombia, sin perjuicio de las provisiones sobre conflicto de leyes de cualquier país. 
                </p>
                <h4>Modificaciones</h4>
                <p>
                    Ninguna sección de estos TÉRMINOS Y CONDICIONES podrá ser modificada, suprimida o agregada por el usuario del Sitio unilateralmente.
                </p>
                <h4>Aplicabilidad</h4>
                <p>
                    Si cualquier sección o parte de estos TÉRMINOS Y CONDICIONES no se puede aplicar o resulta inválida, en su totalidad o en parte, bajo cualquier ley, o sea sentenciada como tal por decisión judicial, dicha parte será interpretada de conformidad con la ley aplicable y su falta de aplicabilidad o invalidez no hará que estos TÉRMINOS Y CONDICIONES en general y las disposiciones remanentes o porciones de ellas sean inaplicables o inválidas o ineficaces en su totalidad y, en tal evento, dichas disposiciones serán cambiadas e interpretadas de tal manera que se logren de la mejor manera posible los objetivos de tales disposiciones no aplicables o inválidas, dentro de los límites de la ley aplicable o las decisiones aplicables de la corte.
                </p>
                <h4>Integridad Estos TÉRMINOS Y CONDICIONES</h4>
                <p>
                    Constituyen los únicos términos entre GVA Abogados y usted. La aceptación de estos TÉRMINOS Y CONDICIONES derogan cualquier acuerdo, pacto, declaración, entendimiento y garantía anterior o contemporáneo con respecto a este Sitio, el Contenido, la información contenida en este Sitio, y el objeto de estos Términos de Uso. En caso de cualquier conflicto entre estos TÉRMINOS Y CONDICIONES y cualquier acuerdo o entendimiento verbal, escrito o previo, prevalecerán estos TÉRMINOS Y CONDICIONES.
                </p>
                <h4>No renuncia</h4>
                <p>
                    La no aplicación de GVA Abogados de alguna de las condiciones, términos y derechos incluidos en estos TÉRMINOS Y CONDICIONES no será interpretada como desistimiento o renuncia del derecho de GVA Abogados en lo sucesivo de hacer cumplir o ejecutar dichas disposiciones.
                </p>
                <h4>Última actualización</h4>
                <p>
                    Estos TÉRMINOS Y CONDICIONES fueron actualizados por última vez 01 de mayo del 2025. Le recordamos que cuando usted accede y hace uso del Sitio, incluyendo todos y cualquiera de los Sitios web de GVA Abogados, entenderemos que usted se obliga libremente al cumplimiento de estos TÉRMINOS Y CONDICIONES.
                </p>
                <h4>Política de Tratamiento de la Información</h4>
                <div>
                    <strong>Generalidades</strong>
                    <strong>Objetivo</strong>                
                </div>
                <p>
                    La sociedad Gómez Valencia S.A.S. domiciliada en Armenia, Quindío, con dirección física Armenia, Quindío – Barrio Coinca – Calle 22 norte No. 9-18, dirección electrónica administrativo@gomezvalencia.com y teléfono (+57) 314 8739679 (de ahora en adelante la “Firma”) pone en conocimiento de los Titulares de los Datos Personales (como dichos términos se definen más adelante) que sus Datos Personales serán tratados de cualquier manera por la Firma, de acuerdo con la presente política de tratamiento de la información (la “Política”), dando cumplimiento con ello a la Ley 1581 de 2012, al Decreto 1377 de 2013 y a cualquier norma que los sustituya o modifique. El propósito principal de esta Política es poner en conocimiento de los Titulares de los Datos Personales los derechos que les asisten, los canales, procedimientos y mecanismos dispuestos por la Firma para ejercerlos; informar quiénes son las personas autorizadas dentro de la Firma de atender las consultas, preguntas, reclamos y quejas, y darles a conocer el alcance y la finalidad del Tratamiento (como dicho término se define más adelante) al cual serán sometidos los Datos Personales en caso de que el Titular otorgue su autorización expresa, previa e informada.
                </p>
                <strong>Alcance</strong>
                <p>
                    La presente Política aplica para todos los Titulares de los Datos Personales que sean tratados de cualquier manera por la Firma.
                </p>
                <strong>Definiciones</strong>
                <p>
                    Las expresiones utilizadas en mayúsculas en esta Política tendrán el significado que aquí se les otorga, o el significado que la Ley o la jurisprudencia aplicable les den, según dicha Ley o jurisprudencia sea modificada de tiempo en tiempo. Cualquier diferencia que exista entre los términos aquí definidos y los establecidos en la Ley, se preferirán aquellos señalados en la Ley.
                </p>
                <ul>
                    <li>Autorización: Es el consentimiento previo, expreso e informado del Titular para llevar a cabo el Tratamiento de sus Datos Personales.</li>
                    <li>Base de Datos: Es el conjunto organizado de Datos Personales que sean objeto de Tratamiento, electrónico o no, cualquiera que fuere la modalidad de su formación, almacenamiento, organización y acceso.</li>
                    <li>Dato Financiero: Es todo Dato Personal referido al nacimiento, ejecución y extinción de obligaciones dinerarias, independientemente de la naturaleza del contrato que les dé origen, cuyo Tratamiento se rige por la Ley 1266 de 2008 o las normas que la complementen, modifiquen o adicionen.</li>
                    <li>Dato Personal: Es cualquier información, vinculada o que pueda asociarse a una o varias personas naturales o jurídicas determinadas o determinables.</li>
                    <li>Dato Público: Es el Dato Personal calificado como tal según los mandatos de la Ley o de la Constitución Política y, en consecuencia, es aquel que no sea semiprivado, privado o sensible. Son públicos, entre otros, los datos relativos al estado civil de las personas, a su profesión u oficio, a su calidad de comerciante o de servidor público y aquellos que puedan obtenerse sin reserva alguna. Por su naturaleza, los datos públicos pueden estar contenidos, entre otros, en registros públicos, documentos públicos, gacetas y boletines oficiales, sentencias judiciales debidamente ejecutoriadas que no estén sometidas a reserva.</li>
                    <li>Dato Sensible: Es el Dato Personal que afecta la intimidad del Titular o cuyo uso indebido puede generar su discriminación, tales como aquellos que revelen afiliaciones sindicales, el origen racial o étnico, la orientación política, las convicciones religiosas, morales o filosóficas, la pertenencia a sindicatos , organizaciones sociales, de derechos humanos o que promueva intereses de cualquier partido político o que garanticen los derechos y garantías de partidos políticos de oposición, así como los datos relativos a la salud, a la vida sexual, y los datos biométricos.</li>
                    <li>Encargado del Tratamiento: Es la persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, realice el Tratamiento de Datos Personales por cuenta del Responsable del Tratamiento.</li>
                    <li>Responsable de Tratamiento: Es la persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, decida sobre la Base de Datos y/o el Tratamiento de los Datos Personales.</li>
                    <li>Titular: Es la persona natural cuyos Datos Personales sean objeto de Tratamiento, como consecuencia de la relación que tiene el Titular y la Firma.</li>
                    <li>Transferencia: Tiene lugar cuando el responsable y/o Encargado del Tratamiento de Datos Personales, ubicado en Colombia envía la información de los datos personales a un receptor, que a su vez es responsable del tratamiento y se encuentra dentro o fuera del país.</li>
                    <li>Transmisión: Tratamiento de Datos Personales que implica la comunicación a un tercero de los mismos dentro o fuera del territorio de la República de Colombia, cuando dicha comunicación tenga por objeto la realización de un Tratamiento por el Encargado en nombre y por cuenta del Responsable, para cumplir con las finalidades de este último.</li>
                    <li>Tratamiento: Es toda operación y procedimiento sistemático, electrónico o no, que permita la recolección, conservación, ordenamiento, almacenamiento, modificación, relacionamiento, uso, circulación, evaluación, bloqueo, destrucción y en general, el procesamiento de Datos Personales, así como también su Transferencia y/o Transmisión a terceros a través de comunicaciones, consultas, interconexiones, cesiones, mensajes de datos.</li>
                </ul>
                <strong>Políticas</strong>
                <strong>Principios</strong>
                <p>
                    La Firma, en el desarrollo de sus actividades comerciales recolectará, utilizará, almacenará, transmitirá, transferirá y en general Tratará los Datos Personales de los Titulares, de conformidad con las finalidades establecidas en la presente Política. En todo Tratamiento de Datos Personales realizado por la Firma, los responsables, Encargados y/o terceros a quienes se les transfiera Datos Personales, deberán dar cumplimiento a los principios y reglas establecidas en la Ley y en esta Política, con el fin de garantizar el derecho al habeas data de los Titulares y dar cumplimiento a las obligaciones de Ley y a los lineamientos internos de la Firma. Estos principios son:
                </p>
                <ul>
                    <li>Autorización previa: Todo Tratamiento de Datos Personales se llevará cabo una vez se haya obtenido la Autorización previa, expresa e informada del Titular, salvo que la Ley establezca una excepción a esta regla. En caso de que los Datos Personales hayan sido obtenidos con anterioridad a la expedición del Decreto 1377 de 2013, la Firma buscará los medios ordinarios y alternativos pertinentes para convocar a los Titulares y obtener su autorización retroactiva, siguiendo los lineamientos establecidos en dicho Decreto y las normas concordantes.</li>
                    <li>Finalidad autorizada: Toda actividad de Tratamiento de Datos Personales debe obedecer a las finalidades mencionadas en esta Política o a las mencionadas en la Autorización otorgada por el Titular de los Datos Personales, o en los documentos específicos donde se regule cada tipo o proceso de Tratamiento de Datos Personales. La finalidad del Tratamiento particular de un Dato Personal debe ser informada al Titular del Dato Personal al momento de obtener su Autorización. Los Datos Personales no podrán ser tratados por fuera de las finalidades informadas y consentidas por los Titulares de los Datos. </li>
                    <li>Calidad del Dato Personal: El Dato Personal sometido a Tratamiento debe ser veraz, completo, exacto, actualizado, comprobable y comprensible. Cuando se esté en poder de Datos Personales parciales, incompletos, fraccionados o que induzcan a error, la Firma deberá abstenerse de Tratarlos, o solicitar a su titular la completitud o corrección de la información.</li>
                    <li>Entrega de información al Titular: Cuando el Titular lo solicite, la Firma deberá entregarle la información acerca de la existencia de Datos Personales que le conciernan al solicitante. Esta entrega de información la llevará a cabo la dependencia de la Firma encargada de la protección de datos personales (ver punto 2.6 de la presente Política).</li>
                    <li>Circulación restringida: Los Datos Personales solo pueden ser Tratados por aquel personal de la Firma que cuente con autorización para ello, o quienes dentro de sus funciones tengan a cargo la realización de tales actividades. No podrá entregarse Datos Personales a quienes no cuenten con Autorización o no hayan sido habilitados por la Firma para llevar a cabo el Tratamiento.</li>
                    <li>Temporalidad: La Firma no usará la información del titular más allá del plazo razonable que exija la finalidad que fue informada al Titular de los Datos Personales.</li>
                    <li>Acceso restringido / Seguridad: Salvo por los Datos Personales expresamente autorizados, la Firma no podrá hacer disponibles Datos Personales para su acceso a través de internet u otros medios de comunicación masiva, a menos que se establezcan medidas técnicas y de seguridad que permitan controlar el acceso y restringirlo solo a las personas Autorizadas.</li>
                    <li>Confidencialidad: La Firma debe siempre realizar el Tratamiento disponiendo las medidas técnicas, humanas y administrativas que resulten necesarias para mantener la confidencialidad del Dato Personal y para evitar que sea éste adulterado, modificado, consultado, usado, accedido, eliminado, o conocido por personas no Autorizadas, o que el Dato Personal se pierda. Todo nuevo proyecto que implique el Tratamiento de Datos Personales por parte de la Firma deberá hacer referencia a esta Política de Tratamiento para asegurar el cumplimiento de esta regla.</li>
                    <li>Confidencialidad y Tratamiento posterior: Todo Dato Personal que no sea Dato Público debe tratarse por los Responsables como confidencial, aun cuando la relación contractual o el vínculo entre el Titular del Dato Personal y la Firma haya terminado. A la terminación de dicho vínculo, tales Datos Personales deben continuar siendo Tratados de conformidad con esta Política y con la Ley.</li>
                    <li>Individualidad: La Firma mantendrá de manera separada las Bases de Datos en las que tiene la calidad de Encargado de las Bases de Datos en las que es Responsable.</li>
                    <li>Necesidad: Los Datos Personales solo pueden ser Tratados durante el tiempo y en la medida que el propósito de su Tratamiento lo justifique. La Firma propenderá por recopilar única y exclusivamente los datos necesarios para cumplir a cabalidad con la regulación y las finalidades establecidas.</li>
                </ul>
                <strong>Tratamiento de Datos Personales</strong>
                <p>
                    Los Datos Personales son recolectados, almacenados, organizados, usados, circulados, transmitidos, transferidos, actualizados, rectificados, suprimidos, eliminados y gestionados de acuerdo con la finalidad o finalidades que tenga cada tipo de Tratamiento.
                </p>

                <p>Tratamiento de Datos Personales de niñas, niños y/o adolescentes</p>
                <p>
                    La Firma Tratará los Datos Personales de un menor de 18 años, siempre que exista el consentimiento previo y expreso de padres o tutores legales. En estos casos, los padres o tutores legales pueden cambiar o revocar la Autorización tal como se describe en esta Política.
                </p>
                <p>
                    Adicionalmente, el Tratamiento de los Datos Personales de niñas, niños y adolescentes, cumplirá con los siguientes parámetros y requisitos:
                </p>
                <ul>
                    <li>El Tratamiento responderá y respetará el interés superior de los niños, niñas y adolescentes.</li>
                    <li>En todo momento se asegurará el respeto de sus derechos fundamentales.</li>
                    <li>El niño, niña o adolescente será escuchado, y su opinión será valorada teniendo en cuenta la madurez, autonomía y capacidad para entender el asunto.</li>
                </ul>
                <p>Tratamiento de Datos Sensibles</p>
                <p>La Firma podrá solicitar los Datos Sensibles que expresamente se mencionarán en cada Autorización.</p>
                <p>En todo caso, la Firma observará estrictamente las limitaciones legales al Tratamiento de Datos Sensibles, sometiendo a Tratamiento los Datos Sensibles únicamente cuando el Titular haya otorgado su Autorización, salvo en los casos en que la ley no requiera de dicha Autorización. Cuando la Firma solicite Datos Sensibles, le informará qué tipo de Datos Personales tienen esta categoría y no condicionará, en ningún caso, ninguna actividad a la entrega de Datos Sensibles.</p>
                <p>
                    Los Datos Sensibles serán tratados con la mayor diligencia posible y con los estándares de seguridad y privacidad más altos. El acceso limitado a los Datos Sensibles será un principio rector para salvaguardar la privacidad de esos Datos Personales y, por lo tanto, solo el personal autorizado podrá tener acceso a ese tipo de información.
                </p>
                <strong>
                    Obligaciones de la Firma como Responsables
                </strong>
                <p>
                    Cuando la Firma actúe como Responsable tendrá las siguientes obligaciones y/o compromisos:
                </p>
                <ul>
                    <li>Contar con una autorización previa cuando así lo prevea la regulación aplicable.</li>
                    <li>Clasificar los datos solicitados.</li>
                    <li>Archivar y administrar la autorización dada por el titular.</li>
                    <li>Cumplir con los principios relacionadas en la presente Política.</li>
                    <li>Atender las consultas, quejas o reclamos presentadas por el titular.</li>
                    <li>Asegurar los datos suministrados a través de procedimientos relacionados con seguridad y privacidad de la información.</li>
                </ul>
                <p>
                    Así mismo, cuando actúe como Encargados o terceros y tenga acceso a Datos Personales mantendrán el Tratamiento dentro de las siguientes finalidades contempladas para la recopilación de dichos datos.
                </p>
                <strong>
                    Finalidades del Tratamiento 
                </strong>
                <p>
                    La Firma realizará el Tratamiento de los Datos Personales para las finalidades informadas al momento en que el Dato Personal sea recolectado y que sean expresamente consentidas.
                </p>
                <p>
                    Así mismo, los Encargados o terceros que tengan acceso a los Datos Personales por virtud de Ley o contrato, mantendrán el Tratamiento dentro de las siguientes finalidades aquí previstas o las informadas al momento de la recolección de los datos.
                </p>
                <ul>
                    <li>Gestionar toda la información necesaria para el cumplimiento de las obligaciones tributarias y de registros comerciales, corporativos y contables de la Firma.</li>
                    <li>Cumplir con los procesos internos de la Firma en materia de administración de proveedores y contratistas.</li>
                    <li>Prestar sus servicios de acuerdo con las necesidades particulares de los clientes de la Firma, con el fin de cumplir los contratos de servicios celebrados, incluyendo, pero sin limitarse a la verificación de afiliaciones y derechos de los individuos a los cuales los clientes de la Firma prestarán sus servicios, utilizar los Datos Personales para mercadeo y/o comercialización de nuevos servicios o productos.</li>
                    <li>El control y la prevención del fraude, lavado de activos, financiación del terrorismo y financiación de la proliferación de armas de destrucción masiva incluyendo, pero sin limitarse, a la consulta en listas vinculantes, y toda la información necesaria requerida para dar cumplimiento a la regulación de prevención del fraude, lavado de activos, financiamiento del terrorismo, financiamiento de la proliferación de armas de destrucción masiva, entre ello las siguientes actividades:</li>
                    <ul>
                        <li>Suministrar los datos personales a las autoridades de control y vigilancia, ya sean administrativas, de policía, judiciales, nacionales o internacionales. Lo anterior, en virtud de un requerimiento legal o reglamentario.</li>
                        <li>Usar y/o revelar información y datos personales, con el fin de defender los derechos y/o propiedad de la Firma, sus clientes, sitio web o de sus usuarios para la detección y prevención del fraude y para la detección, aprehensión o persecución de actos criminales.</li>
                        <li>Realizar el control y prevención de actividades ilícitas como el fraude, la corrupción, el lavado de activos y/o la financiación del terrorismo, incluyendo, pero sin limitarse a la consulta en listas vinculantes, restrictivas o bases de datos públicas.</li>
                        <li>Permitir el acceso a los datos personales a los auditories o terceros contratados para ejecutar y realizar procesos de auditoría interna o externa, propios de la actividad comercial que desarrolla la Firma.</li>
                    </ul>
                </ul>
                <strong>
                    Derechos del Titular de los Datos Personales
                </strong>
                <p>
                    De acuerdo con la Ley, los Titulares de Datos Personales tienen los siguientes derechos:
                </p>
                <ul>
                    <li>Derecho de actualización: Conocer, actualizar y rectificar sus Datos Personales frente a la Firma o los Encargados del Tratamiento de los mismos. Este derecho se podrá ejercer frente a Datos Personales parciales, inexactos, incompletos, fraccionados, que induzcan a error, o aquellos cuyo Tratamiento esté expresamente prohibido o no haya sido autorizado.</li>
                    <li>Derecho de prueba: Solicitar prueba de la Autorización otorgada a la Firma, salvo cuando expresamente se exceptúe como requisito para el Tratamiento, de conformidad con lo establecido en el artículo 10 de la Ley 1581 de 2012 (o en las normas que la reglamenten, adicionen, complementen, modifiquen o deroguen), o cuando se haya presentado la continuidad del Tratamiento según lo previsto en el numeral 4° del artículo 10 del Decreto 1377 de 2013.</li>
                    <li>Derecho de información: Presentar solicitudes ante la Firma o el Encargado del Tratamiento respecto del uso que le ha dado a sus Datos Personales, y a que éstas le entreguen tal información.</li>
                    <li>Derecho de quejas y reclamos: Presentar ante la Superintendencia de Industria y Comercio quejas por infracciones a la Ley, una vez haya agotado el trámite de consulta o reclamo ante la Firma de acuerdo con lo previsto en el artículo 16 de la Ley 1581 de 2012.</li>
                    <li>Derecho de revocación: Revocar su Autorización y/o solicitar la supresión de sus Datos Personales de las bases de datos de la Firma, cuando la Superintendencia de Industria y Comercio haya determinado mediante acto administrativo definitivo que en el Tratamiento la Firma o el Encargado del Tratamiento ha incurrido en conductas contrarias a la Ley o cuando no hay una obligación legal o contractual de mantener el Dato Personal en la Base de Datos del Responsable.</li>
                    <li>Derecho de acceso: Solicitar acceso y acceder en forma gratuita a sus Datos Personales que hayan sido objeto de Tratamiento de acuerdo con el artículo 21 del Decreto 1377 del 2013.</li>
                    <li>Derecho de conocimiento: Conocer las modificaciones a los términos de esta Política de manera previa y eficiente a la implementación de las nuevas modificaciones o, en su defecto, de la nueva política de tratamiento de la información. Así como conocer a la dependencia o persona facultada por la Firma frente a quien podrá presentar quejas, consultas, reclamos y cualquier otra solicitud sobre sus Datos Personales.</li>
                    <li>Derecho de supresión: Solicitar la supresión de sus Datos Personales de las Bases de Datos siempre y cuando no exista un deber legal o una obligación de carácter contractual en virtud de la cual no sea posible dicha supresión.</li>
                </ul>
                <p>
                    Los Titulares podrán ejercer sus derechos de Ley y realizar los procedimientos establecidos en esta Política, mediante la presentación de su documento de identificación o copia del mismo. Los menores de edad podrán ejercer sus derechos personalmente, o a través de sus padres o los adultos que detenten la patria potestad, quienes deberán demostrarlo mediante la documentación pertinente. Así mismo podrán ejercer los derechos del Titular los causahabientes que acrediten dicha calidad, el representante y/o apoderado del titular con la acreditación correspondiente y aquellos que han hecho una estipulación a favor de otro o para otro.
                </p>
                <strong>Área responsable de la atención de peticiones, consultas y reclamos</strong>
                <p>
                    La Firma ha designado a la gestión de Servicio al Cliente como área a cargo de la recepción y atención de peticiones, quejas, reclamos y consultas de todo tipo relacionadas con los Datos Personales. La persona designada de Servicio al Cliente tramitará las consultas y reclamaciones en materia de Datos Personales de conformidad con la Ley y esta Política.
                </p>
                <p>
                    Algunas de las funciones particulares de esta área en relación con Datos Personales son:
                </p>
                <ul>
                    <li>Recibir las solicitudes de los Titulares de Datos Personales, tramitar y responder aquellas que tengan fundamento en la Ley o esta Política, como por ejemplo: solicitudes de actualización de Datos Personales; solicitudes para conocer los Datos Personales; solicitudes de supresión de Datos Personales; solicitudes de información sobre el uso dado a sus Datos Personales; solicitudes de actualización de los Datos Personales; solicitudes de prueba de la Autorización otorgada, cuando ella hubiere procedido según la Ley, entre otras.</li>
                    <li>Dar respuesta a los Titulares de los Datos Personales sobre aquellas solicitudes que no procedan de acuerdo con la Ley.</li>
                    <li>Los datos de contacto del Servicio al Cliente son: <br />
                        <strong>Dirección física:</strong> Armenia, Quindío, Barrio Coinca, Calle 22 No. 9 - 18 <br />
                        <strong>Dirección electrónica:</strong> adminsitrativo@gomezvalencia.com <br />
                        <strong>Teléfono:</strong> 316-284-4083 <br />
                        <strong>Cargo de la persona de contacto:</strong> Asistente administrativa 
                    </li>
                </ul>
                <strong>Procedimientos para ejercer los derechos de los Titulares de los Datos Personales</strong>
                <strong>Consultas</strong>
                <p>
                    La Firma dispondrá de mecanismos para que el Titular, sus causahabientes, sus representantes y/o apoderados, aquellos a quienes se ha estipulado a favor de otro o para otro, y/o los representantes de menores de edad Titulares, formulen consultas respecto de cuáles son los Datos Personales del Titular que reposan en las Bases de Datos de la Firma.
                </p>
                <p>
                    Estos mecanismos podrán ser físicos como trámite de ventanilla, electrónicos a través del correo de Servicio al Cliente administrativo@gomezvalencia.com o telefónicamente en la línea de atención 316-284-4083, encargados de recibir las peticiones, quejas y reclamos en los teléfonos.
                </p>
                <p>
                    Cualquiera que sea el medio, la Firma guardará prueba de la consulta y su respuesta. En consecuencia, los siguientes son los pasos a seguir para la presentación de consultas:
                </p>
                <ul>
                    <li>Las solicitudes se deberán formular por escrito.</li>
                    <li>La solicitud será analizada para verificar la identificación del Titular. Si la solicitud es formulada por persona distinta del Titular y no se acredite que la misma actúa en representación de aquél de conformidad con las leyes vigentes, la solicitud será rechazada. Para ello la Firma puede solicitar el documento de identificación del Titular o copia del mismo, y los poderes especiales, generales o documentos que se exijan según sea el caso.</li>
                    <li>Si el solicitante tuviere capacidad para formular la consulta, de conformidad con los criterios de acreditación establecidos en la Ley 1581 de 2012 y el Decreto 1377 de 2013, la Firma recopilará toda la información sobre el Titular que esté contenida en el registro individual de esa persona o que esté vinculada con la identificación del Titular dentro de las Bases de Datos de la Firma.</li>
                    <li>La persona asignada para atender la consulta dará respuesta dentro de los diez (10) días hábiles contados a partir de la fecha en la que la solicitud fue recibida por la Firma.</li>
                    <li>En todo caso, la respuesta definitiva a todas las solicitudes no tardará más de quince (15) días hábiles desde la fecha en la que la solicitud inicial fue recibida por la Firma.</li>
                </ul>
                <strong>Reclamos</strong>
                <p>
                    La Firma dispone de mecanismos para que el Titular, sus causahabientes, representante y/o apoderados, aquellos que estipularon por otro o para otro, y/o los representantes de menores de edad Titulares, formulen reclamos respecto de: (i) Datos Personales Tratados por la Firma que deben ser objeto de corrección, actualización, supresión o revocatoria de la Autorización o (ii) el presunto incumplimiento de los deberes de Ley de la Firma.
                </p>
                <p>
                    Estos mecanismos podrán ser físicos como trámite de ventanilla, electrónicos a través del correo de Servicio al Cliente para los asuntos relacionados con esta Política administrativo@gomezvalencia.com telefónicamente en la línea de atención 316-284-4083, encargados de recibir las peticiones, quejas y reclamos en los teléfonos.
                </p>
                <p>
                    Cualquiera que sea el medio, la Firma guardará prueba del reclamo y su respuesta. En consecuencia, los siguientes son los pasos a seguir para la presentación de reclamos:
                </p>
                <ul>
                    <li>El reclamo se formulará mediante solicitud escrita.</li>
                    <li>La solicitud será analizada para verificar la identificación del Titular. Si la solicitud es formulada por persona distinta del Titular y no se acredite que la misma actúa en representación de aquél de conformidad con las leyes vigentes, la solicitud será rechazada. Para ello la Firma puede solicitar la cédula de ciudadanía o documento de identificación original del Titular, y los poderes especiales, generales o documentos que se exijan según sea el caso.</li>
                    <li>El reclamo debe contener la siguiente información: (i) Nombre y número de documento de identificación del Titular. (ii) Los datos de contacto (dirección física y/o electrónica y teléfonos de contacto). (iii) Los documentos que acrediten la identidad del Titular, o la representación de su representante. (iv) La descripción clara y precisa de los Datos Personales respecto de los cuales el Titular busca ejercer alguno de los derechos. (v) La descripción de los hechos que dan lugar al reclamo y el objetivo perseguido (actualización, corrección, revocatoria, supresión, o cumplimiento de deberes). (vi) Los documentos que se quiera hacer valer. (vii) Firma, correo electrónico, nombre y número de identificación del solicitante del reclamo.</li>
                    <li>Si el reclamo o la documentación adicional están incompletos, la Firma requerirá al reclamante por una sola vez dentro de los cinco (5) días siguientes a la recepción del reclamo para que subsane las fallas. Si el reclamante no presenta la documentación e información requerida dentro de los dos (2) meses siguientes a la fecha del reclamo inicial, sin que el solicitante presente la información requerida, se entenderá que ha desistido del reclamo.</li>
                    <li>Si por cualquier hecho la persona que recibe el reclamo al interior de la Firma no es competente para resolverlo, dará traslado al Analista de Servicio al Cliente dentro de los dos (2) días hábiles siguientes a haber recibido el reclamo, e informará de dicha remisión al reclamante.</li>
                    <li>Una vez recibido el reclamo con la documentación completa, se incluirá en la Base de Datos de la Firma donde reposen los Datos del Titular sujetos a reclamo una leyenda que diga “reclamo en trámite” y el motivo del mismo, en un término no mayor a dos (2) días hábiles. Esta leyenda deberá mantenerse hasta que el reclamo sea decidido.</li>
                    <li>El término máximo para atender el reclamo será de quince (15) días hábiles contados a partir del día hábil siguiente a la fecha de su recibo. Cuando no fuere posible atender el reclamo dentro de dicho término, se informará al interesado los motivos de la demora y la fecha en que se atenderá su reclamo, la cual en ningún caso podrá superar los ocho (8) días hábiles siguientes al vencimiento del primer término.</li>
                </ul>
                <strong>
                    Revocatoria
                </strong>
                <p>
                    El Titular puede revocar la Autorización para el Tratamiento de sus Datos Personales en cualquier momento, siempre y cuando no lo impida una disposición legal o exista una obligación legal o contractual.
                </p>
                <strong>
                    Seguridad y Privacidad de la Información
                </strong>
                <p>
                    En desarrollo del principio de seguridad y privacidad, la Firma ha adoptado medidas técnicas, administrativas y humanas razonables para proteger los Datos Personales de los Titulares e impedir adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento. El acceso a los datos personales está restringido a sus Titulares y a las personas autorizadas por la Firma de acuerdo con esta Política. La Firma no permitirá el acceso a esta información por parte de terceros en condiciones diferentes a las anunciadas, a excepción de un pedido expreso del Titular o de las personas legitimadas de conformidad con la normatividad nacional.
                </p>
                <p>
                    Es importante tener en cuenta que internet es una red global de comunicación que implica la transmisión de información en una red mundial. En este sentido, pese a que la Firma cuenta con medidas necesarias para la protección de los Datos Personales, es posible que los mismos se vean afectados por las fallas propias de internet.
                </p>
                <strong>
                    Transferencia y Transmisión de Datos Personales.
                </strong>
                <p>
                    La Firma cuando realice o ejecute transferencias o transmisiones de datos personales de los titulares, garantizará el cumplimiento estricto y eficaz, atendiendo el literal a) del artículo 26 de la Ley 1581 del año 2012.
                </p>
                <strong>
                    Video de Vigilancia
                </strong>
                <p>
                    La Firma a través de medios magnéticos y/o tecnológicos instalados en el interior y exterior de sus instalaciones, realiza videos o imágenes diarias de las personas que ingresan o tienen acceso al inmueble donde se desarrollan los servicios contemplados en el objeto social de la Firma. Por lo tanto, Gómez Valencia informará sobre la existencia de estos mecanismos de seguridad y privacidad, a través de avisos o carteles, los cuales estarán ubicados en diferentes espacios del edificio para que estén visualmente al alcance de los titulares. El aviso contemplará que, la finalidad recolectada será, la de proporcionar espacios de seguridad y privacidad a nuestros titulares y proteger los bienes de la Firma. Asimismo, la información recolectada podrá ser usada como prueba ante cualquier autoridad, de acuerdo con la regulación aplicable.
                </p>
                <p>
                    Adicionalmente, los videos de vigilancia garantizarán el derecho a la intimidad personal.
                </p>
                <strong>
                    Vigencia
                </strong>
                <p>
                   Esta Política rige a partir del 01 de enero del año 2025. Los Datos Personales que sean almacenados, utilizados o transmitidos permanecerán en nuestra Base de Datos, con base en el criterio de temporalidad y necesidad, durante el tiempo que sea necesario para las finalidades mencionadas en esta Política y la respectiva Autorización, para las cuales fueron recolectados. 
                </p>
                <strong>
                    Modificaciones
                </strong>
                <p>
                    Esta Política podrá ser modificada por la Firma cuando así lo requiera sin previa notificación, siempre que se trate de modificaciones no sustanciales. De lo contrario, serán comunicadas previamente a los Titulares.
                </p>
                <strong>
                     Anexos
                </strong>
                <p>
                    Anexo A: Finalidades específicas.
                </p>
                <h4>Referencias</h4>
                <ul>
                    <li>Artículo 15 de la Constitución Política de Colombia. Derecho a su intimidad personal y familiar y a su buen nombre.</li>
                    <li>Circular Única de la Superintendencia de Industria y Comercio.</li>
                    <li>Ley 1581 de 2012. Por la cual se dictan disposiciones generales para la protección de datos personales.</li>
                    <li>Decreto 1074 de 2015. Por el cual se reglamenta parcialmente la Ley 1581 de 2012.</li>
                    <li>Circular 886 de 2014. Por la cual se reglamente el artículo 25 de la Ley 1581 de 2012, relativo al Registro Nacional de Bases de Datos.</li>
                    <li>Circular Externa 02 de 2015. Por la cual la Superintendencia de Industria y Comercio impartió instrucciones a los responsables del tratamiento de datos personales, personas jurídicas de naturaleza privada inscritas en las cámaras de comercio y sociedades de economía mixta, para efectos de realizar la inscripción de sus bases de datos en el registro nacional de bases de datos a partir del 9 de noviembre de 2015.</li>
                    <li>Decreto 1074 de 2015. Por medio del cual se expide el Decreto Único Reglamentario del Sector Comercio, Industria y Turismo.</li>
                    <li>Norma ISO/IEC 27701: Extensión Norma ISO/IEC 27001 e ISO/IEC 27002, Requerimientos para la implementación de un Sistema de Gestión de Privacidad de la Información.</li>
                </ul>
                <p>
                    ANEXO A
                </p>
                <strong>
                    Finalidades específicas. 
                </strong>
                <p>
                    Gómez Valencia S.A.S., (en adelante “La Firma”) realiza el tratamiento de Datos Personales, teniendo en cuenta las siguientes finalidades específicas:
                </p>    
                <p>CLIENTES Y POTENCIALES CLIENTES</p>    
                <ul>
                    <li>Cumplir con las obligaciones legales y contractuales.</li>
                    <li>Ejecutar en debida forma los servicios contratados, así como su facturación y cobro.</li>
                    <li>Promocionar todos los servicios que ofrece la Firma.</li>
                    <li>Cumplir con la regulación tributaria colombiana.</li>
                    <li>Enviar información relacionada con la asesoría y productos y servicios.</li>
                    <li>Validar la aptitud jurídica y comercial.</li>
                    <li>Controlar fines estadísticos.</li>
                    <li>Dar cumplimiento a los requerimientos de las autoridades administrativas o judiciales.</li>
                    <li>Realizar las validaciones para dar cumplimiento a la regulación de prevención del lavado de activos, financiamiento del terrorismo y financiamiento de la proliferación de armas de destrucción masiva, así como la regulación de prevención de la corrupción.</li>
                </ul>     

                <p>ACCIONISTAS:</p>
                <ul>
                    <li>Cumplir con las obligaciones legales y contractuales.</li>
                    <li>Ejecutar trámites relacionados con la venta, cesión o enajenación de acciones.</li>
                    <li>Realizar inscripciones ante el registro mercantil de la Cámara de Comercio.</li>
                    <li>Realizar las actividades relativas al pago de dividendos.</li>
                </ul>
                <p>
                    PROVEEDORES Y POTENCIALES PROVEEDORES:
                </p> 
                <ul>
                    <li>Cumplir con la regulación tributaria colombiana</li>
                    <li>Surtir el proceso de validación de contrapartes.</li>
                    <li>Cumplir con las obligaciones legales y contractuales.</li>
                    <li>Reportar a las autoridades.</li>
                    <li>Realizar pagos a proveedores.</li>
                    <li>Realizar las validaciones para dar cumplimiento a la regulación de prevención del lavado de activos, financiamiento del terrorismo y financiamiento de la proliferación de armas de destrucción masiva, así como la regulación de prevención de la corrupción.</li>
                </ul> 
                <p>
                    EMPLEADOS Y CANDIDATOS:
                </p>
                <ul>
                    <li>Cumplir con las obligaciones legales y contractuales.</li>
                    <li>Realizar actividades de bienestar.</li>
                    <li>Desarrollar y gestionar procesos de reclutamiento, selección y contratación de personal.</li>
                    <li>Evaluar el desempeño de los empleados, así como procesos de promoción.</li>
                    <li>Gestionar el control de asistencia, cumplimiento de horarios de trabajo, acceso físico y logístico a instalaciones y activos de la empresa.</li>
                    <li>Evaluar riesgos.</li>
                    <li>Realizar encuestas de Clima Organizacional.</li>
                    <li>Capacitar a nuestros empleados.</li>
                    <li>Desarrollar campañas internas.</li>
                </ul>

                <h4>Política de Seguridad de la Información</h4>
                <strong>
                    Generalidades
                </strong>
                <strong>
                    Objetivo
                </strong>
                <p>
                    Establecer la Política del Sistema de Gestión de Seguridad y Privacidad de la Información de Gómez Valencia S.A.S. (GVA Abogados), garantizando que:
                </p>
                <ul>
                    <li>Sea apropiada al propósito de la Firma.</li>
                    <li>Provea la base para el establecimiento de los objetivos relacionados con la seguridad y la privacidad de la información.</li>
                    <li>Incluya el compromiso de satisfacer los requerimientos aplicables relacionados con seguridad y privacidad de la información.</li>
                    <li>Incluya el compromiso con la mejora continua del Sistema de Gestión de Seguridad y Privacidad de la Información.</li>
                </ul>
                <strong>
                    Alcance
                </strong>
                <p>
                    Este documento contiene la Política adoptada por GVA Abogados para el Sistema de Gestión de Seguridad y Privacidad de la Información y está dirigida a todos los empleados, Unidades de Apoyo, Equipos de Alto Rendimiento (EAR), proveedores y contratistas de la Firma.. 
                </p>
                <strong>
                    Definiciones
                </strong>
                <ul>
                    <li><strong>Activo de Información:</strong> Se refiere a cualquier información o elemento relacionado con el tratamiento de la misma (sistemas, soportes, personas) que tenga valor para la organización.</li>
                    <li><strong>Confidencialidad:</strong> Propiedad que determina que la información no esté disponible ni sea revelada a individuos, entidades o procesos no autorizados.</li>
                    <li><strong>Dato personal:</strong> Es cualquier información, vinculada o que pueda asociarse a una o varias personas naturales o jurídicas determinadas o determinables.</li>
                    <li><strong>Disponibilidad:</strong> Propiedad de que la información sea accesible y utilizable por solicitud de una entidad autorizada.</li>
                    <li><strong>Gestión del Riesgo:</strong> Actividades coordinadas para dirigir y controlar una organización con respecto al riesgo.</li>
                    <li><strong>Incidente de seguridad:</strong> Un evento adverso en un entorno informático, que compromete la confidencialidad, integridad o disponibilidad de la información. Es una violación a una política de seguridad de la información, política aceptable de uso o mejores prácticas de seguridad.</li>
                    <li><strong>Información:</strong> Conjunto de datos, ya procesados y ordenados para su comprensión, que aportan nuevos conocimientos a un individuo o sistema sobre un asunto, materia, fenómeno o ente determinado.</li>
                    <li><strong>Integridad:</strong>Propiedad de salvaguardar la exactitud y estado completo de los activos.</li>
                    <li><strong>Mejora Continua:</strong> Acción permanente realizada con el fin de aumentar la capacidad para cumplir los requisitos y optimizar el desempeño.</li>
                    <li><strong>Privacidad:</strong> Ámbito de la vida privada que se tiene derecho a proteger de cualquier intromisión.</li>
                    <li><strong>Riesgo:</strong> Efecto de la incertidumbre sobre los objetivos.</li>
                </ul>
                <strong>Responsable</strong>
                <p>
                    Este documento es generado por el/la Oficial de Seguridad de la Información, revisado y aprobado por el Grupo de Trabajo de Seguridad y Privacidad de la Información.
                </p>
                <p>
                    Es responsabilidad de todo el personal de GVA Abogados seguir los parámetros especificados en esta política.
                </p>
                <p>
                    Es responsabilidad del/de la Oficial de Seguridad de la Información verificar el cumplimiento en todas las áreas de la Firma.
                </p>
                <strong>Políticas</strong>

                <h4>Política del Sistema de Gestión de Seguridad y Privacidad de la Información</h4>
                <p>
                    Con el fin de cumplir con la misión de estar a la vanguardia para simplificar lo complejo, agregar valor a nuestro entorno, transformar la industria legal y dejar un legado duradero, por medio de un equipo multidisciplinario de abogados especializados en las diversas áreas de práctica del Derecho de los Negocios y con el objetivo de realizar la gestión adecuada de los riesgos a los cuales se encuentra expuesta la información en el desarrollo de sus operaciones, GVA Abogados, ha adoptado un Sistema de Gestión de Seguridad y Privacidad de la Información orientado a garantizar la confidencialidad, integridad, disponibilidad y privacidad de la información de sus clientes y de la Firma.
                </p>
                <p>
                    Por ello, siguiendo un proceso de crecimiento constante, se compromete a:
                </p>
                <ol>
                    <li>Preservar la confidencialidad, integridad, disponibilidad y privacidad de la información como activo de valor estratégico para la prestación del servicio y la toma de decisiones eficientes.</li><br />
                    <li>Proteger la información y sus instalaciones de procesamiento como parte de una estrategia orientada a la gestión de riesgos, la continuidad del negocio y la consolidación de una cultura de seguridad y privacidad de la información.</li><br />
                    <li>Identificar y minimizar los riesgos a los cuales se expone la información, con el fin de garantizar el cumplimiento de los requerimientos legales, contractuales, regulatorios y de negocio vigentes y de esta forma mejorar la competitividad en el mercado y maximizar la rentabilidad para garantizar la auto sostenibilidad y crecimiento de la Firma.</li><br />
                    <li>Implementar y mantener como parte del desarrollo del Sistema de Gestión de Seguridad y Privacidad de la Información, programas y planes de capacitación, entrenamiento y concientización de manera que se contribuya a minimizar la probabilidad de ocurrencia y el eventual impacto de incidentes de seguridad y privacidad de la información.</li><br />
                    <li>Cuidar y dar el tratamiento adecuado a los datos personales que reposen en las bases de datos bajo la responsabilidad de la Firma, de acuerdo con lo establecido en la Ley 1581 de 2012.</li><br />
                    <li>Garantizar la mejora continua y el desempeño esperado de seguridad y privacidad en los procesos de la Firma.</li>
                </ol>
                <p>
                    Esta Política debe ser cumplida por todos los empleados, proveedores y contratistas de GVA Abogados. El incumplimiento de la misma se considera un incidente de seguridad de la información y una violación al Reglamento Interno de Trabajo, y debe ser tratado de acuerdo con los procedimientos y políticas de la Firma en este aspecto. Ver. Capítulo “Escala de faltas y sanciones disciplinarias” en el Reglamento Interno de Trabajo Gómez Valencia S.A.S. 
                </p>
                <strong>
                     Referencias
                </strong>
                <ul>
                    <li>Ley 1581 de 2012: La Ley de Protección de Datos Personales reconoce y protege el derecho que tienen todas las personas a conocer, actualizar y rectificar la información que se haya recogido sobre ellas en bases de datos o archivos que sean susceptibles de tratamiento por Firma es de naturaleza pública o privada.</li>                    
                </ul>

                                        
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
