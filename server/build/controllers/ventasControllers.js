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
exports.getDetallesVenta = exports.deleteVenta = exports.deleteDetalleVenta = exports.updateDetalleVenta = exports.getVentas = exports.registrarDetallesVenta = exports.createVenta = void 0;
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
            const idVenta = ventaResult[0].id_Venta;
            console.log('ID de la venta recuperado:', idVenta);
            res.json({ idVenta });
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
    const detalle = req.body;
    console.log('Detalle recibido:', detalle);
    try {
        // Usa una transacción para asegurar la integridad
        yield database_1.default.query('START TRANSACTION'); // Iniciar transacción
        const { id_Venta, id_Producto, descuento, cantidad, total_venta } = detalle;
        console.log('Insertando detalle:', id_Venta, id_Producto, descuento, cantidad, total_venta);
        yield database_1.default.query('INSERT INTO detalle_venta (id_Venta, id_Producto, descuento, cantidad, total_venta) VALUES (?, ?, ?, ?, ?)', [id_Venta, id_Producto, descuento, cantidad, total_venta]);
        yield database_1.default.query('COMMIT'); // Confirmar transacción
        res.status(200).json({ success: true, message: 'Detalle de venta registrado con éxito' });
    }
    catch (error) {
        yield database_1.default.query('ROLLBACK'); // Revertir transacción en caso de error
        console.error('Error al registrar detalle de venta:', error);
        res.status(500).json({ message: 'Error al registrar el detalle de venta' });
    }
});
exports.registrarDetallesVenta = registrarDetallesVenta;
const getVentas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ventas = yield database_1.default.query(`
        SELECT v.id_Venta, v.fecha, v.id_Usuario, v.metodo_Pago, 
               SUM(dv.total_venta) AS total_ventas 
        FROM venta as v
        LEFT JOIN detalle_venta as dv ON v.id_Venta = dv.id_Venta
        GROUP BY v.id_Venta, v.fecha, v.id_Usuario, v.metodo_Pago
    `);
        res.json(ventas);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas', error });
    }
});
exports.getVentas = getVentas;
// Actualizar un detalle de venta
const updateDetalleVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_Detalle } = req.params;
    const { cantidad, id_Producto, descuento } = req.body;
    console.log('este es el id:', id_Detalle);
    console.log('lo demas', cantidad, id_Producto, descuento);
    try {
        const query = `
          UPDATE detalle_venta
          SET cantidad = ?, id_Producto = ?, descuento = ?
          WHERE id_Detalle = ?`;
        yield database_1.default.query(query, [cantidad, id_Producto, descuento, id_Detalle]);
        // Paso 2: Llamar a la función almacenada para recalcular el total_venta
        const callFunctionQuery = `
    CALL proc_ActualizarDetalleVenta(?, ?, ?, ?)`;
        yield database_1.default.query(callFunctionQuery, [id_Detalle, cantidad, id_Producto, descuento]);
        // Responder con éxito
        res.status(200).json({ message: 'Detalle de venta actualizado correctamente' });
    }
    catch (error) {
        console.error('Error en el backend:', error);
        res.status(500).json({ error: 'Error al actualizar el detalle de venta en la base de datos' });
    }
});
exports.updateDetalleVenta = updateDetalleVenta;
// Eliminar un detalle de venta
const deleteDetalleVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_Detalle } = req.params;
    try {
        const query = `DELETE FROM detalle_venta WHERE id_Detalle = ?`;
        yield database_1.default.query(query, [id_Detalle]);
        res.status(200).json({ message: 'Detalle de venta eliminado correctamente' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar el detalle de venta' });
    }
});
exports.deleteDetalleVenta = deleteDetalleVenta;
// Eliminar una venta y sus detalles
const deleteVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_Venta } = req.params;
    try {
        const query = `DELETE FROM venta WHERE id_Venta = ?`;
        yield database_1.default.query(query, [id_Venta]);
        res.status(200).json({ message: 'Venta eliminada correctamente' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar la venta' });
    }
});
exports.deleteVenta = deleteVenta;
// Obtener todos los detalles de venta para cada ticket
const getDetallesVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const detalle = yield database_1.default.query('SELECT dv.id_Venta, p.nombre, p.codigo_Barras,dv.descuento,dv.cantidad,dv.total_venta,dv.id_Detalle,dv.id_Producto FROM detalle_venta as dv inner join producto  as p on dv.id_Producto=p.id_Producto  WHERE id_Venta = ?', [id]);
        if (detalle.length > 0) {
            res.json(detalle); // Devuelve el primer resultado, si hay más de uno
        }
        else {
            res.status(404).json({ message: 'Deetalles no econtrados ' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'No se obtuvo la venta', error });
    }
});
exports.getDetallesVenta = getDetallesVenta;
