import { Request, Response } from 'express';
import pool from '../database';
import { idText } from 'typescript';

export const createVenta = async (req: Request, res: Response) => {
  const { id_Usuario, fecha, metodo_Pago, caja } = req.body;

  try {
    // Insertar la venta
    const result: any = await pool.query(
      'INSERT INTO venta (id_Usuario, fecha, metodo_Pago, caja) VALUES (?, ?, ?, ?)',
      [id_Usuario, fecha, metodo_Pago, caja]
    );

    const lastId = result.insertId;
    console.log('ID autoincrementado insertado:', lastId);

    // Obtener id_Venta usando el id autoincrementado
    const ventaResult: any = await pool.query('SELECT id_Venta FROM venta WHERE id = ?', [lastId]);

    console.log('Resultado de la consulta de recuperación:', ventaResult);

    if (Array.isArray(ventaResult) && ventaResult.length > 0) {
      const idVenta = ventaResult[0].id_Venta;
      console.log('ID de la venta recuperado:', idVenta);
      res.json({ idVenta });
    } else {
      console.error('No se encontró el id_Venta para el id:', lastId);
      res.status(500).json({ message: 'No se pudo recuperar el ID de la venta.' });
    }
  } catch (error) {
    console.error('Error al crear la venta:', error);
    res.status(500).json({ message: 'Error al crear la venta' });
  }
};

export const registrarDetallesVenta = async (req: Request, res: Response) => {
  const detalle = req.body;
  console.log('Detalle recibido:', detalle);

  try {
    // Usa una transacción para asegurar la integridad
    await pool.query('START TRANSACTION'); // Iniciar transacción

    const { id_Venta, id_Producto, descuento, cantidad, total_venta } = detalle;
    console.log('Insertando detalle:', id_Venta, id_Producto, descuento, cantidad, total_venta);
    
    await pool.query(
      'INSERT INTO detalle_venta (id_Venta, id_Producto, descuento, cantidad, total_venta) VALUES (?, ?, ?, ?, ?)',
      [id_Venta, id_Producto, descuento, cantidad, total_venta]
    );

    await pool.query('COMMIT'); // Confirmar transacción
    res.status(200).json({ success: true, message: 'Detalle de venta registrado con éxito' });
  } catch (error) {
    await pool.query('ROLLBACK'); // Revertir transacción en caso de error
    console.error('Error al registrar detalle de venta:', error);
    res.status(500).json({ message: 'Error al registrar el detalle de venta' });
  }
};

export const getVentas = async (req: Request, res: Response): Promise<void> => {
  try {
    const ventas = await pool.query(`
        SELECT v.id_Venta, v.fecha, v.id_Usuario, v.metodo_Pago, 
               SUM(dv.total_venta) AS total_ventas 
        FROM venta as v
        LEFT JOIN detalle_venta as dv ON v.id_Venta = dv.id_Venta
        GROUP BY v.id_Venta, v.fecha, v.id_Usuario, v.metodo_Pago
    `);
    
    res.json(ventas);
} catch (error) {
    res.status(500).json({ message: 'Error al obtener las ventas', error });
}
};

// Actualizar un detalle de venta
export const updateDetalleVenta = async (req: Request, res: Response) => {
  const { id_Detalle } = req.params;
  const { cantidad, id_Producto, descuento } = req.body;
console.log('este es el id:',id_Detalle);
console.log('lo demas',cantidad,id_Producto,descuento);
  try {
      const query = `
          UPDATE detalle_venta
          SET cantidad = ?, id_Producto = ?, descuento = ?
          WHERE id_Detalle = ?`;
      await pool.query(query, [cantidad, id_Producto, descuento, id_Detalle]);

      // Paso 2: Llamar a la función almacenada para recalcular el total_venta
    const callFunctionQuery = `
    CALL proc_ActualizarDetalleVenta(?, ?, ?, ?)`;
  await pool.query(callFunctionQuery, [id_Detalle, cantidad, id_Producto, descuento]);

  // Responder con éxito
  res.status(200).json({ message: 'Detalle de venta actualizado correctamente' });
} catch (error) {
  console.error('Error en el backend:', error);
  res.status(500).json({ error: 'Error al actualizar el detalle de venta en la base de datos' });
}
};
// Eliminar un detalle de venta
export const deleteDetalleVenta = async (req: Request, res: Response) => {
  const { id_Detalle } = req.params;

  try {
      const query = `DELETE FROM detalle_venta WHERE id_Detalle = ?`;

      await pool.query(query, [id_Detalle]);
      
      res.status(200).json({ message: 'Detalle de venta eliminado correctamente' });
  } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el detalle de venta' });
  }
};

// Eliminar una venta y sus detalles
export const deleteVenta = async (req: Request, res: Response) => {
  const { id_Venta } = req.params;

  try {
      const query = `DELETE FROM venta WHERE id_Venta = ?`;
      await pool.query(query, [id_Venta]);
      
      res.status(200).json({ message: 'Venta eliminada correctamente' });
  } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la venta' });
  }
};

// Obtener todos los detalles de venta para cada ticket
export const getDetallesVenta = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const detalle = await pool.query('SELECT dv.id_Venta, p.nombre, p.codigo_Barras,dv.descuento,dv.cantidad,dv.total_venta,dv.id_Detalle,dv.id_Producto FROM detalle_venta as dv inner join producto  as p on dv.id_Producto=p.id_Producto  WHERE id_Venta = ?', [id]);
    if (detalle.length > 0) {
      res.json(detalle); // Devuelve el primer resultado, si hay más de uno
    } else {
      res.status(404).json({ message: 'Deetalles no econtrados ' });
    }
  } catch (error) {
    res.status(500).json({ message: 'No se obtuvo la venta', error });
  }
};

