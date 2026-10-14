import { Component, input, output } from '@angular/core';
import { Producto } from '@sistema-inventario/types';

@Component({
  selector: 'app-categories',
  standalone: true,
  styleUrl: './categories.component.css',
  template: `
    <section class="categories-panel" id="categorias">
      <div class="section-heading">
        <div>
          <h2>Categorías de productos</h2>
          <p>Selecciona una categoría para filtrar el inventario.</p>
        </div>
      </div>

      <div class="categories-grid">
        <button
          type="button"
          class="category-card"
          [class.active]="categoriaSeleccionada() === 'Todas'"
          (click)="onSelectCategoria.emit('Todas')"
        >
          <span class="category-name">Todas</span>
          <span class="category-count">{{ productos().length }} productos</span>
        </button>

        @for (categoria of categorias(); track categoria) {
          <button
            type="button"
            class="category-card"
            [class.active]="categoriaSeleccionada() === categoria"
            (click)="onSelectCategoria.emit(categoria)"
          >
            <span class="category-name">{{ categoria }}</span>
            <span class="category-count">
              {{ contarPorCategoria(categoria) }} productos
            </span>
          </button>
        }
      </div>
    </section>
  `,
})
export class CategoriesComponent {
  productos = input<Producto[]>([]);
  categorias = input<string[]>([]);
  categoriaSeleccionada = input<string>('Todas');
  onSelectCategoria = output<string>();

  protected contarPorCategoria(cat: string): number {
    return this.productos().filter((p) => p.categoria.trim() === cat).length;
  }
}
