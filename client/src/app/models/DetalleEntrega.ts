export interface DetalleEntrega {
    id_Detalle?: number; // ID del detalle de la entrega, puede ser opcional si se genera automáticamente
    id_Entrega: number; // ID de la entrega asociada
    id_Producto: number; // ID del producto asociado
    cantidad: number; // Cantidad del producto
    total_entrega?: number; // Total de la entrega para este detalle, opcional
  }
  