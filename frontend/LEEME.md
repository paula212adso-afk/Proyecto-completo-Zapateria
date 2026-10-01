# Peluquería – Frontend (React + Vite)

Proyecto aparte que consume la API `apipeluqueria`.

## Cómo ejecutarlo
1. Enciende MySQL (XAMPP) y la API: en la carpeta `apipeluqueria` ejecuta `npm start` (puerto 3333).
2. En esta carpeta ejecuta:
   ```
   npm install
   npm run dev
   ```
3. Abre http://localhost:5173

Si tu API está en otra dirección, copia `.env.example` como `.env` y cambia `VITE_API_URL`.

## Estructura (src/)
- `cliente/`     Login (RF-03), Registro (RF-02), Horarios (RF-06)
- `trabajador/`  Login (RF-05, RF-15), Horarios: ver, editar, eliminar (RF-08, 09, 10)
- `admin/`       Login, Horarios (RF-07, 11, 12), Clientes (RF-01, 14), Trabajadores (RF-04, 13), Administradores (RF-16)
- `components/`  piezas compartidas (formularios, tablas, ventanas, menú)
- `api/`         todas las llamadas al backend en un solo archivo (`servicios.js`)

## Publicar la versión final
`npm run build` genera la carpeta `dist/` lista para subir a un hosting estático.
