import { MovimientoStock } from "../movimiento";
import { Producto } from "../producto";


export function registrarMovimiento(
    movimientos: MovimientoStock[],
    movimiento: MovimientoStock
): boolean {

    if (movimiento.id <= 0 ||
        !Number.isInteger(movimiento.id)) {

        return false;
    }

    if (movimiento.productoId <= 0 ||
        !Number.isInteger(movimiento.productoId)) {

        return false;
    }

    if (movimiento.cantidad <= 0 ||
        !Number.isInteger(movimiento.cantidad)) {

        return false;
    }

    const movimientoExistente =
        movimientos.find(function(item) {

            return item.id === movimiento.id;
        });

    if (movimientoExistente !== undefined) {
        return false;
    }

    movimientos.push(movimiento);

    return true;
}


export function obtenerErrorMovimiento(
    movimiento: MovimientoStock,
    producto: Producto | undefined,
    movimientos: MovimientoStock[]
): string | null {

    if (!Number.isInteger(movimiento.id) ||
        movimiento.id <= 0) {

        return "El ID del movimiento debe ser un número entero mayor que 0.";
    }

    if (!Number.isInteger(movimiento.productoId) ||
        movimiento.productoId <= 0) {

        return "El ID del producto debe ser un número entero mayor que 0.";
    }

    if (producto === undefined) {

        return "El producto no existe.";
    }

    if (!Number.isInteger(movimiento.cantidad) ||
        movimiento.cantidad <= 0) {

        return "La cantidad debe ser un número entero mayor que 0.";
    }

    if (movimiento.fecha.trim() === "") {

        return "La fecha del movimiento es obligatoria.";
    }

    if (Number.isNaN(Date.parse(movimiento.fecha))) {

        return "La fecha del movimiento no es válida.";
    }

    if (
        movimiento.tipo === "salida" &&
        movimiento.cantidad > producto.stock
    ) {

        return "La salida supera el stock disponible.";
    }

    const movimientoExistente =
        movimientos.find(function(item) {

            return item.id === movimiento.id;
        });

    if (movimientoExistente !== undefined) {

        return "Ya existe un movimiento con ese ID.";
    }

    return null;
}


export function obtenerMovimientos(
    movimientos: MovimientoStock[]
): MovimientoStock[] {

    return [...movimientos];
}


export function obtenerMovimientosPorProducto(
    movimientos: MovimientoStock[],
    productoId: number
): MovimientoStock[] {

    return movimientos.filter(function(movimiento) {

        return movimiento.productoId === productoId;
    });
}


export function obtenerMovimientosEntrada(
    movimientos: MovimientoStock[]
): MovimientoStock[] {

    return movimientos.filter(function(movimiento) {

        return movimiento.tipo === "entrada";
    });
}


export function obtenerMovimientosSalida(
    movimientos: MovimientoStock[]
): MovimientoStock[] {

    return movimientos.filter(function(movimiento) {

        return movimiento.tipo === "salida";
    });
}