import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  styleUrl: './dashboard-stats.component.css',
  template: `
    <section class="section-heading">
      <div>
        <h2>Resumen del inventario</h2>
        <p>Indicadores generales del sistema</p>
      </div>
      <span class="demo-label">PANEL DE CONTROL</span>
    </section>

    <section class="stats-grid">
      <article class="stat-card">
        <div class="stat-top">
          <span class="stat-icon blue">▤</span>
          <span class="stat-label">REGISTROS</span>
        </div>
        <h3>{{ totalProductos() }}</h3>
        <p>Productos registrados</p>
      </article>

      <article class="stat-card">
        <div class="stat-top">
          <span class="stat-icon green">▦</span>
          <span class="stat-label">EXISTENCIAS</span>
        </div>
        <h3>{{ totalUnidades() }}</h3>
        <p>Unidades disponibles</p>
      </article>

      <article class="stat-card">
        <div class="stat-top">
          <span class="stat-icon purple">S/</span>
          <span class="stat-label">VALORIZACIÓN</span>
        </div>
        <h3>
          S/ {{ valorInventario().toFixed(2) }}
        </h3>
        <p>Valor referencial del stock</p>
      </article>

      <article class="stat-card">
        <div class="stat-top">
          <span class="stat-icon orange">!</span>
          <span class="stat-label">ATENCIÓN</span>
        </div>
        <h3>{{ productosStockBajo() }}</h3>
        <p>Productos con stock bajo</p>
      </article>
    </section>
  `,
})
export class DashboardStatsComponent {
  totalProductos = input<number>(0);
  totalUnidades = input<number>(0);
  valorInventario = input<number>(0);
  productosStockBajo = input<number>(0);
}
