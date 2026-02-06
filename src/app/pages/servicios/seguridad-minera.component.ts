import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-seguridad-minera',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <section class="page-hero">
      <div class="container">
        <h1>Seguridad para Operaciones Mineras</h1>
        <p>Protección especializada en zonas de alto riesgo</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h2>Servicios Especializados</h2>
        <p>Contenido en desarrollo...</p>
        <button class="btn btn-primary" (click)="navigateTo('/contacto')">Solicitar Información</button>
      </div>
    </section>
  `,
  styles: [`
    .page-hero { background: var(--dark-primary); padding: 150px 0 80px; color: var(--text-light); text-align: center; }
    .section { padding: 80px 0; text-align: center; }
  `]
})
export class SeguridadMineraComponent {
  constructor(private router: Router) {}
  navigateTo(route: string) { this.router.navigate([route]); }
}
