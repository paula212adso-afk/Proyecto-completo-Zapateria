const express = require('express');
const { requerir } = require('../../middleware/auth');
const CRutas = require('../../controlador/admin/CrearClienteControlador');
const TRutas = require('../../controlador/admin/CrearTrabajadorControlador');
const ARutas = require('../../controlador/admin/CrearAdminControlador');
const LRutas = require('../../controlador/admin/LoginAdmincontrolador');
const HRutas = require('../../controlador/admin/ConsultarHorariosAdminControlador');
const GRutas = require('../../controlador/admin/GestionUsuariosControlador');

const router = express.Router();
const soloAdmin = requerir('admin');

router.post('/seguridad/login', LRutas.validarCredencial);

router.post('/seguridad/crearcliente', soloAdmin, CRutas.crearCliente);        // RF-01
router.post('/seguridad/creartrabajador', soloAdmin, TRutas.crearTrabajador);  // RF-04
router.post('/seguridad/crearadmin', soloAdmin, ARutas.crearAdmin);            // RF-16
router.get('/seguridad/horarios', soloAdmin, HRutas.consultarHorarios);        // RF-07

router.get('/seguridad/clientes', soloAdmin, GRutas.listarClientes);
router.get('/seguridad/trabajadores', soloAdmin, GRutas.listarTrabajadores);
router.delete('/seguridad/trabajador/:id', soloAdmin, GRutas.eliminarTrabajador); // RF-13
router.delete('/seguridad/cliente/:id', soloAdmin, GRutas.eliminarCliente);       // RF-14

module.exports = router;
