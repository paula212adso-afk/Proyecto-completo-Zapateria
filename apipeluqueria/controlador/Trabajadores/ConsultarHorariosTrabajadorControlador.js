/* RF-08 El trabajador ve sus horarios */
const modelo = require('../../modelo/Trabajadores/ConsultarHorariosTrabajadorModelo');

class ConsultarHorariosTrabajadorControlador {
  static async consultarHorarios(req, res) {
    const { idtrabajador } = req.params;
    // Un trabajador solo puede ver los suyos
    if (req.usuario.rol === 'trabajador' && String(req.usuario.id) !== String(idtrabajador)) {
      return res.status(403).json({ error: 'Solo puedes ver tus propios horarios.' });
    }
    try {
      const horarios = await modelo.consultarHorarios(idtrabajador);
      res.json({ mensaje: 'Horarios consultados correctamente', horarios });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = ConsultarHorariosTrabajadorControlador;
