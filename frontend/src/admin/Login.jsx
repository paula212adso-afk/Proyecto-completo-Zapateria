import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api/servicios';
import { useAuth } from '../auth/AuthContext';
import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/LoginForm';

export default function LoginAdmin() {
  const { sesiones } = useAuth();
  const ir = useNavigate();
  if (sesiones.admin) return <Navigate to="/admin/horarios" replace />;
  return (
    <AuthLayout lado="Todo el salón en un lugar." ladoTexto="Gestiona clientes, trabajadores y horarios."
      titulo="Acceso de administración" subtitulo="Ingresa con tu correo y contraseña.">
      <LoginForm rol="admin" servicio={api.loginAdmin} alEntrar={() => ir('/admin/horarios')} />
    </AuthLayout>
  );
}
