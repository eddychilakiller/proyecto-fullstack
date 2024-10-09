const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const path = require('path');
const cors = require('@koa/cors');  // Importar koa-cors

const app = new Koa();
const router = new Router();
const dbPath = path.join(__dirname, 'bd.json');


// Usar CORS
app.use(cors({
  origin: '*',  // Permitir todas las peticiones
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],  // Métodos permitidos
  allowHeaders: ['Content-Type', 'Authorization'],  // Headers permitidos
}));


// Middleware
app.use(bodyParser());

// Helper to read and write from the "database"
const readDatabase = () => JSON.parse(fs.readFileSync(dbPath));
const writeDatabase = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// Rutas

router.get('/welcome', async (ctx) => {
  ctx.body = {
    message: 'Bienvenido Candidato 01',
    version: '1.0.0',
    image: 'https://via.placeholder.com/150'  // Puedes reemplazar con una URL de imagen válida
  };
});

router.get('/proveedores', async (ctx) => {
  const data = readDatabase();
  ctx.body = data.providers;
});

router.post('/proveedores', async (ctx) => {
  const { nombre, razonSocial, direccion } = ctx.request.body;
  const data = readDatabase();
  const exists = data.providers.find(provider => provider.nombre === nombre);

  if (exists) {
    ctx.status = 400;
    ctx.body = { message: 'Proveedor ya existe' };
  } else {
    const newProvider = {
      id: data.providers.length + 1,
      nombre,
      razonSocial,
      direccion
    };
    data.providers.push(newProvider);
    writeDatabase(data);
    ctx.status = 201;
    ctx.body = newProvider;
  }
});

router.delete('/proveedores/:id', async (ctx) => {
  const { id } = ctx.params;
  let data = readDatabase();
  const initialLength = data.providers.length;
  data.providers = data.providers.filter(provider => provider.id !== parseInt(id));

  if (data.providers.length === initialLength) {
    ctx.status = 404;
    ctx.body = { message: 'Proveedor no encontrado' };
  } else {
    writeDatabase(data);
    ctx.status = 200;
    ctx.body = { message: 'Proveedor eliminado' };
  }
});

app.use(router.routes()).use(router.allowedMethods());

module.exports = app;

