"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const entregasControllers_1 = require("../controllers/entregasControllers");
const router = (0, express_1.Router)();
// Ruta para crear una nueva entrega
router.post('/create', entregasControllers_1.crearEntrega);
// Ruta para registrar detalles de la entrega
router.post('/detalle/create', entregasControllers_1.registrarDetallesEntrega);
// Ruta para obtener todas las entregas
router.get('/', entregasControllers_1.obtenerEntregas);
// Ruta para obtener una entrega por ID
router.get('/:idEntrega', entregasControllers_1.obtenerEntregaPorId);
// Ruta para eliminar una entrega por ID
router.delete('/delete/:idEntrega', entregasControllers_1.eliminarEntrega);
exports.default = router;
