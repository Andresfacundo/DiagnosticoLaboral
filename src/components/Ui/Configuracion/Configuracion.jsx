import React from 'react'
import { useState } from "react";

const Configuracion = () => {
    const [form, setForm] = useState(0)


    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        await fetch("http://localhost:3000/api/empleados", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        setForm({
            nombre: "",
            apellido: "",
            cc: "",
            clasificacionPersonal: "",
            area: "",
            salarioBase: ""
        });
        onEmpleadoAgregado();
    };
    return (
        <>
            <div>Configuracion</div>

            <form  className="agregar-empleado-form">


                <div>
                    <label htmlFor="">Jornada máxima legal semanal</label>
                    <input type='number' name="" placeholder="" value=""  required />
                </div>
                <div>
                    <label htmlFor="">Hora extra diurna</label>
                    <input name="" placeholder="" value="" onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="">Hora extra nocturna</label>
                    <input name="" placeholder="" value="" onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="">Hora extra diurna dominical</label>
                    <input name="" placeholder="" value="" onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="">Hora extra nocturna dominical</label>
                    <input name="" placeholder="" value="" onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="">Recargo nocturno</label>
                    <input name="" placeholder="" value="" onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="">Recargo dominical</label>
                    <input name="" placeholder="" value="" onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="">Recargo nocturno dominical</label>
                    <input name="" placeholder="" value="" onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="">Hora inicio RN</label>
                    <input name="" placeholder="" value="" onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="">Hora fin RN</label>
                    <input name="" placeholder="" value="" onChange={handleChange} required />
                </div>
            
                <button type="submit">Agregar</button>
            </form>
        </>
    )
}

export default Configuracion