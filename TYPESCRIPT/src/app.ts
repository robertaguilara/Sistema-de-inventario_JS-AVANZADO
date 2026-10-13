import { Producto } from "./producto";
import { MovimientoStock } from "./movimiento";

import { obtenerProductosIniciales }
    from "./sistema/inventario";

import { SistemaInventario }
    from "./sistema/sistemaInventario";


function crearSistema(): SistemaInventario {

    const productosIniciales =
        obtenerProductosIniciales();

    return new SistemaInventario(
        productosIniciales
    );
}


function iniciarSistema(): void {

    const sistema =
        crearSistema();


    console.log("=== VELTRIX SYSTEM ===");

    console.log(
        "Inventario inicial:"
    );

    console.log(
        sistema.obtenerProductos()
    );


    const nuevoProducto: Producto = {

        id: 4,

        nombre:
            "Audífonos inalámbricos",

        categoria:
            "audio",

        precio:
            220,

        stock:
            8
    };


    const registrado =
        sistema.registrar(
            nuevoProducto
        );


    if (registrado) {

        console.log(
            "Producto registrado correctamente."
        );

    } else {

        console.log(
            "No se pudo registrar el producto."
        );

        console.log(
            "Motivo:",
            sistema.obtenerErrorRegistro(
                nuevoProducto
            )
        );
    }


    const productoModificado: Producto = {

        id: 2,

        nombre:
            "Mouse inalámbrico Gamer",

        categoria:
            "mouse",

        precio:
            95,

        stock:
            20
    };


    const actualizado =
        sistema.actualizar(
            2,
            productoModificado
        );


    if (actualizado) {

        console.log(
            "Producto actualizado correctamente."
        );

    } else {

        console.log(
            "No se pudo actualizar el producto."
        );

        console.log(
            "Motivo:",
            sistema.obtenerErrorActualizacion(
                2,
                productoModificado
            )
        );
    }


    const eliminado =
        sistema.eliminar(3);


    if (eliminado) {

        console.log(
            "Producto eliminado correctamente."
        );

    } else {

        console.log(
            "No se pudo eliminar el producto."
        );
    }


    const stockActualizado =
        sistema.actualizarStock(
            1,
            18
        );


    if (stockActualizado) {

        console.log(
            "Stock actualizado correctamente."
        );

    } else {

        console.log(
            "No se pudo actualizar el stock."
        );
    }


    const movimiento: MovimientoStock = {

        id: 1,

        productoId: 1,

        tipo: "entrada",

        cantidad: 5,

        fecha:
            new Date().toISOString()
    };


    const movimientoRegistrado =
        sistema.registrarMovimiento(
            movimiento
        );


    if (movimientoRegistrado) {

        console.log(
            "Movimiento registrado correctamente."
        );

    } else {

        console.log(
            "No se pudo registrar el movimiento."
        );

        console.log(
            "Motivo:",
            sistema.obtenerErrorMovimiento(
                movimiento
            )
        );
    }


    const salida: MovimientoStock = {

        id: 2,

        productoId: 1,

        tipo: "salida",

        cantidad: 3,

        fecha:
            new Date().toISOString()
    };


    const salidaRegistrada =
        sistema.registrarMovimiento(
            salida
        );


    if (salidaRegistrada) {

        console.log(
            "Salida de stock registrada correctamente."
        );

    } else {

        console.log(
            "No se pudo registrar la salida de stock."
        );

        console.log(
            "Motivo:",
            sistema.obtenerErrorMovimiento(
                salida
            )
        );
    }


    const resultado =
        sistema.buscar("mouse");


    console.log(
        "Resultado de búsqueda:"
    );

    console.log(
        resultado
    );


    const resultadoCategoria =
        sistema.filtrarPorCategoria(
            "teclados"
        );


    console.log(
        "Resultado por categoría:"
    );

    console.log(
        resultadoCategoria
    );


    const productosOrdenados =
        sistema.ordenar(
            "precio-asc"
        );


    console.log(
        "Productos ordenados por precio:"
    );

    console.log(
        productosOrdenados
    );


    const productosDisponibles =
        sistema.obtenerProductosDisponibles();


    console.log(
        "Productos disponibles:"
    );

    console.log(
        productosDisponibles
    );


    const productosSinStock =
        sistema.obtenerProductosSinStock();


    console.log(
        "Productos sin stock:"
    );

    console.log(
        productosSinStock
    );


    const resumen =
        sistema.obtenerResumen();


    console.log(
        "Resumen del inventario:"
    );

    console.log(
        "Total de productos:",
        resumen.totalProductos
    );

    console.log(
        "Total de unidades:",
        resumen.totalUnidades
    );

    console.log(
        "Valor del inventario: S/",
        resumen.valorInventario
    );

    console.log(
        "Productos con stock bajo:",
        resumen.productosStockBajo
    );

    console.log(
        "Productos sin stock:",
        resumen.productosSinStock
    );

    console.log(
        "Total de movimientos:",
        resumen.totalMovimientos
    );


    const movimientos =
        sistema.obtenerMovimientos();


    console.log(
        "Historial de movimientos:"
    );

    console.log(
        movimientos
    );


    const movimientosProducto =
        sistema.obtenerMovimientosPorProducto(1);


    console.log(
        "Movimientos del producto 1:"
    );

    console.log(
        movimientosProducto
    );


    const entradas =
        sistema.obtenerMovimientosEntrada();


    console.log(
        "Entradas de stock:"
    );

    console.log(
        entradas
    );


    const salidas =
        sistema.obtenerMovimientosSalida();


    console.log(
        "Salidas de stock:"
    );

    console.log(
        salidas
    );
}


iniciarSistema();