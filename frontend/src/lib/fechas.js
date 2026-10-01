export const hora = (h) => String(h).slice(0, 5);
const aFecha = (f) => { const [a, m, d] = String(f).slice(0, 10).split('-').map(Number); return new Date(a, m - 1, d); };
export const fechaLarga = (f) => aFecha(f).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
export const fechaCorta = (f) => aFecha(f).toLocaleDateString('es-CO', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
export const soloFecha = (f) => String(f).slice(0, 10);
export const iniciales = (n) => n.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
