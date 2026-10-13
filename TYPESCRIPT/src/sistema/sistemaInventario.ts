import { Producto, CriterioOrdenamiento } from "../producto";
import { MovimientoStock } from "../movimiento";

import {
    registrarMovimiento,
    obtenerMovimientos,
    obtenerMovimientosPorProducto,
    obtenerMovimientosEntrada,
    obtenerMovimientosSalida,
    obtenerErrorMovimiento as obtenerErrorMovimientoMovimiento
} from "../movimientos/movimientos";

import {
    buscarProducto,
    filtrarPorCategoria,
    ordenarProductos,
    calcularTotalUnidades,
    calcularValorInventario,
    contarStockBajo,
    contarProductosSinStock,
    registrarProducto,
    validarProducto,
    obtenerErrorProducto,
    obtenerErrorActualizacionProducto,
    actualizarProducto,
    eliminarProducto,
    actualizarStock,
    obtenerProductoPorId,
    obtenerProductosStockBajo,
    obtenerProductosDisponibles,
    obtenerProductosSinStock
} from "../funciones/productos";


export class SistemaInventario {

    private productos: Producto[];

    private movimientos: MovimientoStock[];


    constructor(productos: Producto[]) {

        this.productos = [...productos];

        this.movimientos = [];
    }


    registrar(
        producto: Producto
    ): boolean {

        if (!validarProducto(producto)) {
            return false;
        }

        return registrarProducto(
            this.productos,
            producto
        );
    }


    obtenerErrorRegistro(
        producto: Producto
    ): string | null {

        return obtenerErrorProducto(producto);
    }


    actualizar(
        id: number,
        producto: Producto
    ): boolean {

        return actualizarProducto(
            this.productos,
            id,
            producto
        );
    }


    obtenerErrorActualizacion(
        id: number,
        producto: Producto
    ): string | null {

        return obtenerErrorActualizacionProducto(
            this.productos,
            id,
            producto
        );
    }


    eliminar(
        id: number
    ): boolean {

        return eliminarProducto(
            this.productos,
            id
        );
    }


    actualizarStock(
        id: number,
        nuevoStock: number
    ): boolean {

        return actualizarStock(
            this.productos,
            id,
            nuevoStock
        );
    }


    buscar(
        texto: string
    ): Producto[] {

        return buscarProducto(
            this.productos,
            texto
        );
    }


    filtrarPorCategoria(
        categoria: string
    ): Producto[] {

        return filtrarPorCategoria(
            this.productos,
            categoria
        );
    }


    ordenar(
        criterio: CriterioOrdenamiento
    ): Producto[] {

        return ordenarProductos(
            this.productos,
            criterio
        );
    }


    obtenerTotalUnidades(): number {

        return calcularTotalUnidades(
            this.productos
        );
    }


    obtenerValorInventario(): number {

        return calcularValorInventario(
            this.productos
        );
    }


    obtenerStockBajo(): number {

        return contarStockBajo(
            this.productos
        );
    }


    obtenerProductosSinStock(): Producto[] {

        return obtenerProductosSinStock(
            this.productos
        );
    }


    obtenerProductosDisponibles(): Producto[] {

        return obtenerProductosDisponibles(
            this.productos
        );
    }


    obtenerPorId(
        id: number
    ): Producto | undefined {

        return obtenerProductoPorId(
            this.productos,
            id
        );
    }


    obtenerProductosStockBajo(): Producto[] {

        return obtenerProductosStockBajo(
            this.productos
        );
    }


    obtenerResumen(): {
        totalProductos: number;
        totalUnidades: number;
        valorInventario: number;
        productosStockBajo: number;
        productosSinStock: number;
        totalMovimientos: number;
    } {

        return {

            totalProductos:
                this.productos.length,

            totalUnidades:
                this.obtenerTotalUnidades(),

            valorInventario:
                this.obtenerValorInventario(),

            productosStockBajo:
                this.obtenerStockBajo(),

            productosSinStock:
                this.obtenerProductosSinStock().length,

            totalMovimientos:
                this.movimientos.length
        };
    }


    registrarMovimiento(
        movimiento: MovimientoStock
    ): boolean {

        const producto =
            this.obtenerPorId(
                movimiento.productoId
            );

        const errorMovimiento =
            this.obtenerErrorMovimiento(
                movimiento
            );

        if (errorMovimiento !== null) {
            return false;
        }

        if (producto === undefined) {
            return false;
        }

        const registrado =
            registrarMovimiento(
                this.movimientos,
                movimiento
            );

        if (!registrado) {
            return false;
        }

        if (movimiento.tipo === "entrada") {

            producto.stock +=
                movimiento.cantidad;
        }

        if (movimiento.tipo === "salida") {

            producto.stock -=
                movimiento.cantidad;
        }

        return true;
    }


    obtenerErrorMovimiento(
        movimiento: MovimientoStock
    ): string | null {

        const producto =
            this.obtenerPorId(
                movimiento.productoId
            );

        return obtenerErrorMovimientoMovimiento(
            movimiento,
            producto,
            this.movimientos
        );
    }


    obtenerMovimientos(): MovimientoStock[] {

        return obtenerMovimientos(
            this.movimientos
        );
    }


    obtenerMovimientosPorProducto(
        productoId: number
    ): MovimientoStock[] {

        return obtenerMovimientosPorProducto(
            this.movimientos,
            productoId
        );
    }


    obtenerMovimientosEntrada(): MovimientoStock[] {

        return obtenerMovimientosEntrada(
            this.movimientos
        );
    }


    obtenerMovimientosSalida(): MovimientoStock[] {

        return obtenerMovimientosSalida(
            this.movimientos
        );
    }


    obtenerProductos(): Producto[] {

        return [...this.productos];
    }
}