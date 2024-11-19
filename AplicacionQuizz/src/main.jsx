import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './css/index.css';
import App from './App.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Login from './pages/Auth/Login.jsx';
import IndexPregunta from './pages/Pregunta/Index.jsx';
import IndexRespuesta from './pages/Respuesta/Index.jsx';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import PrivateRoute from './components/PrivateRoute.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true, }} >
        <Header />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pregunta" element={<PrivateRoute><IndexPregunta /></PrivateRoute>} />
          <Route path="/respuestas" element={<PrivateRoute><IndexRespuesta /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);
