import { api } from '../api/servicios';
import { useAuth } from '../auth/AuthContext';
import { useCarga } from '../lib/useCarga';
import { Cargando, ErrorCaja } from '../components/Estados';
import HorariosTabla from '../components/HorariosTabla';

// RF-08 / RF-09 / RF-10: el trabajador ve, edita y elimina sus horarios
export default function HorariosTrabajador() {
  const { sesiones } = useAuth();
  const id = sesiones.trabajador.usuario.idtrabajador;
  const { datos, cargando, error, recargar } = useCarga(() => api.horariosTrabajador(id));
  return (
    <>
      <div className="pagina-cab"><div><h2>Mis horarios</h2><p className="texto-suave">Edita la fecha y las horas, o elimina los que ya no ofrezcas.</p></div></div>
      {cargando && !datos ? <Cargando /> : error ? <ErrorCaja mensaje={error} onReintentar={recargar} /> :
        <HorariosTabla horarios={datos} rol="trabajador" onCambio={recargar} />}
    </>
  );
}
