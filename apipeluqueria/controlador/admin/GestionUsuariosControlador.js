const modelo = require('../../modelo/admin/GestionUsuariosModelo');

const idValido = (id) => /^\d+$/.test(id);

class GestionUsuariosControlador {
  static async listarClientes(req, res) {
    try {
      res.json({ clientes: await modelo.listarClientes() });
    } catch (err) { res.status(500).json({ error: err.message }); }
  }

  static async listarTrabajadores(req, res) {
    try {
      res.json({ trabajadores: await modelo.listarTrabajadores() });
    } catch (err) { res.status(500).json({ error: err.message }); }
  }

  // RF-13
  static async eliminarTrabajador(req, res) {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ error: 'Id no válido.' });
    try {
      if (Number(id) === req.usuario.id) {
        return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta.' });
      }
      const t = await modelo.buscarTrabajador(id);
      if (!t) return res.status(404).json({ error: 'Trabajador no encontrado.' });
      if (String(t.rol).toLowerCase() !== 'trabajador') {
        return res.status(400).json({ error: 'Esta opción solo elimina trabajadores, no administradores.' });
      }
      await modelo.eliminarTrabajador(id);
      res.json({ mensaje: 'Trabajador eliminado correctamente (y sus horarios).' });
    } catch (err) { res.status(500).json({ error: err.message }); }
  }

  // RF-14
  static async eliminarCliente(req, res) {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ error: 'Id no válido.' });
    try {
      const r = await modelo.eliminarCliente(id);
      if (r.affectedRows === 0) return res.status(404).json({ error: 'Cliente no encontrado.' });
      res.json({ mensaje: 'Cliente eliminado correctamente.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
  }
}
module.exports = GestionUsuariosControlador;
