import { useState, useEffect } from 'react';
import axios from 'axios';
import {apiUrl} from './config/Router';


// Función para mezclar un array
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

function App() {
  const [preguntas, setPreguntas] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    axios.get(apiUrl+'/api/preguntasyrespuestas')
      .then(response => {
        const preguntasConRespuestasMezcladas = response.data.map((pregunta) => ({
          ...pregunta,
          respuestas: shuffleArray(pregunta.respuestas),
        }));
        setPreguntas(preguntasConRespuestasMezcladas);
      })
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  const handleAnswerSelection = (answer) => {
    if (answered) return;

    const currentQuestion = preguntas[currentQuestionIndex];
    const correctAnswer = currentQuestion.respuestas.find(res => res.es_correcta);

    if (answer === correctAnswer.respuesta_texto) {
      setScore(score + 1);
    }

    setUserAnswer(answer);
    setAnswered(true);

    setTimeout(() => {
      setUserAnswer('');
      setAnswered(false);

      if (currentQuestionIndex < preguntas.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        alert(`¡Has terminado el quiz! Tu puntuación es: ${score}`);
      }
    }, 2000);
  };

  if (preguntas.length === 0) {
    return <div>Cargando preguntas...</div>;
  }

  const currentQuestion = preguntas[currentQuestionIndex];
  const correctAnswer = currentQuestion.respuestas.find(res => res.es_correcta);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card text-center">
        <h1 className="text-black">Quiz</h1>
        <div className="card-body">
          <h2>{currentQuestion.pregunta_texto}</h2>
          <div className="d-flex justify-content-center">
            {currentQuestion.respuestas.map((respuesta, index) => {
              const isCorrect = respuesta.respuesta_texto === correctAnswer.respuesta_texto;
              const isSelected = userAnswer === respuesta.respuesta_texto;

              let buttonClass = "btn btn-outline-secondary ms-2";
              if (isSelected) {
                if (isCorrect) {
                  buttonClass = "btn btn-success ms-2";
                } else {
                  buttonClass = "btn btn-outline-danger ms-2";
                }
              } else if (isCorrect && answered) {
                buttonClass = "btn btn-success ms-2";
              }

              return (
                <button
                  key={index}
                  className={buttonClass}
                  onClick={() => handleAnswerSelection(respuesta.respuesta_texto)}
                  disabled={answered}
                >
                  {respuesta.respuesta_texto}
                </button>
              );
            })}
          </div>
          <p className="mt-4">{userAnswer && `Tu respuesta fue: ${userAnswer}`}</p>
        </div>
        <p>Pregunta {currentQuestionIndex + 1} de {preguntas.length}</p>
        <p>Tu puntuación: {score}</p>
      </div>
    </div>

  );
}

export default App;
