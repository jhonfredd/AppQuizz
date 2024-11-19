import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    'SELECT id AS pregunta_id, pregunta_texto, categoria, nivel, status FROM preguntas',
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

  if (estado !== 0 && estado !== 1) {
    return res.status(400).send('El valor de estado debe ser 0 o 1.');
  }

  db.query(
    'UPDATE preguntas SET status = ? WHERE id = ?',
    [estado, id],
    (err, results) => {
      if (err) return res.status(500).send('Error en el servidor.');
      if (results.affectedRows === 0) return res.status(404).send('Pregunta no encontrada.');

      res.send({
        message: 'Pregunta actualizada correctamente',
        updatedEstado: estado,
      });
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
    'SELECT * FROM respuestas WHERE pregunta_id = ?',
    [id],
    (err, results) => {
      if (err) return res.status(500).send(err.message);

      if (results.length > 0) {
        return res.status(400).send('No se puede eliminar la pregunta hasta que no se eliminen las respuestas relacionadas.');
      }

      db.query(
        'DELETE FROM preguntas WHERE id = ?',
        [id],
        (err, results) => {
          if (err) return res.status(500).send(err.message);
          if (results.affectedRows === 0) return res.status(404).send("Pregunta no encontrada");
          res.send('Pregunta eliminada correctamente');
        }
      );
    }
  );
});

//respuestas // Obtener todas las respuestas (incluyendo el campo pregunta_id)
app.get('/api/respuestas', (req, res) => {
  db.query(
    `SELECT r.id, r.pregunta_id, r.respuesta_texto, r.es_correcta, r.status, p.pregunta_texto
     FROM respuestas r
     LEFT JOIN preguntas p ON r.pregunta_id = p.id`,
    (err, results) => {
      if (err) return res.status(500).send(err.message);
      res.json(results);
    }
  );
});

// Crear una nueva respuesta
app.post('/api/respuestasCreate', (req, res) => {
  const { pregunta_id, respuesta_texto, es_correcta } = req.body;

  if (!pregunta_id || !respuesta_texto || es_correcta === undefined) {
    return res.status(400).send('Faltan campos requeridos.');
  }

  db.query(
    'SELECT COUNT(*) AS respuestas_count FROM respuestas WHERE pregunta_id = ?',
    [pregunta_id],
    (err, results) => {
      if (err) return res.status(500).send(err.message);
      const respuestasCount = results[0].respuestas_count;

      if (respuestasCount >= 4) {
        return res.status(400).send('No se puede crear más respuestas. Ya tienes 4 respuestas para esta pregunta. Si quieres insertar una nueva, elimina o edita una existente.');
      }

      if (es_correcta) {
        db.query(
          'SELECT * FROM respuestas WHERE pregunta_id = ? AND es_correcta = true',
          [pregunta_id],
          (err, results) => {
            if (err) return res.status(500).send(err.message);

            if (results.length > 0) {
              return res.status(400).send('Ya existe una respuesta correcta para esta pregunta.');
            }

            db.query(
              'INSERT INTO respuestas (pregunta_id, respuesta_texto, es_correcta) VALUES (?, ?, ?)',
              [pregunta_id, respuesta_texto, es_correcta],
              (err, results) => {
                if (err) return res.status(500).send(err.message);
                res.status(201).send('Respuesta creada correctamente');
              }
            );
          }
        );
      } else {
        db.query(
          'INSERT INTO respuestas (pregunta_id, respuesta_texto, es_correcta) VALUES (?, ?, ?)',
          [pregunta_id, respuesta_texto, es_correcta],
          (err, results) => {
            if (err) return res.status(500).send(err.message);
            res.status(201).send('Respuesta creada correctamente');
          }
        );
      }
    }
  );
});

// Editar una respuesta existente
app.put('/api/respuestasEdit/:id', (req, res) => {
  const { id } = req.params;
  const { pregunta_id, respuesta_texto, es_correcta, status } = req.body;

  if (!pregunta_id || !respuesta_texto || es_correcta === undefined || status === undefined) {
    return res.status(400).send('Faltan campos requeridos.');
  }

  if (es_correcta) {
    db.query(
      'SELECT * FROM respuestas WHERE pregunta_id = ? AND es_correcta = true AND id != ?',
      [pregunta_id, id],  // Excluimos la respuesta que estamos editando
      (err, results) => {
        if (err) return res.status(500).send(err.message);

        if (results.length > 0) {
          return res.status(400).send('Ya existe una respuesta correcta para esta pregunta.');
        }

        db.query(
          'UPDATE respuestas SET pregunta_id = ?, respuesta_texto = ?, es_correcta = ?, status = ? WHERE id = ?',
          [pregunta_id, respuesta_texto, es_correcta, status, id],
          (err, results) => {
            if (err) return res.status(500).send(err.message);
            if (results.affectedRows === 0) return res.status(404).send("Respuesta no encontrada");
            res.send('Respuesta actualizada correctamente');
          }
        );
      }
    );
  } else {
    db.query(
      'UPDATE respuestas SET pregunta_id = ?, respuesta_texto = ?, es_correcta = ?, status = ? WHERE id = ?',
      [pregunta_id, respuesta_texto, es_correcta, status, id],
      (err, results) => {
        if (err) return res.status(500).send(err.message);
        if (results.affectedRows === 0) return res.status(404).send("Respuesta no encontrada");
        res.send('Respuesta actualizada correctamente');
      }
    );
  }
});

app.put('/api/respuestasCambioEstado/:id', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (estado !== 0 && estado !== 1) {
    return res.status(400).send('El valor de estado debe ser 0 o 1.');
  }

  db.query(
    'UPDATE respuestas SET status = ? WHERE id = ?',
    [estado, id],
    (err, results) => {
      if (err) return res.status(500).send('Error en el servidor.');
      if (results.affectedRows === 0) return res.status(404).send('Respuesta no encontrada.');

      res.send({
        message: 'Respuesta actualizada correctamente',
        updatedEstado: estado,
      });
    }
  );
});

// Eliminar una respuesta
app.delete('/api/respuestasDelete/:id', (req, res) => {
  const { id } = req.params;
    db.query('DELETE FROM respuestas WHERE id = ?', [id], (err, results) => {
      if (err) return res.status(500).send(err.message);
      res.send('Respuesta eliminada correctamente');
    });
});


app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT id, email, password FROM user WHERE email = ?',
    [email],
    (err, results) => {
      if (err) return res.status(500).json({message: err.message, status: err.status});

      if (results.length === 0) {
        return res.status(404).json({ message:'Usuario no encontrado', status:401});
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).send({message: err.message, status: err.status});

        if (!isMatch) {
          return res.status(401).json({ message:'Credenciales incorrectas', status:401});
        }

        const authToken = generateAuthToken(user.id);

        res.status(201).json({
          message: 'Autenticación exitosa',
          authToken: authToken,
          userId: user.id,
          status: 200
        });
      });
    }
  );
});
const generateAuthToken = (userId) => {
  const token = jwt.sign({ userId }, '$:_&5#25#ASWswr?%/%sfw', { expiresIn: '1h' });
  return token;
};


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
