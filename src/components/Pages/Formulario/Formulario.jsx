import React, { useState } from "react";

const Formulario = ({ setPaso }) => {
    const [empleador, setEmpleador] = useState({
        tipo: "Natural",
        nombre: "",
        identificacion: "",
        trabajadores: "",
        contratos: []
    });

    const manejarCambio = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setEmpleador((prev) => ({
                ...prev,
                contratos: checked
                    ? [...prev.contratos, value]
                    : prev.contratos.filter((c) => c !== value)
            }));
        } else {
            setEmpleador({ ...empleador, [name]: value });
        }
    };

    return (
        <div>
            <h2>Información del Empleador</h2>
            <label>
                <input type="radio" name="tipo" value="Natural" checked={empleador.tipo === "Natural"} onChange={manejarCambio} /> Natural
            </label>
            <label>
                <input type="radio" name="tipo" value="Jurídica" checked={empleador.tipo === "Jurídica"} onChange={manejarCambio} /> Jurídica
            </label>
            <br />
            <input type="text" name="nombre" placeholder="Nombre o Razón Social" value={empleador.nombre} onChange={manejarCambio} />
            <input type="text" name="identificacion" placeholder="Número de Identificación" value={empleador.identificacion} onChange={manejarCambio} />
            <input type="number" name="trabajadores" placeholder="Número de Trabajadores" value={empleador.trabajadores} onChange={manejarCambio} />
            <br />
            <label><input type="checkbox" name="contratos" value="Fijo" onChange={manejarCambio} /> Término Fijo</label>
            <label><input type="checkbox" name="contratos" value="Indefinido" onChange={manejarCambio} /> Término Indefinido</label>
            <label><input type="checkbox" name="contratos" value="Obra" onChange={manejarCambio} /> Obra o Labor</label>
            <br />
            <button onClick={() => setPaso(2)}>Continuar</button>
        </div>
    );
};

export default Formulario;
