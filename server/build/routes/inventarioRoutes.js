"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/inventarioRoutes.ts
const express_1 = require("express");
const inventarioControllers_1 = require("../controllers/inventarioControllers");
const router = (0, express_1.Router)();
router.post('/', inventarioControllers_1.createInventario);
router.get('/', inventarioControllers_1.getInventarios);
router.put('/close/:idInventario', inventarioControllers_1.closeInventario);
router.put('/detalle', inventarioControllers_1.guardarDetallesInventario);
exports.default = router;
