import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api/servicios';
import { useAuth } from '../auth/AuthContext';
import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/LoginForm';

// RF-05 / RF-15: el trabajador inicia sesión
export default function LoginTrabajador() {
  const { sesiones } = useAuth();
  const ir = useNavigate();
  if (sesiones.trabajador) return <Navigate to="/trabajador/horarios" replace />;
  return (
    <AuthLayout lado="Tu agenda, a tu manera." ladoTexto="Consulta, ajusta o elimina tus horarios."
      titulo="Acceso de trabajadores" subtitulo="Ingresa con tu correo y contraseña.">
      <LoginForm rol="trabajador" servicio={api.loginTrabajador} alEntrar={() => ir('/trabajador/horarios')} />
    </AuthLayout>
  );
}
