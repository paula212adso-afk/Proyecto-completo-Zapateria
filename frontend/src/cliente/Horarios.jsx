import { useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import { api } from '../api/servicios';
import { useCarga } from '../lib/useCarga';
import { fechaLarga, hora, soloFecha } from '../lib/fechas';
import { Cargando, ErrorCaja, Vacio } from '../components/Estados';

// RF-06: el cliente ve los horarios disponibles
export default function HorariosCliente() {
  const { datos, cargando, error, recargar } = useCarga(api.horariosCliente);
  const [quien, setQuien] = useState('');

  const trabajadores = useMemo(() => [...new Set((datos || []).map((h) => h.trabajador))].sort(), [datos]);
  const porDia = useMemo(() => {
    const dias = {};
    (datos || []).filter((h) => !quien || h.trabajador === quien)
      .sort((a, b) => (soloFecha(a.fecha) + a.horaInicio).localeCompare(soloFecha(b.fecha) + b.horaInicio))
      .forEach((h) => (dias[soloFecha(h.fecha)] ||= []).push(h));
    return Object.entries(dias);
  }, [datos, quien]);

  return (
    <>
      <div className="pagina-cab">
        <div><h2>Horarios disponibles</h2><p className="texto-suave">Estos son los turnos libres de nuestros trabajadores.</p></div>
        {trabajadores.length > 1 && (
          <label className="filtro">Trabajador
            <select value={quien} onChange={(e) => setQuien(e.target.value)}>
              <option value="">Todos</option>
              {trabajadores.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
        )}
      </div>
      {cargando && !datos ? <Cargando /> : error ? <ErrorCaja mensaje={error} onReintentar={recargar} /> :
        !porDia.length ? <Vacio titulo="No hay horarios disponibles" texto="Vuelve a consultar más tarde." /> :
        porDia.map(([dia, hs]) => (
          <section key={dia} className="dia">
            <h3>{fechaLarga(dia)}</h3>
            <div className="turnos">
              {hs.map((h) => (
                <article key={h.idhorario} className="turno">
                  <strong><Clock size={16} /> {hora(h.horaInicio)} – {hora(h.horaFin)}</strong>
                  <span>{h.trabajador}</span>
                </article>
              ))}
            </div>
          </section>
        ))}
    </>
  );
}
