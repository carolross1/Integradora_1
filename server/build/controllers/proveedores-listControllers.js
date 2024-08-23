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
exports.updateProveedor = exports.deleteProveedor = exports.addProveedor = exports.getProveedores = void 0;
const database_1 = __importDefault(require("../database"));
const getProveedores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.default.query('SELECT * FROM proveedor');
        return res.status(200).json(result);
    }
    catch (err) {
        const error = err;
        return res.status(500).json({ error: error.message });
    }
});
exports.getProveedores = getProveedores;
const addProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_Proveedor, nombre, apellidos, email, empresa } = req.body;
    try {
        yield database_1.default.query('INSERT INTO proveedor (id_Proveedor, nombre, apellidos, email, empresa) VALUES (?, ?, ?, ?, ?)', [id_Proveedor, nombre, apellidos, email, empresa]);
        return res.status(201).json({ message: 'Proveedor agregado exitosamente' });
    }
    catch (err) {
        const error = err;
        return res.status(500).json({ error: error.message });
    }
});
exports.addProveedor = addProveedor;
const deleteProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idProveedor } = req.params;
    try {
        yield database_1.default.query('DELETE FROM proveedor WHERE id_Proveedor = ?', [idProveedor]);
        return res.status(204).json(); // Código 204 indica que se eliminó correctamente
    }
    catch (err) {
        const error = err;
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteProveedor = deleteProveedor;
const updateProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_Proveedor } = req.params;
    const { nombre, apellidos, email, empresa } = req.body;
    // Asegúrate de que id_Proveedor sea un número válido
    if (!id_Proveedor || isNaN(Number(id_Proveedor))) {
        return res.status(400).json({ error: 'ID del proveedor no válido' });
    }
    // Verifica que todos los campos necesarios estén presentes
    if (!nombre || !apellidos || !email || !empresa) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    try {
        const [updateResult] = yield database_1.default.query('UPDATE proveedor SET nombre = ?, apellidos = ?, email = ?, empresa = ? WHERE id_Proveedor = ?', [nombre, apellidos, email, empresa, id_Proveedor]);
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        // Recupera el proveedor actualizado
        const [updatedProveedor] = yield database_1.default.query('SELECT * FROM proveedor WHERE id_Proveedor = ?', [id_Proveedor]);
        return res.status(200).json(updatedProveedor[0]);
    }
    catch (err) {
        const error = err;
        return res.status(500).json({ error: error.message });
    }
});
exports.updateProveedor = updateProveedor;
