const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const path = require('path');

const app = new Koa();
const router = new Router();
const dbPath = path.join(__dirname, 'bd.json');

// Middleware
app.use(bodyParser());

// Helper to read and write from the "database"
const readDatabase = () => JSON.parse(fs.readFileSync(dbPath));
const writeDatabase = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// Rutas
router.get('/api/providers', async (ctx) => {
  const data = readDatabase();
  ctx.body = data.providers;
});

router.post('/api/providers', async (ctx) => {
  const { name, reason, address } = ctx.request.body;
  const data = readDatabase();
  const exists = data.providers.find(provider => provider.name === name);

  if (exists) {
    ctx.status = 400;
    ctx.body = { message: 'Proveedor ya existe' };
  } else {
    const newProvider = {
      id: data.providers.length + 1,
      name,
      reason,
      address
    };
    data.providers.push(newProvider);
    writeDatabase(data);
    ctx.status = 201;
    ctx.body = newProvider;
  }
});

router.delete('/api/providers/:id', async (ctx) => {
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

