import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Welcome = () => {
  const [welcomeData, setWelcomeData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:4000/api/welcome')
      .then(response => setWelcomeData(response.data))
      .catch(error => console.log(error));
  }, []);

  if (!welcomeData) return <p>Loading...</p>;

  return (
    <div>
      <h1>{welcomeData.message}</h1>
      <p>Version: {welcomeData.version}</p>
      <img src={welcomeData.image} alt="Candidato" />
    </div>
  );
}

export default Welcome;

