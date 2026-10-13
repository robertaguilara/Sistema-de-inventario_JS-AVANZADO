export type TipoMovimiento =
    | "entrada"
    | "salida";


export interface MovimientoStock {

    id: number;

    productoId: number;

    tipo: TipoMovimiento;

    cantidad: number;

    fecha: string;

}