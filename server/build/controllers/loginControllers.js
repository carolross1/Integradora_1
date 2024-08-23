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
exports.login = void 0;
const database_1 = __importDefault(require("../database"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuario, contrasena } = req.body;
    try {
        // Obtener el salt y el ID del usuario
        const result = yield database_1.default.query('SELECT id_Usuario, salt, contrasena, tipo_Usuario FROM usuario WHERE email = ?', [usuario]);
        if (result.length === 0) {
            return res.status(401).json({ success: false, message: '**Email o contraseña incorrectos***' });
        }
        const { id_Usuario, salt, contrasena: hashedPassword, tipo_Usuario } = result[0];
        // Verificar la contraseña
        const hash = yield database_1.default.query('SELECT HashPasswordConSalt(?, ?) AS hash', [contrasena, salt]);
        if (hash[0].hash !== hashedPassword) {
            return res.status(401).json({ success: false, message: 'Email o contraseña incorrectos' });
        }
        res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', usuario: { id_Usuario, nombre: usuario, tipo_Usuario } });
    }
    catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
    }
});
exports.login = login;
