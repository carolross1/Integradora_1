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
exports.obtenerTotalVenta = exports.obtenerDetallesVenta = exports.deleteFactura = exports.updateFactura = exports.createFactura = exports.getFacturaU = exports.getFacturas = void 0;
const database_1 = __importDefault(require("../database"));
const getFacturas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const facturas = yield database_1.default.query('SELECT * FROM factura');
        res.json(facturas);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener facturas', error });
    }
});
exports.getFacturas = getFacturas;
const getFacturaU = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const factura = yield database_1.default.query('SELECT * FROM factura WHERE id_Factura = ?', [id]);
        if (factura.length > 0) {
            res.json(factura[0]); // Devuelve el primer resultado, si hay más de uno
        }
        else {
            res.status(404).json({ message: 'Factura no encontrada' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'No se obtuvo la factura', error });
    }
});
exports.getFacturaU = getFacturaU;
const createFactura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.query('INSERT INTO factura SET ?', [req.body]);
        res.json({ message: 'Factura creada' });
    }
    catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Ya existe una factura para este ticket. Por favor, utiliza un ticket diferente.', error });
        }
        else {
            res.status(500).json({ message: 'Error al crear factura', error });
        }
    }
});
exports.createFactura = createFactura;
const updateFactura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield database_1.default.query('UPDATE factura SET ? WHERE id_Factura = ?', [req.body, id]);
        res.json({ message: 'Factura actualizada' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar factura', error });
    }
});
exports.updateFactura = updateFactura;
const deleteFactura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield database_1.default.query('DELETE FROM factura WHERE id_Factura = ?', [id]);
        res.json({ message: 'Factura eliminada' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar factura', error });
    }
});
exports.deleteFactura = deleteFactura;
const obtenerDetallesVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_Venta } = req.params;
    try {
        // Consulta a la base de datos para obtener los detalles de la venta
        const total = yield database_1.default.query(`SELECT id_Producto, descuento, cantidad, total_venta
         FROM detalle_venta
         WHERE id_Venta = ?`, [id_Venta]);
        // Enviar la respuesta con los detalles obtenidos
        res.status(200).json(total);
    }
    catch (error) {
        console.error('Error al obtener detalles de venta:', error);
        res.status(500).json({ message: 'Error al obtener detalles de venta' });
    }
});
exports.obtenerDetallesVenta = obtenerDetallesVenta;
const obtenerTotalVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_Venta } = req.params;
    try {
        // Consulta para obtener el total de la venta
        const result = yield database_1.default.query(`
        SELECT SUM(total_venta) as total
        FROM detalle_venta
        WHERE id_Venta = ?
      `, [id_Venta]);
        if (result.length > 0) {
            res.json({ total: result[0].total || 0 });
        }
        else {
            res.status(404).json({ message: 'Venta no encontrada' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el total de la venta' });
    }
});
exports.obtenerTotalVenta = obtenerTotalVenta;
