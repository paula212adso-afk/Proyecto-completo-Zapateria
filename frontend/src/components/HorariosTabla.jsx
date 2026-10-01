import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { api } from '../api/servicios';
import { hora, fechaCorta, soloFecha } from '../lib/fechas';
import Modal from './Modal';
import Campo from './Campo';
import { Vacio } from './Estados';
import { useUi } from './Ui';

// Tabla de horarios con editar y eliminar. La usan el trabajador (RF-08/09/10) y el admin (RF-07/11/12).
export default function HorariosTabla({ horarios, rol, conTrabajador, onCambio }) {
  const { toast, confirmar } = useUi();
  const [editando, setEditando] = useState(null);

  if (!horarios.length) {
    return <Vacio titulo="Todavía no hay horarios" texto="Cuando se registren horarios aparecerán aquí." />;
  }

  const eliminar = async (h) => {
    const ok = await confirmar({
      titulo: 'Eliminar horario',
      texto: `Se eliminará el horario del ${fechaCorta(h.fecha)} de ${hora(h.horaInicio)} a ${hora(h.horaFin)}. No se puede deshacer.`,
      boton: 'Eliminar', peligro: true,
    });
    if (!ok) return;
    try { await api.eliminarHorario(rol, h.idhorario); toast('Horario eliminado'); onCambio(); }
    catch (e) { toast(e.message, 'error'); }
  };

  return (
    <>
      <div className="tabla-caja">
        <table>
          <thead>
            <tr><th>Fecha</th><th>Horario</th>{conTrabajador && <th>Trabajador</th>}<th>Estado</th><th><span className="solo-lectores">Acciones</span></th></tr>
          </thead>
          <tbody>
            {horarios.map((h) => (
              <tr key={h.idhorario}>
                <td>{fechaCorta(h.fecha)}</td>
                <td className="num">{hora(h.horaInicio)} – {hora(h.horaFin)}</td>
                {conTrabajador && <td>{h.trabajador}</td>}
                <td><span className={`etq ${h.estado === 'DISPONIBLE' ? 'ok' : ''}`}>{h.estado === 'DISPONIBLE' ? 'Disponible' : h.estado}</span></td>
                <td className="acc">
                  <button className="btn sec chico" onClick={() => setEditando(h)}><Pencil size={15} /> Editar</button>
                  <button className="btn peligro chico" onClick={() => eliminar(h)}><Trash2 size={15} /> Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editando && <EditarHorario h={editando} rol={rol} onClose={() => setEditando(null)} onGuardado={() => { setEditando(null); onCambio(); }} />}
    </>
  );
}

function EditarHorario({ h, rol, onClose, onGuardado }) {
  const { toast } = useUi();
  const [f, setF] = useState({ fecha: soloFecha(h.fecha), horaInicio: hora(h.horaInicio), horaFin: hora(h.horaFin) });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const guardar = async (e) => {
    e.preventDefault();
    if (!f.fecha || !f.horaInicio || !f.horaFin) { setError('Completa la fecha y las dos horas.'); return; }
    if (f.horaFin <= f.horaInicio) { setError('La hora de fin debe ser posterior a la de inicio.'); return; }
    setEnviando(true); setError('');
    try { await api.editarHorario(rol, h.idhorario, f); toast('Horario actualizado'); onGuardado(); }
    catch (x) { setError(x.message); setEnviando(false); }
  };

  return (
    <Modal titulo="Editar horario" onClose={onClose}>
      {h.trabajador && <p className="texto-suave">{h.trabajador}</p>}
      <form onSubmit={guardar} noValidate>
        <Campo etiqueta="Fecha">{(p) => <input {...p} type="date" value={f.fecha} onChange={(e) => setF({ ...f, fecha: e.target.value })} />}</Campo>
        <div className="fila-2">
          <Campo etiqueta="Hora de inicio">{(p) => <input {...p} type="time" value={f.horaInicio} onChange={(e) => setF({ ...f, horaInicio: e.target.value })} />}</Campo>
          <Campo etiqueta="Hora de fin">{(p) => <input {...p} type="time" value={f.horaFin} onChange={(e) => setF({ ...f, horaFin: e.target.value })} />}</Campo>
        </div>
        {error && <div className="aviso error" role="alert">{error}</div>}
        <div className="botones">
          <button type="button" className="btn sec" onClick={onClose}>Cancelar</button>
          <button className="btn" disabled={enviando}>{enviando ? 'Guardando…' : 'Guardar cambios'}</button>
        </div>
      </form>
    </Modal>
  );
}
