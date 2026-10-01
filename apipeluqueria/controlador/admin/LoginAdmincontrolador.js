/* Login administrador */
const modelo = require('../../modelo/admin/LoginAdminModelo');
const { respuestaLogin } = require('../../util/sesion');

class LoginAdminControlador {
  static async validarCredencial(req, res) {
    const { t1: email, t2: password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }
    try {
      const user = await modelo.validarCredenciales(email, password);
      if (!user) return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
      if (String(user.rol).toLowerCase() !== 'admin') {
        return res.status(403).json({ error: 'Esta cuenta no es de administrador.' });
      }
      if (user.estado !== 'Activo') return res.status(403).json({ error: 'Tu cuenta está inactiva.' });
      return respuestaLogin(res, user, 'admin', user.idtrabajador);
    } catch (err) {
      res.status(500).json({ error: `Hubo un error al validar las credenciales: ${err.message}` });
    }
  }
}
module.exports = LoginAdminControlador;
