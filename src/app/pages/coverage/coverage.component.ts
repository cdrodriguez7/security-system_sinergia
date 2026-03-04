import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

interface Province {
  name: string;
  region: string;
  operations: number;
  percentage: number;
  responseTime: string;
  offices: number;
  specialists: number;
}

interface RegionalOffice {
  city: string;
  address: string;
  phone: string;
  email: string;
  services: string[];
}

@Component({
  selector: 'app-coverage',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <section class="page-hero">
      <div class="container">
        <div class="breadcrumb">
          <a (click)="navigateTo('/')">Inicio</a>
          <span>/</span>
          <span>Cobertura Nacional</span>
        </div>
        <h1>Cobertura Nacional Completa</h1>
        <p class="hero-description">
          Presencia estratégica en las 24 provincias del Ecuador con tiempos de respuesta garantizados
        </p>
      </div>
    </section>

    <!-- MAPA INTERACTIVO -->
    <section class="section map-section">
      <div class="container">
        <div class="coverage-main-grid">
          <div class="coverage-map-large">
            <h2>Distribución de Operaciones 2024</h2>
            <div class="map-container-large">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Ecuador_location_map.svg/600px-Ecuador_location_map.svg.png" 
                   alt="Mapa Ecuador"
                   class="ecuador-map-large">
              <div class="map-markers">
                <!-- GUAYAQUIL -->
                <div class="marker marker-primary" style="top: 58%; left: 22%;">
                  <div class="marker-pulse"></div>
                  <span class="marker-label">Guayaquil</span>
                  <div class="marker-info">
                    <p><strong>4,500</strong> operaciones</p>
                    <p><strong>35%</strong> del total</p>
                  </div>
                </div>

                <!-- ZAMORA -->
                <div class="marker marker-secondary" style="top: 88%; left: 40%;">
                  <div class="marker-pulse"></div>
                  <span class="marker-label">Zamora</span>
                  <div class="marker-info">
                    <p><strong>3,200</strong> operaciones</p>
                    <p><strong>25%</strong> del total</p>
                  </div>
                </div>

                <!-- QUITO -->
                <div class="marker marker-tertiary" style="top: 26%; left: 46%;">
                  <div class="marker-pulse"></div>
                  <span class="marker-label">Quito</span>
                  <div class="marker-info">
                    <p><strong>2,800</strong> operaciones</p>
                    <p><strong>22%</strong> del total</p>
                  </div>
                </div>

                <!-- CUENCA -->
                <div class="marker marker-quaternary" style="top: 67%; left: 37%;">
                  <div class="marker-pulse"></div>
                  <span class="marker-label">Cuenca</span>
                  <div class="marker-info">
                    <p><strong>1,200</strong> operaciones</p>
                    <p><strong>9%</strong> del total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="coverage-stats-panel">
            <div class="stat-card">
              <div class="stat-icon">🏢</div>
              <div class="stat-content">
                <div class="stat-number">{{ totalOffices }}</div>
                <div class="stat-label">Oficinas Regionales</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-content">
                <div class="stat-number">{{ totalSpecialists }}+</div>
                <div class="stat-label">Especialistas</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">📍</div>
              <div class="stat-content">
                <div class="stat-number">24/24</div>
                <div class="stat-label">Provincias</div>
              </div>
            </div>

            <div class="stat-card highlight">
              <div class="stat-icon">⏱️</div>
              <div class="stat-content">
                <div class="stat-number">&lt;1hr</div>
                <div class="stat-label">Respuesta Rápida</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- COBERTURA POR PROVINCIA -->
    <section class="section provinces-section">
      <div class="container">
        <div class="section-header">
          <h2>Cobertura por Provincia</h2>
          <p class="section-subtitle">
            Operaciones y tiempos de respuesta en cada provincia
          </p>
        </div>

        <div class="region-tabs">
          <button class="tab-btn" 
                  *ngFor="let region of regions"
                  [class.active]="selectedRegion === region"
                  (click)="selectedRegion = region">
            {{ region }}
          </button>
        </div>

        <div class="provinces-grid">
          <div class="province-card" 
               *ngFor="let province of getProvincesByRegion(selectedRegion)">
            <div class="province-header">
              <h3>{{ province.name }}</h3>
              <span class="province-region">{{ province.region }}</span>
            </div>
            
            <div class="province-stats">
              <div class="province-stat">
                <div class="stat-value">{{ province.operations | number }}</div>
                <div class="stat-label">Operaciones</div>
              </div>
              <div class="province-stat">
                <div class="stat-value">{{ province.percentage }}%</div>
                <div class="stat-label">Del Total</div>
              </div>
            </div>

            <div class="province-details">
              <div class="detail-item">
                <span class="detail-icon">⏱️</span>
                <span class="detail-text">{{ province.responseTime }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">👥</span>
                <span class="detail-text">{{ province.specialists }} especialistas</span>
              </div>
            </div>

            <div class="province-bar">
              <div class="province-fill" [style.width.%]="province.percentage"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- OFICINAS REGIONALES -->
    <section class="section offices-section">
      <div class="container">
        <div class="section-header">
          <h2>Nuestras Oficinas Regionales</h2>
        </div>

        <div class="offices-grid">
          <div class="office-card" *ngFor="let office of regionalOffices">
            <div class="office-badge">Oficina Regional</div>
            <h3>{{ office.city }}</h3>
            
            <div class="office-contact">
              <div class="contact-item">
                <span class="contact-icon">📍</span>
                <span class="contact-text">{{ office.address }}</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📞</span>
                <span class="contact-link">{{ office.phone }}</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📧</span>
                <span class="contact-link">{{ office.email }}</span>
              </div>
            </div>

            <div class="office-services">
              <h4>Servicios:</h4>
              <div class="services-tags">
                <span class="service-tag" *ngFor="let service of office.services">{{ service }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="section cta-section">
      <div class="container">
        <h2>¿Necesita Cobertura en su Zona?</h2>
        <p>Consulte disponibilidad y tiempos de respuesta</p>
        <button class="btn btn-primary btn-lg" (click)="navigateTo('/contacto')">
          Solicitar Información
        </button>
      </div>
    </section>
  `,
  styles: [`
    /* HERO */
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
      color: rgba(255, 255, 255, 0.85);

      a {
        cursor: pointer;
        &:hover { color: var(--primary-blue); }
      }
    }

    h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: 20px;
    }

    .hero-description {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.95);
      max-width: 700px;
    }

    /* MAPA */
    .map-section {
      background: var(--bg-section-light);
    }

    .coverage-main-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 40px;
      margin-top: 40px;
    }

    .coverage-map-large {
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: var(--shadow-md);

      h2 {
        margin-bottom: 30px;
        color: var(--dark-primary);
      }
    }

    .map-container-large {
      position: relative;
      width: 100%;
    }

    .ecuador-map-large {
      width: 100%;
      height: auto;
    }

    .map-markers {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .marker {
      position: absolute;
      cursor: pointer;
      transform: translate(-50%, -50%);

      &:hover .marker-info {
        opacity: 1;
        visibility: visible;
      }
    }

    .marker-pulse {
      width: 20px;
      height: 20px;
      background: var(--primary-blue);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.5); opacity: 0.5; }
    }

    .marker-label {
      position: absolute;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--dark-primary);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      white-space: nowrap;
    }

    .marker-info {
      position: absolute;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 15px;
      border-radius: 10px;
      box-shadow: var(--shadow-md);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      min-width: 180px;

      p {
        margin: 5px 0;
        font-size: 13px;
      }
    }

    .coverage-stats-panel {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .stat-card {
      background: white;
      padding: 25px;
      border-radius: 15px;
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      gap: 20px;

      &.highlight {
        background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
        color: white;
      }
    }

    .stat-icon {
      font-size: 40px;
    }

    .stat-number {
      font-size: 32px;
      font-weight: 700;
      color: var(--dark-primary);
      
      .highlight & {
        color: white;
      }
    }

    .stat-label {
      font-size: 14px;
      color: var(--text-muted);
      
      .highlight & {
        color: rgba(255, 255, 255, 0.9);
      }
    }

    /* PROVINCIAS */
    .provinces-section {
      background: white;
    }

    .section-header {
      text-align: center;
      margin-bottom: 40px;

      h2 {
        color: var(--dark-primary);
        margin-bottom: 15px;
      }

      .section-subtitle {
        color: var(--text-muted);
      }
    }

    .region-tabs {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 40px;
      flex-wrap: wrap;
    }

    .tab-btn {
      padding: 12px 30px;
      background: var(--bg-section-light);
      border: 2px solid transparent;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--primary-blue);
      }

      &.active {
        background: var(--primary-blue);
        color: white;
      }
    }

    .provinces-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 25px;
    }

    .province-card {
      background: var(--bg-section-light);
      padding: 25px;
      border-radius: 15px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-md);
      }
    }

    .province-header {
      margin-bottom: 20px;

      h3 {
        font-size: 20px;
        color: var(--dark-primary);
        margin-bottom: 5px;
      }

      .province-region {
        font-size: 13px;
        color: var(--primary-blue);
      }
    }

    .province-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }

    .province-stat {
      text-align: center;

      .stat-value {
        font-size: 24px;
        font-weight: 700;
        color: var(--dark-primary);
      }

      .stat-label {
        font-size: 12px;
        color: var(--text-muted);
      }
    }

    .province-details {
      margin-bottom: 15px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .province-bar {
      height: 6px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      overflow: hidden;
    }

    .province-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
      transition: width 0.5s ease;
    }

    /* OFICINAS */
    .offices-section {
      background: var(--bg-section-light);
    }

    .offices-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
    }

    .office-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: var(--shadow-md);
      position: relative;
    }

    .office-badge {
      position: absolute;
      top: 20px;
      right: 20px;
      background: var(--primary-blue);
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 12px;
    }

    .office-card h3 {
      font-size: 24px;
      color: var(--dark-primary);
      margin-bottom: 20px;
    }

    .office-contact {
      margin-bottom: 20px;
    }

    .contact-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 10px;
      font-size: 14px;
    }

    .office-services h4 {
      font-size: 16px;
      margin-bottom: 10px;
      color: var(--dark-primary);
    }

    .services-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .service-tag {
      background: var(--bg-section-light);
      padding: 5px 12px;
      border-radius: 15px;
      font-size: 12px;
      color: var(--dark-primary);
    }

    /* CTA */
    .cta-section {
      background: var(--dark-primary);
      text-align: center;
      padding: 80px 0;

      h2 {
        color: white;
        margin-bottom: 15px;
      }

      p {
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 30px;
      }
    }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .coverage-main-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .page-hero {
        padding: 120px 0 60px;
      }

      .provinces-grid,
      .offices-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CoverageComponent {
  selectedRegion: string = 'Todas';
  regions: string[] = ['Todas', 'Costa', 'Sierra', 'Oriente'];
  
  totalOffices: number = 12;
  totalSpecialists: number = 75;

  provinces: Province[] = [
    { name: 'Guayas', region: 'Costa', operations: 4500, percentage: 35, responseTime: '<1 hora', offices: 3, specialists: 25 },
    { name: 'Pichincha', region: 'Sierra', operations: 2800, percentage: 22, responseTime: '<1 hora', offices: 2, specialists: 18 },
    { name: 'Zamora Chinchipe', region: 'Oriente', operations: 3200, percentage: 25, responseTime: '<4 horas', offices: 2, specialists: 15 },
    { name: 'Azuay', region: 'Sierra', operations: 1200, percentage: 9, responseTime: '<1 hora', offices: 1, specialists: 8 },
    { name: 'Manabí', region: 'Costa', operations: 800, percentage: 6, responseTime: '<2 horas', offices: 1, specialists: 5 },
    { name: 'El Oro', region: 'Costa', operations: 600, percentage: 5, responseTime: '<2 horas', offices: 1, specialists: 4 }
  ];

  regionalOffices: RegionalOffice[] = [
    {
      city: 'Guayaquil',
      address: 'Av. 9 de Octubre, World Trade Center',
      phone: '+593-4-XXX-XXXX',
      email: 'guayaquil@sinergia-security.com',
      services: ['Protección Ejecutiva', 'Transporte Valores', 'K&R']
    },
    {
      city: 'Quito',
      address: 'Av. República del Salvador',
      phone: '+593-2-XXX-XXXX',
      email: 'quito@sinergia-security.com',
      services: ['Protección Ejecutiva', 'Consultoría']
    },
    {
      city: 'Cuenca',
      address: 'Av. Federico Malo',
      phone: '+593-7-XXX-XXXX',
      email: 'cuenca@sinergia-security.com',
      services: ['Protección Ejecutiva', 'Seguridad Residencial']
    },
    {
      city: 'Zamora',
      address: 'Av. Del Maestro',
      phone: '+593-7-XXX-XXXX',
      email: 'zamora@sinergia-security.com',
      services: ['Seguridad Minera', 'Transporte Valores']
    }
  ];

  constructor(private router: Router) {}

  getProvincesByRegion(region: string): Province[] {
    if (region === 'Todas') {
      return this.provinces;
    }
    return this.provinces.filter(p => p.region === region);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}