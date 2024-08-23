export interface CorteCaja {
  id_Corte?: number;
  fecha: string;
  hora_Inicio: string;
  hora_Fin?: string;
  saldo_Inicial: number;
  ingresos?: number;
  egresos?: number;
  saldo_Final?: number;
  id_Usuario: string;
  cerrado?: boolean;
}