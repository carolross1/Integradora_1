import { Request, Response } from 'express';
import pool from '../database';

export const getProductos = async (req: Request, res: Response): Promise<void> => {
    try {
        const productos = await pool.query('SELECT * FROM producto');
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error });
    }
};

export const createProducto = async (req: Request, res: Response): Promise<void> => {
    try {
        // Intentar insertar el nuevo producto
        await pool.query('INSERT INTO producto SET ?', [req.body]);
        res.json({ message: 'Producto creado' });
    } catch (error) {
        // Manejo de errores SQL
        if (error && typeof error === 'object') {
            const sqlError = error as any;
            if (sqlError.code === 'ER_DUP_ENTRY') {
                if (sqlError.sqlMessage.includes('nombre')) {
                    res.status(400).json({ message: '**El nombre del producto ya existe.Por favor, utiliza un nombre diferente.***' });
                } else if (sqlError.sqlMessage.includes('codigo_barras')) {
                    res.status(400).json({ message: '**El código de barras ya está en uso. Por favor, utiliza un código diferente.**' });
                } else {
                    res.status(400).json({ message: '**Entrada duplicada. Verifique los datos**' });
                }
            } else {
                res.status(500).json({ message: 'Error al crear producto', error: sqlError.message || 'Error desconocido' });
            }
        } else {
            res.status(500).json({ message: 'Error desconocido' });
        }
    }
};
export const updateProducto = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE producto SET ? WHERE id_Producto = ?', [req.body, id]);
        res.json({ message: 'Producto actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto', error });
    }
};

export const deleteProducto = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM producto WHERE id_Producto = ?', [id]);
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error });
    } 
};
// Obtener todas las categorías
export const getCategorias = async (req: Request, res: Response): Promise<void> => {
    try {
        const categorias = await pool.query('SELECT * FROM categoria'); // Ajusta la consulta según el nombre de la tabla
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categorías', error });
    }
};

export const getProductosBajoStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const productos = await pool.query('SELECT * FROM producto WHERE cantidad_Stock < cant_Minima');
        console.log('Productos bajo stock:', productos);
        if (productos.length === 0) {
            res.status(404).json({ text: 'No hay productos con bajo stock' });
        } else {
            res.json(productos);
        }
    } catch (error) {
        console.error('Error al obtener productos bajo stock:', error);
        res.status(500).json({ message: 'Error al obtener productos bajo stock', error });
    }
};
export const updateStock = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { cantidad } = req.body;
    try {
        await pool.query('UPDATE producto SET cantidad_Stock = ? WHERE id_Producto = ?', [cantidad, id]);
        res.json({ message: 'Stock actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar stock', error });
    }
};
