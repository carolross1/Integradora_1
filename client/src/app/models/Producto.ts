export interface Producto {
    id_Producto: number;
    codigo_Barras:number;
    nombre: string;
    id_Categoria?: number;
    precio_Compra: number;
    precio_Venta: number;
    utilidad: number;
    cantidad_Stock: number;
    cant_Minima: number;
    cantidad?:number;
  }