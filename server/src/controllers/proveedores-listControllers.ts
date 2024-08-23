import { Request, Response } from 'express';
import pool from '../database';

interface CustomError extends Error {
  message: string;
}

export const getProveedores = async (req: Request, res: Response): Promise<Response> => {
    try {
        const result = await pool.query('SELECT * FROM proveedor');
        return res.status(200).json(result);
    } catch (err) {
        const error = err as CustomError;
        return res.status(500).json({ error: error.message });
    }
};

export const addProveedor = async (req: Request, res: Response): Promise<Response> => {
    const { id_Proveedor, nombre, apellidos, email, empresa } = req.body;
    try {
        await pool.query('INSERT INTO proveedor (id_Proveedor, nombre, apellidos, email, empresa) VALUES (?, ?, ?, ?, ?)', 
        [id_Proveedor, nombre, apellidos, email, empresa]);
        return res.status(201).json({ message: 'Proveedor agregado exitosamente' });
    } catch (err) {
        const error = err as CustomError;
        return res.status(500).json({ error: error.message });
    }
};

export const deleteProveedor = async (req: Request, res: Response): Promise<Response> => {
    const { idProveedor } = req.params;
    try {
      await pool.query('DELETE FROM proveedor WHERE id_Proveedor = ?', [idProveedor]);
      return res.status(204).json(); // Código 204 indica que se eliminó correctamente
    } catch (err) {
      const error = err as CustomError;
      return res.status(500).json({ error: error.message });
    }
  };
  

export const updateProveedor = async (req: Request, res: Response): Promise<Response> => {
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
        const [updateResult] = await pool.query(
            'UPDATE proveedor SET nombre = ?, apellidos = ?, email = ?, empresa = ? WHERE id_Proveedor = ?', 
            [nombre, apellidos, email, empresa, id_Proveedor]
        );
        
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        
        // Recupera el proveedor actualizado
        const [updatedProveedor] = await pool.query('SELECT * FROM proveedor WHERE id_Proveedor = ?', [id_Proveedor]);
        return res.status(200).json(updatedProveedor[0]);
    } catch (err) {
        const error = err as CustomError;
        return res.status(500).json({ error: error.message });
    }
};
