import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent 
  },
  {
    path: 'servicios/proteccion-ejecutiva',
    loadComponent: () => import('./pages/servicios/proteccion-ejecutiva.component').then(m => m.ProteccionEjecutivaComponent)
  },
  {
    path: 'servicios/seguridad-minera',
    loadComponent: () => import('./pages/servicios/seguridad-minera.component').then(m => m.SeguridadMineraComponent)
  },
  {
    path: 'servicios/transporte-valores',
    loadComponent: () => import('./pages/servicios/transporte-valores.component').then(m => m.TransporteValoresComponent)
  },
  {
    path: 'servicios/crisis-kr',
    loadComponent: () => import('./pages/servicios/crisis-kr.component').then(m => m.CrisisKRComponent)
  },
  {
    path: 'servicios/academy',
    loadComponent: () => import('./pages/servicios/academy.component').then(m => m.AcademyComponent)
  },
  {
    path: 'servicios/app',
    loadComponent: () => import('./pages/servicios/app.component').then(m => m.AppSinergiaComponent)
  },
  {
    path: 'empresa',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'cobertura',
    loadComponent: () => import('./pages/coverage/coverage.component').then(m => m.CoverageComponent)
  },
  {
    path: 'casos',
    loadComponent: () => import('./pages/cases/cases.component').then(m => m.CasesComponent)
  },
  {
    path: 'equipo',
    loadComponent: () => import('./pages/team/team.component').then(m => m.TeamComponent)
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
