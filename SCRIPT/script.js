const productos = [];

const formProducto = document.querySelector("#formProducto");
const idProducto = document.querySelector("#idProducto");
const nombreProducto = document.querySelector("#nombreProducto");
const categoriaProducto = document.querySelector("#categoriaProducto");
const precioProducto = document.querySelector("#precioProducto");
const stockProducto = document.querySelector("#stockProducto");

const mensaje = document.querySelector("#mensaje");

const buscarProducto = document.querySelector("#buscarProducto");
const btnBuscar = document.querySelector("#btnBuscar");
const btnMostrarTodos = document.querySelector("#btnMostrarTodos");
const btnStockBajo = document.querySelector("#btnStockBajo");
const filtroCategoria = document.querySelector("#filtroCategoria");

const tablaProductos = document.querySelector("#tablaProductos");

const formStock = document.querySelector("#formStock");
const idStock = document.querySelector("#idStock");
const nuevoStock = document.querySelector("#nuevoStock");
const mensajeStock = document.querySelector("#mensajeStock");

const resumen = document.querySelector("#resumen");

function actualizarCategorias() {
    const categorias = productos.map(function(producto) {
        return producto.categoria;
    });

    const categoriasUnicas = categorias.filter(function(categoria, indice) {
        return categorias.indexOf(categoria) === indice;
    });

    filtroCategoria.innerHTML = '<option value="">Todas</option>';

    categoriasUnicas.forEach(function(categoria) {
        filtroCategoria.innerHTML += `
            <option value="${categoria}">${categoria}</option>
        `;
    });
}

formProducto.addEventListener("submit", function(event) {
    event.preventDefault();
    try {
        const id = Number(idProducto.value);
        const nombre = nombreProducto.value.trim().replace(/\s+/g, " ");
        const categoria = categoriaProducto.value.trim().replace(/\s+/g, " ");
        const precio = Number(precioProducto.value);
        const stock = Number(stockProducto.value);
        if (nombre === "" || categoria === "") {
            mensaje.textContent = "Complete todos los campos.";
            return;
        }
        if (Number.isNaN(id) || Number.isNaN(precio) || Number.isNaN(stock)) {
            mensaje.textContent = "Ingrese valores numéricos válidos.";
            return;
        }
        if (id <= 0 || precio <= 0 || stock < 0) {
            mensaje.textContent = "Ingrese valores correctos.";
            return;
        }
        const productoExistente = productos.find(function(producto) {
            return producto.id === id;
        });
        if (productoExistente !== undefined) {
            mensaje.textContent = "El ID del producto ya existe.";
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
        actualizarCategorias();

        mensaje.textContent = "Producto registrado correctamente.";

        mostrarProductos(productos);
        mostrarResumen();

        formProducto.reset();

    } catch (error) {
        mensaje.textContent = "Ocurrió un error al registrar el producto.";
    }
});


function mostrarProductos(lista) {
    tablaProductos.innerHTML = lista.map(function(producto) {
        return `
            <tr>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>S/ ${producto.precio.toFixed(2)}</td>
                <td>${producto.stock}</td>
                <td>
                    <button onclick="editarProducto(${producto.id})">Editar</button>
                    <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </td>
            </tr>
        `;
    }).join("");
}

function editarProducto(id) {
    const producto = productos.find(function(producto) {
        return producto.id === id;
    });

    if (producto === undefined) {
        mensaje.textContent = "Producto no encontrado.";
        return;
    }

    const nuevoNombre = prompt("Ingrese el nuevo nombre:", producto.nombre);
    const nuevaCategoria = prompt("Ingrese la nueva categoría:", producto.categoria);
    const nuevoPrecio = prompt("Ingrese el nuevo precio:", producto.precio);

    if (nuevoNombre === null || nuevaCategoria === null || nuevoPrecio === null) {
        return;
    }

    if (nuevoNombre.trim() === "" || nuevaCategoria.trim() === "") {
        mensaje.textContent = "Complete todos los campos.";
        return;
    }

    const precio = Number(nuevoPrecio);

    if (Number.isNaN(precio) || precio <= 0) {
        mensaje.textContent = "Ingrese un precio válido.";
        return;
    }

    producto.nombre = nuevoNombre.trim().replace(/\s+/g, " ");
    producto.categoria = nuevaCategoria.trim().replace(/\s+/g, " ");
    producto.precio = precio;

    actualizarCategorias();

    mensaje.textContent = "Producto actualizado correctamente.";

    mostrarProductos(productos);
    mostrarResumen();
}

function eliminarProducto(id) {
    const producto = productos.find(function(producto) {
        return producto.id === id;
    });

    if (producto === undefined) {
        mensaje.textContent = "Producto no encontrado.";
        return;
    }

    const confirmar = confirm("¿Desea eliminar este producto?");

    if (!confirmar) {
        return;
    }

    const indice = productos.indexOf(producto);
    productos.splice(indice, 1);
    actualizarCategorias();

    mensaje.textContent = "Producto eliminado correctamente.";

    mostrarProductos(productos);
    mostrarResumen();
}


btnBuscar.addEventListener("click", function() {
    const texto = buscarProducto.value.trim().toLowerCase();
    const resultados = productos.filter(function(producto) {
        return producto.nombre.toLowerCase().includes(texto) ||
               producto.id.toString() === texto;
    });
    mostrarProductos(resultados);
});


btnMostrarTodos.addEventListener("click", function() {
    mostrarProductos(productos);
});


btnStockBajo.addEventListener("click", function() {
    const productosStockBajo = productos.filter(function(producto) {
        return producto.stock < 5;
    });

    mostrarProductos(productosStockBajo);
});

filtroCategoria.addEventListener("change", function() {
    const categoriaSeleccionada = filtroCategoria.value;

    if (categoriaSeleccionada === "") {
        mostrarProductos(productos);
        return;
    }

    const resultados = productos.filter(function(producto) {
        return producto.categoria === categoriaSeleccionada;
    });

    mostrarProductos(resultados);
});


formStock.addEventListener("submit", function(event) {
    event.preventDefault();
    try {
        const id = Number(idStock.value);
        const stock = Number(nuevoStock.value);
        if (Number.isNaN(id) || Number.isNaN(stock)) {
            mensajeStock.textContent = "Ingrese valores numéricos válidos.";
            return;
        }
        if (id <= 0 || stock < 0) {
            mensajeStock.textContent = "Ingrese valores correctos.";
            return;
        }
        const producto = productos.find(function(producto) {
            return producto.id === id;
        });
        if (producto === undefined) {
            mensajeStock.textContent = "Producto no encontrado.";
            return;
        }
        producto.stock = stock;
        mensajeStock.textContent = "Stock actualizado correctamente.";
        mostrarProductos(productos);
        mostrarResumen();

        formStock.reset();

    } catch (error) {
        mensajeStock.textContent = "Ocurrió un error al actualizar el stock.";
    }
});


function mostrarResumen() {
    const cantidadProductos = productos.length;

    const cantidadUnidades = productos.reduce(function(total, producto) {
        return total + producto.stock;
    }, 0);
    const productosStockBajo = productos.filter(function(producto) {
        return producto.stock < 5;
    }).length;
    resumen.innerHTML = `
        <p>Total de productos: ${cantidadProductos}</p>
        <p>Total de unidades: ${cantidadUnidades}</p>
        <p>Productos con stock bajo: ${productosStockBajo}</p>
    `;
}


actualizarCategorias();
mostrarProductos(productos);
mostrarResumen();