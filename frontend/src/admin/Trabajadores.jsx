import { api } from '../api/servicios';
import GestionPersonas from '../components/GestionPersonas';

// RF-04 crear trabajador · RF-13 eliminar trabajador
export default function Trabajadores() {
  return <GestionPersonas titulo="Trabajadores" descripcion="Equipo que ofrece horarios de atención." singular="trabajador"
    idCampo="idtrabajador" avisoEliminar="También se eliminarán sus horarios."
    cargar={() => api.listarTrabajadores().then((l) => l.filter((t) => t.rol.toLowerCase() === 'trabajador'))}
    crear={api.crearTrabajador} eliminar={api.eliminarTrabajador} />;
}
