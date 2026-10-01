/* RF-03 Login cliente */
const modelo = require('../../modelo/clientes/LoginClienteModelo');
const { respuestaLogin } = require('../../util/sesion');

class LoginClienteControlador {
  static async validarCredencial(req, res) {
    const { t1: email, t2: password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }
    try {
      const user = await modelo.validarCredenciales(email, password);
      if (!user) return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
      if (user.estado !== 'Activo') return res.status(403).json({ error: 'Tu cuenta está inactiva.' });
      return respuestaLogin(res, user, 'cliente', user.idcliente);
    } catch (err) {
      res.status(500).json({ error: `Hubo un error al validar las credenciales: ${err.message}` });
    }
  }
}
module.exports = LoginClienteControlador;
