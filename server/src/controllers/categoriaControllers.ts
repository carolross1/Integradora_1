import { Request, Response } from 'express';
import pool from '../database';

interface CustomError extends Error {
  message: string;
}

export const getCategorias = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await pool.query('SELECT * FROM categoria');
      return res.status(200).json(result);
    } catch (err) {
      const error = err as CustomError;
      return res.status(500).json({ error: error.message });
    }
  };
    
export const addCategoria = async (req: Request, res: Response): Promise<Response> => {
  const { nombre } = req.body;
  try {
    await pool.query('INSERT INTO categoria (nombre) VALUES (?)', [nombre]);
    return res.status(201).json({ message: 'Categoría agregada exitosamente' });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({ error: error.message });
  }
};

export const deleteCategoria = async (req: Request, res: Response): Promise<Response> => {
  const { idCategoria } = req.params;
  try {
    const result = await pool.query('DELETE FROM categoria WHERE id_Categoria = ?', [idCategoria]);
    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'Categoría eliminada exitosamente' });
    } else {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({ error: error.message });
  }
};

export const updateCategoria = async (req: Request, res: Response): Promise<Response> => {
  const { idCategoria } = req.params;
  const { nombre } = req.body;
  try {
    await pool.query('UPDATE categoria SET nombre = ? WHERE id_Categoria = ?', [nombre, idCategoria]);
    const [categoria] = await pool.query('SELECT * FROM categoria WHERE id_Categoria = ?', [idCategoria]);
    return res.status(200).json(categoria);
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({ error: error.message });
  }
};