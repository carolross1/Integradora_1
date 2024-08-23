export interface Inventario {
  idInventario?:number;
    id_Usuario?: number;
    fechaInicio: Date;
    fechaTermino?: Date | null;
    usuario: string;
  }