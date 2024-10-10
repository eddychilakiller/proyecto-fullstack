# Proyecto FullStack con React y Node.js
---

Este proyecto es una solución para el examen práctico de desarrollo **FullStack**, utilizando **React** en el front-end y **Node.js con Koa** en el back-end. El proyecto incluye un CRUD básico de proveedores con validación, paginación y documentación de la API con **Swagger**.

## Tabla de Contenidos

- [Requisitos](#requisitos)
- [Instalación](#instalación)
  - [Back-end](#back-end)
  - [Front-end](#front-end)
- [Documentación de la API](#documentación-de-la-api)
- [Uso del CRUD de Proveedores](#uso-del-crud-de-proveedores)
  - [Listar Proveedores](#listar-proveedores)
  - [Agregar Proveedores](#agregar-proveedores)
  - [Eliminar Proveedores](#eliminar-proveedores)
- [Patrones de Diseño](#patrones-de-diseño)
- [Instrucciones con Docker (opcional)](#instrucciones-con-docker-opcional)
- [Licencia](#licencia)

## Requisitos

Para ejecutar este proyecto, necesitarás tener instalado:

- **Node.js** (versión 14 o superior)
- **npm** (gestor de paquetes de Node.js)

## Instalación

### Clonar el repositorio

Primero, clona este repositorio en tu máquina local:

```bash
git clone https://github.com/eddychilakiller/proyecto-fullstack.git
cd proyecto-fullstack
```

### Back-end

1. Ve a la carpeta del back-end:

   ```bash
   cd gapsi-backend
   ```

2. Instala las dependencias necesarias:

   ```bash
   npm install
   ```

3. Inicia el servidor del back-end:

   ```bash
   node index.js
   ```

4. El servidor del back-end estará corriendo en `http://localhost:4000`.

### Front-end

1. Abre una nueva terminal y ve a la carpeta del front-end:

   ```bash
   cd ../gapsi-frontend
   ```

2. Instala las dependencias necesarias:

   ```bash
   npm install
   ```

3. Inicia el servidor del front-end:

   ```bash
   npm start
   ```

4. El servidor del front-end estará corriendo en `http://localhost:3000`.

## Documentación de la API

La documentación de la API está disponible en formato **Swagger**. Para acceder a ella, sigue estos pasos:

1. Asegúrate de que el back-end esté corriendo.
2. Abre un navegador y ve a:

   ```
   http://localhost:4000/docs
   ```

Esta documentación incluye todos los detalles sobre las rutas disponibles, los parámetros que se pueden enviar, y las respuestas que devuelve la API.

## Uso del CRUD de Proveedores

### Listar Proveedores

- **Método**: `GET`
- **Endpoint**: `/proveedores`
- **Parámetros** (opcional):
  - `page`: Número de página (por defecto `1`).
  - `limit`: Número de proveedores por página (por defecto `5`).

Ejemplo de uso:

```
GET http://localhost:4000/proveedores?page=1&limit=5
```

### Agregar Proveedores

- **Método**: `POST`
- **Endpoint**: `/proveedores`
- **Body** (JSON):
  ```json
  {
    "nombre": "Proveedor 1",
    "razonSocial": "Empresa 1",
    "direccion": "Dirección 1"
  }
  ```

Ejemplo de uso:

```
POST http://localhost:4000/proveedores
```

### Eliminar Proveedores

- **Método**: `DELETE`
- **Endpoint**: `/proveedores/:nombre`

Ejemplo de uso:

```
DELETE http://localhost:4000/proveedores/Proveedor 1
```

## Patrones de Diseño

Este proyecto incluye la implementación de dos patrones de diseño:

1. **Singleton**: Utilizado para la conexión con el archivo `bd.json`, asegurando que solo haya una instancia que gestione la lectura y escritura de los datos.
2. **Factory**: Utilizado para la creación de proveedores, encapsulando la lógica de creación en una fábrica.

## Instrucciones con Docker (opcional)

Si prefieres ejecutar el proyecto con **Docker**, sigue estos pasos:

1. Asegúrate de tener **Docker** instalado en tu máquina.
2. En la raíz del proyecto (donde está el archivo `docker-compose.yml`), ejecuta el siguiente comando para construir y levantar los servicios del back-end y front-end:

   ```bash
   docker-compose up --build
   ```

3. Accede al front-end en `http://localhost:3001` y al back-end en `http://localhost:4000`.

## Licencia

Este proyecto es parte de un examen práctico de desarrollo y es solo para fines de evaluación.

