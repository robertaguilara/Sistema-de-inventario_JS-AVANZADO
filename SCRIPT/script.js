const productos = [];
const movimientos = [];

let soloStockBajo = false;


const formProducto = document.querySelector("#formProducto");
const idProducto = document.querySelector("#idProducto");
const nombreProducto = document.querySelector("#nombreProducto");
const categoriaProducto = document.querySelector("#categoriaProducto");
const precioProducto = document.querySelector("#precioProducto");
const stockProducto = document.querySelector("#stockProducto");

const mensaje = document.querySelector("#mensaje");


const buscarProducto = document.querySelector("#buscarProducto");
const btnBuscar = document.querySelector("#btnBuscar");
const btnLimpiarBusqueda = document.querySelector("#btnLimpiarBusqueda");
const btnMostrarTodos = document.querySelector("#btnMostrarTodos");
const btnStockBajo = document.querySelector("#btnStockBajo");
const filtroCategoria = document.querySelector("#filtroCategoria");
const ordenarProductos = document.querySelector("#ordenarProductos");

const tablaProductos = document.querySelector("#tablaProductos");


const formStock = document.querySelector("#formStock");
const idStock = document.querySelector("#idStock");
const nuevoStock = document.querySelector("#nuevoStock");
const mensajeStock = document.querySelector("#mensajeStock");


const formMovimientoStock = document.querySelector("#formMovimientoStock");
const idMovimiento = document.querySelector("#idMovimiento");
const cantidadMovimiento = document.querySelector("#cantidadMovimiento");
const tipoMovimiento = document.querySelector("#tipoMovimiento");
const mensajeMovimiento = document.querySelector("#mensajeMovimiento");


const filtroMovimiento = document.querySelector("#filtroMovimiento");
const btnLimpiarHistorial = document.querySelector("#btnLimpiarHistorial");
const tablaMovimientos = document.querySelector("#tablaMovimientos");


const resumen = document.querySelector("#resumen");


/* =========================
   ELEMENTOS DEL DASHBOARD
========================= */

const btnMenu = document.querySelector("#btnMenu");

const kpiProductos = document.querySelector("#kpiProductos");
const kpiUnidades = document.querySelector("#kpiUnidades");
const kpiStockBajo = document.querySelector("#kpiStockBajo");
const kpiValor = document.querySelector("#kpiValor");

const actividadReciente =
    document.querySelector("#actividadReciente");

const productosRecientes =
    document.querySelector("#productosRecientes");


/* =========================
   LOCALSTORAGE
========================= */

function guardarProductos() {

    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );
}


function guardarMovimientos() {

    localStorage.setItem(
        "movimientos",
        JSON.stringify(movimientos)
    );
}


function cargarProductos() {

    const productosGuardados =
        localStorage.getItem("productos");

    if (productosGuardados === null) {
        return;
    }

    try {

        const productosCargados =
            JSON.parse(productosGuardados);

        if (Array.isArray(productosCargados)) {

            productosCargados.forEach(function(producto) {

                productos.push(producto);

            });
        }

    } catch (error) {

        mensaje.textContent =
            "No se pudieron cargar los productos guardados.";
    }
}


function cargarMovimientos() {

    const movimientosGuardados =
        localStorage.getItem("movimientos");

    if (movimientosGuardados === null) {
        return;
    }

    try {

        const movimientosCargados =
            JSON.parse(movimientosGuardados);

        if (Array.isArray(movimientosCargados)) {

            movimientosCargados.forEach(function(movimiento) {

                movimientos.push(movimiento);

            });
        }

    } catch (error) {

        mensajeMovimiento.textContent =
            "No se pudo cargar el historial de movimientos.";
    }
}


/* =========================
   CATEGORIAS
========================= */

function actualizarCategorias() {

    const categorias =
        productos.map(function(producto) {

            return producto.categoria;

        });


    const categoriasUnicas =
        categorias.filter(function(categoria, indice) {

            return categorias.indexOf(categoria) === indice;

        });


    filtroCategoria.innerHTML =
        '<option value="">Todas</option>';


    categoriasUnicas.forEach(function(categoria) {

        filtroCategoria.innerHTML += `
            <option value="${categoria}">
                ${categoria}
            </option>
        `;

    });
}


