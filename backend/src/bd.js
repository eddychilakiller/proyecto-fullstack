const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.filePath = path.join(__dirname, 'bd.json');
  }

  // Leer proveedores desde el archivo
  getProveedores() {
    const data = fs.readFileSync(this.filePath);
    return JSON.parse(data);
  }

  // Escribir proveedores en el archivo
  saveProveedores(proveedores) {
    fs.writeFileSync(this.filePath, JSON.stringify({ proveedores }, null, 2));
  }
}

// Crear una instancia única (Singleton)
const databaseInstance = new Database();
module.exports = databaseInstance;
