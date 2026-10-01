import { useMemo, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useCarga } from '../lib/useCarga';
import { iniciales } from '../lib/fechas';
import { useAuth } from '../auth/AuthContext';
import Modal from './Modal';
import PersonaForm from './PersonaForm';
import { Cargando, ErrorCaja, Vacio } from './Estados';
import { useUi } from './Ui';

// Lista con búsqueda + crear + eliminar. Sirve para clientes, trabajadores y administradores.
export default function GestionPersonas({ titulo, descripcion, singular, cargar, crear, eliminar, idCampo, avisoEliminar }) {
  const { toast, confirmar } = useUi();
  const { sesiones } = useAuth();
  const yo = sesiones.admin?.usuario?.idtrabajador;
  const { datos, cargando, error, recargar } = useCarga(cargar);
  const [buscar, setBuscar] = useState('');
  const [creando, setCreando] = useState(false);

  const filtrados = useMemo(() => {
    const q = buscar.trim().toLowerCase();
    return (datos || []).filter((p) => !q || [p.nombres, p.correo, p.numeroDocumento].some((x) => String(x).toLowerCase().includes(q)));
  }, [datos, buscar]);

  const borrar = async (p) => {
    const ok = await confirmar({ titulo: `Eliminar ${singular}`, texto: `Se eliminará a ${p.nombres}. ${avisoEliminar || ''} No se puede deshacer.`, boton: 'Eliminar', peligro: true });
    if (!ok) return;
    try { await eliminar(p[idCampo]); toast(`${singular[0].toUpperCase() + singular.slice(1)} eliminado`); recargar(); }
    catch (e) { toast(e.message, 'error'); }
  };

  return (
    <>
      <div className="pagina-cab">
        <div><h2>{titulo}</h2><p className="texto-suave">{descripcion}</p></div>
        <button className="btn" onClick={() => setCreando(true)}><Plus size={18} /> Nuevo {singular}</button>
      </div>

      {cargando && !datos ? <Cargando /> : error ? <ErrorCaja mensaje={error} onReintentar={recargar} /> : (
        <>
          <label className="buscador">
            <Search size={18} aria-hidden="true" />
            <input value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Buscar por nombre, correo o documento" aria-label="Buscar" />
          </label>
          {!datos.length ? (
            <Vacio titulo={`Aún no hay ${singular}s`} texto="Crea el primero con el botón de arriba." />
          ) : !filtrados.length ? (
            <Vacio titulo="Sin resultados" texto="Prueba con otro nombre, correo o documento." />
          ) : (
            <div className="tabla-caja">
              <table>
                <thead><tr><th>Nombre</th><th>Documento</th><th>Correo</th><th>Teléfono</th><th>Estado</th>{eliminar && <th><span className="solo-lectores">Acciones</span></th>}</tr></thead>
                <tbody>
                  {filtrados.map((p) => (
                    <tr key={p[idCampo]}>
                      <td><span className="persona"><span className="avatar" aria-hidden="true">{iniciales(p.nombres)}</span>{p.nombres}{p.idtrabajador === yo && <span className="etq">Tú</span>}</span></td>
                      <td className="num">{p.tipoDocumento} {p.numeroDocumento}</td>
                      <td>{p.correo}</td>
                      <td className="num">{p.telefono}</td>
                      <td><span className="etq ok">{p.estado}</span></td>
                      {eliminar && <td className="acc"><button className="btn peligro chico" onClick={() => borrar(p)}><Trash2 size={15} /> Eliminar</button></td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {creando && (
        <Modal titulo={`Nuevo ${singular}`} onClose={() => setCreando(false)}>
          <PersonaForm etiqueta={`Crear ${singular}`} onCancel={() => setCreando(false)}
            onSubmit={async (d) => { await crear(d); toast(`${singular[0].toUpperCase() + singular.slice(1)} creado`); setCreando(false); recargar(); }} />
        </Modal>
      )}
    </>
  );
}
