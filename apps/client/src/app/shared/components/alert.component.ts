import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  styleUrl: './alert.component.css',
  template: `
    @if (mensaje()) {
      <div [class]="'alert-container ' + (tipo() === 'error' ? 'alert-error' : 'alert-exito')">
        <div class="flex items-center gap-2">
          <span class="text-lg">{{ tipo() === 'error' ? '⚠️' : '✅' }}</span>
          <span>{{ mensaje() }}</span>
        </div>
        <button
          type="button"
          (click)="onCerrar.emit()"
          class="alert-btn-close"
        >
          ✕
        </button>
      </div>
    }
  `,
})
export class AlertComponent {
  mensaje = input<string>('');
  tipo = input<'exito' | 'error' | ''>('');
  onCerrar = output<void>();
}
