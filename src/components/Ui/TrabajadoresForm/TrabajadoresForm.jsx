import React, { useState } from "react";
import './TrabajadoresForm.css'

export default function TrabajadorForm({ onSubmit }) {

    const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        cc: "",
        area: "",
        salarioBase: "",
        clasificacionPersonal: "",
        color: getRandomColor()
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
        setForm({ nombre: "", apellido: "", cc: "", area: "", salarioBase: "", clasificacionPersonal: "", color: "" });
    };

    return (
        <form onSubmit={handleSubmit} className="form-trabajador-horarios">
            <h2>Agregar trabajador</h2>

            <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
            <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required />
            <input name="cc" placeholder="Cédula" value={form.cc} onChange={handleChange} required />
            <select
                name="clasificacionPersonal"
                value={form.clasificacionPersonal}
                onChange={handleChange}
                required
            >
                <option value="" disabled>
                    Clasificación del personal
                </option>
                <option value="Ordinario">Ordinario</option>
                <option value="Direccion, confianza o manejo">
                    Dirección, confianza o manejo
                </option>
            </select>
            <input name="area" placeholder="Área" value={form.area} onChange={handleChange} />
            <input name="salarioBase" type="number" placeholder="Salario Base" value={form.salarioBase} onChange={handleChange} required />
            <label className="color-label">
                Color del trabajador
                <div className="color-input-wrapper">
                    <input
                        type="color"
                        name="color"
                        value={form.color}
                        onChange={handleChange}
                    />
                    <span></span>
                </div>
            </label>
            <button type="submit">Agregar</button>

        </form >
    );
}
