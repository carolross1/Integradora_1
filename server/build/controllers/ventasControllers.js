"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarDetallesVenta = exports.createVenta = void 0;
const database_1 = __importDefault(require("../database"));
const createVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_Usuario, fecha, metodo_Pago, caja } = req.body;
    try {
        // Insertar la venta
        const result = yield database_1.default.query('INSERT INTO venta (id_Usuario, fecha, metodo_Pago, caja) VALUES (?, ?, ?, ?)', [id_Usuario, fecha, metodo_Pago, caja]);
        const lastId = result.insertId;
        console.log('ID autoincrementado insertado:', lastId);
        // Obtener id_Venta usando el id autoincrementado
        const ventaResult = yield database_1.default.query('SELECT id_Venta FROM venta WHERE id = ?', [lastId]);
        console.log('Resultado de la consulta de recuperación:', ventaResult);
        if (Array.isArray(ventaResult) && ventaResult.length > 0) {
            const id_Venta = ventaResult[0].id_Venta;
            console.log('ID de la venta recuperado:', id_Venta);
            res.json({ id_Venta });
        }
        else {
            console.error('No se encontró el id_Venta para el id:', lastId);
            res.status(500).json({ message: 'No se pudo recuperar el ID de la venta.' });
        }
    }
    catch (error) {
        console.error('Error al crear la venta:', error);
        res.status(500).json({ message: 'Error al crear la venta' });
    }
});
exports.createVenta = createVenta;
const registrarDetallesVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_Venta, id_Producto, cantidad, descuento } = req.body;
    // Imprimir el contenido de `detalles` en la consola
    console.log('Detalles recibidos:', { id_Venta, id_Producto, cantidad, descuento });
    try {
        // Insertar la venta
        const result = yield database_1.default.query('INSERT INTO detalle_venta (id_Venta, id_Producto, descuento, cantidad) VALUES (?, ?, ?, ?)', [id_Venta, id_Producto, cantidad, descuento]);
    }
    catch (error) {
        console.error('Error al crear la venta:', error);
        res.status(500).json({ message: 'Error al crear el detalle de  venta' });
    }
});
exports.registrarDetallesVenta = registrarDetallesVenta;