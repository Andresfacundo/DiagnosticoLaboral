import React, { useState, useEffect } from "react";
import CalendarioTurnos from "../../Pages/CalendarioTurnos/CalendarioTurnos";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CalendarioPage() {

  return (
    <section className="section-card">
      <CalendarioTurnos/>
      <ToastContainer position="top-right" autoClose={4000} />
    </section>
  );
}
export default CalendarioPage;
