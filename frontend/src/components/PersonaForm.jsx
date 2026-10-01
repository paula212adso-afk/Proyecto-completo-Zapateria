import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Campo from './Campo';

// Mismas reglas que valida el servidor, para avisar antes de enviar
const REGLAS = {
  tipoDocumento: (v) => (['CC', 'TI', 'CE'].includes(v) ? '' : 'Elige un tipo de documento.'),
  numeroDocumento: (v) => (/^\d{8,10}$/.test(v) ? '' : 'Debe tener entre 8 y 10 dígitos.'),
  nombres: (v) => (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,100}$/.test(v) ? '' : 'Solo letras, entre 3 y 100 caracteres.'),
  direccion: (v) => (/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s.,#ºª\-/]{5,200}$/.test(v) ? '' : 'Mínimo 5 caracteres. Se permiten letras, números y # - . , /'),
  telefono: (v) => (/^\d{10}$/.test(v) ? '' : 'Debe tener exactamente 10 dígitos.'),
  correo: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 250 ? '' : 'Escribe un correo válido, por ejemplo nombre@correo.com.'),
  contrasena: (v) => (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v) ? '' : 'Mínimo 8 caracteres con mayúscula, minúscula, número y símbolo.'),
};
const VACIO = { tipoDocumento: 'CC', numeroDocumento: '', nombres: '', direccion: '', telefono: '', correo: '', contrasena: '' };

export default function PersonaForm({ etiqueta = 'Guardar', onSubmit, onCancel }) {
  const [v, setV] = useState(VACIO);
  const [err, setErr] = useState({});
  const [ver, setVer] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorServidor, setErrorServidor] = useState('');

  const cambiar = (k, val) => {
    setV((p) => ({ ...p, [k]: val }));
    if (err[k] !== undefined) setErr((e) => ({ ...e, [k]: REGLAS[k](val) }));
  };
  const validar = (k) => setErr((e) => ({ ...e, [k]: REGLAS[k](v[k]) }));

  const enviar = async (e) => {
    e.preventDefault();
    const todos = Object.fromEntries(Object.keys(REGLAS).map((k) => [k, REGLAS[k](v[k])]));
    setErr(todos);
    if (Object.values(todos).some(Boolean)) return;
    setEnviando(true); setErrorServidor('');
    try {
      await onSubmit({ ...v, nombres: v.nombres.trim(), direccion: v.direccion.trim(), correo: v.correo.trim() });
    } catch (x) { setErrorServidor(x.message); }
    finally { setEnviando(false); }
  };

  const ctl = (k, extra = {}) => ({ value: v[k], onChange: (e) => cambiar(k, e.target.value), onBlur: () => validar(k), ...extra });

  return (
    <form onSubmit={enviar} noValidate>
      <div className="fila-doc">
        <Campo etiqueta="Tipo" error={err.tipoDocumento}>
          {(p) => <select {...p} {...ctl('tipoDocumento')}><option>CC</option><option>TI</option><option>CE</option></select>}
        </Campo>
        <Campo etiqueta="Número de documento" error={err.numeroDocumento} ayuda="Entre 8 y 10 dígitos.">
          {(p) => <input {...p} {...ctl('numeroDocumento')} inputMode="numeric" autoComplete="off" />}
        </Campo>
      </div>
      <Campo etiqueta="Nombres y apellidos" error={err.nombres}>
        {(p) => <input {...p} {...ctl('nombres')} autoComplete="name" />}
      </Campo>
      <Campo etiqueta="Dirección" error={err.direccion}>
        {(p) => <input {...p} {...ctl('direccion')} autoComplete="street-address" />}
      </Campo>
      <div className="fila-2">
        <Campo etiqueta="Teléfono" error={err.telefono} ayuda="10 dígitos, sin espacios.">
          {(p) => <input {...p} {...ctl('telefono')} inputMode="numeric" autoComplete="tel" />}
        </Campo>
        <Campo etiqueta="Correo" error={err.correo}>
          {(p) => <input {...p} {...ctl('correo')} type="email" autoComplete="email" />}
        </Campo>
      </div>
      <Campo etiqueta="Contraseña" error={err.contrasena} ayuda="8+ caracteres, con mayúscula, minúscula, número y símbolo.">
        {(p) => (
          <div className="con-icono">
            <input {...p} {...ctl('contrasena')} type={ver ? 'text' : 'password'} autoComplete="new-password" />
            <button type="button" className="icono-btn" onClick={() => setVer(!ver)} aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {ver ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        )}
      </Campo>
      {errorServidor && <div className="aviso error" role="alert">{errorServidor}</div>}
      <div className="botones">
        {onCancel && <button type="button" className="btn sec" onClick={onCancel}>Cancelar</button>}
        <button className="btn" disabled={enviando}>{enviando ? 'Guardando…' : etiqueta}</button>
      </div>
    </form>
  );
}
