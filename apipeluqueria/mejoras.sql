-- Ejecutar UNA vez en phpMyAdmin sobre `bdpeluqueria`.
-- 1) El trabajador 2 es copia exacta del 1 (mismo correo y documento).
DELETE FROM `trabajadores` WHERE `idtrabajador` = 2;

-- 2) Evita duplicados: así la API responde "Ya existe un usuario..." (409).
ALTER TABLE `clientes`
  ADD UNIQUE KEY `uq_clientes_correo` (`correo`),
  ADD UNIQUE KEY `uq_clientes_documento` (`numeroDocumento`);
ALTER TABLE `trabajadores`
  ADD UNIQUE KEY `uq_trabajadores_correo` (`correo`),
  ADD UNIQUE KEY `uq_trabajadores_documento` (`numeroDocumento`);

-- 3) El trabajador 3 (Guillermo Ortiz) tiene la contraseña dañada (dos hash pegados) y no puede entrar.
--    Arréglala con:  node scripts/resetClave.js trabajadores 123@gmsil.com "NuevaClave#2026"
