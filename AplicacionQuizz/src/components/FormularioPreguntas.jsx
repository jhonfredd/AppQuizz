const FormularioPreguntas = ({ onChange, respuestaSeleccionada }) => {
  return (
    <div>
      <label className="form-label">Respuestas</label>
      <div>
        <div className="form-check">
          <input
            type="radio"
            id="respuesta1"
            name="respuesta"
            value="Respuesta 1"
            checked={respuestaSeleccionada === "Respuesta 1"}
            onChange={onChange}
            className="form-check-input"
          />
          <label className="form-check-label" htmlFor="respuesta1">
            Respuesta 1
          </label>
        </div>
        <div className="form-check">
          <input
            type="radio"
            id="respuesta2"
            name="respuesta"
            value="Respuesta 2"
            checked={respuestaSeleccionada === "Respuesta 2"}
            onChange={onChange}
            className="form-check-input"
          />
          <label className="form-check-label" htmlFor="respuesta2">
            Respuesta 2
          </label>
        </div>
        <div className="form-check">
          <input
            type="radio"
            id="respuesta3"
            name="respuesta"
            value="Respuesta 3"
            checked={respuestaSeleccionada === "Respuesta 3"}
            onChange={onChange}
            className="form-check-input"
          />
          <label className="form-check-label" htmlFor="respuesta3">
            Respuesta 3
          </label>
        </div>
        <div className="form-check">
          <input
            type="radio"
            id="respuesta4"
            name="respuesta"
            value="Respuesta 4"
            checked={respuestaSeleccionada === "Respuesta 4"}
            onChange={onChange}
            className="form-check-input"
          />
          <label className="form-check-label" htmlFor="respuesta4">
            Respuesta 4
          </label>
        </div>
      </div>
    </div>
  );
};
