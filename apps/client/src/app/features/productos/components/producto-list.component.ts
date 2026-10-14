import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '@sistema-inventario/types';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [FormsModule],
  styleUrl: './producto-list.component.css',
  template: `
    <section class="panel products-panel" id="productos">
      <div class="panel-heading">
        <div>
          <h2>Lista de productos</h2>
          <p>Consulta, busca y gestiona los productos del inventario</p>
        </div>

        <button
          type="button"
          class="btn-registrar-header"
          (click)="onNuevoProducto.emit()"
        >
          + Registrar producto
        </button>
      </div>

      <div class="products-toolbar">
        <div class="search-container">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar producto por nombre, categoría o ID..."
            [ngModel]="busqueda()"
            (ngModelChange)="onBusquedaChange.emit($event)"
          />
        </div>
      </div>

      <div class="products-table-wrapper">
        <table class="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (producto of productos(); track producto.id) {
              <tr>
                <td class="font-mono font-bold text-[#8eb8ff]">#{{ producto.id }}</td>
                <td class="font-medium text-[#f1f5f9]">{{ producto.nombre }}</td>
                <td>
                  <span class="py-1 px-2.5 rounded-md bg-[#162237] border border-[#2a3850] text-xs text-[#94a3b8]">
                    {{ producto.categoria }}
                  </span>
                </td>
                <td class="font-semibold text-[#f8fafc]">S/ {{ producto.precio.toFixed(2) }}</td>
                <td>
                  <span [class]="obtenerPillStock(producto.stock)">
                    <span class="stock-dot"></span>
                    {{ producto.stock }} uds.
                  </span>
                </td>
                <td>
                  <div class="flex gap-2">
                    <button
                      type="button"
                      class="btn-accion-editar"
                      (click)="onEditar.emit(producto)"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      class="btn-accion-eliminar"
                      (click)="onEliminar.emit(producto.id)"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="text-center py-10 text-[#94a3b8]">
                  No se encontraron productos disponibles.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class ProductoListComponent {
  productos = input<Producto[]>([]);
  busqueda = input<string>('');
  onBusquedaChange = output<string>();
  onNuevoProducto = output<void>();
  onEditar = output<Producto>();
  onEliminar = output<number>();

  protected obtenerPillStock(stock: number): string {
    if (stock === 0) return 'stock-pill cero';
    if (stock < 5) return 'stock-pill bajo';
    return 'stock-pill normal';
  }
}
