import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const contactarEmpleador = async (diagnostico) => {
  const empleador = diagnostico.empleador;

  if (!empleador || !empleador.email || !empleador.telefono) {
    alert("Faltan datos del empleador.");
    return;
  }

  const email = empleador.email;
  const nombre = empleador.nombres;
  const telefono = empleador.telefono;
const mensajeWa = `
Hola ${nombre}, gracias por diligenciar nuestro diagnóstico de cumplimiento laboral y de seguridad social. 📝

Revisamos tus respuestas y encontramos oportunidades importantes para mejorar. Podemos ayudarte a fortalecer el cumplimiento normativo de tu empresa.

¿Te parece si conversamos en una llamada corta? Puedes agendar aquí el momento que mejor te funcione:

👉 https://calendly.com/juandaniel-2
`;


  try {
    await axios.post(`${API_URL}/api/send-email`, {
      email,
      nombre,
    });
    console.log("Correo enviado con éxito.");
  } catch (err) {
    console.error("Error al enviar correo:", err);
  }


  const telefonoLimpio = telefono.replace(/\D/g, "");
  const whatsappURL = `https://api.whatsapp.com/send?phone=57${telefonoLimpio}&text=${encodeURIComponent(mensajeWa)}`;
  window.open(whatsappURL, "_blank");

};

export default contactarEmpleador;
