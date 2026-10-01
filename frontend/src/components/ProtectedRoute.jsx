import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

// Solo deja pasar si hay sesión de ese rol; si no, manda a su login
export default function ProtectedRoute({ rol, children }) {
  const { sesiones } = useAuth();
  return sesiones[rol] ? children : <Navigate to={`/${rol}/login`} replace />;
}
