
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InventarioService, Movimiento } from './services/inventario';
import { Producto } from './models/producto';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('VELTRIX SYSTEM');

  private readonly inventarioService = inject(InventarioService);

  protected mostrarFormulario = signal(false);
  protected mostrarFormularioMovimiento = signal(false);
  protected mensaje = signal('');
  protected cargando = signal(false);

  protected nuevoProducto = {
    id: 0,
    nombre: '',
    categoria: '',
    precio: 0,
    stock: 0
  };

  protected nuevoMovimiento = {
    productoId: 0,
    tipo: 'entrada' as 'entrada' | 'salida',
    cantidad: 1
  };

  protected readonly productos = signal<Producto[]>([]);
  protected readonly movimientos = signal<Movimiento[]>([]);
  protected readonly busqueda = signal('');
  protected readonly categoriaSeleccionada = signal('Todas');

protected readonly categoriasDisponibles = computed(() => {
  const categorias = this.productos().map(
    (producto) => producto.categoria.trim()
  );

  return [...new Set(categorias)].sort((a, b) =>
    a.localeCompare(b)
  );
});
  protected readonly filtroMovimientos = signal<
    'todos' | 'entrada' | 'salida'
  >('todos');

  
protected readonly productosFiltrados = computed(() => {
  const texto = this.busqueda().trim().toLowerCase();
  const categoria = this.categoriaSeleccionada();

  return this.productos().filter((producto) => {
    const coincideTexto =
      producto.nombre.toLowerCase().includes(texto) ||
      producto.categoria.toLowerCase().includes(texto) ||
      producto.id.toString() === texto;

    const coincideCategoria =
      categoria === 'Todas' ||
      producto.categoria.trim() === categoria;

    return coincideTexto && coincideCategoria;
  });
});


  protected readonly movimientosFiltrados = computed(() => {
    const filtro = this.filtroMovimientos();

    if (filtro === 'todos') {
      return this.movimientos();
    }

    return this.movimientos().filter(
      (movimiento) => movimiento.tipo === filtro
    );
  });

  protected readonly totalProductos = computed(
    () => this.productos().length
  );

  protected readonly totalUnidades = computed(
    () => this.productos().reduce(
      (total, producto) => total + producto.stock,
      0
    )
  );

  protected readonly valorInventario = computed(
    () => this.productos().reduce(
      (total, producto) => total + producto.precio * producto.stock,
      0
    )
  );

  protected readonly productosStockBajo = computed(
    () => this.productos().filter(
      (producto) => producto.stock > 0 && producto.stock < 5
    ).length
  );

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarMovimientos();
  }

  // Cargar productos desde la API REST.
  protected cargarProductos(): void {
    this.cargando.set(true);

    this.inventarioService.listarProductos().subscribe({
      next: (productos) => {
        this.productos.set(productos);
        this.cargando.set(false);
      },
      error: () => {
        this.mensaje.set(
          'No se pudieron cargar los productos. Verifica que la API REST esté funcionando.'
        );
        this.cargando.set(false);
      }
    });
  }

  // Cargar el historial de movimientos.
  protected cargarMovimientos(): void {
    this.inventarioService.listarMovimientos().subscribe({
      next: (movimientos) => {
        this.movimientos.set(
          [...movimientos].sort(
            (a, b) => new Date(b.fecha).getTime() -
              new Date(a.fecha).getTime()
          )
        );
      },
      error: () => {
        this.mensaje.set(
          'No se pudo cargar el historial de movimientos.'
        );
      }
    });
  }

  // Abrir el formulario de registro de productos.
  protected abrirFormulario(): void {
    this.mensaje.set('');
    this.mostrarFormulario.set(true);
  }

  // Abrir el formulario de movimientos.
  protected abrirFormularioMovimiento(): void {
    if (this.productos().length === 0) {
      this.mensaje.set(
        'Primero debes registrar un producto para gestionar su stock.'
      );
      return;
    }

    this.mensaje.set('');
    this.mostrarFormularioMovimiento.set(true);
  }

  // Desplazarse a la sección de movimientos.
  protected irAMovimientos(): void {
    this.abrirFormularioMovimiento();

    document.getElementById('movimientos')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  // Cerrar el formulario de productos.
  protected cancelarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.mensaje.set('');
    this.reiniciarFormulario();
  }

  // Cerrar y restablecer el formulario de movimientos.
  protected cancelarFormularioMovimiento(): void {
    this.mostrarFormularioMovimiento.set(false);
    this.mensaje.set('');
    this.reiniciarFormularioMovimiento();
  }

  // Enviar los datos del formulario de movimientos.
  protected guardarMovimiento(): void {
    this.registrarMovimiento(
      Number(this.nuevoMovimiento.productoId),
      this.nuevoMovimiento.tipo,
      Number(this.nuevoMovimiento.cantidad)
    );
  }

  // Registrar un producto nuevo.
  protected registrarProducto(): void {
    const producto: Producto = {
      ...this.nuevoProducto,
      nombre: this.nuevoProducto.nombre.trim(),
      categoria: this.nuevoProducto.categoria.trim()
    };

    if (!this.inventarioService.validarProducto(producto)) {
      this.mensaje.set(
        'Completa los datos correctamente. El ID y el stock deben ser enteros; el precio debe ser mayor que cero.'
      );
      return;
    }

    const nombreRepetido = this.productos().some(
      (item) =>
        item.nombre.trim().toLowerCase() ===
        producto.nombre.toLowerCase()
    );

    const idRepetido = this.productos().some(
      (item) => item.id === producto.id
    );

    if (nombreRepetido || idRepetido) {
      this.mensaje.set(
        'No se pudo registrar. El ID o el nombre del producto ya existe.'
      );
      return;
    }

    this.cargando.set(true);
    this.mensaje.set('');

    this.inventarioService.crearProducto(producto).subscribe({
      next: (productoRegistrado) => {
        this.productos.update((lista) => [
          ...lista,
          productoRegistrado
        ]);

        this.reiniciarFormulario();
        this.mensaje.set('Producto registrado correctamente.');
        this.mostrarFormulario.set(false);
        this.cargando.set(false);
      },
      error: () => {
        this.mensaje.set(
          'No se pudo registrar el producto. Verifica la conexión con la API REST.'
        );
        this.cargando.set(false);
      }
    });
  }

  // Editar un producto existente.
  protected editarProducto(producto: Producto): void {
    const nombre = prompt(
      'Nuevo nombre del producto:',
      producto.nombre
    );

    if (nombre === null) {
      return;
    }

    const categoria = prompt(
      'Nueva categoría:',
      producto.categoria
    );

    if (categoria === null) {
      return;
    }

    const precioTexto = prompt(
      'Nuevo precio:',
      producto.precio.toString()
    );

    if (precioTexto === null) {
      return;
    }

    const productoActualizado: Producto = {
      ...producto,
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      precio: Number(precioTexto)
    };

    if (!this.inventarioService.validarProducto(productoActualizado)) {
      this.mensaje.set(
        'No se pudo editar. Revisa el nombre, la categoría y el precio.'
      );
      return;
    }

    const nombreRepetido = this.productos().some(
      (item) =>
        item.id !== producto.id &&
        item.nombre.trim().toLowerCase() ===
          productoActualizado.nombre.toLowerCase()
    );

    if (nombreRepetido) {
      this.mensaje.set(
        'Ya existe otro producto con ese nombre.'
      );
      return;
    }

    this.cargando.set(true);
    this.mensaje.set('');

    this.inventarioService.actualizarProducto(
      productoActualizado
    ).subscribe({
      next: (resultado) => {
        this.productos.update((lista) =>
          lista.map((item) =>
            item.id === resultado.id ? resultado : item
          )
        );

        this.mensaje.set('Producto actualizado correctamente.');
        this.cargando.set(false);
      },
      error: () => {
        this.mensaje.set(
          'No se pudo actualizar el producto en la API REST.'
        );
        this.cargando.set(false);
      }
    });
  }

  // Eliminar un producto.
  protected eliminarProducto(producto: Producto): void {
    const confirmar = confirm(
      `¿Deseas eliminar el producto "${producto.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    this.cargando.set(true);
    this.mensaje.set('');

    this.inventarioService.eliminarProductoApi(
      producto.id
    ).subscribe({
      next: () => {
        this.productos.update((lista) =>
          lista.filter((item) => item.id !== producto.id)
        );

        this.mensaje.set('Producto eliminado correctamente.');
        this.cargando.set(false);
      },
      error: () => {
        this.mensaje.set(
          'No se pudo eliminar el producto. Verifica la conexión con la API REST.'
        );
        this.cargando.set(false);
      }
    });
  }

  // Registrar una entrada o salida de stock.
  protected registrarMovimiento(
    productoId: number,
    tipo: 'entrada' | 'salida',
    cantidad: number
    ): void {
    if (this.cargando()) {
      return;
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      this.mensaje.set(
        'La cantidad debe ser un número entero mayor que cero.'
      );
      return;
    }

    const producto = this.productos().find(
      (item) => item.id === productoId
    );

    if (!producto) {
      this.mensaje.set('No se encontró el producto seleccionado.');
      return;
    }

    const nuevoStock = tipo === 'entrada'
      ? producto.stock + cantidad
      : producto.stock - cantidad;

    if (nuevoStock < 0) {
      this.mensaje.set(
        'No hay suficiente stock para realizar esta salida.'
      );
      return;
    }

    const productoActualizado: Producto = {
      ...producto,
      stock: nuevoStock
    };

    const movimiento: Movimiento = {
      productoId: producto.id,
      productoNombre: producto.nombre,
      tipo,
      cantidad,
      stockResultante: nuevoStock,
      fecha: new Date().toISOString()
    };

    this.cargando.set(true);
    this.mensaje.set('');

    this.inventarioService.actualizarProducto(
      productoActualizado
    ).subscribe({
      next: (resultado) => {
        this.productos.update((lista) =>
          lista.map((item) =>
            item.id === resultado.id ? resultado : item
          )
        );

        this.inventarioService.crearMovimiento(
          movimiento
        ).subscribe({
          next: (movimientoRegistrado) => {
            this.movimientos.update((lista) =>
              [movimientoRegistrado, ...lista]
            );

            this.mensaje.set(
              `Movimiento registrado. Stock actual: ${nuevoStock} unidades.`
            );

            this.mostrarFormularioMovimiento.set(false);
            this.reiniciarFormularioMovimiento();
            this.cargando.set(false);
          },
          error: () => {
            this.mensaje.set(
              'El stock se actualizó, pero no se pudo guardar el movimiento. Revisa el historial.'
            );
            this.cargando.set(false);
            this.cargarMovimientos();
          }
        });
      },
      error: () => {
        this.mensaje.set(
          'No se pudo actualizar el stock en la API REST.'
        );
        this.cargando.set(false);
      }
    });
  }

  // Restablecer los campos del formulario de productos.
  private reiniciarFormulario(): void {
    this.nuevoProducto = {
      id: 0,
      nombre: '',
      categoria: '',
      precio: 0,
      stock: 0
    };
  }

  // Restablecer los campos del formulario de movimientos.
  private reiniciarFormularioMovimiento(): void {
    this.nuevoMovimiento = {
      productoId: 0,
      tipo: 'entrada',
      cantidad: 1
    };
  }
}
