import { Request, Response } from 'express';
import pool from '../database';

export const login = async (req: Request, res: Response) => {
  const { usuario, contrasena } = req.body;

  try {
    // Obtener el salt y el ID del usuario
    const result = await pool.query('SELECT id_Usuario, salt, contrasena, tipo_Usuario FROM usuario WHERE email = ?', [usuario]);
    if (result.length === 0) {
      return res.status(401).json({ success: false, message: '**Email o contraseña incorrectos***' });
    }

    const { id_Usuario, salt, contrasena: hashedPassword,tipo_Usuario } = result[0];

    // Verificar la contraseña
    const hash = await pool.query('SELECT HashPasswordConSalt(?, ?) AS hash', [contrasena, salt]);
    if (hash[0].hash !== hashedPassword) {
      return res.status(401).json({ success: false, message: 'Email o contraseña incorrectos' });
    }

    res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', usuario: { id_Usuario, nombre: usuario,tipo_Usuario } });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
  }
};
