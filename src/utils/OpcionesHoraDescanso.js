
export default function generarOpcionesDescanso(horaInicio, horaFin, opcionesHoraParam, minutosDescanso = 0) {
  if (!horaInicio || !horaFin) return [];

  
  let opcionesHora = opcionesHoraParam;
  if (!Array.isArray(opcionesHora)) {
    opcionesHora = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        opcionesHora.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      }
    }
  }

  const [hInicio, mInicio] = horaInicio.split(":").map(Number);
  const [hFin, mFin] = horaFin.split(":").map(Number);
  const minutosInicio = hInicio * 60 + mInicio;
  let minutosFin = hFin * 60 + mFin;

  if (minutosFin <= minutosInicio) minutosFin += 24 * 60;

  const descanso = Number(minutosDescanso) || 0;

  return opcionesHora.filter((hora) => {
    const [h, m] = hora.split(":").map(Number);
    let minutos = h * 60 + m;


    if (minutos < minutosInicio) minutos += 24 * 60;


    return minutos >= minutosInicio && (minutos + descanso) <= minutosFin;
  });
}
