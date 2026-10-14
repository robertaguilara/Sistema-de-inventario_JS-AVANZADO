import { Component } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  styleUrl: './topbar.component.css',
  template: `
    <header class="topbar">
      <div>
        <span class="breadcrumb">VELTRIX SYSTEM / INICIO</span>
        <h1>Panel principal</h1>
      </div>

      <div class="user-profile">
        <div class="user-avatar">RA</div>
        <div class="user-info">
          <strong>Administrador</strong>
          <span>Gestión de inventario</span>
        </div>
      </div>
    </header>

    <section class="welcome">
      <div>
        <span class="eyebrow">CENTRO DE CONTROL</span>
        <h2>Bienvenido a VELTRIX SYSTEM</h2>
        <p>
          Administra tus productos y consulta el estado general
          de tu inventario desde un solo lugar.
        </p>
      </div>

      <div class="welcome-decoration">V</div>
    </section>
  `,
})
export class TopbarComponent {}
