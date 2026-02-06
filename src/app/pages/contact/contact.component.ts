import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <section class="page-hero">
      <div class="container">
        <h1>Contacto</h1>
        <p>Estamos disponibles 24/7 para emergencias</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h2>Formulario de Contacto</h2>
        <p>Contenido en desarrollo...</p>
        <div style="margin-top: 30px;">
          <a href="tel:+593999999999" class="btn btn-primary">📞 Llamar Ahora</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-hero { background: var(--dark-primary); padding: 150px 0 80px; color: var(--text-light); text-align: center; }
    .section { padding: 80px 0; text-align: center; }
  `]
})
export class ContactComponent {
  constructor(private router: Router) {}
  navigateTo(route: string) { this.router.navigate([route]); }
}
