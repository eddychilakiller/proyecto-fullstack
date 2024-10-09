import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProvidersList = () => {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/providers')
      .then(response => setProviders(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div>
      <h2>Lista de Proveedores</h2>
      <ul>
        {providers.map(provider => (
          <li key={provider.id}>
            {provider.name} - {provider.reason} - {provider.address}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProvidersList;

