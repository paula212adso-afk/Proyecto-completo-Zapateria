import { Link } from 'react-router-dom';
import { Scissors, CalendarDays, BriefcaseBusiness, ShieldCheck, ArrowRight } from 'lucide-react';

const ENTRADAS = [
  { to: '/cliente/login', Icono: CalendarDays, titulo: 'Soy cliente', texto: 'Consulta los horarios disponibles y crea tu cuenta.' },
  { to: '/trabajador/login', Icono: BriefcaseBusiness, titulo: 'Soy trabajador', texto: 'Revisa y ajusta tu agenda de trabajo.' },
  { to: '/admin/login', Icono: ShieldCheck, titulo: 'Administración', texto: 'Gestiona clientes, trabajadores y horarios.' },
];

export default function Home() {
  return (
    <div className="portada">
      <div className="franja" />
      <div className="portada-in">
        <span className="marca"><Scissors size={22} /> Peluquería</span>
        <h1>Tu agenda de peluquería, en orden.</h1>
        <p className="texto-suave grande">Elige cómo quieres entrar.</p>
        <nav className="entradas" aria-label="Accesos">
          {ENTRADAS.map(({ to, Icono, titulo, texto }) => (
            <Link key={to} to={to} className="entrada">
              <Icono size={26} />
              <div><strong>{titulo}</strong><span>{texto}</span></div>
              <ArrowRight size={20} className="flecha" />
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
