const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');  // Importar koa-cors
const db = require('./bd');  // Importamos el Singleton de la base de datos
const ProveedorFactory = require('./ProveedorFactory');  // Importar la fábrica
const serve = require('koa-static');
const path = require('path');
const swaggerUi = require('swagger-ui-koa');
const swaggerDocs = require('./swaggerConfig');


const app = new Koa();
const router = new Router();

// Ruta para la documentación de Swagger
app.use(serve(path.join(__dirname, 'public')));  // Servir archivos estáticos desde la carpeta 'public'
app.use(swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocs));

// Usar CORS
app.use(cors({
  origin: '*',  // Permitir todas las peticiones
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],  // Métodos permitidos
  allowHeaders: ['Content-Type', 'Authorization'],  // Headers permitidos
}));


// Middleware
app.use(bodyParser());

/**
 * @swagger
 * /welcome:
 *   get:
 *     summary: Devuelve un mensaje de bienvenida
 *     description: Retorna un mensaje de bienvenida con la versión de la aplicación.
 *     responses:
 *       200:
 *         description: Mensaje de bienvenida con versión
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bienvenido Candidato 01
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 */
router.get('/welcome', async (ctx) => {
  ctx.body = {
    message: 'Bienvenido Candidato 01',
    version: '1.0.0',
    image: 'https://via.placeholder.com/150'  
  };
});

/**
 * @swagger
 * /proveedores:
 *   get:
 *     summary: Obtiene la lista de proveedores
 *     description: Devuelve una lista paginada de proveedores
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número de proveedores por página
 *     responses:
 *       200:
 *         description: Lista de proveedores paginada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 proveedores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         example: Proveedor 1
 *                       razonSocial:
 *                         type: string
 *                         example: Empresa 1
 *                       direccion:
 *                         type: string
 *                         example: Dirección 1
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 5
 */
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

/**
 * @swagger
 * /proveedores:
 *   post:
 *     summary: Agrega un nuevo proveedor
 *     description: Crea un nuevo proveedor y lo agrega a la base de datos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               razonSocial:
 *                 type: string
 *               direccion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proveedor agregado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Proveedor agregado
 *                 proveedor:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     razonSocial:
 *                       type: string
 *                     direccion:
 *                       type: string
 *       400:
 *         description: El proveedor ya existe
 */
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

/**
 * @swagger
 * /proveedores/{nombre}:
 *   delete:
 *     summary: Elimina un proveedor por nombre
 *     description: Elimina un proveedor existente
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proveedor eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Proveedor eliminado
 *       404:
 *         description: Proveedor no encontrado
 */
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

