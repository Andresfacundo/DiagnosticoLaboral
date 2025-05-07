import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const Registros = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [empleadores, setEmpleadores] = useState([]);
  const [idSeleccionado, setIdSeleccionado] = useState(id || '');
  const [empleadorInfo, setEmpleadorInfo] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [porcentajesCategorias, setPorcentajesCategorias] = useState([]);
  const [cumplimientoGeneral, setCumplimientoGeneral] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carga inicial de empleadores para el dropdown
  useEffect(() => {
    axios.get('/api/empleadores')
      .then(res => setEmpleadores(res.data))
      .catch(err => setError('Error al cargar lista de clientes'));
  }, []);

  // Función para calcular cumplimiento
  const calcularCumplimiento = (resp, preg) => {
    const mapa = {};
    preg.forEach(p => { mapa[p.id] = p; });
    const stats = {};
    let totalC = 0;
    let totalP = 0;
    resp.forEach(r => {
      const p = mapa[r.preguntaId];
      if (!p) return;
      const cat = p.categoria;
      stats[cat] = stats[cat] || { cumplen: 0, total: 0 };
      stats[cat].total += 1;
      if (r.cumplio) {
        stats[cat].cumplen += 1;
        totalC += 1;
      }
      totalP += 1;
    });
    const cats = Object.keys(stats).map(cat => {
      const d = stats[cat];
      return { categoria: cat, porcentaje: d.total ? Math.round((d.cumplen / d.total) * 100) : 0 };
    });
    setPorcentajesCategorias(cats);
    setCumplimientoGeneral(totalP ? Math.round((totalC / totalP) * 100) : 0);
  };

  // Carga datos del cliente cuando cambia selección
  useEffect(() => {
    if (!idSeleccionado) return;
    setLoading(true);
    setError(null);
    axios.get(`/api/empleadores/${idSeleccionado}`)
      .then(res => setEmpleadorInfo(Array.isArray(res.data) ? res.data[0] : res.data))
      .catch(err => setError('Error al cargar datos del cliente'));
    axios.get(`/api/empleadores/${idSeleccionado}`)
      .then(res => setRespuestas(res.data))
      .catch(err => setError('Error al cargar respuestas'));
    axios.get(`/api/empleadores/${idSeleccionado}`)
      .then(res => setPreguntas(res.data))
      .catch(err => setError('Error al cargar preguntas'))
      .finally(() => setLoading(false));
  }, [idSeleccionado]);

  // Recalcular cuando cambian respuestas/preguntas
  useEffect(() => {
    if (respuestas.length > 0 && preguntas.length > 0) {
      calcularCumplimiento(respuestas, preguntas);
    }
  }, [respuestas, preguntas]);

  // Maneja cambio en el dropdown
  const handleClienteChange = (e) => {
    const nuevoId = e.target.value;
    setIdSeleccionado(nuevoId);
    navigate(`/admin/resultados/${nuevoId}`);
  };

  return (
    <div>
      <h1>Resultados Detallados por Cliente</h1>

      {/* Selección de cliente */}
      <div>
        <label>Seleccione un cliente: </label>
        <select value={idSeleccionado} onChange={handleClienteChange}>
          <option value="">-- Elegir cliente --</option>
          {empleadores.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.nombre}</option>
          ))}
        </select>
      </div>

      {loading && <p>Cargando datos...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}

      {/* Datos básicos del empleador */}
      {empleadorInfo && (
        <table>
          <thead>
            <tr><th>Nombre</th><th>Fecha</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>{empleadorInfo.nombre}</td>
              <td>{new Date(empleadorInfo.fecha).toLocaleDateString()}</td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Cumplimiento general */}
      {empleadorInfo && (
        <div>
          <h2>Cumplimiento General: {cumplimientoGeneral}%</h2>
        </div>
      )}

      {/* Gráfico radar */}
      {porcentajesCategorias.length > 0 && (
        <RadarChart width={300} height={250} data={porcentajesCategorias}>
          <PolarGrid />
          <PolarAngleAxis dataKey="categoria" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Cumplimiento" dataKey="porcentaje" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      )}

      {/* Recomendaciones */}
      {porcentajesCategorias.length > 0 && (
        <div>
          <h3>Recomendaciones</h3>
          {porcentajesCategorias
            .filter(c => c.porcentaje < 60)
            .map(catData => (
              <div key={catData.categoria}>
                <p>En la categoría <b>{catData.categoria}</b> (cumplimiento {catData.porcentaje}%), sugerimos revisar:</p>
                <ul>
                  {respuestas
                    .filter(r => {
                      const p = preguntas.find(q => q.id === r.preguntaId);
                      return p && p.categoria === catData.categoria && !r.cumplio;
                    })
                    .map(r => {
                      const texto = preguntas.find(q => q.id === r.preguntaId)?.texto || '';
                      return <li key={r.preguntaId}>{texto}</li>;
                    })
                  }
                </ul>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Registros;
