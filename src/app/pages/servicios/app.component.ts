import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-sinergia-app',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <section class="page-hero">
      <div class="container">
        <h1>App Sinergia (Beta)</h1>
        <p>Seguridad on-demand desde tu dispositivo</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h2>App Móvil</h2>
        <p>
        
        </p>
        <button class="btn btn-primary" (click)="navigateTo('/contacto')">Unirse al Beta</button>
      </div>
    </section>
  `,
  styles: [`
    .page-hero { background: var(--dark-primary); padding: 150px 0 80px; color: var(--text-light); text-align: center; }
    .section { padding: 80px 0; text-align: center; }
  `]
})
export class AppSinergiaComponent {
  constructor(private router: Router) {}
  navigateTo(route: string) { this.router.navigate([route]); }
}
