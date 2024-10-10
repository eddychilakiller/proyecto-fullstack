const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const path = require('path');
const cors = require('@koa/cors');  // Importar koa-cors
const db = require('./bd');  // Importamos el Singleton de la base de datos
const ProveedorFactory = require('./ProveedorFactory');  // Importar la fábrica

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

// Ruta para listar proveedores con paginación
router.get('/proveedores', (ctx) => {
  const { page = 1, limit = 5 } = ctx.query;
  const data = db.getProveedores();  // Usamos el Singleton para obtener los proveedores
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const proveedoresPaginados = data.proveedores.slice(startIndex, endIndex);

  ctx.body = {
    proveedores: proveedoresPaginados,
    total: data.proveedores.length,
    page: parseInt(page),
    limit: parseInt(limit)
  };
});

router.post('/proveedores', (ctx) => {
  const data = db.getProveedores();  // Usamos el Singleton para leer los proveedores
  const { nombre, razonSocial, direccion } = ctx.request.body;
  const existe = data.proveedores.some(p => p.nombre === nombre);


  if (existe) {
    ctx.status = 400;
    ctx.body = { error: 'El proveedor ya existe' };
  } else {
    const nuevoProveedor = ProveedorFactory.createProveedor(nombre, razonSocial, direccion);  // Usar la fábrica
    data.proveedores.push(nuevoProveedor);
    db.saveProveedores(data.proveedores);
    ctx.body = { message: 'Proveedor agregado', proveedor: nuevoProveedor };
  }
});

router.delete('/proveedores/:nombre', (ctx) => {
  const data = db.getProveedores();  // Usamos el Singleton para leer los proveedores
  const nombre = ctx.params.nombre;

  const proveedorIndex = data.proveedores.findIndex(p => p.nombre === nombre);

  if (proveedorIndex === -1) {
    ctx.status = 404;
    ctx.body = { error: 'Proveedor no encontrado' };
  } else {
    data.proveedores.splice(proveedorIndex, 1);
    db.saveProveedores(data.proveedores);  // Usamos el Singleton para guardar los proveedores
    ctx.body = { message: 'Proveedor eliminado' };
  }
});

app.use(router.routes()).use(router.allowedMethods());

module.exports = app;

