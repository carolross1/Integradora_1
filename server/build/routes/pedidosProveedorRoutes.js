"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pedidoProveedorControllers_1 = require("../controllers/pedidoProveedorControllers"); // Ajusta la ruta de importación según sea necesario
const router = (0, express_1.Router)();
// Rutas para pedidos
router.post('/', pedidoProveedorControllers_1.registrarPedido);
router.get('/', pedidoProveedorControllers_1.obtenerPedidos);
router.get('/:idPedido', pedidoProveedorControllers_1.obtenerPedidoPorId); // Simplifica la ruta
router.delete('/:idPedido', pedidoProveedorControllers_1.eliminarPedido); // Simplifica la ruta
// Rutas para detalles de pedidos
router.post('/detalles-pedido', pedidoProveedorControllers_1.registrarDetallesPedido);
router.get('/detalles-pedido/:idPedido', pedidoProveedorControllers_1.obtenerDetallesPedido);
exports.default = router;
