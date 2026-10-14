import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  styleUrl: './sidebar.component.css',
  template: `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">V</div>
        <div>
          <h2>VELTRIX</h2>
          <span>SYSTEM</span>
        </div>
      </div>

      <div class="menu-title">MENÚ PRINCIPAL</div>

      <nav class="menu">
        <a href="#" class="menu-item active">
          <span class="menu-icon">▦</span>
          <span>Panel principal</span>
        </a>

        <a href="#productos" class="menu-item">
          <span class="menu-icon">▤</span>
          <span>Productos</span>
        </a>

        <a href="#movimientos" class="menu-item">
          <span class="menu-icon">⇄</span>
          <span>Movimientos</span>
        </a>

        <a href="#categorias" class="menu-item">
          <span class="menu-icon">▧</span>
          <span>Categorías</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <span class="status-dot"></span>
        Sistema de inventario
        <small>Versión Angular</small>
      </div>
    </aside>
  `,
})
export class SidebarComponent {}
