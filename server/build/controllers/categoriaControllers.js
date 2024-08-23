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
exports.updateCategoria = exports.deleteCategoria = exports.addCategoria = exports.getCategorias = void 0;
const database_1 = __importDefault(require("../database"));
const getCategorias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.default.query('SELECT * FROM categoria');
        return res.status(200).json(result);
    }
    catch (err) {
        const error = err;
        return res.status(500).json({ error: error.message });
    }
});
exports.getCategorias = getCategorias;
const addCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre } = req.body;
    try {
        yield database_1.default.query('INSERT INTO categoria (nombre) VALUES (?)', [nombre]);
        return res.status(201).json({ message: 'Categoría agregada exitosamente' });
    }
    catch (err) {
        const error = err;
        return res.status(500).json({ error: error.message });
    }
});
exports.addCategoria = addCategoria;
const deleteCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idCategoria } = req.params;
    try {
        const result = yield database_1.default.query('DELETE FROM categoria WHERE id_Categoria = ?', [idCategoria]);
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Categoría eliminada exitosamente' });
        }
        else {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
    }
    catch (err) {
        const error = err;
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteCategoria = deleteCategoria;
const updateCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idCategoria } = req.params;
    const { nombre } = req.body;
    try {
        yield database_1.default.query('UPDATE categoria SET nombre = ? WHERE id_Categoria = ?', [nombre, idCategoria]);
        const [categoria] = yield database_1.default.query('SELECT * FROM categoria WHERE id_Categoria = ?', [idCategoria]);
        return res.status(200).json(categoria);
    }
    catch (err) {
        const error = err;
        return res.status(500).json({ error: error.message });
    }
});
exports.updateCategoria = updateCategoria;
