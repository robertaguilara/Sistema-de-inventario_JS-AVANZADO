import {
    Producto,
    CriterioOrdenamiento
} from "../producto";


export function buscarProducto(
    productos: Producto[],
    texto: string
): Producto[] {

    const textoBusqueda = texto.trim().toLowerCase();

    if (textoBusqueda === "") {
        return [...productos];
    }

    return productos.filter(function(producto) {

        return producto.nombre
                   .toLowerCase()
                   .includes(textoBusqueda) ||

               producto.categoria
                   .toLowerCase()
                   .includes(textoBusqueda) ||

               producto.id.toString() === textoBusqueda;
    });
}


export function filtrarPorCategoria(
    productos: Producto[],
    categoria: string
): Producto[] {

    const categoriaBusqueda =
        categoria.trim().toLowerCase();

    if (categoriaBusqueda === "") {
        return [...productos];
    }

    return productos.filter(function(producto) {

        return producto.categoria
                   .trim()
                   .toLowerCase() === categoriaBusqueda;
    });
}


export function ordenarProductos(
    productos: Producto[],
    criterio: CriterioOrdenamiento
): Producto[] {

    const listaOrdenada = [...productos];

    if (criterio === "nombre-asc") {

        listaOrdenada.sort(function(a, b) {
            return a.nombre.localeCompare(b.nombre);
        });
    }

    if (criterio === "nombre-desc") {

        listaOrdenada.sort(function(a, b) {
            return b.nombre.localeCompare(a.nombre);
        });
    }

    if (criterio === "precio-asc") {

        listaOrdenada.sort(function(a, b) {
            return a.precio - b.precio;
        });
    }

    if (criterio === "precio-desc") {

        listaOrdenada.sort(function(a, b) {
            return b.precio - a.precio;
        });
    }

    if (criterio === "stock-asc") {

        listaOrdenada.sort(function(a, b) {
            return a.stock - b.stock;
        });
    }

    if (criterio === "stock-desc") {

        listaOrdenada.sort(function(a, b) {
            return b.stock - a.stock;
        });
    }

    return listaOrdenada;
}


export function calcularTotalUnidades(
    productos: Producto[]
): number {

    return productos.reduce(function(
        total,
        producto
    ) {

        return total + producto.stock;

    }, 0);
}


export function calcularValorInventario(
    productos: Producto[]
): number {

    return productos.reduce(function(
        total,
        producto
    ) {

        return total +
            (producto.precio * producto.stock);

    }, 0);
}


export function contarStockBajo(
    productos: Producto[]
): number {

    return productos.filter(function(producto) {

        return producto.stock > 0 &&
               producto.stock < 5;

    }).length;
}


export function contarProductosSinStock(
    productos: Producto[]
): number {

    return productos.filter(function(producto) {

        return producto.stock === 0;

    }).length;
}


export function obtenerProductosDisponibles(
    productos: Producto[]
): Producto[] {

    return productos.filter(function(producto) {

        return producto.stock > 0;

    });
}


export function obtenerProductosSinStock(
    productos: Producto[]
): Producto[] {

    return productos.filter(function(producto) {

        return producto.stock === 0;

    });
}


export function registrarProducto(
    productos: Producto[],
    producto: Producto
): boolean {

    if (!validarProducto(producto)) {
        return false;
    }

    const nombreNormalizado =
        producto.nombre.trim().toLowerCase();

    const productoExistente =
        productos.find(function(item) {

            return item.id === producto.id ||
                   item.nombre
                       .trim()
                       .toLowerCase() === nombreNormalizado;
        });

    if (productoExistente !== undefined) {
        return false;
    }

    productos.push(producto);

    return true;
}


export function validarProducto(
    producto: Producto
): boolean {

    return obtenerErrorProducto(producto) === null;
}


export function obtenerErrorProducto(
    producto: Producto
): string | null {

    if (!Number.isInteger(producto.id) ||
        producto.id <= 0) {

        return "El ID debe ser un número entero mayor que 0.";
    }

    if (producto.nombre.trim() === "") {

        return "El nombre del producto es obligatorio.";
    }

    if (producto.categoria.trim() === "") {

        return "La categoría del producto es obligatoria.";
    }

    if (!Number.isFinite(producto.precio) ||
        producto.precio <= 0) {

        return "El precio debe ser un número mayor que 0.";
    }

    if (!Number.isFinite(producto.stock) ||
        !Number.isInteger(producto.stock) ||
        producto.stock < 0) {

        return "El stock debe ser un número entero igual o mayor que 0.";
    }

    return null;
}


export function obtenerErrorActualizacionProducto(
    productos: Producto[],
    id: number,
    productoActualizado: Producto
): string | null {

    const productoExistente =
        obtenerProductoPorId(productos, id);

    if (productoExistente === undefined) {

        return "El producto que se desea actualizar no existe.";
    }

    const errorProducto =
        obtenerErrorProducto(productoActualizado);

    if (errorProducto !== null) {

        return errorProducto;
    }

    if (productoActualizado.id !== id) {

        return "El ID del producto no puede cambiar durante la actualización.";
    }

    const nombreNormalizado =
        productoActualizado.nombre
            .trim()
            .toLowerCase();

    const productoDuplicado =
        productos.find(function(producto) {

            return producto.id !== id &&
                   producto.nombre
                       .trim()
                       .toLowerCase() === nombreNormalizado;
        });

    if (productoDuplicado !== undefined) {

        return "Ya existe otro producto con ese nombre.";
    }

    return null;
}


export function actualizarProducto(
    productos: Producto[],
    id: number,
    productoActualizado: Producto
): boolean {

    const error =
        obtenerErrorActualizacionProducto(
            productos,
            id,
            productoActualizado
        );

    if (error !== null) {
        return false;
    }

    const posicion =
        productos.findIndex(function(producto) {

            return producto.id === id;
        });

    if (posicion === -1) {
        return false;
    }

    productos[posicion] = productoActualizado;

    return true;
}


export function eliminarProducto(
    productos: Producto[],
    id: number
): boolean {

    const posicion =
        productos.findIndex(function(producto) {

            return producto.id === id;
        });

    if (posicion === -1) {
        return false;
    }

    productos.splice(posicion, 1);

    return true;
}


export function actualizarStock(
    productos: Producto[],
    id: number,
    nuevoStock: number
): boolean {

    const producto =
        productos.find(function(producto) {

            return producto.id === id;
        });

    if (producto === undefined) {
        return false;
    }

    if (!Number.isInteger(nuevoStock) ||
        nuevoStock < 0) {

        return false;
    }

    producto.stock = nuevoStock;

    return true;
}


export function obtenerProductoPorId(
    productos: Producto[],
    id: number
): Producto | undefined {

    return productos.find(function(producto) {

        return producto.id === id;
    });
}


export function obtenerProductosStockBajo(
    productos: Producto[]
): Producto[] {

    return productos.filter(function(producto) {

        return producto.stock > 0 &&
               producto.stock < 5;
    });
}