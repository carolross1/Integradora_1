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
exports.getReport = void 0;
const database_1 = __importDefault(require("../database"));
const getReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extraer fechas de los parámetros de consulta
    const { fechaDesde, fechaHasta } = req.query;
    // Verificar que ambas fechas están presentes
    if (!fechaDesde || !fechaHasta) {
        return res.status(400).json({ error: 'Por favor proporciona ambas fechas' });
    }
    try {
        // Consulta SQL para obtener el reporte
        const result = yield database_1.default.query(`SELECT 
         p.nombre AS producto,
         p.precio_Venta AS precioUnitario,
         SUM(dv.cantidad) AS cantidadTotal,
         (p.precio_Venta * SUM(dv.cantidad)) AS precioTotalProducto,
         (p.utilidad*SUM(dv.cantidad)) AS ganancias
       FROM producto p
       JOIN detalle_venta dv ON p.id_Producto = dv.id_Producto
       JOIN venta v ON v.id_Venta = dv.id_Venta
       WHERE DATE(v.fecha) >= DATE(?) AND DATE(v.fecha) <= DATE(?)
       GROUP BY p.nombre, p.precio_Venta`, [fechaDesde, fechaHasta]);
        // Retornar el resultado de la consulta
        return res.status(200).json(result);
    }
    catch (err) {
        // Manejo de errores
        const error = err;
        return res.status(500).json({ error: error.message });
    }
});
exports.getReport = getReport;
