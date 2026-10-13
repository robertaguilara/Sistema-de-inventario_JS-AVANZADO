import { Producto } from "../producto";


export function obtenerProductosIniciales(): Producto[] {

    return [

        {
            id: 1,
            nombre: "Teclado mecánico",
            categoria: "teclados",
            precio: 150,
            stock: 10
        },

        {
            id: 2,
            nombre: "Mouse inalámbrico",
            categoria: "mouse",
            precio: 80,
            stock: 15
        },

        {
            id: 3,
            nombre: "Monitor 24 pulgadas",
            categoria: "monitores",
            precio: 650,
            stock: 4
        }

    ];
}