/* =========================
   ORDENAMIENTO
========================= */

function ordenarLista(lista) {

    const criterio =
        ordenarProductos.value;


    if (criterio === "") {
        return lista;
    }


    const listaOrdenada =
        [...lista];


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


/* =========================
   ACTUALIZAR INVENTARIO
========================= */

function actualizarVista() {

    let lista = productos;


    const texto =
        buscarProducto.value.trim().toLowerCase();


    if (texto !== "") {

        lista =
            lista.filter(function(producto) {

                return producto.nombre
                    .toLowerCase()
                    .includes(texto) ||

                    producto.categoria
                    .toLowerCase()
                    .includes(texto) ||

                    producto.id
                    .toString() === texto;

            });

    }


    const categoriaSeleccionada =
        filtroCategoria.value;


    if (categoriaSeleccionada !== "") {

        lista =
            lista.filter(function(producto) {

                return producto.categoria ===
                    categoriaSeleccionada;

            });

    }


    if (soloStockBajo) {

        lista =
            lista.filter(function(producto) {

                return producto.stock < 5;

            });

    }


    lista =
        ordenarLista(lista);


    mostrarProductos(lista);
}


/* =========================
   REGISTRAR PRODUCTO
========================= */

formProducto.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        try {

            const id =
                Number(idProducto.value);


            const nombre =
                nombreProducto.value
                    .trim()
                    .replace(/\s+/g, " ");


            const categoria =
                categoriaProducto.value
                    .trim()
                    .replace(/\s+/g, " ")
                    .toLowerCase();


            const precio =
                Number(precioProducto.value);


            const stock =
                Number(stockProducto.value);


            if (
                nombre === "" ||
                categoria === ""
            ) {

                mensaje.textContent =
                    "Complete todos los campos.";

                return;
            }


            if (
                Number.isNaN(id) ||
                Number.isNaN(precio) ||
                Number.isNaN(stock)
            ) {

                mensaje.textContent =
                    "Ingrese valores numéricos válidos.";

                return;
            }


            if (
                !Number.isInteger(id) ||
                !Number.isInteger(stock)
            ) {

                mensaje.textContent =
                    "El ID y el stock deben ser números enteros.";

                return;
            }


            if (
                id <= 0 ||
                precio <= 0 ||
                stock < 0
            ) {

                mensaje.textContent =
                    "Ingrese valores correctos.";

                return;
            }


            const productoExistente =
                productos.find(function(producto) {

                    return producto.id === id ||
                        producto.nombre.toLowerCase() ===
                        nombre.toLowerCase();

                });


            if (productoExistente !== undefined) {

                if (productoExistente.id === id) {

                    mensaje.textContent =
                        "El ID del producto ya existe.";

                } else {

                    mensaje.textContent =
                        "El nombre del producto ya existe.";
                }

                return;
            }


            const producto = {

                id: id,

                nombre: nombre,

                categoria: categoria,

                precio: precio,

                stock: stock

            };


            productos.push(producto);


            guardarProductos();

            actualizarCategorias();


            mensaje.textContent =
                "Producto registrado correctamente.";


            actualizarVista();

            mostrarResumen();

            actualizarDashboard();


            formProducto.reset();

        } catch (error) {

            mensaje.textContent =
                "Ocurrió un error al registrar el producto.";
        }

    }
);


/* =========================
   ESTADO DEL STOCK
========================= */

function obtenerEstadoStock(stock) {

    if (stock === 0) {

        return `
            <span class="estado sin-stock">
                Sin stock
            </span>
        `;

    }


    if (stock < 5) {

        return `
            <span class="estado stock-bajo">
                Stock bajo
            </span>
        `;

    }


    return `
        <span class="estado disponible">
            Disponible
        </span>
    `;
}


/* =========================
   MOSTRAR PRODUCTOS
========================= */

