import { Request, Response } from 'express';
import pool from '../database';

export const getFacturas = async (req: Request, res: Response): Promise<void> => {
    try {
        const facturas = await pool.query('SELECT * FROM factura');
        res.json(facturas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener facturas', error });
    }
};
export const getFacturaU = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const factura = await pool.query('SELECT * FROM factura WHERE id_Factura = ?', [id]);
    if (factura.length > 0) {
      res.json(factura[0]); // Devuelve el primer resultado, si hay más de uno
    } else {
      res.status(404).json({ message: 'Factura no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'No se obtuvo la factura', error });
  }
};


export const createFactura = async (req: Request, res: Response): Promise<void> => {
  try {
      await pool.query('INSERT INTO factura SET ?', [req.body]);
      res.json({ message: 'Factura creada' });
  } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
          res.status(400).json({ message: 'Ya existe una factura para este ticket. Por favor, utiliza un ticket diferente.', error });
      } else {
          res.status(500).json({ message: 'Error al crear factura', error });
      }
  }
};

export const updateFactura = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE factura SET ? WHERE id_Factura = ?', [req.body, id]);
        res.json({ message: 'Factura actualizada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar factura', error });
    }
};

export const deleteFactura = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM factura WHERE id_Factura = ?', [id]);
        res.json({ message: 'Factura eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar factura', error });
    }
};
export const obtenerDetallesVenta = async (req: Request, res: Response) => {
    const { id_Venta } = req.params;
  
    try {
      // Consulta a la base de datos para obtener los detalles de la venta
      const total = await pool.query(
        `SELECT id_Producto, descuento, cantidad, total_venta
         FROM detalle_venta
         WHERE id_Venta = ?`,
        [id_Venta]
      );
  
      // Enviar la respuesta con los detalles obtenidos
      res.status(200).json(total);
    } catch (error) {
      console.error('Error al obtener detalles de venta:', error);
      res.status(500).json({ message: 'Error al obtener detalles de venta' });
    }
  };
  export const obtenerTotalVenta = async (req: Request, res: Response) => {
    const { id_Venta } = req.params;
    
    try {
      // Consulta para obtener el total de la venta
      const result = await pool.query(`
        SELECT SUM(total_venta) as total
        FROM detalle_venta
        WHERE id_Venta = ?
      `, [id_Venta]);
  
      if (result.length > 0) {
        res.json({ total: result[0].total || 0 });
      } else {
        res.status(404).json({ message: 'Venta no encontrada' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el total de la venta' });
    }
  };