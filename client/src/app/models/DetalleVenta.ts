export interface DetalleVenta {
  id_Detalle?: number;
  id_Venta: string;
  id_Producto: number;
  descuento?: number;  
  cantidad:number;   
  total_venta?:number;   
  editing?: boolean;
  }
