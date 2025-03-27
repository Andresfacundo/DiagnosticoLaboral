import React, { useEffect, useState } from "react";
import { obtenerDiagnostico } from "../../../Services/api";

const Diagnostico = () => {
    const [resultado, setResultado] = useState(null);

    useEffect(() => {
        obtenerDiagnostico().then(setResultado);
    }, []);

    return (
        <div>
            <h2>Resultado del Diagnóstico</h2>
            {resultado ? <p>Porcentaje de cumplimiento: {resultado.resultado}%</p> : <p>Cargando...</p>}
        </div>
    );
};

export default Diagnostico;
