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
exports.registrarDetallesEntrega = exports.eliminarEntrega = exports.obtenerEntregaPorId = exports.obtenerEntregas = exports.crearEntrega = void 0;
const database_1 = __importDefault(require("../database")); // Asegúrate de que tu archivo de conexión a la base de datos esté correctamente configurado
// Crear una nueva entrega
const crearEntrega = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_Usuario, id_Proveedor, fecha, total_entrega, id_Factura } = req.body;
    try {
        // Insertar la entrega
        const result = yield database_1.default.query('INSERT INTO entrega_producto (id_Usuario, id_Proveedor, fecha, id_Factura) VALUES (?, ?, ?, ?)', [id_Usuario, id_Proveedor, fecha, id_Factura]);
        const lastId = result.insertId;
        console.log('ID autoincrementado insertado:', lastId);
        // Obtener id_Entrega usando el id autoincrementado
        const entregaResult = yield database_1.default.query('SELECT id_Entrega FROM entrega_producto WHERE id_Entrega = ?', [lastId]);
        console.log('Resultado de la consulta de recuperación:', entregaResult);
        if (Array.isArray(entregaResult) && entregaResult.length > 0) {
            const idEntrega = entregaResult[0].id_Entrega;
            console.log('ID de la entrega recuperado:', idEntrega);
            res.json({ idEntrega });
        }
        else {
            console.error('No se encontró el id_Entrega para el id:', lastId);
            res.status(500).json({ message: 'No se pudo recuperar el ID de la entrega.' });
        }
    }
    catch (error) {
        console.error('Error al crear la entrega:', error);
        res.status(500).json({ message: 'Error al crear la entrega' });
    }
});
exports.crearEntrega = crearEntrega;
const obtenerEntregas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entregas = yield database_1.default.query('SELECT * FROM entrega_producto');
        res.json(entregas);
    }
    catch (error) {
        console.error('Error al obtener entregas:', error);
        res.status(500).json({ message: 'Error al obtener entregas' });
    }
});
exports.obtenerEntregas = obtenerEntregas;
const obtenerEntregaPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idEntrega } = req.params;
    try {
        const entrega = yield database_1.default.query('SELECT * FROM entrega_producto WHERE id_Entrega = ?', [idEntrega]);
        if (Array.isArray(entrega) && entrega.length > 0) {
            res.json(entrega[0]);
        }
        else {
            res.status(404).json({ message: 'Entrega no encontrada' });
        }
    }
    catch (error) {
        console.error('Error al obtener entrega:', error);
        res.status(500).json({ message: 'Error al obtener entrega' });
    }
});
exports.obtenerEntregaPorId = obtenerEntregaPorId;
const eliminarEntrega = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idEntrega } = req.params;
    try {
        yield database_1.default.query('DELETE FROM entrega_producto WHERE id_Entrega = ?', [idEntrega]);
        res.json({ message: 'Entrega eliminada' });
    }
    catch (error) {
        console.error('Error al eliminar entrega:', error);
        res.status(500).json({ message: 'Error al eliminar entrega' });
    }
});
exports.eliminarEntrega = eliminarEntrega;
// Registrar detalles de la entrega
const registrarDetallesEntrega = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let detalles = req.body;
    console.log('Detalles recibidos:', detalles);
    // Si detalles no es un arreglo, lo convertimos en un arreglo con un solo elemento
    if (!Array.isArray(detalles)) {
        detalles = [detalles];
    }
    try {
        // Usa una transacción para asegurar la integridad
        yield database_1.default.query('START TRANSACTION'); // Iniciar transacción
        for (const detalle of detalles) {
            const { id_Entrega, id_Producto, cantidad, total_entrega } = detalle;
            console.log('Insertando detalle:', id_Entrega, id_Producto, cantidad, total_entrega);
            yield database_1.default.query('INSERT INTO detalle_entrega (id_Entrega, id_Producto, cantidad, total_entrega) VALUES (?, ?, ?, ?)', [id_Entrega, id_Producto, cantidad, total_entrega]);
        }
        yield database_1.default.query('COMMIT'); // Confirmar transacción
        res.status(200).json({ success: true, message: 'Detalles de entrega registrados con éxito' });
    }
    catch (error) {
        yield database_1.default.query('ROLLBACK'); // Revertir transacción en caso de error
        console.error('Error al registrar los detalles de entrega:', error);
        res.status(500).json({ message: 'Error al registrar los detalles de entrega' });
    }
});
exports.registrarDetallesEntrega = registrarDetallesEntrega;
