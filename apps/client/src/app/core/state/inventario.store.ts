import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { InventarioService } from '../../services/inventario';
import { Producto, Movimiento, TipoMovimiento } from '@sistema-inventario/types';
import { CrearProductoSchema, RegistrarMovimientoDtoSchema } from '@sistema-inventario/contracts';

interface InventarioState {
  productos: Producto[];
  movimientos: Movimiento[];
  cargando: boolean;
  mensaje: string;
  tipoMensaje: 'exito' | 'error' | '';
  busqueda: string;
  categoriaSeleccionada: string;
  filtroMovimientos: 'todos' | TipoMovimiento;
  modalProductoAbierto: boolean;
  modalMovimientoAbierto: boolean;
}

const initialState: InventarioState = {
  productos: [],
  movimientos: [],
  cargando: false,
  mensaje: '',
  tipoMensaje: '',
  busqueda: '',
  categoriaSeleccionada: 'Todas',
  filtroMovimientos: 'todos',
  modalProductoAbierto: false,
  modalMovimientoAbierto: false,
};

export const InventarioStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ productos, movimientos, busqueda, categoriaSeleccionada, filtroMovimientos }) => ({
    totalProductos: computed(() => productos().length),
    totalUnidades: computed(() => productos().reduce((acc, p) => acc + p.stock, 0)),
    valorInventario: computed(() => productos().reduce((acc, p) => acc + p.precio * p.stock, 0)),
    productosStockBajo: computed(() => productos().filter((p) => p.stock > 0 && p.stock < 5).length),
    productosSinStock: computed(() => productos().filter((p) => p.stock === 0).length),
    categoriasDisponibles: computed(() => {
      const cats = productos().map((p) => p.categoria.trim());
      return [...new Set(cats)].sort((a, b) => a.localeCompare(b));
    }),
    productosFiltrados: computed(() => {
      const q = busqueda().trim().toLowerCase();
      const cat = categoriaSeleccionada();

      return productos().filter((p) => {
        const coincideTexto =
          p.nombre.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q) ||
          p.id.toString() === q;
        const coincideCat = cat === 'Todas' || p.categoria.trim() === cat;
        return coincideTexto && coincideCat;
      });
    }),
    movimientosFiltrados: computed(() => {
      const filtro = filtroMovimientos();
      if (filtro === 'todos') return movimientos();
      return movimientos().filter((m) => m.tipo === filtro);
    }),
  })),
  withMethods((store, inventarioService = inject(InventarioService)) => ({
    setBusqueda(busqueda: string): void {
      patchState(store, { busqueda });
    },
    setCategoriaSeleccionada(categoriaSeleccionada: string): void {
      patchState(store, { categoriaSeleccionada });
    },
    setFiltroMovimientos(filtroMovimientos: 'todos' | TipoMovimiento): void {
      patchState(store, { filtroMovimientos });
    },
    abrirModalProducto(): void {
      patchState(store, { modalProductoAbierto: true, mensaje: '', tipoMensaje: '' });
    },
    cerrarModalProducto(): void {
      patchState(store, { modalProductoAbierto: false });
    },
    abrirModalMovimiento(): void {
      if (store.productos().length === 0) {
        patchState(store, {
          mensaje: 'Primero debes registrar un producto para gestionar su stock.',
          tipoMensaje: 'error',
        });
        return;
      }
      patchState(store, { modalMovimientoAbierto: true, mensaje: '', tipoMensaje: '' });
    },
    cerrarModalMovimiento(): void {
      patchState(store, { modalMovimientoAbierto: false });
    },
    limpiarMensaje(): void {
      patchState(store, { mensaje: '', tipoMensaje: '' });
    },
    cargarDatos(): void {
      patchState(store, { cargando: true });
      inventarioService.listarProductos().subscribe({
        next: (productos) => {
          patchState(store, { productos, cargando: false });
        },
        error: () => {
          patchState(store, {
            cargando: false,
            mensaje: 'No se pudieron cargar los productos. Verifica que la API esté activa.',
            tipoMensaje: 'error',
          });
        },
      });

      inventarioService.listarMovimientos().subscribe({
        next: (movimientos) => {
          const ordenados = [...movimientos].sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );
          patchState(store, { movimientos: ordenados });
        },
        error: () => {
          patchState(store, {
            mensaje: 'No se pudo cargar el historial de movimientos.',
            tipoMensaje: 'error',
          });
        },
      });
    },
    crearProducto(producto: Producto): boolean {
      const validacion = CrearProductoSchema.safeParse(producto);
      if (!validacion.success) {
        patchState(store, {
          mensaje: validacion.error.issues[0]?.message || 'Datos del producto inválidos',
          tipoMensaje: 'error',
        });
        return false;
      }

      const existeId = store.productos().some((p) => p.id === producto.id);
      const existeNombre = store
        .productos()
        .some((p) => p.nombre.toLowerCase() === producto.nombre.toLowerCase());

      if (existeId || existeNombre) {
        patchState(store, {
          mensaje: 'El ID o el nombre del producto ya existen.',
          tipoMensaje: 'error',
        });
        return false;
      }

      patchState(store, { cargando: true });
      inventarioService.crearProducto(producto).subscribe({
        next: (nuevo) => {
          patchState(store, {
            productos: [...store.productos(), nuevo],
            cargando: false,
            modalProductoAbierto: false,
            mensaje: 'Producto registrado exitosamente.',
            tipoMensaje: 'exito',
          });
        },
        error: () => {
          patchState(store, {
            cargando: false,
            mensaje: 'Error al registrar el producto en el servidor.',
            tipoMensaje: 'error',
          });
        },
      });
      return true;
    },
    actualizarProducto(producto: Producto): void {
      patchState(store, { cargando: true });
      inventarioService.actualizarProducto(producto).subscribe({
        next: (actualizado) => {
          patchState(store, {
            productos: store.productos().map((p) => (p.id === actualizado.id ? actualizado : p)),
            cargando: false,
            mensaje: 'Producto actualizado exitosamente.',
            tipoMensaje: 'exito',
          });
        },
        error: () => {
          patchState(store, {
            cargando: false,
            mensaje: 'Error al actualizar el producto.',
            tipoMensaje: 'error',
          });
        },
      });
    },
    eliminarProducto(id: number): void {
      patchState(store, { cargando: true });
      inventarioService.eliminarProductoApi(id).subscribe({
        next: () => {
          patchState(store, {
            productos: store.productos().filter((p) => p.id !== id),
            cargando: false,
            mensaje: 'Producto eliminado correctamente.',
            tipoMensaje: 'exito',
          });
        },
        error: () => {
          patchState(store, {
            cargando: false,
            mensaje: 'No se pudo eliminar el producto.',
            tipoMensaje: 'error',
          });
        },
      });
    },
    registrarMovimiento(productoId: number, tipo: TipoMovimiento, cantidad: number): boolean {
      const validacion = RegistrarMovimientoDtoSchema.safeParse({ productoId, tipo, cantidad });
      if (!validacion.success) {
        patchState(store, {
          mensaje: validacion.error.issues[0]?.message || 'Datos del movimiento inválidos',
          tipoMensaje: 'error',
        });
        return false;
      }

      const producto = store.productos().find((p) => p.id === productoId);
      if (!producto) {
        patchState(store, { mensaje: 'Producto no encontrado.', tipoMensaje: 'error' });
        return false;
      }

      const nuevoStock = tipo === 'entrada' ? producto.stock + cantidad : producto.stock - cantidad;
      if (nuevoStock < 0) {
        patchState(store, {
          mensaje: 'Stock insuficiente para procesar la salida.',
          tipoMensaje: 'error',
        });
        return false;
      }

      patchState(store, { cargando: true });
      const productoActualizado: Producto = { ...producto, stock: nuevoStock };
      const nuevoMovimiento: Movimiento = {
        productoId: producto.id,
        productoNombre: producto.nombre,
        tipo,
        cantidad,
        stockResultante: nuevoStock,
        fecha: new Date().toISOString(),
      };

      inventarioService.actualizarProducto(productoActualizado).subscribe({
        next: (prodGuardado) => {
          patchState(store, {
            productos: store.productos().map((p) => (p.id === prodGuardado.id ? prodGuardado : p)),
          });

          inventarioService.crearMovimiento(nuevoMovimiento).subscribe({
            next: (movGuardado) => {
              patchState(store, {
                movimientos: [movGuardado, ...store.movimientos()],
                modalMovimientoAbierto: false,
                cargando: false,
                mensaje: `Movimiento registrado: ${tipo.toUpperCase()} de ${cantidad} unidades. Stock restante: ${nuevoStock}.`,
                tipoMensaje: 'exito',
              });
            },
            error: () => {
              patchState(store, {
                cargando: false,
                mensaje: 'Stock actualizado pero ocurrió un error guardando el movimiento.',
                tipoMensaje: 'error',
              });
            },
          });
        },
        error: () => {
          patchState(store, {
            cargando: false,
            mensaje: 'Error al actualizar el stock en el servidor.',
            tipoMensaje: 'error',
          });
        },
      });

      return true;
    },
  }))
);
