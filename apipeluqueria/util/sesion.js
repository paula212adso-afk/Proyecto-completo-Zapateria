// Arma la respuesta de login: token + datos del usuario SIN la contraseña.
const { firmar } = require('../middleware/auth');

function respuestaLogin(res, usuario, rol, id) {
  const { contrasena, ...datos } = usuario;
  const token = firmar({ id, rol, nombres: usuario.nombres });
  return res.json({ mensaje: 'Inicio de sesión exitoso', token, rol, usuario: datos });
}

module.exports = { respuestaLogin };
