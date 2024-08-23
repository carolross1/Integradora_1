"use strict";
// userController.ts
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
exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.createUser = void 0;
const database_1 = __importDefault(require("../database"));
// Crear un nuevo usuario
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_Usuario, nombre, apellido, telefono, email, contrasena, tipo_Usuario } = req.body;
    try {
        yield database_1.default.query('INSERT INTO usuario (id_Usuario, nombre, apellido, telefono, email, contrasena, tipo_Usuario) VALUES (?, ?, ?, ?, ?, ?, ?)', [id_Usuario, nombre, apellido, telefono, email, contrasena, tipo_Usuario]);
        res.status(201).json({ message: 'Usuario creado exitosamente' });
    }
    catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes('email')) {
                res.status(400).json({ message: '**El correo electrónico ya está en uso**' });
            }
            else if (error.sqlMessage.includes('telefono')) {
                res.status(400).json({ message: '**El número de teléfono ya está en uso**' });
            }
            else {
                res.status(400).json({ message: '**El ID de usuario ya está en uso**' });
            }
        }
        else {
            res.status(500).json({ message: '**Error al crear el usuario**', error });
        }
    }
});
exports.createUser = createUser;
// Obtener todos los usuarios
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuarios = yield database_1.default.query('SELECT * FROM usuario');
        res.json(usuarios);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
});
exports.getUsers = getUsers;
// Obtener un usuario por ID
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const usuarios = yield database_1.default.query('SELECT * FROM usuario WHERE id_Usuario = ?', [id]);
        if (usuarios.length > 0) {
            res.json(usuarios[0]);
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
});
exports.getUser = getUser;
// Actualizar un usuario
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_Usuario } = req.params;
    const { nombre, apellido, telefono, email, contrasena, tipo_Usuario } = req.body;
    try {
        const result = yield database_1.default.query('UPDATE usuario SET nombre = ?, apellido = ?, telefono = ?, email = ?, contrasena = ?, tipo_Usuario = ? WHERE id_Usuario = ?', [nombre, apellido, telefono, email, contrasena, tipo_Usuario, id_Usuario]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Usuario actualizado exitosamente' });
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    }
    catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes('email')) {
                res.status(400).json({ message: 'El correo electrónico ya está en uso' });
            }
            else if (error.sqlMessage.includes('telefono')) {
                res.status(400).json({ message: 'El número de teléfono ya está en uso' });
            }
            else {
                res.status(400).json({ message: 'Error de duplicación de entrada' });
            }
        }
        else {
            res.status(500).json({ message: 'Error al actualizar el usuario', error });
        }
    }
});
exports.updateUser = updateUser;
// Eliminar un usuario
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Ejecutar la consulta DELETE
        const result = yield database_1.default.query('DELETE FROM usuario WHERE id_Usuario = ?', [id]);
        // Verificar si se afectaron filas
        if (result.affectedRows > 0) {
            res.json({ message: 'Usuario eliminado exitosamente' });
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    }
    catch (error) {
        // Manejar el error SQL de manera segura
        if (error && typeof error === 'object') {
            const sqlError = error;
            if (sqlError.code === 'ER_ROW_IS_REFERENCED_2') {
                res.status(400).json({ message: 'No se puede eliminar el usuario porque tiene referencias en otras tablas.' });
            }
            else {
                // Errores generales del servidor
                res.status(500).json({ message: 'Error al eliminar el usuario', error: sqlError.message || 'Error desconocido' });
            }
        }
        else {
            // Manejo de errores no estándar
            res.status(500).json({ message: 'Error desconocido' });
        }
    }
});
exports.deleteUser = deleteUser;
