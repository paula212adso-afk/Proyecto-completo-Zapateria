/* RF-10 trabajador elimina su horario · RF-12 admin elimina cualquier horario */
const modelo = require('../../modelo/horarios/EliminarHorarioModelo');
const buscar = require('../../modelo/horarios/EditarHorarioModelo');

class EliminarHorarioControlador {
  static async eliminarHorario(req, res) {
    try {
      const { idhorario } = req.params;
      if (!/^\d+$/.test(idhorario)) {
        return res.status(400).json({ error: 'El id del horario no es válido.' });
      }

      const horario = await buscar.buscarPorId(idhorario);
      if (!horario) return res.status(404).json({ error: 'Horario no encontrado' });

      if (req.usuario.rol === 'trabajador' && horario.idtrabajador !== req.usuario.id) {
        return res.status(403).json({ error: 'Solo puedes eliminar tus propios horarios.' });
      }

      await modelo.eliminarHorario(idhorario);
      res.json({ mensaje: 'Horario eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = EliminarHorarioControlador;
