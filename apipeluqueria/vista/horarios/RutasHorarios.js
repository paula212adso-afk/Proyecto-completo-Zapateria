const express = require('express');
const { requerir } = require('../../middleware/auth');
const CRutas = require('../../controlador/horarios/ConsultarHorariosControlador');
const EditarHorarioControlador = require('../../controlador/horarios/EditarHorarioControlador');
const EliminarHorarioControlador = require('../../controlador/horarios/EliminarHorarioControlador');

const router = express.Router();

router.get('/horarios', requerir('cliente', 'trabajador', 'admin'), CRutas.consultarHorarios);                 // RF-06
router.put('/horarios/:idhorario', requerir('trabajador', 'admin'), EditarHorarioControlador.editarHorario);   // RF-09 / RF-11
router.delete('/horarios/:idhorario', requerir('trabajador', 'admin'), EliminarHorarioControlador.eliminarHorario); // RF-10 / RF-12

module.exports = router;
