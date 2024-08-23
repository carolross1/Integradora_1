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
exports.guardarDetallesInventario = exports.closeInventario = exports.getInventarios = exports.createInventario = void 0;
const database_1 = __importDefault(require("../database"));
const createInventario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fechaInicio, usuario } = req.body;
        console.log('Datos recibidos:', { fechaInicio, usuario }); // Verifica los datos recibidos
        const result = yield database_1.default.query('INSERT INTO inventario (fecha_Inicio, id_Usuario) VALUES (?, ?)', [fechaInicio, usuario]);
        res.json({ message: 'Inventario creado', id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear inventario', error });
    }
});
exports.createInventario = createInventario;
const getInventarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inventarios = yield database_1.default.query('SELECT * FROM inventario');
        res.json(inventarios);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener inventarios', error });
    }
});
exports.getInventarios = getInventarios;
const closeInventario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idInventario } = req.params;
    try {
        yield database_1.default.query('UPDATE inventario SET Fecha_Termino = NOW() WHERE id_Inventario = ?', [idInventario]);
        console.log(`Inventario con ID ${idInventario} cerrado a las:`, new Date());
        res.json({ message: 'Inventario cerrado' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al cerrar inventario', error });
    }
});
exports.closeInventario = closeInventario;
const guardarDetallesInventario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const detalles = req.body;
    console.log('Detalles recibidos:', detalles); // Mensaje de depuración para ver los detalles recibidos
    try {
        for (const detalle of detalles) {
            yield database_1.default.query('INSERT INTO detalle_inventario (id_Inventario, id_Producto, cantidad_Fisica) VALUES (?, ?, ?)', [detalle.idInventario, detalle.idProducto, detalle.cantidadFisica]);
        }
        res.json({ message: 'Detalles de inventario guardados' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al guardar detalles de inventariossss', error });
    }
});
exports.guardarDetallesInventario = guardarDetallesInventario;
