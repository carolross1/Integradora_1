// Define un nuevo tipo para la creación de proveedores
export type NuevoProveedor = Omit<Proveedor, 'id_Proveedor'>;

export interface Proveedor {
    id_Proveedor: number;
    nombre: string;
    apellidos: string;
    email: string;
    empresa: string;
    editing: boolean;
  }