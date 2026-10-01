import { http } from './http';

// El backend recibe los datos de persona como t1..t7
const persona = (d) => ({
  t1: d.tipoDocumento, t2: d.numeroDocumento, t3: d.nombres,
  t4: d.direccion, t5: d.telefono, t6: d.correo, t7: d.contrasena,
});
const credenciales = (c) => ({ t1: c.correo, t2: c.clave });
const POST = 'POST', PUT = 'PUT', DELETE = 'DELETE';

export const api = {
  // Sesión
  loginCliente: (c) => http('/login', { metodo: POST, cuerpo: credenciales(c) }),                 // RF-03
  loginTrabajador: (c) => http('/trabajador/login', { metodo: POST, cuerpo: credenciales(c) }),   // RF-05 / RF-15
  loginAdmin: (c) => http('/seguridad/login', { metodo: POST, cuerpo: credenciales(c) }),

  // Cuentas
  crearCuenta: (d) => http('/usuario/crear', { metodo: POST, cuerpo: persona(d) }),                               // RF-02
  crearCliente: (d) => http('/seguridad/crearcliente', { metodo: POST, cuerpo: persona(d), rol: 'admin' }),       // RF-01
  crearTrabajador: (d) => http('/seguridad/creartrabajador', { metodo: POST, cuerpo: persona(d), rol: 'admin' }), // RF-04
  crearAdmin: (d) => http('/seguridad/crearadmin', { metodo: POST, cuerpo: persona(d), rol: 'admin' }),           // RF-16
  listarClientes: () => http('/seguridad/clientes', { rol: 'admin' }).then((r) => r.clientes),
  listarTrabajadores: () => http('/seguridad/trabajadores', { rol: 'admin' }).then((r) => r.trabajadores),
  eliminarTrabajador: (id) => http(`/seguridad/trabajador/${id}`, { metodo: DELETE, rol: 'admin' }), // RF-13
  eliminarCliente: (id) => http(`/seguridad/cliente/${id}`, { metodo: DELETE, rol: 'admin' }),       // RF-14

  // Horarios
  horariosCliente: () => http('/horarios', { rol: 'cliente' }).then((r) => r.horarios),                            // RF-06
  horariosAdmin: () => http('/seguridad/horarios', { rol: 'admin' }).then((r) => r.horarios),                      // RF-07
  horariosTrabajador: (id) => http(`/trabajador/horarios/${id}`, { rol: 'trabajador' }).then((r) => r.horarios),   // RF-08
  editarHorario: (rol, id, d) => http(`/horarios/${id}`, { metodo: PUT, cuerpo: d, rol }),                         // RF-09 / RF-11
  eliminarHorario: (rol, id) => http(`/horarios/${id}`, { metodo: DELETE, rol }),                                  // RF-10 / RF-12
};
