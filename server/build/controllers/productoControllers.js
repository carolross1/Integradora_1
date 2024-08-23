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
exports.updateStock = exports.getProductosBajoStock = exports.getCategorias = exports.deleteProducto = exports.updateProducto = exports.createProducto = exports.getProductos = void 0;
const database_1 = __importDefault(require("../database"));
const getProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productos = yield database_1.default.query('SELECT * FROM producto');
        res.json(productos);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error });
    }
});
exports.getProductos = getProductos;
const createProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Intentar insertar el nuevo producto
        yield database_1.default.query('INSERT INTO producto SET ?', [req.body]);
        res.json({ message: 'Producto creado' });
    }
    catch (error) {
        // Manejo de errores SQL
        if (error && typeof error === 'object') {
            const sqlError = error;
            if (sqlError.code === 'ER_DUP_ENTRY') {
                if (sqlError.sqlMessage.includes('nombre')) {
                    res.status(400).json({ message: '**El nombre del producto ya existe.Por favor, utiliza un nombre diferente.***' });
                }
                else if (sqlError.sqlMessage.includes('codigo_barras')) {
                    res.status(400).json({ message: '**El código de barras ya está en uso. Por favor, utiliza un código diferente.**' });
                }
                else {
                    res.status(400).json({ message: '**Entrada duplicada. Verifique los datos**' });
                }
            }
            else {
                res.status(500).json({ message: 'Error al crear producto', error: sqlError.message || 'Error desconocido' });
            }
        }
        else {
            res.status(500).json({ message: 'Error desconocido' });
        }
    }
});
exports.createProducto = createProducto;
const updateProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield database_1.default.query('UPDATE producto SET ? WHERE id_Producto = ?', [req.body, id]);
        res.json({ message: 'Producto actualizado' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto', error });
    }
});
exports.updateProducto = updateProducto;
const deleteProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield database_1.default.query('DELETE FROM producto WHERE id_Producto = ?', [id]);
        res.json({ message: 'Producto eliminado' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error });
    }
});
exports.deleteProducto = deleteProducto;
// Obtener todas las categorías
const getCategorias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categorias = yield database_1.default.query('SELECT * FROM categoria'); // Ajusta la consulta según el nombre de la tabla
        res.json(categorias);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener categorías', error });
    }
});
exports.getCategorias = getCategorias;
const getProductosBajoStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productos = yield database_1.default.query('SELECT * FROM producto WHERE cantidad_Stock < cant_Minima');
        console.log('Productos bajo stock:', productos);
        if (productos.length === 0) {
            res.status(404).json({ text: 'No hay productos con bajo stock' });
        }
        else {
            res.json(productos);
        }
    }
    catch (error) {
        console.error('Error al obtener productos bajo stock:', error);
        res.status(500).json({ message: 'Error al obtener productos bajo stock', error });
    }
});
exports.getProductosBajoStock = getProductosBajoStock;
const updateStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { cantidad } = req.body;
    try {
        yield database_1.default.query('UPDATE producto SET cantidad_Stock = ? WHERE id_Producto = ?', [cantidad, id]);
        res.json({ message: 'Stock actualizado' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar stock', error });
    }
});
exports.updateStock = updateStock;
