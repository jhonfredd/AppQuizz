import { useEffect, useState } from 'react';
import {apiUrl} from './config/Router';

function Home() {
  const [data, setData] = useState([]);
  // const apiKey = import.meta.env.VITE_API_KEY;
  // const apiUrl = import.meta.env.API_URL;
  useEffect(() => {
    fetch(apiUrl+'/api/persona')
      .then(response => response.json())
      .then(data => {
        setData(data);  // Guarda los datos en el estado
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  console.log(data)
  return (
    <>
      <div className="card" style={{width: '18rem'}}>
        <div className="card-body">
          <h5 className="card-title">Card title <i className="bi-alarm"></i> </h5>
          <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
          <p className="card-text">Some quick example text to build on the card title and make up the bulk of the cards content.</p>
          <a href="#" className="card-link">Card link</a>
          <a href="#" className="card-link">Another link</a>
          {/* <p>API Key: {apiKey}</p>
          <p>API URL: {apiUrl}</p> */}
        </div>
      </div>
    </>
  )
}

export default Home