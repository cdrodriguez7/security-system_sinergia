import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-coverage',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <section class="page-hero">
      <div class="container">
        <h1>Cobertura Nacional</h1>
        <p>Presencia en las 24 provincias del Ecuador</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h2>Zonas de Operación</h2>
        <p>Contenido en desarrollo...</p>
        <button class="btn btn-primary" (click)="navigateTo('/contacto')">Consultar Cobertura</button>
      </div>
    </section>
  `,
  styles: [`
    .page-hero { background: var(--dark-primary); padding: 150px 0 80px; color: var(--text-light); text-align: center; }
    .section { padding: 80px 0; text-align: center; }
  `]
})
export class CoverageComponent {
  constructor(private router: Router) {}
  navigateTo(route: string) { this.router.navigate([route]); }
}
