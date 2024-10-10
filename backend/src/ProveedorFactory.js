class Proveedor {
    constructor(nombre, razonSocial, direccion) {
      this.nombre = nombre;
      this.razonSocial = razonSocial;
      this.direccion = direccion;
    }
  }
  
  class ProveedorFactory {
    // Crear una instancia de Proveedor
    static createProveedor(nombre, razonSocial, direccion) {
      return new Proveedor(nombre, razonSocial, direccion);
    }
  }
  
  module.exports = ProveedorFactory;
  