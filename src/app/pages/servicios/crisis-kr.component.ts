import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-crisis-kr',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <section class="page-hero">
      <div class="container">
        <h1>Gestión de Crisis K&R</h1>
        <p>Protocolo especializado con cobertura hasta $3M USD</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h2>Servicios K&R</h2>
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
export class CrisisKRComponent {
  constructor(private router: Router) {}
  navigateTo(route: string) { this.router.navigate([route]); }
}
