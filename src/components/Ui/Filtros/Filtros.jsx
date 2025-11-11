// import React from "react";
// import "./Filtros.css";

// const Filtros = ({
//   titulo = "Filtros",
//   campos = [],
//   filtros = {},
//   setFiltros = () => {},
//   onAplicar = () => {},
//   onLimpiar = () => {},
// }) => {
//   const handleChange = (e, nombreCampo) => {
//     setFiltros({ ...filtros, [nombreCampo]: e.target.value });
//   };

//   return (
//     <div className="filtros-container">
//       {titulo && <h3>{titulo}</h3>}
//       <div className="filtros-grid">
//         {campos.map((campo) => (
//           <input
//             key={campo.nombre}
//             type={campo.tipo || "text"}
//             placeholder={campo.placeholder || campo.nombre}
//             value={filtros[campo.nombre] || ""}
//             onChange={(e) => handleChange(e, campo.nombre)}
//           />
//         ))}

//         <button onClick={() => onAplicar(filtros)} className="btn-filtrar">
//           Aplicar filtros
//         </button>
//         <button
//           onClick={() => onLimpiar()}
//           className="btn-limpiar"
//         >
//           Limpiar
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Filtros;


// import React, { useState } from "react";
// import "./Filtros.css";
// import { SlidersHorizontal } from "lucide-react"; // Icono moderno (asegúrate de tener lucide-react)

// const Filtros = ({
//   titulo = "Filtros",
//   campos = [],
//   filtros = {},
//   setFiltros = () => {},
//   onAplicar = () => {},
//   onLimpiar = () => {},
// }) => {
//   const [open, setOpen] = useState(false);

//   const handleChange = (e, nombreCampo) => {
//     setFiltros({ ...filtros, [nombreCampo]: e.target.value });
//   };

//   return (
//     <div className="filtros-container">
//       <button className="filtros-toggle" onClick={() => setOpen(!open)}>
//         <SlidersHorizontal size={18} />
//         <span>{titulo}</span>
//       </button>

//       <div className={`filtros-content ${open ? "open" : ""}`}>
//         <div className="filtros-grid">
//           {campos.map((campo) => (
//             <div key={campo.nombre} className="filtro-item">
//               <input
//                 type={campo.tipo || "text"}
//                 placeholder={campo.placeholder || campo.nombre}
//                 value={filtros[campo.nombre] || ""}
//                 onChange={(e) => handleChange(e, campo.nombre)}
//               />
//             </div>
//           ))}
//         </div>

//         <div className="filtros-buttons">
//           <button onClick={() => onAplicar(filtros)} className="btn-filtrar">
//             Aplicar
//           </button>
//           <button onClick={() => onLimpiar()} className="btn-limpiar">
//             Limpiar
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Filtros;




// import React, { useState, useRef, useEffect } from "react";
// import "./Filtros.css";
// import { SlidersHorizontal } from "lucide-react";

// const Filtros = ({
//   titulo = "Filtros",
//   campos = [],
//   filtros = {},
//   setFiltros = () => {},
//   onAplicar = () => {},
//   onLimpiar = () => {},
// }) => {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const handleChange = (e, nombreCampo) => {
//     setFiltros({ ...filtros, [nombreCampo]: e.target.value });
//   };

//   // cerrar el dropdown si se hace clic fuera
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="filtros-dropdown" ref={dropdownRef}>
//       <button className="filtros-btn" onClick={() => setOpen(!open)}>
//         <SlidersHorizontal size={18} />
//         <span>{titulo}</span>
//       </button>

//       {open && (
//         <div className="filtros-menu">
//           <div className="filtros-campos">
//             {campos.map((campo) => (
//               <div key={campo.nombre} className="campo-item">
//                 <label>{campo.placeholder || campo.nombre}</label>
//                 <input
//                   type={campo.tipo || "text"}
//                   value={filtros[campo.nombre] || ""}
//                   placeholder={filtros[campo.nombre] || ""}
//                   onChange={(e) => handleChange(e, campo.nombre)}                  

//                 />
//               </div>
//             ))}
//           </div>

//           <div className="filtros-acciones">
//             <button className="btn-aplicar" onClick={() => onAplicar(filtros)}>
//               Aplicar
//             </button>
//             <button className="btn-limpiar" onClick={onLimpiar}>
//               Limpiar
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Filtros;






import React, { useState, useRef, useEffect } from "react";
import "./Filtros.css";
import { SlidersHorizontal } from "lucide-react";

const Filtros = ({
  titulo = "Filtros",
  campos = [],
  filtros = {},
  setFiltros = () => { },
  onAplicar = () => { },
  onLimpiar = () => { },
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleChange = (e, nombreCampo) => {
    setFiltros((prev) => ({ ...prev, [nombreCampo]: e.target.value }));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="filtros-dropdown" ref={dropdownRef}>
      <button className="filtros-btn" onClick={() => setOpen(!open)}>
        <SlidersHorizontal size={18} />
        <span>{titulo}</span>
      </button>

      {open && (
        <div className="filtros-menu">
          <div className="filtros-campos">
            {campos.map((campo) => (
              <div key={campo.nombre} className="campo-item">
                <input
                  type={campo.tipo || "text"}
                  value={filtros[campo.nombre] || ""}
                  placeholder={campo.placeholder}
                  onChange={(e) => handleChange(e, campo.nombre)}
                />
              </div>
            ))}
          </div>

          <div className="filtros-acciones">
            <button className="btn-aplicar" onClick={() => onAplicar(filtros)}>
              Aplicar filtros
            </button>
            <button className="btn-limpiar" onClick={onLimpiar}>
              Limpiar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filtros;
