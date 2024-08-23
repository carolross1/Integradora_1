// models/Pedido.ts
export type PedidoCreacion = Omit<PedidoProveedor, 'id_Pedido'>;

// models/Pedido.ts
export interface PedidoProveedor {
  id_Pedido?: number;
  id_Proveedor: number;
  fecha_Pedido: Date;
  total: number;

  detalles: DetallePedido[];
}


export interface DetallePedido {
  id_Detalle?: number; // ID autoincremental, opcional
  id_Pedido: number; // Relacionado con el pedido
  id_Producto: number; // Relacionado con el producto
  total: number;
  cantidad: number; // Cantidad del producto
  nombre:string;
  codigo_Barras:number;
  precio: number;

}
