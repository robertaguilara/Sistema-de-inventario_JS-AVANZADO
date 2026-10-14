import { Component, inject, OnInit } from '@angular/core';
import { InventarioStore } from './core/state/inventario.store';
import { SidebarComponent } from './features/sidebar/components/sidebar.component';
import { TopbarComponent } from './features/topbar/components/topbar.component';
import { DashboardStatsComponent } from './features/dashboard/components/dashboard-stats.component';
import { CategoriesComponent } from './features/categories/components/categories.component';
import { ProductoListComponent } from './features/productos/components/producto-list.component';
import { ProductoModalComponent } from './features/productos/components/producto-modal.component';
import { MovimientoListComponent } from './features/movimientos/components/movimiento-list.component';
import { MovimientoModalComponent } from './features/movimientos/components/movimiento-modal.component';
import { AlertComponent } from './shared/components/alert.component';
import { Producto, TipoMovimiento } from '@sistema-inventario/types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SidebarComponent,
    TopbarComponent,
    DashboardStatsComponent,
    CategoriesComponent,
    ProductoListComponent,
    ProductoModalComponent,
    MovimientoListComponent,
    MovimientoModalComponent,
    AlertComponent,
  ],
  styleUrl: './app.css',
  template: `
    <div class="app-container">
      <!-- Barra lateral fija original -->
      <app-sidebar />

      <!-- Contenido Principal -->
      <main class="main-content">
        <!-- Topbar y Banner de Bienvenida -->
        <app-topbar />

        <!-- Mensajes del Sistema -->
        <app-alert
          [mensaje]="store.mensaje()"
          [tipo]="store.tipoMensaje()"
          (onCerrar)="store.limpiarMensaje()"
        />

        <!-- Resumen del inventario (Tarjetas) -->
        <app-dashboard-stats
          [totalProductos]="store.totalProductos()"
          [totalUnidades]="store.totalUnidades()"
          [valorInventario]="store.valorInventario()"
          [productosStockBajo]="store.productosStockBajo()"
        />

        <!-- Categorías -->
        <app-categories
          [productos]="store.productos()"
          [categorias]="store.categoriasDisponibles()"
          [categoriaSeleccionada]="store.categoriaSeleccionada()"
          (onSelectCategoria)="store.setCategoriaSeleccionada($event)"
        />

        <!-- Catálogo de Productos -->
        <app-producto-list
          [productos]="store.productosFiltrados()"
          [busqueda]="store.busqueda()"
          (onBusquedaChange)="store.setBusqueda($event)"
          (onNuevoProducto)="store.abrirModalProducto()"
          (onEditar)="onEditarProducto($event)"
          (onEliminar)="store.eliminarProducto($event)"
        />

        <!-- Historial de Movimientos -->
        <app-movimiento-list
          [movimientos]="store.movimientosFiltrados()"
          [filtroActual]="store.filtroMovimientos()"
          (onFiltroChange)="store.setFiltroMovimientos($event)"
          (onNuevoMovimiento)="store.abrirModalMovimiento()"
        />

        <!-- Paneles de Acciones Rápidas y Estado del Sistema -->
        <section class="bottom-grid">
          <div class="panel">
            <div class="panel-heading">
              <div>
                <h2>Acciones rápidas</h2>
                <p>Accesos directos a las operaciones frecuentes</p>
              </div>
            </div>

            <button type="button" class="action-card" (click)="store.abrirModalProducto()">
              <span class="action-icon">▤</span>
              <div>
                <strong>Registrar producto</strong>
                <small>Añadir un nuevo ítem al catálogo</small>
              </div>
            </button>

            <button type="button" class="action-card" (click)="store.abrirModalMovimiento()">
              <span class="action-icon movement">⇄</span>
              <div>
                <strong>Gestionar stock</strong>
                <small>Registrar entrada o salida de inventario</small>
              </div>
            </button>
          </div>

          <div class="panel">
            <div class="panel-heading">
              <div>
                <h2>Estado del sistema</h2>
                <p>Verificación de módulos en tiempo real</p>
              </div>
            </div>

            <div class="status-row">
              <span class="status-check">✓</span>
              <span>API REST (db.json)</span>
              <strong class="ml-auto text-[#64dcb0]">OPERATIVO</strong>
            </div>

            <div class="status-row">
              <span class="status-check">✓</span>
              <span>Estado Reactivo (SignalStore)</span>
              <strong class="ml-auto text-[#64dcb0]">ACTIVO</strong>
            </div>

            <div class="status-row">
              <span class="status-check">✓</span>
              <span>Validaciones de Contrato (Zod)</span>
              <strong class="ml-auto text-[#64dcb0]">SINCRONIZADO</strong>
            </div>

            <div class="status-note">
              <strong class="text-[#9fc2ff] text-xs">Información</strong>
              <p class="text-[#a8b7ce] text-xs mt-1">
                Arquitectura híbrida modularizada con componentes desacoplados y Tailwind CSS.
              </p>
            </div>
          </div>
        </section>

        <!-- Pie de página original -->
        <footer class="footer">
          <span>VELTRIX SYSTEM © 2026</span>
          <span>Desarrollado con Angular, Tailwind CSS y SignalStore</span>
        </footer>
      </main>

      <!-- Modal de Producto -->
      @if (store.modalProductoAbierto()) {
        <app-producto-modal
          (onCerrar)="store.cerrarModalProducto()"
          (onGuardar)="store.crearProducto($event)"
        />
      }

      <!-- Modal de Movimiento -->
      @if (store.modalMovimientoAbierto()) {
        <app-movimiento-modal
          [productos]="store.productos()"
          (onCerrar)="store.cerrarModalMovimiento()"
          (onGuardar)="onRegistrarMovimiento($event)"
        />
      }
    </div>
  `,
})
export class App implements OnInit {
  protected readonly store = inject(InventarioStore);

  ngOnInit(): void {
    this.store.cargarDatos();
  }

  protected onEditarProducto(producto: Producto): void {
    const nombre = prompt('Nuevo nombre del producto:', producto.nombre);
    if (nombre === null) return;

    const categoria = prompt('Nueva categoría:', producto.categoria);
    if (categoria === null) return;

    const precioTexto = prompt('Nuevo precio (S/):', producto.precio.toString());
    if (precioTexto === null) return;

    const precio = Number(precioTexto);
    if (isNaN(precio) || precio <= 0) {
      alert('Precio inválido');
      return;
    }

    this.store.actualizarProducto({
      ...producto,
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      precio,
    });
  }

  protected onRegistrarMovimiento(datos: {
    productoId: number;
    tipo: TipoMovimiento;
    cantidad: number;
  }): void {
    this.store.registrarMovimiento(datos.productoId, datos.tipo, datos.cantidad);
  }
}
