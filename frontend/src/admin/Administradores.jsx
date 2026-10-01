import { api } from '../api/servicios';
import GestionPersonas from '../components/GestionPersonas';

// RF-16 crear administrador
export default function Administradores() {
  return <GestionPersonas titulo="Administradores" descripcion="Personas con acceso a este panel." singular="administrador"
    idCampo="idtrabajador"
    cargar={() => api.listarTrabajadores().then((l) => l.filter((t) => t.rol.toLowerCase() === 'admin'))}
    crear={api.crearAdmin} />;
}
