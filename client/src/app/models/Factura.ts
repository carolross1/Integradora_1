export interface Factura {
    id_Factura?: number;
    id_Venta: string;
    RFC: string;
    nombre: string;
    apellidos: string;
    estado: string;
    municipio: string;
    codigo_Postal: string;
    direccion: string;
    fecha_Factura: string;
    total:number;
  }