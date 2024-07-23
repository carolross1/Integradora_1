"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var productoControllers_1 = require("../controllers/productoControllers");
var productoControllers_2 = require("../controllers/productoControllers");
var router = (0, express_1.Router)();


router.get('/bajo-stock', productoControllers_2.getProductosBajoStock);
router.get('/', productoControllers_1.getProductos);
router.post('/', productoControllers_1.createProducto);
router.put('/:id', productoControllers_1.updateProducto);
router.delete('/:id', productoControllers_1.deleteProducto);
router.put('/actualizar-stock/:id', productoControllers_1.updateStock);

exports.default = router;
