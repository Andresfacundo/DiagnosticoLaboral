// src/utils/storageUtils.js
export function getEmpleados() {
  return JSON.parse(localStorage.getItem("empleados") || "[]");
}

export function saveEmpleados(empleados) {
  localStorage.setItem("empleados", JSON.stringify(empleados));
}

export function getTurnos() {
  return JSON.parse(localStorage.getItem("turnos") || "[]");
}

export function saveTurnos(turnos) {
  localStorage.setItem("turnos", JSON.stringify(turnos));
}
