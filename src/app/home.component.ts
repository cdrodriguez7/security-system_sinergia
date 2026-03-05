import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { ServiceCardComponent } from './components/service-card/service-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    ServiceCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  showCtaBand: boolean = true;
  isBandMinimized: boolean = false;
  isFloatExpanded: boolean = false; // ← AGREGADO

  
  services = [
    {
      title: 'Protección Ejecutiva',
      description: 'Seguridad personalizada 24/7 para autoridades, funcionarios públicos y ejecutivos de alto nivel con protocolos certificados internacionalmente.',
      features: [
        'Close protection 24/7',
        'Análisis de amenazas en tiempo real',
        'Coordinación con autoridades',
        'Equipos tácticos especializados'
      ],
      imageUrl: 'https://spyt.com.mx/wp-content/uploads/2024/09/bodyguard-in-sunglasses-opening-car-door-to-businessman.jpg',
      route: '/servicios/proteccion-ejecutiva'
    },
    {
      title: 'Seguridad Minera',
      description: 'Protección especializada para operaciones mineras y energéticas en zonas de alto riesgo con equipos tácticos y vigilancia perimetral.',
      features: [
        'Vigilancia perimetral 24/7',
        'Escolta especializada de personal',
        'Respuesta rápida a emergencias',
        'Protección de instalaciones críticas'
      ],
      imageUrl: 'https://revistainnovacion.com/uploads/thumb_admin/images/0004/minas.jpg',
      route: '/servicios/seguridad-minera'
    },
    {
      title: 'Transporte de Valores',
      description: 'Movilidad segura y transporte de carga valiosa con vehículos blindados, rastreo GPS satelital y comunicaciones encriptadas.',
      features: [
        'Vehículos blindados B6',
        'Rastreo GPS en tiempo real',
        'Convoy táctico especializado',
        'Rutas seguras predefinidas'
      ],
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKT79t1bMQBNgU7jDnKWiHK2h5u9rl44mJ4w&s',
      route: '/servicios/transporte-valores'
    },
    {
      title: 'Gestión Crisis K&R',
      description: 'Protocolo especializado para situaciones de secuestro y extorsión con cobertura aseguradora de hasta $3M USD y sala de crisis 24/7.',
      features: [
        'Cobertura hasta $3M USD',
        'Negociación profesional',
        'Sala de crisis operativa 24/7',
        'Coordinación con aseguradoras'
      ],
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWCAtGQ1nlwQZVRNK191jgPAGDLqftC3t24w&s',
      route: '/servicios/crisis-kr'
    },
    {
      title: 'Sinergia Academy',
      description: 'Capacitación especializada en protección ejecutiva, conducción táctica y gestión de crisis para equipos corporativos e institucionales.',
      features: [
        'Instructores certificados internacionalmente',
        'Cursos teórico-prácticos',
        'Certificación internacional',
        'Entrenamiento personalizado'
      ],
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn2Zl8JD8YzEcYgetlKrtDTwn7kZfEpsKYBA&s',
      route: '/servicios/academy'
    },
    {
      title: 'App Sinergia',
      description: 'Plataforma digital para solicitar protección on-demand con rastreo GPS, comunicación directa 24/7 y gestión de servicios en tiempo real.',
      features: [
        'Solicitud inmediata de protección',
        'Geolocalización en tiempo real',
        'Comunicación directa con central',
        'Historial completo de servicios'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
      route: '/servicios/app'
    }
  ];

  stats = [
    { number: '14+', label: 'Años de Experiencia', icon: '🛡️' },
    { number: '75+', label: 'Especialistas', icon: '👥' },
    { number: '850+', label: 'Clientes Protegidos', icon: '✅' },
    { number: '$3M', label: 'Cobertura K&R', icon: '💼' }
  ];

  aboutData = {
    years: 14,
    clients: 850,
    operations: 12000,
    coverage: '24/24'
  };

  coverageData = [
    { province: 'Guayaquil', operations: 4500, percentage: 35 },
    { province: 'Zamora', operations: 3200, percentage: 25 },
    { province: 'Quito', operations: 2800, percentage: 22 },
    { province: 'Cuenca', operations: 1200, percentage: 9 }
  ];

  testimonials = [
    {
      text: 'Sinergia Security nos ha brindado tranquilidad absoluta en nuestras operaciones mineras. Su profesionalismo y respuesta rápida ante incidentes críticos ha sido impecable.',
      author: 'Carlos M.',
      position: 'Director de Seguridad',
      company: 'Empresa Minera - Zamora',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
    },
    {
      text: 'La protección ejecutiva que recibí durante mi gestión como funcionario público superó todas las expectativas. El equipo de Sinergia es discreto, profesional y altamente capacitado.',
      author: 'María G.',
      position: 'Ex-Viceministra',
      company: 'Gobierno del Ecuador',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
    },
    {
      text: 'Después de un intento de extorsión, Sinergia nos proporcionó un protocolo K&R completo. Su manejo de la crisis fue profesional y la resolución exitosa. Los recomiendo ampliamente.',
      author: 'Roberto P.',
      position: 'CEO',
      company: 'Empresa Importadora',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
    }
  ];

  teamMembers = [
    {
      name: 'Crnl. (r) Eduardo Mora',
      position: 'Director General',
      experience: '25 años en Fuerzas Especiales',
      certifications: ['Close Protection International', 'Crisis Management', 'Tactical Operations'],
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop'
    },
    {
      name: 'Lcdo. Marco Vélez',
      position: 'Director de Operaciones',
      experience: '18 años en seguridad corporativa',
      certifications: ['K&R Specialist', 'Risk Assessment', 'Executive Protection'],
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop'
    },
    {
      name: 'Dra. Patricia Sánchez',
      position: 'Coordinadora de Crisis',
      experience: '15 años en gestión de riesgos',
      certifications: ['Crisis Negotiation', 'Psychology', 'Emergency Management'],
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
    },
    {
      name: 'Sgto. (r) Luis Andrade',
      position: 'Jefe de Operaciones Tácticas',
      experience: '20 años en GIR',
      certifications: ['Tactical Response', 'Firearms Instructor', 'Defense Tactics'],
      image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop'
    }
  ];

  
  constructor(private router: Router) {}

  // Métodos para CTA Band
  closeBand(): void {
    this.showCtaBand = false;
  }

  toggleBand(): void {
    this.isBandMinimized = !this.isBandMinimized;
  }

  // Métodos para CTA Float
  expandFloat(): void {
    this.isFloatExpanded = true;
  }

  collapseFloat(): void {
    this.isFloatExpanded = false;
  }

  // Navegación
  navigateTo(route: string) {
    this.router.navigate([route]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}