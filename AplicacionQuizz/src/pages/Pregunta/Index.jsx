import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../../config/Router';

const Index = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState({
    id: "",
    pregunta_texto: "",
    categoria: "",
    nivel: "",
  });
  const [operation, setOperation] = useState(1); // 1: Crear, 2: Editar
  const [formulario, setFormulario] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(5);

  // Función para obtener preguntas
  const fetchPreguntas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/preguntas`);
      setPreguntas(response.data);
    } catch (error) {
      console.error("Error al obtener las preguntas:", error);
    }
  };

  // Usamos useEffect para cargar las preguntas al cargar el componente
  useEffect(() => {
    fetchPreguntas();
  }, []);

  // Función para guardar la pregunta (crear o editar)
  const savePregunta = async (e) => {
    e.preventDefault();

    // Validación de campos
    if (!productoSeleccionado.pregunta_texto || !productoSeleccionado.categoria || !productoSeleccionado.nivel) {
      console.error("Faltan campos requeridos.");
      return;
    }

    try {
      console.log("Datos enviados:", productoSeleccionado); // Para verificar los datos que se envían
      if (operation === 1) {
        // Crear pregunta
        await axios.post(`${apiUrl}/api/preguntasCreate`, productoSeleccionado);
      } else {
        // Editar pregunta
        await axios.put(`${apiUrl}/api/preguntasEdit/${productoSeleccionado.id}`, productoSeleccionado);
      }
      fetchPreguntas(); // Refresca la lista de preguntas
      setFormulario(false); // Cierra el formulario
      resetFormulario(); // Resetea el formulario
    } catch (error) {
      console.error("Error al guardar la pregunta:", error);
    }
  };

  // Función para eliminar una pregunta
  const eliminarPregunta = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/preguntasDelete/${id}`);
      fetchPreguntas();
    } catch (error) {
      console.error("Error al eliminar la pregunta:", error);
    }
  };

  // Función para cambiar el estado de una pregunta
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await axios.put(`${apiUrl}/api/preguntasCambioEstado/${id}`, { estado: nuevoEstado });
      fetchPreguntas();
    } catch (error) {
      console.error("Error al cambiar el estado de la pregunta:", error);
    }
  };

  // Función para resetear el formulario
  const resetFormulario = () => {
    setProductoSeleccionado({
      id: "",
      pregunta_texto: "",
      categoria: "",
      nivel: "",
    });
    setOperation(1);
  };

  // Paginación
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = preguntas.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Función para buscar preguntas
  const handleSearch = (e) => {
    e.preventDefault();
    const filteredQuestions = preguntas.filter((pregunta) =>
      pregunta.pregunta_texto.toLowerCase().includes(searchValue.toLowerCase())
    );
    setPreguntas(filteredQuestions);
  };

  // Abrir formulario para crear una pregunta
  const abrirFormularioCrear = () => {
    resetFormulario();
    setFormulario(true);
    setOperation(1);
  };

  // Abrir formulario para editar una pregunta
  const abrirFormularioEditar = (producto) => {
    setProductoSeleccionado({
      id: producto.pregunta_id,
      pregunta_texto: producto.pregunta_texto,
      categoria: producto.categoria,
      nivel: producto.nivel,
    });
    setFormulario(true);
    setOperation(2);
  };

  return (
    <div className="card">
      <div className="card-body">
        {formulario === false ? (
          <div>
            <h1 className="text-center">Preguntas</h1>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <form onSubmit={handleSearch} className="d-flex">
                <div className="input-group">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="form-control"
                    placeholder="Buscar por nombre"
                  />
                  <button className="btn btn-primary" type="submit">
                    <i className="bi bi-search"></i> Buscar
                  </button>
                </div>
              </form>
              <button className="btn btn-success" onClick={abrirFormularioCrear}>
                <i className="bi bi-plus-circle"></i> Crear Pregunta
              </button>
            </div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Pregunta</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentQuestions.length > 0 ? (
                  currentQuestions.map((producto, index) => (
                    <tr key={producto.pregunta_id}>
                      <td>{index + 1}</td>
                      <td>{producto.pregunta_texto}</td>
                      <td>{producto.categoria}</td>
                      <td>{producto.estado === 1 ? "Activo" : "Inactivo"}</td>
                      <td>
                        <button className="btn btn-warning" onClick={() => abrirFormularioEditar(producto)}>
                          <i className="bi bi-pencil"></i> Editar
                        </button>
                        <button className="btn btn-danger ms-2" onClick={() => eliminarPregunta(producto.pregunta_id)}>
                          <i className="bi bi-trash"></i> Eliminar
                        </button>
                        <button className="btn btn-success ms-2" onClick={() => cambiarEstado(producto.pregunta_id, producto.estado === 1 ? 0 : 1)}>
                          {producto.estado === 1 ? (
                            <><i className="bi bi-trash"></i> Desactivar</>
                          ) : (
                            <><i className="bi bi-check-circle"></i> Activar</>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No hay preguntas disponibles.</td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Paginación */}
            <nav>
              <ul className="pagination justify-content-center">
                {Array.from({ length: Math.ceil(preguntas.length / questionsPerPage) }, (_, index) => (
                  <li key={index + 1} className="page-item">
                    <button
                      onClick={() => paginate(index + 1)}
                      className="page-link"
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        ) : (
          <form onSubmit={savePregunta}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="pregunta_texto" className="form-label">Pregunta</label>
                <input
                  type="text"
                  id="pregunta_texto"
                  name="pregunta_texto"
                  className="form-control"
                  value={productoSeleccionado.pregunta_texto || ''}
                  onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, pregunta_texto: e.target.value })}
                  placeholder="Ingrese su pregunta"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="categoria" className="form-label">Categoría</label>
                <input
                  type="text"
                  id="categoria"
                  name="categoria"
                  className="form-control"
                  value={productoSeleccionado.categoria || ''}
                  onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, categoria: e.target.value })}
                  placeholder="Ingrese su categoría"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="nivel" className="form-label">Nivel de pregunta</label>
                <input
                  type="number"
                  id="nivel"
                  name="nivel"
                  className="form-control"
                  value={productoSeleccionado.nivel || ''}
                  onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, nivel: e.target.value })}
                  placeholder="Ingrese el nivel de pregunta"
                />
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                {operation === 1 ? "Crear Pregunta" : "Editar Pregunta"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setFormulario(false)}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Index;
