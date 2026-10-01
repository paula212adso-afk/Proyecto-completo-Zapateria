import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CalendarDays, Users, Briefcase, ShieldCheck } from 'lucide-react';
import { AuthProvider } from './auth/AuthContext';
import { UiProvider } from './components/Ui';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';
import Home from './Home';
import LoginCliente from './cliente/Login';
import RegistroCliente from './cliente/Registro';
import HorariosCliente from './cliente/Horarios';
import LoginTrabajador from './trabajador/Login';
import HorariosTrabajador from './trabajador/Horarios';
import LoginAdmin from './admin/Login';
import HorariosAdmin from './admin/Horarios';
import Clientes from './admin/Clientes';
import Trabajadores from './admin/Trabajadores';
import Administradores from './admin/Administradores';

const NAV_ADMIN = [
  { to: '/admin/horarios', texto: 'Horarios', Icono: CalendarDays },
  { to: '/admin/clientes', texto: 'Clientes', Icono: Users },
  { to: '/admin/trabajadores', texto: 'Trabajadores', Icono: Briefcase },
  { to: '/admin/administradores', texto: 'Administradores', Icono: ShieldCheck },
];

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UiProvider>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/cliente/login" element={<LoginCliente />} />
            <Route path="/cliente/registro" element={<RegistroCliente />} />
            <Route path="/cliente/horarios" element={
              <ProtectedRoute rol="cliente"><AppShell rol="cliente" etiqueta="Cliente"><HorariosCliente /></AppShell></ProtectedRoute>} />

            <Route path="/trabajador/login" element={<LoginTrabajador />} />
            <Route path="/trabajador/horarios" element={
              <ProtectedRoute rol="trabajador"><AppShell rol="trabajador" etiqueta="Trabajador"><HorariosTrabajador /></AppShell></ProtectedRoute>} />

            <Route path="/admin/login" element={<LoginAdmin />} />
            <Route path="/admin" element={<ProtectedRoute rol="admin"><AppShell rol="admin" etiqueta="Administración" nav={NAV_ADMIN} /></ProtectedRoute>}>
              <Route index element={<Navigate to="horarios" replace />} />
              <Route path="horarios" element={<HorariosAdmin />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="trabajadores" element={<Trabajadores />} />
              <Route path="administradores" element={<Administradores />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </UiProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
