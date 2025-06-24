// src/components/Ui/CustomEvent/CustomEvent.js
const CustomEvent = ({ event }) => (
  <div className="custom-event" title={`${event.title} (${event.horaInicio} - ${event.horaFin})`}>
    <div className="custom-event-title">{event.title}</div>
    <div className="custom-event-info">
      {event.horaInicio} - {event.horaFin}
      <br />
      <span className="custom-event-day">{event.dia}</span>
    </div>
  </div>
);

export default CustomEvent;
