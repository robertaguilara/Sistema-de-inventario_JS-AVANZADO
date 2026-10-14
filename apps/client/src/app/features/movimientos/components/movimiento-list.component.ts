import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Movimiento, TipoMovimiento } from '@sistema-inventario/types';

@Component({
  selector: 'app-movimiento-list',
  standalone: true,
  imports: [DatePipe],
  styleUrl: './movimiento-list.component.css',
  template: `
    <section class="panel movement-panel" id="movimientos">
      <div class="panel-heading">
        <div>
          <h2>Movimientos de inventario</h2>
          <p>Historial de entradas y salidas registradas en el sistema</p>
        </div>

        <button
          type="button"
          class="btn-registrar-movement"
          (click)="onNuevoMovimiento.emit()"
        >
          + Registrar movimiento
        </button>
      </div>

      <div class="filter-buttons">
        <button
          type="button"
          class="btn-filter"
          [class.active]="filtroActual() === 'todos'"
          (click)="onFiltroChange.emit('todos')"
        >
          Todos
        </button>
        <button
          type="button"
          class="btn-filter"
          [class.active]="filtroActual() === 'entrada'"
          (click)="onFiltroChange.emit('entrada')"
        >
          Entradas
        </button>
        <button
          type="button"
          class="btn-filter"
          [class.active]="filtroActual() === 'salida'"
          (click)="onFiltroChange.emit('salida')"
        >
          Salidas
        </button>
      </div>

      <div class="products-table-wrapper">
        <table class="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Stock resultante</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            @for (movimiento of movimientos(); track movimiento.id || $index) {
              <tr>
                <td class="font-mono text-[#8eb8ff]">#{{ movimiento.id || $index + 1 }}</td>
                <td class="font-medium text-[#f1f5f9]">{{ movimiento.productoNombre }}</td>
                <td>
                  <span [class]="'badge-tipo ' + movimiento.tipo">
                    <span class="badge-dot"></span>
                    {{ movimiento.tipo === 'entrada' ? 'Entrada' : 'Salida' }}
                  </span>
                </td>
                <td class="font-bold text-[#f8fafc]">{{ movimiento.cantidad }} uds.</td>
                <td class="font-mono text-[#94a3b8]">{{ movimiento.stockResultante }} uds.</td>
                <td class="text-xs text-[#8291aa]">{{ movimiento.fecha | date:'medium' }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="text-center py-10 text-[#94a3b8]">
                  No hay movimientos registrados.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class MovimientoListComponent {
  movimientos = input<Movimiento[]>([]);
  filtroActual = input<'todos' | TipoMovimiento>('todos');
  onFiltroChange = output<'todos' | TipoMovimiento>();
  onNuevoMovimiento = output<void>();
}
