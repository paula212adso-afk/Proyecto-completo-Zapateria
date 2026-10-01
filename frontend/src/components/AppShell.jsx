import { NavLink, Outlet, Link } from 'react-router-dom';
import { Scissors, LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { iniciales } from '../lib/fechas';

// Estructura de las pantallas internas: barra superior y, si hay varias secciones, menú lateral.
export default function AppShell({ rol, etiqueta, nav = [], children }) {
  const { sesiones, salir } = useAuth();
  const usuario = sesiones[rol].usuario;
  return (
    <div className={`shell ${nav.length ? 'con-menu' : ''}`}>
      <header className="shell-top">
        <Link to="/" className="marca"><Scissors size={20} /> Peluquería <span className="etiqueta-rol">{etiqueta}</span></Link>
        <div className="usuario">
          <span className="avatar" aria-hidden="true">{iniciales(usuario.nombres)}</span>
          <span className="usuario-nombre">{usuario.nombres}</span>
          <button className="btn sec chico" onClick={() => salir(rol)}><LogOut size={16} /> Salir</button>
        </div>
      </header>
      {nav.length > 0 && (
        <nav className="shell-menu" aria-label="Secciones">
          {nav.map(({ to, texto, Icono }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'activo' : '')}><Icono size={18} /> {texto}</NavLink>
          ))}
        </nav>
      )}
      <main className="shell-main">{children ?? <Outlet />}</main>
    </div>
  );
}
