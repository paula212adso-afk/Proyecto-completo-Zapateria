import { api } from '../api/servicios';
import GestionPersonas from '../components/GestionPersonas';

// RF-01 crear cliente · RF-14 eliminar cliente
export default function Clientes() {
  return <GestionPersonas titulo="Clientes" descripcion="Personas con cuenta para ver los horarios." singular="cliente"
    idCampo="idcliente" cargar={api.listarClientes} crear={api.crearCliente} eliminar={api.eliminarCliente} />;
}