function mostrarProductos(lista) {

    if (lista.length === 0) {

        tablaProductos.innerHTML = `
            <tr>
                <td colspan="7">
                    No se encontraron productos.
                </td>
            </tr>
        `;

        return;
    }


    tablaProductos.innerHTML =
        lista.map(function(producto) {

            return `
                <tr>

                    <td>
                        ${producto.id}
                    </td>

                    <td>
                        ${producto.nombre}
                    </td>

                    <td>
                        ${producto.categoria}
                    </td>

                    <td>
                        S/ ${producto.precio.toFixed(2)}
                    </td>

                    <td>
                        ${producto.stock}
                    </td>

                    <td>
                        ${obtenerEstadoStock(producto.stock)}
                    </td>

                    <td>

                        <button
                            onclick="editarProducto(${producto.id})"
                        >
                            Editar
                        </button>

                        <button
                            onclick="eliminarProducto(${producto.id})"
                        >
                            Eliminar
                        </button>

                    </td>

                </tr>
            `;

        }).join("");
}


/* =========================
   EDITAR PRODUCTO
========================= */

function editarProducto(id) {

    const producto =
        productos.find(function(producto) {

            return producto.id === id;

        });


    if (producto === undefined) {

        mensaje.textContent =
            "Producto no encontrado.";

        return;
    }


    const nuevoNombre =
        prompt(
            "Ingrese el nuevo nombre:",
            producto.nombre
        );


    const nuevaCategoria =
        prompt(
            "Ingrese la nueva categoría:",
            producto.categoria
        );


    const nuevoPrecio =
        prompt(
            "Ingrese el nuevo precio:",
            producto.precio
        );


    if (
        nuevoNombre === null ||
        nuevaCategoria === null ||
        nuevoPrecio === null
    ) {

        return;
    }


    if (
        nuevoNombre.trim() === "" ||
        nuevaCategoria.trim() === ""
    ) {

        mensaje.textContent =
            "Complete todos los campos.";

        return;
    }


    const nombreNormalizado =
        nuevoNombre
            .trim()
            .replace(/\s+/g, " ");


    const nombreExiste =
        productos.find(function(item) {

            return item.id !== id &&
                item.nombre.toLowerCase() ===
                nombreNormalizado.toLowerCase();

        });


    if (nombreExiste !== undefined) {

        mensaje.textContent =
            "El nombre del producto ya existe.";

        return;
    }


    const precio =
        Number(nuevoPrecio);


    if (
        Number.isNaN(precio) ||
        precio <= 0
    ) {

        mensaje.textContent =
            "Ingrese un precio válido.";

        return;
    }


    producto.nombre =
        nombreNormalizado;


    producto.categoria =
        nuevaCategoria
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase();


    producto.precio =
        precio;


    guardarProductos();

    actualizarCategorias();


    mensaje.textContent =
        "Producto actualizado correctamente.";


    actualizarVista();

    mostrarResumen();

    actualizarDashboard();
}


/* =========================
   ELIMINAR PRODUCTO
========================= */

function eliminarProducto(id) {

    const producto =
        productos.find(function(producto) {

            return producto.id === id;

        });


    if (producto === undefined) {

        mensaje.textContent =
            "Producto no encontrado.";

        return;
    }


    const confirmar =
        confirm(
            "¿Desea eliminar el producto?"
        );


    if (!confirmar) {
        return;
    }


    const indice =
        productos.indexOf(producto);


    productos.splice(
        indice,
        1
    );


    guardarProductos();

    actualizarCategorias();


    mensaje.textContent =
        "Producto eliminado correctamente.";


    actualizarVista();

    mostrarResumen();

    actualizarDashboard();
}


/* =========================
   BUSQUEDA
========================= */

btnBuscar.addEventListener(
    "click",
    function() {

        actualizarVista();

    }
);


buscarProducto.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            actualizarVista();

        }

    }
);


btnLimpiarBusqueda.addEventListener(
    "click",
    function() {

        buscarProducto.value = "";

        actualizarVista();

    }
);


btnMostrarTodos.addEventListener(
    "click",
    function() {

        soloStockBajo = false;

        buscarProducto.value = "";

        filtroCategoria.value = "";

        ordenarProductos.value = "";

        actualizarVista();

    }
);


btnStockBajo.addEventListener(
    "click",
    function() {

        soloStockBajo = true;

        actualizarVista();

    }
);


filtroCategoria.addEventListener(
    "change",
    function() {

        actualizarVista();

    }
);


