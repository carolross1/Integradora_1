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
exports.obtenerDetallesPedido = exports.registrarDetallesPedido = exports.eliminarPedido = exports.obtenerPedidoPorId = exports.obtenerPedidos = exports.registrarPedido = exports.enviarCorreo = void 0;
const database_1 = __importDefault(require("../database")); // Asegúrate de que tu archivo de conexión a la base de datos esté correctamente configurado
const nodemailer_1 = __importDefault(require("nodemailer"));
// Configuración del transporte de correo
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'pvabarrotes@gmail.com',
        pass: 'pvabarrotes123',
    },
});
const enviarCorreo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { destinatario, asunto, mensaje } = req.body;
    const mailOptions = {
        from: 'pvabarrotes@gmail.com',
        to: destinatario,
        subject: asunto,
        text: mensaje,
    };
    try {
        const info = yield transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.response);
        res.json({ message: 'Correo enviado correctamente', response: info.response });
    }
    catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Error al enviar el correo' });
    }
});
exports.enviarCorreo = enviarCorreo;
const registrarPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_Proveedor, fecha_Pedido, total } = req.body;
    try {
        // Insertar el pedido y obtener el ID generado automáticamente
        const result = yield database_1.default.query('INSERT INTO pedido_digital (id_Proveedor, fecha_Pedido, total) VALUES (?, ?, ?)', [id_Proveedor, fecha_Pedido, total]);
        // Obtener el ID autogenerado del pedido
        const lastId = result.insertId;
        console.log('ID autoincrementado insertado:', lastId);
        // Verificar si el ID fue generado correctamente
        if (lastId) {
            res.json({ idPedido: lastId });
        }
        else {
            res.status(500).json({ message: 'No se pudo obtener el ID del pedido.' });
        }
    }
    catch (error) {
        console.error('Error al crear el pedido:', error);
        res.status(500).json({ message: 'Error al crear el pedido' });
    }
});
exports.registrarPedido = registrarPedido;
const obtenerPedidos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pedidos = yield database_1.default.query('SELECT * FROM pedido_digital');
        res.json(pedidos);
    }
    catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ message: 'Error al obtener pedidos' });
    }
});
exports.obtenerPedidos = obtenerPedidos;
const obtenerPedidoPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idPedido } = req.params;
    try {
        const pedido = yield database_1.default.query('SELECT * FROM pedido_digital WHERE id_Pedido = ?', [idPedido]);
        if (Array.isArray(pedido) && pedido.length > 0) {
            res.json(pedido[0]);
        }
        else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    }
    catch (error) {
        console.error('Error al obtener pedido:', error);
        res.status(500).json({ message: 'Error al obtener pedido' });
    }
});
exports.obtenerPedidoPorId = obtenerPedidoPorId;
const eliminarPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idPedido } = req.params;
    try {
        yield database_1.default.query('DELETE FROM pedido_digital WHERE id_Pedido = ?', [idPedido]);
        res.json({ message: 'Pedido eliminado' });
    }
    catch (error) {
        console.error('Error al eliminar pedido:', error);
        res.status(500).json({ message: 'Error al eliminar pedido' });
    }
});
exports.eliminarPedido = eliminarPedido;
const registrarDetallesPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let detalles = req.body;
    console.log('Detalles recibidos:', detalles);
    // Si detalles no es un arreglo, lo convertimos en un arreglo con un solo elemento
    if (!Array.isArray(detalles)) {
        detalles = [detalles];
    }
    // Usamos el primer detalle para obtener el id_Pedido
    const { id_Pedido } = detalles[0];
    // Verificar que el id_Pedido es válido
    if (!id_Pedido || id_Pedido === 0) {
        return res.status(400).json({ message: 'El id_Pedido no es válido.' });
    }
    try {
        // Verificar que el id_Pedido existe en la tabla pedido_digital
        const pedido = yield database_1.default.query('SELECT id_Pedido FROM pedido_digital WHERE id_Pedido = ?', [id_Pedido]);
        if (pedido.length === 0) {
            return res.status(400).json({ message: 'El id_Pedido no existe en la tabla pedido_digital.' });
        }
        // Usa una transacción para asegurar la integridad
        yield database_1.default.query('START TRANSACTION'); // Iniciar transacción
        for (const detalle of detalles) {
            const { id_Producto, cantidad, total } = detalle;
            console.log('Insertando detalle:', id_Pedido, id_Producto, cantidad, total);
            yield database_1.default.query('INSERT INTO detalle_pedido_digital (id_Pedido, id_Producto, cantidad, total) VALUES (?, ?, ?, ?)', [id_Pedido, id_Producto, cantidad, total]);
        }
        yield database_1.default.query('COMMIT'); // Confirmar transacción
        res.status(200).json({ success: true, message: 'Detalles de pedido registrados con éxito' });
    }
    catch (error) {
        yield database_1.default.query('ROLLBACK'); // Revertir transacción en caso de error
        console.error('Error al registrar los detalles de pedido:', error);
        res.status(500).json({ message: 'Error al registrar los detalles de pedido' });
    }
});
exports.registrarDetallesPedido = registrarDetallesPedido;
const obtenerDetallesPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idPedido } = req.params;
    try {
        const detalles = yield database_1.default.query('SELECT * FROM detalle_pedido_digital WHERE id_Pedido = ?', [idPedido]);
        res.json(detalles);
    }
    catch (error) {
        console.error('Error al obtener detalles del pedido:', error);
        res.status(500).json({ message: 'Error al obtener detalles del pedido' });
    }
});
exports.obtenerDetallesPedido = obtenerDetallesPedido;
