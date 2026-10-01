/* Utilidades compartidas por cliente, trabajador y admin */

// Misma dirección que sirve la página; si abres el HTML como archivo, usa localhost:3333.
// Para otro servidor, define antes: <script>window.API_URL='https://tu-api'</script>
const API = window.API_URL ?? (location.protocol === 'file:' ? 'http://localhost:3333' : '');

const esc = (t) => String(t ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- Sesión (una por rol) ---------- */
const Sesion = {
  guardar(rol, datos) { localStorage.setItem('peluqueria_' + rol, JSON.stringify(datos)); },
  leer(rol) { try { return JSON.parse(localStorage.getItem('peluqueria_' + rol)); } catch { return null; } },
  salir(rol, destino) { localStorage.removeItem('peluqueria_' + rol); location.href = destino; },
  // Si no hay sesión de ese rol, manda al login
  exigir(rol, login) {
    const s = this.leer(rol);
    if (!s) { location.href = login; throw new Error('sin sesión'); }
    return s;
  }
};

/* ---------- Llamadas a la API ---------- */
async function api(ruta, { metodo = 'GET', cuerpo, rol, login } = {}) {
  const cab = { 'Content-Type': 'application/json' };
  const s = rol && Sesion.leer(rol);
  if (s) cab.Authorization = 'Bearer ' + s.token;
  let r;
  try {
    r = await fetch(API + ruta, { method: metodo, headers: cab, body: cuerpo ? JSON.stringify(cuerpo) : undefined });
  } catch {
    throw new Error('No hay conexión con el servidor. ¿Está encendido?');
  }
  const datos = await r.json().catch(() => ({}));
  if (r.status === 401 && rol && login) { Sesion.salir(rol, login); }
  if (!r.ok) throw new Error(datos.error || datos.mensaje || 'Ocurrió un error inesperado.');
  return datos;
}

/* ---------- Avisos ---------- */
function aviso(el, tipo, texto) {
  el.className = 'aviso ver ' + tipo;
  el.textContent = texto;
}
function toast(texto) {
  const t = document.createElement('div');
  t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = texto;
  document.body.append(t); setTimeout(() => t.remove(), 3000);
}

/* ---------- Formulario de login genérico ---------- */
function activarLogin({ ruta, rol, destino }) {
  const f = document.getElementById('form'), msg = document.getElementById('msg');
  if (Sesion.leer(rol)) location.href = destino;
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const b = f.querySelector('button'); b.disabled = true; msg.className = 'aviso';
    try {
      const d = await api(ruta, { metodo: 'POST', cuerpo: { t1: f.correo.value.trim(), t2: f.clave.value } });
      Sesion.guardar(rol, { token: d.token, usuario: d.usuario });
      location.href = destino;
    } catch (err) { aviso(msg, 'error', err.message); b.disabled = false; }
  });
}

/* ---------- Campos de persona (cliente / trabajador / admin) ---------- */
function camposPersona() {
  return `
  <div class="fila2">
    <div><label for="t1">Tipo</label>
      <select id="t1" name="t1" required><option>CC</option><option>TI</option><option>CE</option></select></div>
    <div><label for="t2">Número de documento</label>
      <input id="t2" name="t2" inputmode="numeric" pattern="\\d{8,10}" required>
      <div class="ayuda">Entre 8 y 10 dígitos.</div></div>
  </div>
  <label for="t3">Nombres y apellidos</label><input id="t3" name="t3" minlength="3" maxlength="100" required>
  <label for="t4">Dirección</label><input id="t4" name="t4" minlength="5" maxlength="200" required>
  <label for="t5">Teléfono</label><input id="t5" name="t5" inputmode="numeric" pattern="\\d{10}" required>
  <div class="ayuda">10 dígitos, sin espacios.</div>
  <label for="t6">Correo</label><input id="t6" name="t6" type="email" maxlength="250" required>
  <label for="t7">Contraseña</label><input id="t7" name="t7" type="password" minlength="8" required>
  <div class="ayuda">Mínimo 8 caracteres con mayúscula, minúscula, número y símbolo.</div>`;
}
function leerPersona(form) {
  const o = {}; for (const k of ['t1','t2','t3','t4','t5','t6','t7']) o[k] = form[k].value.trim();
  o.t7 = form.t7.value; return o;
}

