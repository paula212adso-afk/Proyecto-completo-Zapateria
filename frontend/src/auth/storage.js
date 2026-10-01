// Una sesión independiente por rol: cliente, trabajador, admin
const clave = (rol) => `peluqueria_${rol}`;
export const leerSesion = (rol) => { try { return JSON.parse(localStorage.getItem(clave(rol))); } catch { return null; } };
export const guardarSesion = (rol, datos) => localStorage.setItem(clave(rol), JSON.stringify(datos));
export const borrarSesion = (rol) => localStorage.removeItem(clave(rol));
