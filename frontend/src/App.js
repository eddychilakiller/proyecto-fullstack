import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [version, setVersion] = useState('');
  const [proveedores, setProveedores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [direccion, setDireccion] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(5);  // Número de proveedores por página
  const [total, setTotal] = useState(0);  // Total de proveedores

  // Obtener el mensaje de bienvenida y la versión
  useEffect(() => {
    axios.get('http://localhost:4000/welcome')
      .then(response => {
        setWelcomeMessage(response.data.message);
        setVersion(response.data.version);
      })
      .catch(error => {
        console.error('Error al obtener la bienvenida:', error);
      });

    // Obtener la lista de proveedores
    obtenerProveedores();
  }, [page]);

  const obtenerProveedores = () => {
    axios.get(`http://localhost:4000/proveedores?page=${page}&limit=${limit}`)
      .then(response => {
        setProveedores(response.data.proveedores || []);  // Asegurarse de que sea un array
        setTotal(response.data.total || 0);  // Guardar el total de proveedores
      })
      .catch(error => {
        setProveedores([]);  // En caso de error, devolver un array vacío
        console.error('Error al obtener los proveedores:', error);
      });
  };

  const agregarProveedor = (e) => {
    e.preventDefault();

    const nuevoProveedor = {
      nombre,
      razonSocial,
      direccion
    };

    axios.post('http://localhost:4000/proveedores', nuevoProveedor)
      .then(response => {
        setSuccess('Proveedor agregado correctamente');
        setError('');
        setNombre('');
        setRazonSocial('');
        setDireccion('');
        obtenerProveedores();
      })
      .catch(error => {
        setSuccess('');
        setError('Error: ' + (error.response?.data?.error || 'No se pudo agregar el proveedor'));
      });
  };

  const eliminarProveedor = (nombre) => {
    axios.delete(`http://localhost:4000/proveedores/${nombre}`)
      .then(response => {
        setSuccess('Proveedor eliminado correctamente');
        setError('');
        obtenerProveedores();
      })
      .catch(error => {
        setSuccess('');
        setError('Error al eliminar el proveedor');
      });
  };

  const siguientePagina = () => {
    if (page * limit < total) {
      setPage(page + 1);
    }
  };

  const anteriorPagina = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="container">
      <h1 className="my-4">{welcomeMessage}</h1>
      <p>Versión: {version}</p>

      <h2 className="my-4">Lista de Proveedores</h2>
      <ul className="list-group mb-4">
        {proveedores.length > 0 ? (
          proveedores.map((proveedor, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              {proveedor.nombre} - {proveedor.razonSocial} - {proveedor.direccion}
              <button className="btn btn-danger" onClick={() => eliminarProveedor(proveedor.nombre)}>Eliminar</button>
            </li>
          ))
        ) : (
          <li className="list-group-item">No hay proveedores disponibles.</li>
        )}
      </ul>

      <div className="d-flex justify-content-between">
        <button className="btn btn-primary" onClick={anteriorPagina} disabled={page === 1}>
          Anterior
        </button>
        <p>Página {page} de {Math.ceil(total / limit)}</p>
        <button className="btn btn-primary" onClick={siguientePagina} disabled={page * limit >= total}>
          Siguiente
        </button>
      </div>

      <h2 className="my-4">Agregar Proveedor</h2>
      <form onSubmit={agregarProveedor}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Razón Social</label>
          <input
            type="text"
            className="form-control"
            value={razonSocial}
            onChange={(e) => setRazonSocial(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Dirección</label>
          <input
            type="text"
            className="form-control"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Agregar Proveedor</button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success mt-3">{success}</div>}
    </div>
  );
}

export default App;
