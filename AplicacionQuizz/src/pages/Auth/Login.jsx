import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import axios from 'axios';
import { apiUrl } from '../../config/Router';

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/login`, { email, password });
      if (response.data.status === 200) {
        login(response.data.authToken);
        
        Swal.fire({
          icon: 'success',
          title: '¡Login exitoso!',
          text: 'Has iniciado sesión correctamente.',
        });
        navigate('/pregunta');
      } else {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Credenciales incorrectas.',
        });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      const errorMessage = error.response && error.response.data
        ? error.response.data.message
        : 'Hubo un problema al procesar la solicitud.';
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: errorMessage,
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className='card text-center' style={{ width: '20%' }}>
        <h1 className='text-black'>Quiz</h1>
        <div className='card-body'>
          {isAuthenticated === false ? (
            <form onSubmit={handleSubmit}> 
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          ) : (
            <div>
              <p>Logeado con éxito</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