/* ---------- Horarios ---------- */
const fmtHora = (h) => String(h).slice(0, 5);
function fmtFecha(f) {
  const [a, m, d] = String(f).slice(0, 10).split('-').map(Number);
  return new Date(a, m - 1, d).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// Tabla con botones Editar / Eliminar (trabajador y admin)
function tablaHorarios(horarios, { conTrabajador }) {
  if (!horarios.length) return '<div class="vacio">Todavía no hay horarios registrados.</div>';
  return `<div class="envoltura"><table>
    <thead><tr><th>Fecha</th><th>Horario</th>${conTrabajador ? '<th>Trabajador</th>' : ''}<th>Estado</th><th></th></tr></thead><tbody>
    ${horarios.map(h => `<tr>
      <td>${esc(String(h.fecha).slice(0,10))}</td>
      <td>${fmtHora(h.horaInicio)} – ${fmtHora(h.horaFin)}</td>
      ${conTrabajador ? `<td>${esc(h.trabajador)}</td>` : ''}
      <td><span class="etq ${h.estado === 'DISPONIBLE' ? 'ok' : ''}">${esc(h.estado)}</span></td>
      <td class="acc">
        <button class="sec chico" data-editar="${h.idhorario}">Editar</button>
        <button class="peligro chico" data-borrar="${h.idhorario}">Eliminar</button>
      </td></tr>`).join('')}
    </tbody></table></div>`;
}

// Enlaza los botones de la tabla. `recargar` vuelve a pedir los horarios.
function activarAccionesHorario(contenedor, horarios, { rol, login, recargar }) {
  contenedor.onclick = async (e) => {
    const ed = e.target.closest('[data-editar]'), bo = e.target.closest('[data-borrar]');
    if (ed) abrirEditar(horarios.find(h => h.idhorario == ed.dataset.editar), { rol, login, recargar });
    if (bo && confirm('¿Eliminar este horario? No se puede deshacer.')) {
      try {
        await api('/horarios/' + bo.dataset.borrar, { metodo: 'DELETE', rol, login });
        toast('Horario eliminado'); recargar();
      } catch (err) { toast(err.message); }
    }
  };
}

function abrirEditar(h, { rol, login, recargar }) {
  const d = document.createElement('dialog');
  d.innerHTML = `<form method="dialog" id="fe">
    <h3>Editar horario</h3><p class="ayuda" style="margin:0">${esc(h.trabajador || '')}</p>
    <label for="ef">Fecha</label><input id="ef" type="date" required value="${esc(String(h.fecha).slice(0,10))}">
    <label for="ei">Hora de inicio</label><input id="ei" type="time" required value="${fmtHora(h.horaInicio)}">
    <label for="ee">Hora de fin</label><input id="ee" type="time" required value="${fmtHora(h.horaFin)}">
    <div class="aviso" id="em"></div>
    <div class="botones"><button type="button" class="sec" id="ec">Cancelar</button><button>Guardar cambios</button></div></form>`;
  document.body.append(d); d.showModal();
  d.querySelector('#ec').onclick = () => d.close();
  d.addEventListener('close', () => d.remove());
  d.querySelector('#fe').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api('/horarios/' + h.idhorario, { metodo: 'PUT', rol, login,
        cuerpo: { fecha: d.querySelector('#ef').value, horaInicio: d.querySelector('#ei').value, horaFin: d.querySelector('#ee').value } });
      d.close(); toast('Horario actualizado'); recargar();
    } catch (err) { aviso(d.querySelector('#em'), 'error', err.message); }
  });
}
