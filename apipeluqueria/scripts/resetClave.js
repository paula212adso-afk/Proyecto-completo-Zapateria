// Cambia la contraseña de un cliente o trabajador/admin desde la terminal.
// Uso:  node scripts/resetClave.js trabajadores pepito@gmail.com "NuevaClave#2026"
//       node scripts/resetClave.js clientes juan123@gmail.com "NuevaClave#2026"
const bcrypt = require('bcrypt');
const db = require('../modelo/bd/Conexion');

(async () => {
  const [tabla, correo, clave] = process.argv.slice(2);
  if (!['clientes', 'trabajadores'].includes(tabla) || !correo || !clave) {
    console.log('Uso: node scripts/resetClave.js <clientes|trabajadores> <correo> "<clave>"');
    process.exit(1);
  }
  const hash = await bcrypt.hash(clave, 10);
  const r = await db.query(`UPDATE ${tabla} SET contrasena = ? WHERE correo = ?`, [hash, correo]);
  console.log(r.affectedRows ? `✅ Contraseña actualizada (${r.affectedRows} fila/s)` : '⚠️ No se encontró ese correo');
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
