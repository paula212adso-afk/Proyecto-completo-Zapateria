import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/servicios';
import AuthLayout from '../components/AuthLayout';
import PersonaForm from '../components/PersonaForm';
import { useUi } from '../components/Ui';

// RF-02: el cliente crea su propia cuenta
export default function RegistroCliente() {
  const ir = useNavigate();
  const { toast } = useUi();
  return (
    <AuthLayout lado="Crea tu cuenta." ladoTexto="Con ella podrás ver los horarios disponibles."
      titulo="Crear cuenta de cliente" subtitulo="Completa tus datos."
      pie={<>¿Ya tienes cuenta? <Link to="/cliente/login">Iniciar sesión</Link></>}>
      <PersonaForm etiqueta="Crear cuenta"
        onSubmit={async (d) => { await api.crearCuenta(d); toast('Cuenta creada. Ya puedes iniciar sesión.'); ir('/cliente/login'); }} />
    </AuthLayout>
  );
}
