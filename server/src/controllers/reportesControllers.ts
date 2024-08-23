import { Request, Response } from 'express';
import pool from '../database';

interface CustomError extends Error {
  message: string;
}

export const getReport = async (req: Request, res: Response): Promise<Response> => {
  // Extraer fechas de los parámetros de consulta
  const { fechaDesde, fechaHasta } = req.query;

  // Verificar que ambas fechas están presentes
  if (!fechaDesde || !fechaHasta) {
    return res.status(400).json({ error: 'Por favor proporciona ambas fechas' });
  }

  try {
    // Consulta SQL para obtener el reporte
    const result = await pool.query(
      `SELECT 
         p.nombre AS producto,
         p.precio_Venta AS precioUnitario,
         SUM(dv.cantidad) AS cantidadTotal,
         (p.precio_Venta * SUM(dv.cantidad)) AS precioTotalProducto,
         (p.utilidad*SUM(dv.cantidad)) AS ganancias
       FROM producto p
       JOIN detalle_venta dv ON p.id_Producto = dv.id_Producto
       JOIN venta v ON v.id_Venta = dv.id_Venta
       WHERE DATE(v.fecha) >= DATE(?) AND DATE(v.fecha) <= DATE(?)
       GROUP BY p.nombre, p.precio_Venta`,
      [fechaDesde, fechaHasta]
    );
    
    // Retornar el resultado de la consulta
    return res.status(200).json(result);
  } catch (err) {
    // Manejo de errores
    const error = err as CustomError;
    return res.status(500).json({ error: error.message });
  }
};
