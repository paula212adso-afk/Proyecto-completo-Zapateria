const express = require('express');
const CRutas = require('../../controlador/clientes/CrearClienteControlador');
const LCRutas = require('../../controlador/clientes/LoginClienteControlador');

const router = express.Router();

router.post('/usuario/crear', CRutas.crearCliente); // RF-02 (público)
router.post('/login', LCRutas.validarCredencial);   // RF-03

module.exports = router;
