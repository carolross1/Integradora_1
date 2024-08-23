import { Request, Response } from 'express';
import pool from '../database'; // Asegúrate de que tu archivo de conexión a la base de datos esté correctamente configurado
import nodemailer from 'nodemailer';


// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pvabarrotes@gmail.com',
    pass: 'pvabarrotes123',
  },
});

export const enviarCorreo = async (req: Request, res: Response) => {
  const { destinatario, asunto, mensaje } = req.body;

  const mailOptions = {
    from: 'pvabarrotes@gmail.com',
    to: destinatario,
    subject: asunto,
    text: mensaje,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
    res.json({ message: 'Correo enviado correctamente', response: info.response });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
};

export const registrarPedido = async (req: Request, res: Response) => {
  const { id_Proveedor, fecha_Pedido, total } = req.body;

  try {
    // Insertar el pedido y obtener el ID generado automáticamente
    const result: any = await pool.query(
      'INSERT INTO pedido_digital (id_Proveedor, fecha_Pedido, total) VALUES (?, ?, ?)',
      [id_Proveedor, fecha_Pedido, total]
    );

    // Obtener el ID autogenerado del pedido
    const lastId = result.insertId;
    console.log('ID autoincrementado insertado:', lastId);

    // Verificar si el ID fue generado correctamente
    if (lastId) {
      res.json({ idPedido: lastId });
    } else {
      res.status(500).json({ message: 'No se pudo obtener el ID del pedido.' });
    }
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
};

export const obtenerPedidos = async (req: Request, res: Response) => {
  try {
    const pedidos = await pool.query('SELECT * FROM pedido_digital');
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
};

export const obtenerPedidoPorId = async (req: Request, res: Response) => {
  const { idPedido } = req.params;
  try {
    const pedido = await pool.query('SELECT * FROM pedido_digital WHERE id_Pedido = ?', [idPedido]);
    if (Array.isArray(pedido) && pedido.length > 0) {
      res.json(pedido[0]);
    } else {
      res.status(404).json({ message: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ message: 'Error al obtener pedido' });
  }
};

export const eliminarPedido = async (req: Request, res: Response) => {
  const { idPedido } = req.params;
  try {
    await pool.query('DELETE FROM pedido_digital WHERE id_Pedido = ?', [idPedido]);
    res.json({ message: 'Pedido eliminado' });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({ message: 'Error al eliminar pedido' });
  }
};

export const registrarDetallesPedido = async (req: Request, res: Response) => {
  let detalles = req.body;
  console.log('Detalles recibidos:', detalles);

  // Si detalles no es un arreglo, lo convertimos en un arreglo con un solo elemento
  if (!Array.isArray(detalles)) {
    detalles = [detalles];
  }

  // Usamos el primer detalle para obtener el id_Pedido
  const { id_Pedido } = detalles[0]; 

  // Verificar que el id_Pedido es válido
  if (!id_Pedido || id_Pedido === 0) {
    return res.status(400).json({ message: 'El id_Pedido no es válido.' });
  }

  try {
    // Verificar que el id_Pedido existe en la tabla pedido_digital
    const pedido = await pool.query('SELECT id_Pedido FROM pedido_digital WHERE id_Pedido = ?', [id_Pedido]);

    if (pedido.length === 0) {
      return res.status(400).json({ message: 'El id_Pedido no existe en la tabla pedido_digital.' });
    }

    // Usa una transacción para asegurar la integridad
    await pool.query('START TRANSACTION'); // Iniciar transacción

    for (const detalle of detalles) {
      const { id_Producto, cantidad, total } = detalle;
      console.log('Insertando detalle:', id_Pedido, id_Producto, cantidad, total);

      await pool.query(
        'INSERT INTO detalle_pedido_digital (id_Pedido, id_Producto, cantidad, total) VALUES (?, ?, ?, ?)',
        [id_Pedido, id_Producto, cantidad, total]
      );
    }

    await pool.query('COMMIT'); // Confirmar transacción
    res.status(200).json({ success: true, message: 'Detalles de pedido registrados con éxito' });
  } catch (error) {
    await pool.query('ROLLBACK'); // Revertir transacción en caso de error
    console.error('Error al registrar los detalles de pedido:', error);
    res.status(500).json({ message: 'Error al registrar los detalles de pedido' });
  }
};
export const obtenerDetallesPedido = async (req: Request, res: Response) => {
  const { idPedido } = req.params;
  try {
    const detalles = await pool.query('SELECT * FROM detalle_pedido_digital WHERE id_Pedido = ?', [idPedido]);
    res.json(detalles);
  } catch (error) {
    console.error('Error al obtener detalles del pedido:', error);
    res.status(500).json({ message: 'Error al obtener detalles del pedido' });
  }
};
