const express = require('express');
const { requerir } = require('../../middleware/auth');
const LTRutas = require('../../controlador/Trabajadores/LoginTrabajadorcontrolador');
const HTRutas = require('../../controlador/Trabajadores/ConsultarHorariosTrabajadorControlador');

const router = express.Router();

router.post('/trabajador/login', LTRutas.validarCredencial);                                          // RF-05 / RF-15
router.get('/trabajador/horarios/:idtrabajador', requerir('trabajador', 'admin'), HTRutas.consultarHorarios); // RF-08

module.exports = router;
