import { Request, Response } from 'express';
import pool from '../database';

export const iniciarCorte = async (req: Request, res: Response): Promise<void> => {
    const connection = await pool.getConnection();
    try {
        const { fecha, hora_Inicio, saldo_Inicial, id_Usuario } = req.body;
        const nuevoCorte = {
            fecha,
            hora_Inicio,
            saldo_Inicial,
            id_Usuario,
            cerrado: false
        };

        const result = await connection.query('INSERT INTO corte_caja SET ?', [nuevoCorte]);
        res.json({ message: 'Corte de caja iniciado', id_Corte: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error con el corte', error });
    } finally {
        connection.release();
    }
};


export const obtenerCorteAbierto = async (req: Request, res: Response): Promise<void> => {
    try {
       
        const { id_Usuario } = req.params;
        console.log('Recibiendo solicitud para obtener corte abierto:', req.params.id_Usuario);
        const result = await pool.query(
            'SELECT id_Corte FROM corte_caja WHERE id_Usuario = ? AND cerrado = FALSE',
            [id_Usuario]
        );

        if (result.length > 0) {
            res.json({ id_Corte: result[0].id_Corte });
        } else {
            res.status(404).json({ message: 'No se encontró un corte abierto para este usuario.' });
        }
    } catch (error) {
        console.error('Error al obtener el corte abierto:', error);
        res.status(500).json({ message: 'Error al obtener el corte abierto', error });
    }
};
export const cerrarCorte = async (req: Request, res: Response): Promise<void> => {
    const connection = await pool.getConnection();
    try {
        const { id_Corte } = req.body;
        console.log('ID de Corte recibido:', id_Corte);

        // Obtener el saldo inicial
        const corteResult = await connection.query('SELECT saldo_Inicial FROM corte_caja WHERE id_Corte = ?', [id_Corte]);
        console.log('Resultado de la consulta de saldo inicial:', corteResult);

        if (Array.isArray(corteResult) && corteResult.length > 0) {
            const saldo_Inicial = corteResult[0].saldo_Inicial;
            console.log('Saldo Inicial recuperado:', saldo_Inicial);
            res.json({ message:'Corte cerrado con un saldo inicial:',saldo_Inicial });

            // Procesamiento adicional en segundo plano
            setImmediate(async () => {
                const connection = await pool.getConnection(); 
                try {
                    // Calcular ingresos desde la tabla de DetalleVenta
                    const ingresosResult = await connection.query(
                        `SELECT SUM(dv.total_venta) AS total_ventas
                        FROM detalle_venta as dv
                        INNER JOIN venta as v
                        ON dv.id_Venta = v.id_Venta
                        WHERE DATE(v.fecha) =  (SELECT DATE(fecha) FROM corte_caja WHERE id_Corte = ?)`,
                        [id_Corte]
                    );
                    console.log('Resultado de la consulta de ingresos:', ingresosResult);

                    const totalIngresos = ingresosResult[0]?.total_ventas || 0;
                    console.log('Total de Ingresos:', totalIngresos);

                    // Calcular egresos desde la tabla de Retiros
                    const egresosResult = await connection.query(
                        `SELECT SUM(monto) AS totalEgresos
                        FROM Retiros
                       WHERE fecha = (SELECT fecha FROM corte_caja WHERE id_Corte = ?)`,
                        [id_Corte]
                    );
                    console.log('Resultado de la consulta de egresos:', egresosResult);

                    const totalEgresos = egresosResult[0]?.totalEgresos || 0;
                    console.log('Total de Egresos:', totalEgresos);

                    // Calcular el saldo final
                    const saldo_Final = saldo_Inicial + totalIngresos - totalEgresos;
                    console.log('Saldo Final calculado:', saldo_Final);

                    // Actualizar la tabla corte_caja con los nuevos valores
                    await connection.query(
                        `UPDATE corte_caja
                        SET hora_Fin = CURTIME(), ingresos = ?, egresos = ?, saldo_Final = ?, cerrado = TRUE 
                        WHERE id_Corte = ?`,
                        [totalIngresos, totalEgresos, saldo_Final, id_Corte]
                    );

                    console.log('Corte de caja cerrado', saldo_Final);

                } catch (error) {
                    console.error('Error al cerrar el corte en segundo plano:', error);
                } finally {
                    connection.release(); // Asegúrate de liberar la conexión
                }
            });

        } else {
            console.error('No se encontró saldo inicial para el corte con id:', id_Corte);
            res.status(500).json({ message: 'No se pudo recuperar el saldo inicial para el corte.' });
        }

    } catch (error) {
        console.error('Error al cerrar el corte:', error);
        res.status(500).json({ message: 'Error al cerrar el corte', error });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};
export const obtenerCorteActual = async (req: Request, res: Response): Promise<void> => {
    const connection = await pool.getConnection();
    try {
        const corte = await connection.query('SELECT * FROM corte_caja WHERE cerrado = TRUE ORDER BY id_Corte DESC LIMIT 1');
        res.json(corte[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el corte actual', error });
    } finally {
        connection.release();
    }
};
/*si alcanzo
export const obtenerTodosLosCortes = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT * FROM corte_caja');
        res.json(result);
    } catch (error) {
        console.error('Error al obtener los cortes de caja:', error);
        res.status(500).json({ message: 'Error al obtener los cortes de caja', error });
    }
};*/
