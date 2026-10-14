import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '@sistema-inventario/types';

@Component({
  selector: 'app-producto-modal',
  standalone: true,
  imports: [FormsModule],
  styleUrl: '../../../shared/components/modal-form.css',
  template: `
    <div class="modal-overlay">
      <div class="modal-box">
        <div class="modal-header">
          <h3>Registrar nuevo producto</h3>
          <button (click)="onCerrar.emit()" class="modal-close">✕</button>
        </div>

        <form (ngSubmit)="enviar()">
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label>ID del producto</label>
              <input
                type="number"
                [(ngModel)]="modelo.id"
                name="id"
                required
                min="1"
                placeholder="Ej. 101"
              />
            </div>
            <div class="form-group">
              <label>Stock inicial</label>
              <input
                type="number"
                [(ngModel)]="modelo.stock"
                name="stock"
                required
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Nombre</label>
            <input
              type="text"
              [(ngModel)]="modelo.nombre"
              name="nombre"
              required
              placeholder="Ej. Teclado mecánico"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label>Categoría</label>
              <input
                type="text"
                [(ngModel)]="modelo.categoria"
                name="categoria"
                required
                placeholder="Ej. Periféricos"
              />
            </div>
            <div class="form-group">
              <label>Precio (S/)</label>
              <input
                type="number"
                step="0.01"
                [(ngModel)]="modelo.precio"
                name="precio"
                required
                min="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="onCerrar.emit()">
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              Guardar producto
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ProductoModalComponent {
  onCerrar = output<void>();
  onGuardar = output<Producto>();

  modelo: Producto = {
    id: 0,
    nombre: '',
    categoria: '',
    precio: 0,
    stock: 0,
  };

  enviar(): void {
    this.onGuardar.emit({
      ...this.modelo,
      nombre: this.modelo.nombre.trim(),
      categoria: this.modelo.categoria.trim(),
      precio: Number(this.modelo.precio),
      stock: Number(this.modelo.stock),
      id: Number(this.modelo.id),
    });
  }
}
