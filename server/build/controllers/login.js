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
        // Primero obtenemos el salt del usuario
        const resultSalt = yield database_1.default.query("SELECT id_Usuario, salt FROM usuario WHERE nombre = @usuario", [usuario]);
        if (resultSalt.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
        const { id_Usuario, salt } = resultSalt.rows[0];
        // Ahora verificamos la contraseña con el salt
        const resultLogin = yield database_1.default.query("SELECT * FROM usuario WHERE id_Usuario = @id_Usuario AND contrasena = (SELECT dbo.HashPasswordConSalt(@contrasena, @salt))", [id_Usuario, contrasena, salt]);
        if (resultLogin.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
        res.json({ mensaje: 'Bienvenido Usuario', usuario: resultLogin.rows[0] });
    }
    catch (error) {
        res.status(500).json({ error: 'Error en la autenticación' });
    }
});
exports.login = login;
