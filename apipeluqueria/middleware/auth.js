// Autenticación con token (JWT) y control de roles.
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

let SECRETO = process.env.JWT_SECRET;
if (!SECRETO) {
  SECRETO = crypto.randomBytes(32).toString('hex');
  console.warn('⚠️  JWT_SECRET no está en el .env. Se usa una clave temporal: las sesiones se cierran al reiniciar el servidor.');
}

// Genera el token que se entrega al iniciar sesión
function firmar(payload) {
  return jwt.sign(payload, SECRETO, { expiresIn: '8h' });
}

// Exige un token válido y, opcionalmente, uno de los roles indicados
// Roles: 'cliente' | 'trabajador' | 'admin'
function requerir(...roles) {
  return (req, res, next) => {
    const cabecera = req.headers.authorization || '';
    const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Debes iniciar sesión.' });
    try {
      req.usuario = jwt.verify(token, SECRETO); // { id, rol, nombres }
    } catch {
      return res.status(401).json({ error: 'La sesión expiró. Inicia sesión de nuevo.' });
    }
    if (roles.length && !roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permiso para esta acción.' });
    }
    next();
  };
}

module.exports = { firmar, requerir };