ordenarProductos.addEventListener(
    "change",
    function() {

        actualizarVista();

    }
);


/* =========================
   ACTUALIZAR STOCK
========================= */

formStock.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        try {

            const id =
                Number(idStock.value);


            const stock =
                Number(nuevoStock.value);


            if (
                Number.isNaN(id) ||
                Number.isNaN(stock)
            ) {

                mensajeStock.textContent =
                    "Ingrese valores numéricos válidos.";

                return;
            }


            if (
                !Number.isInteger(id) ||
                !Number.isInteger(stock)
            ) {

                mensajeStock.textContent =
                    "El ID y el stock deben ser números enteros.";

                return;
            }


            if (
                id <= 0 ||
                stock < 0
            ) {

                mensajeStock.textContent =
                    "Ingrese valores correctos.";

                return;
            }


            const producto =
                productos.find(function(producto) {

                    return producto.id === id;

                });


            if (producto === undefined) {

                mensajeStock.textContent =
                    "Producto no encontrado.";

                return;
            }


            producto.stock =
                stock;


            guardarProductos();


            mensajeStock.textContent =
                "Stock actualizado correctamente.";


            actualizarVista();

            mostrarResumen();

            actualizarDashboard();


            formStock.reset();

        } catch (error) {

            mensajeStock.textContent =
                "Ocurrió un error al actualizar el stock.";
        }

    }
);


/* =========================
   MOVIMIENTO DE STOCK
========================= */

formMovimientoStock.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        try {

            const id =
                Number(idMovimiento.value);


            const cantidad =
                Number(cantidadMovimiento.value);


            const tipo =
                tipoMovimiento.value;


            if (
                Number.isNaN(id) ||
                Number.isNaN(cantidad)
            ) {

                mensajeMovimiento.textContent =
                    "Ingrese valores numéricos válidos.";

                return;
            }


            if (
                !Number.isInteger(id) ||
                !Number.isInteger(cantidad)
            ) {

                mensajeMovimiento.textContent =
                    "El ID y la cantidad deben ser números enteros.";

                return;
            }


            if (
                id <= 0 ||
                cantidad <= 0
            ) {

                mensajeMovimiento.textContent =
                    "Ingrese valores correctos.";

                return;
            }


            const producto =
                productos.find(function(producto) {

                    return producto.id === id;

                });


            if (producto === undefined) {

                mensajeMovimiento.textContent =
                    "Producto no encontrado.";

                return;
            }


            const fechaMovimiento =
                new Date().toISOString();


            if (tipo === "entrada") {

                producto.stock =
                    producto.stock + cantidad;


                movimientos.push({

                    producto:
                        producto.nombre,

                    tipo:
                        "Entrada",

                    cantidad:
                        cantidad,

                    stockResultante:
                        producto.stock,

                    fecha:
                        fechaMovimiento

                });


                mensajeMovimiento.textContent =
                    "Entrada de stock registrada correctamente.";
            }


            if (tipo === "salida") {

                if (
                    cantidad >
                    producto.stock
                ) {

                    mensajeMovimiento.textContent =
                        "No hay suficiente stock para realizar la salida.";

                    return;
                }


                producto.stock =
                    producto.stock - cantidad;


                movimientos.push({

                    producto:
                        producto.nombre,

                    tipo:
                        "Salida",

                    cantidad:
                        cantidad,

                    stockResultante:
                        producto.stock,

                    fecha:
                        fechaMovimiento

                });


                mensajeMovimiento.textContent =
                    "Salida de stock registrada correctamente.";
            }


            guardarProductos();

            guardarMovimientos();


            actualizarVista();

            mostrarResumen();

            mostrarMovimientos();

            actualizarDashboard();


            formMovimientoStock.reset();

        } catch (error) {

            mensajeMovimiento.textContent =
                "Ocurrió un error al registrar el movimiento.";
        }

    }
);


/* =========================
   MOSTRAR MOVIMIENTOS
========================= */

