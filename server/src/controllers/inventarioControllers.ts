// controllers/inventarioController.ts
import { Request, Response } from 'express';
import pool from '../database';

export const createInventario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fechaInicio, usuario } = req.body;
      console.log('Datos recibidos:', { fechaInicio, usuario }); // Verifica los datos recibidos
    const result = await pool.query('INSERT INTO inventario (fecha_Inicio, id_Usuario) VALUES (?, ?)', [fechaInicio, usuario]);
    res.json({ message: 'Inventario creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear inventario', error });
  }
};

export const getInventarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const inventarios = await pool.query('SELECT * FROM inventario');
    res.json(inventarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener inventarios', error });
  }
};

export const closeInventario = async (req: Request, res: Response): Promise<void> => {
  const { idInventario } = req.params;
  try {
    await pool.query('UPDATE inventario SET Fecha_Termino = NOW() WHERE id_Inventario = ?', [idInventario]);
    console.log(`Inventario con ID ${idInventario} cerrado a las:`, new Date());
   
    res.json({ message: 'Inventario cerrado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar inventario', error });
  }
};

export const guardarDetallesInventario = async (req: Request, res: Response): Promise<void> => {
  const detalles = req.body;
  console.log('Detalles recibidos:', detalles); // Mensaje de depuración para ver los detalles recibidos
  try {
    for (const detalle of detalles) {
      await pool.query('INSERT INTO detalle_inventario (id_Inventario, id_Producto, cantidad_Fisica) VALUES (?, ?, ?)', [detalle.idInventario, detalle.idProducto, detalle.cantidadFisica]);
    }
    res.json({ message: 'Detalles de inventario guardados' });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar detalles de inventariossss', error });
  }
};