# Peluquería – API + pantallas

## Puesta en marcha
1. En phpMyAdmin importa `bdpeluqueria.sql` (el tuyo) y luego ejecuta `mejoras.sql`.
2. `npm install` y después `npm start` (o `npm run dev`).
3. Abre http://localhost:3333 → portada con los tres accesos.

## Carpetas de pantallas (`public/`)
- `cliente/`     login.html (RF-03), registro.html (RF-02), horarios.html (RF-06)
- `trabajador/`  login.html (RF-05 / RF-15), horarios.html (RF-08, 09, 10)
- `admin/`       login.html, panel.html (RF-01, 04, 07, 11, 12, 13, 14, 16)

## Contraseñas
Las de los datos de ejemplo no se conocen. Para fijar una:
`node scripts/resetClave.js trabajadores pepito@gmail.com "Admin#2026x"`
(pepito@gmail.com es el administrador existente; con él entras al panel y creas los demás.)