function mostrarMovimientos() {

    let lista =
        movimientos;


    const filtro =
        filtroMovimiento.value;


    if (filtro !== "") {

        lista =
            movimientos.filter(
                function(movimiento) {

                    return movimiento.tipo
                        .toLowerCase() === filtro;

                }
            );

    }


    if (lista.length === 0) {

        tablaMovimientos.innerHTML = `
            <tr>
                <td colspan="5">
                    No hay movimientos registrados.
                </td>
            </tr>
        `;

        return;
    }


    const listaMostrar =
        [...lista].reverse();


    tablaMovimientos.innerHTML =
        listaMostrar.map(
            function(movimiento) {

                let fecha =
                    "Registro anterior";


                if (movimiento.fecha) {

                    fecha =
                        new Date(
                            movimiento.fecha
                        ).toLocaleString(
                            "es-PE"
                        );

                }


                return `
                    <tr>

                        <td>
                            ${movimiento.producto}
                        </td>

                        <td>
                            ${movimiento.tipo}
                        </td>

                        <td>
                            ${movimiento.cantidad}
                        </td>

                        <td>
                            ${movimiento.stockResultante}
                        </td>

                        <td>
                            ${fecha}
                        </td>

                    </tr>
                `;

            }
        ).join("");
}


/* =========================
   FILTRO HISTORIAL
========================= */

filtroMovimiento.addEventListener(
    "change",
    function() {

        mostrarMovimientos();

    }
);


btnLimpiarHistorial.addEventListener(
    "click",
    function() {

        const confirmar =
            confirm(
                "¿Desea eliminar todo el historial?"
            );


        if (!confirmar) {
            return;
        }


        movimientos.length = 0;

        guardarMovimientos();

        mostrarMovimientos();

        mostrarResumen();

        actualizarDashboard();


        mensajeMovimiento.textContent =
            "Historial eliminado correctamente.";

    }
);


/* =========================
   RESUMEN
========================= */

function mostrarResumen() {

    const cantidadProductos =
        productos.length;


    const cantidadUnidades =
        productos.reduce(
            function(total, producto) {

                return total +
                    producto.stock;

            },
            0
        );


    const valorInventario =
        productos.reduce(
            function(total, producto) {

                return total +
                    (
                        producto.precio *
                        producto.stock
                    );

            },
            0
        );


    const productosStockBajo =
        productos.filter(
            function(producto) {

                return producto.stock < 5;

            }
        ).length;


    let precioPromedio = 0;


    if (productos.length > 0) {

        const sumaPrecios =
            productos.reduce(
                function(total, producto) {

                    return total +
                        producto.precio;

                },
                0
            );


        precioPromedio =
            sumaPrecios /
            productos.length;
    }


    const totalEntradas =
        movimientos
            .filter(
                function(movimiento) {

                    return movimiento.tipo ===
                        "Entrada";

                }
            )
            .reduce(
                function(total, movimiento) {

                    return total +
                        movimiento.cantidad;

                },
                0
            );


    const totalSalidas =
        movimientos
            .filter(
                function(movimiento) {

                    return movimiento.tipo ===
                        "Salida";

                }
            )
            .reduce(
                function(total, movimiento) {

                    return total +
                        movimiento.cantidad;

                },
                0
            );


    resumen.innerHTML = `

        <p>
            Total de productos:
            ${cantidadProductos}
        </p>

        <p>
            Total de unidades:
            ${cantidadUnidades}
        </p>

        <p>
            Productos con stock bajo:
            ${productosStockBajo}
        </p>

        <p>
            Valor total del inventario:
            S/ ${valorInventario.toFixed(2)}
        </p>

        <p>
            Precio promedio:
            S/ ${precioPromedio.toFixed(2)}
        </p>

        <p>
            Total de unidades ingresadas:
            ${totalEntradas}
        </p>

        <p>
            Total de unidades salidas:
            ${totalSalidas}
        </p>

    `;
}


/* =========================
   KPI DEL DASHBOARD
========================= */

function actualizarKPI() {

    const cantidadProductos =
        productos.length;


    const cantidadUnidades =
        productos.reduce(
            function(total, producto) {

                return total +
                    producto.stock;

            },
            0
        );


    const cantidadStockBajo =
        productos.filter(
            function(producto) {

                return producto.stock < 5;

            }
        ).length;


    const valorInventario =
        productos.reduce(
            function(total, producto) {

                return total +
                    (
                        producto.precio *
                        producto.stock
                    );

            },
            0
        );


    kpiProductos.textContent =
        cantidadProductos;


    kpiUnidades.textContent =
        cantidadUnidades;


    kpiStockBajo.textContent =
        cantidadStockBajo;


    kpiValor.textContent =
        "S/ " +
        valorInventario.toFixed(2);
}


