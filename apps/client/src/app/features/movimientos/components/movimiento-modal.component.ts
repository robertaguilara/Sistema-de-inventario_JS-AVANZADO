import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto, TipoMovimiento } from '@sistema-inventario/types';

@Component({
  selector: 'app-movimiento-modal',
  standalone: true,
  imports: [FormsModule],
  styleUrl: '../../../shared/components/modal-form.css',
  template: `
    <div class="modal-overlay">
      <div class="modal-box">
        <div class="modal-header">
          <h3>Registrar movimiento de stock</h3>
          <button (click)="onCerrar.emit()" class="modal-close">✕</button>
        </div>

        <form (ngSubmit)="enviar()">
          <div class="form-group">
            <label>Producto</label>
            <select [(ngModel)]="productoId" name="productoId" required>
              <option [ngValue]="0" disabled selected>Selecciona un producto...</option>
              @for (p of productos(); track p.id) {
                <option [ngValue]="p.id">
                  #{{ p.id }} - {{ p.nombre }} (Stock: {{ p.stock }} uds.)
                </option>
              }
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label>Tipo de movimiento</label>
              <select [(ngModel)]="tipo" name="tipo">
                <option value="entrada">Entrada (Abastecimiento)</option>
                <option value="salida">Salida (Venta / Retiro)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Cantidad (uds.)</label>
              <input
                type="number"
                min="1"
                [(ngModel)]="cantidad"
                name="cantidad"
                required
                placeholder="1"
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="onCerrar.emit()">
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              Guardar movimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class MovimientoModalComponent {
  productos = input<Producto[]>([]);
  onCerrar = output<void>();
  onGuardar = output<{ productoId: number; tipo: TipoMovimiento; cantidad: number }>();

  productoId = 0;
  tipo: TipoMovimiento = 'entrada';
  cantidad = 1;

  enviar(): void {
    this.onGuardar.emit({
      productoId: Number(this.productoId),
      tipo: this.tipo,
      cantidad: Number(this.cantidad),
    });
  }
}
