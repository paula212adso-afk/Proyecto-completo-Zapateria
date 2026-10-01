const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rutaadmin = require('./vista/admin/RutasAdmin');
const rutacliente = require('./vista/clientes/RutasClientes');
const rutatrabajadores = require('./vista/Trabajadores/RutasTrabajadores.js');
const rutahorarios = require('./vista/horarios/RutasHorarios');

const app = express();
const PORT = process.env.PORT || 3333;

// ---------- Middlewares ----------
app.use(cors({
  origin: '*', // En producción: ['https://tu-dominio.com']
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Pantallas (carpeta public: cliente, trabajador, admin) ----------
app.use(express.static(path.join(__dirname, 'public')));

// ---------- API ----------
app.use('/', rutaadmin);
app.use('/', rutacliente);
app.use('/', rutatrabajadores);
app.use('/', rutahorarios);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
