import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../../config/Router';
import Pagination from '../../components/Paginate';
import Swal from 'sweetalert2'; 

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

  const fetchPreguntas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/preguntas`);
      setPreguntas(response.data);
    } catch (error) {
      console.error("Error al obtener las preguntas:", error);
    }
  };

  useEffect(() => {
    fetchPreguntas();
  }, []);

  const savePregunta = async (e) => {
    e.preventDefault();

    if (!productoSeleccionado.pregunta_texto || !productoSeleccionado.categoria || !productoSeleccionado.nivel) {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Faltan campos requeridos.',
      });
      return;
    }
    try {
      if (operation === 1) {
        await axios.post(`${apiUrl}/api/preguntasCreate`, productoSeleccionado);
        Swal.fire({
          icon: 'success',
          title: '¡Pregunta creada!',
          text: 'La pregunta ha sido creada con éxito.',
        });
      } else {
        await axios.put(`${apiUrl}/api/preguntasEdit/${productoSeleccionado.id}`, productoSeleccionado);
        Swal.fire({
          icon: 'success',
          title: '¡Pregunta editada!',
          text: 'La pregunta ha sido editada con éxito.',
        });
      }
      fetchPreguntas();
      setFormulario(false);
      resetFormulario();
    } catch (error) {
      console.error("Error al guardar la pregunta:", error);
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Hubo un problema al guardar la pregunta.',
      });
    }
  };

  const eliminarPregunta = async (id) => {
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
          await axios.delete(`${apiUrl}/api/preguntasDelete/${id}`);
          Swal.fire(
            '¡Eliminado!',
            'La pregunta ha sido eliminada.',
            'success'
          );
          fetchPreguntas();
        } catch (error) {
          console.error("Error al eliminar la pregunta:", error);
  
          const errorMessage = error.response && error.response.data 
            ? error.response.data 
            : 'Hubo un problema al eliminar la pregunta.';
  
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: errorMessage,
          });
        }
      }
    });
  };
  

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await axios.put(`${apiUrl}/api/preguntasCambioEstado/${id}`, { estado: nuevoEstado });
      Swal.fire({
        icon: 'success',
        title: '¡Estado actualizado!',
        text: `La pregunta ha sido ${nuevoEstado === 1 ? 'activada' : 'desactivada'} con éxito.`,
      });
      fetchPreguntas();
    } catch (error) {
      console.error("Error al cambiar el estado de la pregunta:", error);
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Hubo un problema al cambiar el estado.',
      });
    }
  };

  const resetFormulario = () => {
    setProductoSeleccionado({
      id: "",
      pregunta_texto: "",
      categoria: "",
      nivel: "",
    });
    setOperation(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredQuestions = preguntas.filter((pregunta) =>
      pregunta.pregunta_texto.toLowerCase().includes(searchValue.toLowerCase())
    );
    setPreguntas(filteredQuestions);
  };

  const abrirFormularioCrear = () => {
    resetFormulario();
    setFormulario(true);
    setOperation(1);
  };

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

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = preguntas.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card" style={{ width:'95%'}}>
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
                        <td>{producto.status === 1 ? ( <div className='btn btn-outline-success'> Activo </div> ) : ( <div className='btn btn-outline-danger'> Inactivo </div> )}</td>
                        <td>
                          <button className="btn btn-warning" onClick={() => abrirFormularioEditar(producto)}>
                            <i className="bi bi-pencil"></i> Editar
                          </button>
                          <button className="btn btn-danger ms-2" onClick={() => eliminarPregunta(producto.pregunta_id)}>
                            <i className="bi bi-trash"></i> Eliminar
                          </button>                        
                          {producto.status === 1  ? (
                            <button className="btn btn-warning ms-2" onClick={() => cambiarEstado(producto.pregunta_id, producto.status === 1 ? 0 : 1)}>
                              <><i className="bi bi-trash"></i> Desactivar</>
                            </button>
                          ):( 
                          <button className="btn btn-success ms-2" onClick={() => cambiarEstado(producto.pregunta_id, producto.status === 1 ? 0 : 1)}>
                            <><i className="bi bi-check-circle"></i> Activar</>
                          </button>
                        )}
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
              <nav>
                <ul className="pagination justify-content-center">
                    <Pagination
                      totalItems={preguntas.length}
                      itemsPerPage={questionsPerPage}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
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
                  <label htmlFor="nivel" className="form-label">Nivel</label>
                  <p className="text-secondary">Ejemplo: solo este número como máximo (1, 2, 3)</p>
                  <input
                    type="number"
                    id="nivel"
                    name="nivel"
                    className="form-control"
                    value={productoSeleccionado.nivel || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value >= 1 && value <= 3) {
                        setProductoSeleccionado({ ...productoSeleccionado, nivel: value });
                      }
                    }}
                    placeholder="Ingrese el nivel de pregunta"
                    min="1"
                    max="3"
                  />
                </div>

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
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
