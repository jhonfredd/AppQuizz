import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../../config/Router';
import Pagination from '../../components/Paginate';
import Swal from 'sweetalert2';
import Select from 'react-select';

const Index = () => {
  const [respuestas, setRespuestas] = useState([]);
  const [preguntas, setPreguntas] = useState([]);

  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState({
    id: "",
    respuesta_texto: "",
    pregunta_id: "",
    es_correcta: false,
    status: 1,
  });
  const [operation, setOperation] = useState(1); // 1: Crear, 2: Editar
  const [formulario, setFormulario] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(5);

  const fetchPreguntas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/preguntas`);
      setPreguntas(response.data);
    } catch (error) {
      console.error("Error al obtener las preguntas:", error);
    }
  };

  const fetchRespuestas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/respuestas`);
      setRespuestas(response.data);
    } catch (error) {
      console.error("Error al obtener las respuestas:", error);
    }
  };

  useEffect(() => {
    fetchPreguntas();
    fetchRespuestas();
  }, []);

  const saveRespuesta = async (e) => {
    e.preventDefault();

    if (!respuestaSeleccionada.respuesta_texto || !respuestaSeleccionada.pregunta_id) {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Faltan campos requeridos.',
      });
      return;
    }

    const respuestasPregunta = respuestas.filter((respuesta) => respuesta.pregunta_id === respuestaSeleccionada.pregunta_id);
    if (respuestasPregunta.length >= 4 && operation === 1) {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Solo puedes crear un máximo de 4 respuestas para esta pregunta.',
      });
      return;
    }

    if (respuestaSeleccionada.es_correcta) {
      const respuestasCorrectas = respuestasPregunta.filter((respuesta) => respuesta.es_correcta);
      if (respuestasCorrectas.length >= 1 && operation === 1) {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Solo puedes tener una respuesta correcta para esta pregunta.',
        });
        return;
      }
    }

    try {
      if (operation === 1) {
        await axios.post(`${apiUrl}/api/respuestasCreate`, respuestaSeleccionada);
        Swal.fire({
          icon: 'success',
          title: '¡Respuesta creada!',
          text: 'La respuesta ha sido creada con éxito.',
        });
      } else {
        await axios.put(`${apiUrl}/api/respuestasEdit/${respuestaSeleccionada.id}`, respuestaSeleccionada);
        Swal.fire({
          icon: 'success',
          title: '¡Respuesta editada!',
          text: 'La respuesta ha sido editada con éxito.',
        });
      }
      fetchRespuestas();
      setFormulario(false);
      resetFormulario();
    } catch (error) {
      const errorMessage = error.response && error.response.data 
            ? error.response.data 
            : 'Hubo un problema al eliminar la pregunta.';
  
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: errorMessage,
          });
    }
  };

  const eliminarRespuesta = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}/api/respuestasDelete/${id}`);
          Swal.fire(
            '¡Eliminado!',
            'La respuesta ha sido eliminada.',
            'success'
          );
          fetchRespuestas();
        } catch (error) {
          console.error("Error al eliminar la respuesta:", error);

          const errorMessage = error.response && error.response.data 
            ? error.response.data 
            : 'Hubo un problema al eliminar la respuesta.';

          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: errorMessage,
          });
        }
      }
    });
  };

  const resetFormulario = () => {
    setRespuestaSeleccionada({
      id: "",
      respuesta_texto: "",
      pregunta_id: "",
      es_correcta: false,
    });
    setOperation(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredRespuestas = respuestas.filter((respuesta) =>
      respuesta.respuesta_texto.toLowerCase().includes(searchValue.toLowerCase())
    );
    setRespuestas(filteredRespuestas);
  };

  const abrirFormularioCrear = () => {
    resetFormulario();
    setFormulario(true);
    setOperation(1);
  };

  const abrirFormularioEditar = (respuesta) => {
    setRespuestaSeleccionada({
      id: respuesta.id,
      respuesta_texto: respuesta.respuesta_texto,
      pregunta_id: respuesta.pregunta_id,
      es_correcta: respuesta.es_correcta,
      status: respuesta.status,
    });
    setFormulario(true);
    setOperation(2);
  };

  const indexOfLastRespuesta = currentPage * questionsPerPage;
  const indexOfFirstRespuesta = indexOfLastRespuesta - questionsPerPage;
  const currentRespuestas = respuestas.slice(indexOfFirstRespuesta, indexOfLastRespuesta);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const opcionesPreguntas = preguntas.map(pregunta => ({
    value: pregunta.pregunta_id,
    label: pregunta.pregunta_texto
  }));

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="card" style={{ width:'95%'}}>
        <div className="card-body">
          {formulario === false ? (
            <div>
              <h1 className="text-center">Respuestas</h1>
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3">
                <div className='col-sm-6'>
                  <form onSubmit={handleSearch} className="d-flex flex-column flex-sm-row w-100">
                    <div className="input-group mb-2 mb-sm-0">
                      <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="form-control"
                        placeholder="Buscar por respuesta"
                      />
                      <button className="btn btn-primary" type="submit">
                        <i className="bi bi-search"></i> Buscar
                      </button>
                    </div>
                  </form>
                </div>
                <div className='col-sm-2'>
                  <button className="btn btn-success mt-2 mt-sm-0" onClick={abrirFormularioCrear}>
                    <i className="bi bi-plus-circle"></i> Crear Respuesta
                  </button>
                </div>
              </div>

              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Pregunta</th>
                    <th>Respuesta</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRespuestas.length > 0 ? (
                    currentRespuestas.map((respuesta, index) => (
                      <tr key={respuesta.id}>
                        <td>{index + 1}</td>
                        <td>{respuesta.pregunta_texto}</td>
                        <td>{respuesta.respuesta_texto}</td>
                        <td>
                          <div className="d-flex flex-column flex-sm-row">
                            <button className="btn btn-warning mb-2 mb-sm-0" onClick={() => abrirFormularioEditar(respuesta)}>
                              <i className="bi bi-pencil"></i> Editar
                            </button>
                            <button className="btn btn-danger ms-0 ms-sm-2 mb-2 mb-sm-0" onClick={() => eliminarRespuesta(respuesta.id)}>
                              <i className="bi bi-trash"></i> Eliminar
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No hay respuestas disponibles.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <nav>
                <ul className="pagination justify-content-center">
                  <Pagination
                    totalItems={respuestas.length}
                    itemsPerPage={questionsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </ul>
              </nav>
            </div>
          ) : (
            <div>
              <h1 className="text-center">{operation === 1 ? "Crear Respuesta" : "Editar Respuesta"}</h1>
              <form onSubmit={saveRespuesta}>
                <div className="mb-3">
                  <label htmlFor="pregunta_id" className="form-label">
                    Pregunta:
                  </label>
                  <Select
                    id="pregunta_id"
                    name="pregunta_id"
                    options={opcionesPreguntas}
                    value={opcionesPreguntas.find(option => option.value === respuestaSeleccionada.pregunta_id)}
                    onChange={(selectedOption) => setRespuestaSeleccionada({ ...respuestaSeleccionada, pregunta_id: selectedOption.value })}
                    placeholder="Seleccione una pregunta"
                    isSearchable
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="respuesta_texto" className="form-label">
                    Respuesta:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="respuesta_texto"
                    name="respuesta_texto"
                    value={respuestaSeleccionada.respuesta_texto}
                    onChange={(e) => setRespuestaSeleccionada({ ...respuestaSeleccionada, respuesta_texto: e.target.value })}
                  />
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="es_correcta"
                    name="es_correcta"
                    checked={respuestaSeleccionada.es_correcta}
                    onChange={(e) => setRespuestaSeleccionada({ ...respuestaSeleccionada, es_correcta: e.target.checked })}
                  />
                  <label htmlFor="es_correcta" className="form-check-label">
                    Correcta
                  </label>
                </div>
                <div className="d-flex justify-content-center gap-2">
                  <button type="submit" className="btn btn-success">
                    {operation === 1 ? "Crear" : "Editar"}
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => setFormulario(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default Index;
