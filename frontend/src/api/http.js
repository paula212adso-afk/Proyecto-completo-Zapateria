import { leerSesion, borrarSesion } from '../auth/storage';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export class ApiError extends Error {
  constructor(mensaje, estado) { super(mensaje); this.estado = estado; }
}

// `rol` indica con qué sesión se firma la petición (envía el token).
export async function http(ruta, { metodo = 'GET', cuerpo, rol } = {}) {
  const cabeceras = { 'Content-Type': 'application/json' };
  const sesion = rol && leerSesion(rol);
  if (sesion) cabeceras.Authorization = `Bearer ${sesion.token}`;

  let r;
  try {
    r = await fetch(BASE + ruta, { method: metodo, headers: cabeceras, body: cuerpo ? JSON.stringify(cuerpo) : undefined });
  } catch {
    throw new ApiError('No hay conexión con el servidor. Revisa que la API esté encendida.', 0);
  }
  const datos = await r.json().catch(() => ({}));

  if (r.status === 401 && sesion) {            // token vencido: cerrar sesión de ese rol
    borrarSesion(rol);
    window.dispatchEvent(new CustomEvent('sesion-expirada', { detail: rol }));
  }
  if (!r.ok) throw new ApiError(datos.error || datos.mensaje || 'Ocurrió un error inesperado.', r.status);
  return datos;
}
