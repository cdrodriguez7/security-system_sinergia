import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-proteccion-ejecutiva',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <section class="page-hero">
      <div class="container">
        <div class="breadcrumb">
          <a (click)="navigateTo('/')">Inicio</a>
          <span>/</span>
          <a (click)="navigateTo('/')">Servicios</a>
          <span>/</span>
          <span>Protección Ejecutiva</span>
        </div>
        <h1>Protección Ejecutiva de Alto Nivel</h1>
        <p class="hero-description">
          Seguridad personalizada 24/7 para autoridades, funcionarios públicos y ejecutivos 
          con protocolos certificados internacionalmente
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="service-intro">
          <h2>¿Qué Incluye Nuestro Servicio?</h2>
          <p>
            Protección ejecutiva discreta y profesional diseñada específicamente para su perfil de riesgo. 
            Nuestro equipo de especialistas certificados garantiza su seguridad en todo momento.
          </p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon"></div>
            <h3>Close Protection 24/7</h3>
            <p>Equipo de escolta personal entrenado en metodologías internacionales</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon"></div>
            <h3>Análisis de Amenazas</h3>
            <p>Evaluación continua de riesgos y vulnerabilidades</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon"></div>
            <h3>Movilidad Segura</h3>
            <p>Vehículos blindados y rutas seguras predefinidas</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon"></div>
            <h3>Monitoreo GPS</h3>
            <p>Rastreo en tiempo real y comunicaciones encriptadas</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section products-section">
      <div class="container">
        <h2>Vehículos y Equipamiento Especializado</h2>
        <p class="section-subtitle">
          Contamos con una flota de vehículos blindados y equipamiento táctico de última generación
        </p>

        <div class="products-grid">
          <div class="product-card" *ngFor="let product of products">
            <div class="product-image">
              <img [src]="product.image" [alt]="product.name">
              <div class="product-badge">{{ product.category }}</div>
            </div>
            <div class="product-content">
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
              <div class="product-specs">
                <div class="spec" *ngFor="let spec of product.specs">
                  <span class="spec-label">{{ spec.label }}:</span>
                  <span class="spec-value">{{ spec.value }}</span>
                </div>
              </div>
              <button class="btn btn-primary" (click)="requestQuote(product)">
                Solicitar Cotización
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section cta-section">
      <div class="container">
        <h2>¿Listo para una Protección de Nivel Internacional?</h2>
        <p>Solicite una evaluación de riesgo personalizada</p>
        <button class="btn btn-primary btn-lg" (click)="navigateTo('/contacto')">
          Agendar Reunión Confidencial
        </button>
      </div>
    </section>
  `,
  styles: [`
    .page-hero {
      background: linear-gradient(135deg, var(--dark-primary) 0%, var(--dark-secondary) 100%);
      padding: 150px 0 80px;
      color: var(--text-light);
    }

    .breadcrumb {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);

      a {
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
          color: var(--primary-gold);
        }
      }
    }

    h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: 20px;
    }

    .hero-description {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.8);
      max-width: 700px;
    }

    .service-intro {
      text-align: center;
      max-width: 800px;
      margin: 0 auto 60px;

      h2 {
        margin-bottom: 20px;
      }

      p {
        color: var(--text-muted);
        font-size: 1.1rem;
        line-height: 1.8;
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-top: 50px;
    }

    .feature-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: var(--shadow-md);
      text-align: center;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-10px);
      }

      .feature-icon {
        font-size: 48px;
        margin-bottom: 20px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 15px;
        color: var(--dark-primary);
      }

      p {
        color: var(--text-muted);
        line-height: 1.6;
      }
    }

    .products-section {
      background: var(--bg-section-light);
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 30px;
      margin-top: 50px;
    }

    .product-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-10px);
        box-shadow: var(--shadow-lg);
      }

      .product-image {
        position: relative;
        height: 250px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: var(--primary-gold);
          color: var(--dark-primary);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }
      }

      .product-content {
        padding: 30px;

        h3 {
          font-size: 22px;
          margin-bottom: 15px;
          color: var(--dark-primary);
        }

        p {
          color: var(--text-muted);
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .product-specs {
          margin-bottom: 25px;
          padding: 15px;
          background: var(--bg-section-light);
          border-radius: 10px;

          .spec {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);

            &:last-child {
              border-bottom: none;
            }

            .spec-label {
              font-weight: 600;
              color: var(--dark-primary);
            }

            .spec-value {
              color: var(--text-muted);
            }
          }
        }
      }
    }

    .cta-section {
      background: linear-gradient(135deg, var(--primary-gold) 0%, var(--primary-gold-dark) 100%);
      text-align: center;
      padding: 80px 0;

      h2 {
        color: var(--dark-primary);
        font-size: clamp(2rem, 4vw, 3rem);
        margin-bottom: 20px;
      }

      p {
        color: rgba(26, 29, 35, 0.9);
        font-size: 1.2rem;
        margin-bottom: 30px;
      }
    }

    @media (max-width: 768px) {
      .page-hero {
        padding: 120px 0 60px;
      }

      .products-grid {
        grid-template-columns: 1fr;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProteccionEjecutivaComponent {
  products = [
    {
      name: 'Toyota Land Cruiser Blindado',
      category: 'Vehículo Blindado B6',
      description: 'SUV blindado nivel B6 para protección ejecutiva de alto nivel con capacidad para 5 pasajeros',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop',
      specs: [
        { label: 'Blindaje', value: 'Nivel B6' },
        { label: 'Capacidad', value: '5 pasajeros' },
        { label: 'GPS', value: 'Rastreo satelital' },
        { label: 'Comunicación', value: 'Encriptada' }
      ]
    },
    {
      name: 'Mercedes-Benz S-Class Blindado',
      category: 'Vehículo Ejecutivo B7',
      description: 'Sedán de lujo blindado nivel B7 para máxima protección y confort',
      image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&h=600&fit=crop',
      specs: [
        { label: 'Blindaje', value: 'Nivel B7' },
        { label: 'Capacidad', value: '4 pasajeros' },
        { label: 'Confort', value: 'Premium' },
        { label: 'Autonomía', value: '600 km' }
      ]
    },
    {
      name: 'Kit de Comunicación Segura',
      category: 'Equipamiento',
      description: 'Sistema de comunicaciones encriptadas para coordinación de equipos de seguridad',
      image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=600&fit=crop',
      specs: [
        { label: 'Alcance', value: '50 km' },
        { label: 'Encriptación', value: 'AES-256' },
        { label: 'Batería', value: '24 horas' },
        { label: 'Resistencia', value: 'IP67' }
      ]
    },
    {
      name: 'Equipo Táctico Personal',
      category: 'Equipamiento',
      description: 'Kit completo de protección personal incluyendo chalecos balísticos nivel III',
      image: 'https://images.unsplash.com/photo-1611836980903-fd91ad85cf82?w=800&h=600&fit=crop',
      specs: [
        { label: 'Protección', value: 'Nivel III' },
        { label: 'Peso', value: '3.5 kg' },
        { label: 'Material', value: 'Kevlar' },
        { label: 'Certificación', value: 'NIJ' }
      ]
    }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  requestQuote(product: any) {
    console.log('Solicitar cotización para:', product.name);
    this.router.navigate(['/contacto'], { 
      queryParams: { service: 'proteccion-ejecutiva', product: product.name } 
    });
  }
}
