import { api } from '../api/servicios';
import { useCarga } from '../lib/useCarga';
import { Cargando, ErrorCaja } from '../components/Estados';
import HorariosTabla from '../components/HorariosTabla';

// RF-07 / RF-11 / RF-12
export default function HorariosAdmin() {
  const { datos, cargando, error, recargar } = useCarga(api.horariosAdmin);
  return (
    <>
      <div className="pagina-cab"><div><h2>Horarios</h2><p className="texto-suave">Los horarios de todos los trabajadores.</p></div></div>
      {cargando && !datos ? <Cargando /> : error ? <ErrorCaja mensaje={error} onReintentar={recargar} /> :
        <HorariosTabla horarios={datos} rol="admin" conTrabajador onCambio={recargar} />}
    </>
  );
}
