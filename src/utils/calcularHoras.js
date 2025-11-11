  
  import { useState } from "react";

// export function calcularHoras(horaInicio, horaFin, minutosDescanso = 0) {
//   if (!horaInicio || !horaFin) return 0;

//   const inicio = new Date(`2000-01-01T${horaInicio}`);
//   const fin = new Date(`2000-01-01T${horaFin}`);

//   let diferencia = (fin - inicio) / (1000 * 60 * 60); // Diferencia en horas

//   // Si el turno pasa de medianoche (por ejemplo, 22:00 → 06:00)
//   if (diferencia < 0) diferencia += 24;

//   // Restar descanso
//   const descansoHoras = parseInt(minutosDescanso, 10) / 60;
//   const total = Math.max(0, diferencia - descansoHoras);

//   return Number(total.toFixed(2));
// }

// 📁 src/utils/calcularHoras.js
export function calcularHoras(horaInicio, horaFin, minutosDescanso = 0) {
  if (!horaInicio || !horaFin) {
    return { horas: 0, minutos: 0, totalHoras: 0 };
  }

  const inicio = new Date(`2000-01-01T${horaInicio}`);
  const fin = new Date(`2000-01-01T${horaFin}`);

  let diferencia = (fin - inicio) / (1000 * 60); // diferencia en minutos

  // Si pasa de medianoche
  if (diferencia < 0) diferencia += 24 * 60;

  // Restar descanso
  const totalMinutos = Math.max(0, diferencia - parseInt(minutosDescanso || 0, 10));

  const horas = Math.floor(totalMinutos / 60);
  const minutos = Math.round(totalMinutos % 60);
  const totalHoras = totalMinutos / 60;

  return { horas, minutos, totalHoras };
}
