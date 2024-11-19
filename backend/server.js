import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
    return;
  }
  console.log('Conexión exitosa a la base de datos.');
});

app.get('/api/preguntasyrespuestas', (req, res) => {
  db.query(
    'SELECT preguntas.id AS pregunta_id, preguntas.pregunta_texto, preguntas.categoria, preguntas.nivel, respuestas.id AS respuesta_id, respuestas.respuesta_texto, respuestas.es_correcta ' +
    'FROM preguntas ' +
    'LEFT JOIN respuestas ON preguntas.id = respuestas.pregunta_id',
    (err, results) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        const groupedResults = results.reduce((acc, row) => {
          const { pregunta_id, pregunta_texto, categoria, nivel, respuesta_id, respuesta_texto, es_correcta } = row;

          if (!acc[pregunta_id]) {
            acc[pregunta_id] = {
              pregunta_id,
              pregunta_texto,
              categoria,
              nivel,
              respuestas: [],
            };
          }
          acc[pregunta_id].respuestas.push({
            respuesta_id,
            respuesta_texto,
            es_correcta,
          });

          return acc;
        }, {});
        res.json(Object.values(groupedResults));
      }
    }
  );
});


// Endpoint para obtener preguntas
app.get('/api/preguntas', (req, res) => {
  db.query(
    'SELECT id AS pregunta_id, pregunta_texto, categoria, nivel FROM preguntas',
    (err, results) => {
      if (err) return res.status(500).send(err.message);
      res.json(results);
    }
  );
});

app.post('/api/preguntasCreate', (req, res) => {
  const { pregunta_texto, categoria, nivel } = req.body;
  console.log(req.body);

  if (!pregunta_texto || !categoria || !nivel) {
    return res.status(400).send('Faltan campos requeridos.');
  }

  db.query(
    'INSERT INTO preguntas (pregunta_texto, categoria, nivel) VALUES (?, ?, ?)',
    [pregunta_texto, categoria, nivel],
    (err, results) => {
      if (err) {
        return res.status(500).send(err.message);
      }

      res.status(201).send('Pregunta creada correctamente');
    }
  );
});

app.put('/api/preguntasCambioEstado/:id', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!pregunta_texto || !categoria || !nivel) {
    return res.status(400).send('Faltan campos requeridos.');
  }

  db.query(
    'UPDATE preguntas SET estado = ? WHERE id = ?',
    [ estado, id],
    (err, results) => {
      if (err) return res.status(500).send(err.message);
      if (results.affectedRows === 0) return res.status(404).send("Pregunta no encontrada");
      res.send('Pregunta actualizada correctamente');
    }
  );
});

app.put('/api/preguntasEdit/:id', (req, res) => {
  const { id } = req.params;
  const { pregunta_texto, categoria, nivel } = req.body;

  if (!pregunta_texto || !categoria || !nivel) {
    return res.status(400).send('Faltan campos requeridos.');
  }

  db.query(
    'UPDATE preguntas SET pregunta_texto = ?, categoria = ?, nivel = ? WHERE id = ?',
    [pregunta_texto, categoria, nivel, id],
    (err, results) => {
      if (err) return res.status(500).send(err.message);
      if (results.affectedRows === 0) return res.status(404).send("Pregunta no encontrada");
      res.send('Pregunta actualizada correctamente');
    }
  );
});

app.delete('/api/preguntasDelete/:id', (req, res) => {
  const { id } = req.params;

  db.query(
    'DELETE FROM preguntas WHERE id = ?',
    [id],
    (err, results) => {
      if (err) return res.status(500).send(err.message);
      if (results.affectedRows === 0) return res.status(404).send("Pregunta no encontrada");
      res.send('Pregunta eliminada correctamente');
    }
  );
});





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
