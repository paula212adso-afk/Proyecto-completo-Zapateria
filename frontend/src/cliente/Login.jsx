import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api/servicios';
import { useAuth } from '../auth/AuthContext';
import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/LoginForm';

// RF-03: el cliente inicia sesión
export default function LoginCliente() {
  const { sesiones } = useAuth();
  const ir = useNavigate();
  if (sesiones.cliente) return <Navigate to="/cliente/horarios" replace />;
  return (
    <AuthLayout lado="Reserva tu próximo corte." ladoTexto="Mira los horarios disponibles de nuestros trabajadores."
      titulo="Acceso de clientes" subtitulo="Ingresa con tu correo y contraseña."
      pie={<>¿Aún no tienes cuenta? <Link to="/cliente/registro">Crear cuenta</Link></>}>
      <LoginForm rol="cliente" servicio={api.loginCliente} alEntrar={() => ir('/cliente/horarios')} />
    </AuthLayout>
  );
}
