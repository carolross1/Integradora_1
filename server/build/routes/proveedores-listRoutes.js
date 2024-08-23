"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proveedores_listControllers_1 = require("../controllers/proveedores-listControllers");
const router = (0, express_1.Router)();
// Ruta para obtener todos los proveedores
router.get('/', proveedores_listControllers_1.getProveedores);
// Ruta para agregar un nuevo proveedor
router.post('/', proveedores_listControllers_1.addProveedor);
// Ruta para eliminar un proveedor por ID
router.delete('/:idProveedor', proveedores_listControllers_1.deleteProveedor);
// Ruta para actualizar un proveedor por ID
router.put('/:idProveedor', proveedores_listControllers_1.updateProveedor);
exports.default = router;
