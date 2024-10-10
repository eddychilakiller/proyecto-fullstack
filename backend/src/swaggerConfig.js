const swaggerJsdoc = require('swagger-jsdoc');

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Proveedores',
      version: '1.0.0',
      description: 'Documentación de la API para gestionar proveedores',
      contact: {
        name: 'Candidato 01'
      },
      servers: [
        {
          url: 'http://localhost:4000',
          description: 'Servidor local'
        }
      ]
    }
  },
  apis: ['./src/app.js'], // Archivos donde se documentarán las rutas
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;
