import React, { useEffect, useState, useRef } from "react";
import { aprobarAuth } from "../../../Services/useFetchAprobarAuth";
import "./Notificaciones.css";
import { Bell } from "lucide-react";
import { useSocket, emitSocketEvent } from "../../../hook/useSocket";

const Notificaciones = () => {
  const [pendientes, setPendientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const bellRef = useRef(null);


  useEffect(() => {
    obtenerPendientes();

    // Cierra el dropdown al hacer click fuera
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const obtenerPendientes = async () => {
    try {
      const data = await aprobarAuth.listarPendientes();
      setPendientes(data);
    } catch (error) {
      console.error(error);
    }
  };

  useSocket("nuevo-usuario-pendiente", (data) => {
    setPendientes((prev) => [...prev, data]);
  });

  useSocket("usuario-aprobado", (data) => {
    setPendientes((prev) => prev.filter((p) => p.id !== data.id));
  });

  useSocket("usuario-rechazado", (data) => {
    setPendientes((prev) => prev.filter((p) => p.id !== data.id));
  });

  const aprobar = async (id) => {
    try {
      const data = await aprobarAuth.aprobar(id);
      setMensaje(data.msg);
      setPendientes(pendientes.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const rechazar = async (id) => {
    try {
      const data = await aprobarAuth.rechazar(id);
      setMensaje(data.msg);
      setPendientes(pendientes.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bell-container" ref={bellRef}>
      <button className="bell-button" onClick={() => setOpen(!open)}>
        <Bell size={22} />
        {pendientes.length > 0 && (
          <span className="badge">{pendientes.length}</span>
        )}
      </button>

      {open && (
        <div className="dropdown">
          <h4>Solicitudes de registro</h4>
          {mensaje && <p className="mensaje">{mensaje}</p>}

          {pendientes.length === 0 ? (
            <p className="sin-pendientes">No hay solicitudes pendientes</p>
          ) : (
            <ul className="lista-notificaciones">
              {pendientes.map((usuario) => (
                <li key={usuario.id} className="notificacion-item">
                  <div className="info">
                    <strong>{usuario.nombre}</strong>
                    <span>{usuario.email}</span>
                    <small>Rol: {usuario.rol}</small>
                  </div>
                  <div className="acciones">
                    <button
                      className="btn-aprobar"
                      onClick={() => aprobar(usuario.id)}
                    >
                      ✔
                    </button>
                    <button
                      className="btn-rechazar"
                      onClick={() => rechazar(usuario.id)}
                    >
                      ✖
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notificaciones;