/* =========================
   ACTIVIDAD RECIENTE
========================= */

function mostrarActividadReciente() {

    if (movimientos.length === 0) {

        actividadReciente.innerHTML = `
            <div class="actividad-vacia">

                <span>
                    ◌
                </span>

                <p>
                    No hay movimientos recientes.
                </p>

            </div>
        `;

        return;
    }


    const lista =
        [...movimientos]
            .reverse()
            .slice(0, 5);


    actividadReciente.innerHTML =
        lista.map(
            function(movimiento) {

                const esEntrada =
                    movimiento.tipo ===
                    "Entrada";


                let fecha =
                    "Registro anterior";


                if (movimiento.fecha) {

                    fecha =
                        new Date(
                            movimiento.fecha
                        ).toLocaleString(
                            "es-PE"
                        );

                }


                const signo =
                    esEntrada
                        ? "+"
                        : "-";


                return `
                    <div class="actividad-item">

                        <div class="
                            actividad-icono
                            ${esEntrada
                                ? "entrada"
                                : "salida"}
                        ">
                            ${esEntrada ? "↑" : "↓"}
                        </div>


                        <div class="actividad-info">

                            <strong>
                                ${movimiento.producto}
                            </strong>

                            <span>
                                ${movimiento.tipo}
                                ·
                                ${fecha}
                            </span>

                        </div>


                        <span class="
                            actividad-cantidad
                            ${esEntrada
                                ? "entrada"
                                : "salida"}
                        ">
                            ${signo}${movimiento.cantidad}
                        </span>

                    </div>
                `;

            }
        ).join("");
}


/* =========================
   PRODUCTOS RECIENTES
========================= */

function mostrarProductosRecientes() {

    if (productos.length === 0) {

        productosRecientes.innerHTML = `
            <div class="actividad-vacia">

                <span>
                    ▣
                </span>

                <p>
                    No hay productos registrados.
                </p>

            </div>
        `;

        return;
    }


    const lista =
        [...productos]
            .reverse()
            .slice(0, 5);


    productosRecientes.innerHTML =
        lista.map(
            function(producto) {

                return `
                    <div class="producto-reciente">

                        <div class="producto-icono">
                            ▣
                        </div>


                        <div class="producto-info">

                            <strong>
                                ${producto.nombre}
                            </strong>

                            <span>
                                ${producto.categoria}
                                · Stock: ${producto.stock}
                            </span>

                        </div>


                        <span class="producto-precio">
                            S/ ${producto.precio.toFixed(2)}
                        </span>

                    </div>
                `;

            }
        ).join("");
}


/* =========================
   ACTUALIZAR DASHBOARD
========================= */

function actualizarDashboard() {

    actualizarKPI();

    mostrarActividadReciente();

    mostrarProductosRecientes();
}


/* =========================
   MENU LATERAL
========================= */

btnMenu.addEventListener(
    "click",
    function() {

        if (window.innerWidth <= 650) {

            document.body.classList.toggle(
                "sidebar-visible"
            );

        } else {

            document.body.classList.toggle(
                "sidebar-colapsado"
            );

        }

    }
);


/* =========================
   NAVEGACION DEL MENU
========================= */

const menuItems =
    document.querySelectorAll(
        ".menu-item"
    );


menuItems.forEach(
    function(item) {

        item.addEventListener(
            "click",
            function() {

                menuItems.forEach(
                    function(menu) {

                        menu.classList.remove(
                            "activo"
                        );

                    }
                );


                item.classList.add(
                    "activo"
                );


                if (
                    window.innerWidth <= 650
                ) {

                    document.body.classList.remove(
                        "sidebar-visible"
                    );

                }

            }
        );

    }
);


/* =========================
   CARGA INICIAL
========================= */

cargarProductos();

cargarMovimientos();

actualizarCategorias();

mostrarProductos(productos);

mostrarMovimientos();

mostrarResumen();

actualizarDashboard();