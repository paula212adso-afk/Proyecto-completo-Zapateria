const dbService = require('../bd/Conexion');

class GestionUsuariosModelo {
  // Listados (nunca devuelven la contraseña)
  static listarClientes() {
    return dbService.query(`SELECT idcliente, tipoDocumento, numeroDocumento, nombres, direccion, telefono, correo, estado
                            FROM clientes ORDER BY nombres`);
  }

  static listarTrabajadores() {
    return dbService.query(`SELECT idtrabajador, tipoDocumento, numeroDocumento, nombres, direccion, telefono, correo, rol, estado
                            FROM trabajadores ORDER BY rol, nombres`);
  }

  static async buscarTrabajador(id) {
    const r = await dbService.query('SELECT idtrabajador, rol FROM trabajadores WHERE idtrabajador = ?', [id]);
    return r.length ? r[0] : null;
  }

  // RF-13: primero sus horarios (llave foránea), luego el trabajador
  static async eliminarTrabajador(id) {
    await dbService.query('DELETE FROM horarios WHERE idtrabajador = ?', [id]);
    return dbService.query('DELETE FROM trabajadores WHERE idtrabajador = ?', [id]);
  }

  // RF-14
  static eliminarCliente(id) {
    return dbService.query('DELETE FROM clientes WHERE idcliente = ?', [id]);
  }
}
module.exports = GestionUsuariosModelo;
