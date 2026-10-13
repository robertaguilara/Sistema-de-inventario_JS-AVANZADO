export interface Producto {

    id: number;

    nombre: string;

    categoria: string;

    precio: number;

    stock: number;

}

export type CriterioOrdenamiento =
    | "nombre-asc"
    | "nombre-desc"
    | "precio-asc"
    | "precio-desc"
    | "stock-asc"
    | "stock-desc";