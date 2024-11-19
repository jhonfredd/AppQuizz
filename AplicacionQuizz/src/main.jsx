import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './css/index.css';
import App from './App.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Login from './pages/Auth/Login.jsx';
import Index from './pages/Pregunta/Index.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router
      future={{
        v7_startTransition: true,
      }}
    >
      <Header />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/">
          <Route path="/" element={<App />} />
        </Route>
        <Route path="login">
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="pregunta">
          <Route path="/pregunta" element={<Index />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
);
