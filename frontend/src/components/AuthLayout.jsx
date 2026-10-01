import { Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';

// Pantalla dividida para login y registro
export default function AuthLayout({ lado, ladoTexto, titulo, subtitulo, pie, children }) {
  return (
    <div className="auth">
      <aside className="auth-lado">
        <Link to="/" className="marca"><Scissors size={22} /> Peluquería</Link>
        <div>
          <h1>{lado}</h1>
          <p>{ladoTexto}</p>
        </div>
      </aside>
      <main className="auth-form">
        <div className="auth-caja">
          <h2>{titulo}</h2>
          <p className="texto-suave">{subtitulo}</p>
          {children}
          {pie && <p className="auth-pie">{pie}</p>}
        </div>
      </main>
    </div>
  );
}
