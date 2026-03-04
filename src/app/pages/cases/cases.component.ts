import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

interface Testimonial {
  id: number;
  author: string;
  position: string;
  company: string;
  industry: string;
  image: string;
  text: string;
  service: string;
  year: number;
  rating: number;
  verified: boolean;
}

interface CaseStudy {
  id: number;
  title: string;
  category: string;
  client: string;
  duration: string;
  challenge: string;
  solution: string;
  results: string[];
  image: string;
  tags: string[];
}

interface Sector {
  icon: string;
  name: string;
  description: string;
  clients: number;
  operations: number;
}

@Component({
  selector: 'app-cases',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <section class="page-hero">
      <div class="container">
        <div class="breadcrumb">
          <a (click)="navigateTo('/')">Inicio</a>
          <span>/</span>
          <span>Casos de Éxito</span>
        </div>
        <h1>Casos de Éxito y Testimonios</h1>
        <p class="hero-description">
          Resultados comprobados en protección ejecutiva, gestión de crisis y seguridad corporativa 
          con más de 12,000 operaciones exitosas
        </p>
      </div>
    </section>

    <!-- ESTADÍSTICAS GENERALES -->
    <section class="section stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-number">100%</div>
            <div class="stat-label">Tasa de Éxito en Crisis K&R</div>
            <p class="stat-desc">12 casos resueltos sin incidentes</p>
          </div>
          <div class="stat-box">
            <div class="stat-number">0</div>
            <div class="stat-label">Incidentes Graves</div>
            <p class="stat-desc">En protección ejecutiva (14 años)</p>
          </div>
          <div class="stat-box">
            <div class="stat-number">12,000+</div>
            <div class="stat-label">Operaciones Completadas</div>
            <p class="stat-desc">Desde 2012 a la fecha</p>
          </div>
          <div class="stat-box highlight">
            <div class="stat-number">98%</div>
            <div class="stat-label">Satisfacción del Cliente</div>
            <p class="stat-desc">Basado en 250+ encuestas</p>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIOS -->
    <section class="section testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2>Lo Que Dicen Nuestros Clientes</h2>
          <p class="section-subtitle">
            Testimonios verificados de empresas y ejecutivos que han confiado su seguridad a Sinergia
          </p>
        </div>

        <!-- FILTROS -->
        <div class="filter-tabs">
          <button class="filter-btn" 
                  *ngFor="let industry of industries"
                  [class.active]="selectedIndustry === industry"
                  (click)="selectedIndustry = industry">
            {{ industry }}
          </button>
        </div>

        <!-- GRID DE TESTIMONIOS -->
        <div class="testimonials-grid">
          <div class="testimonial-card" *ngFor="let testimonial of getFilteredTestimonials()">
            <div class="testimonial-header">
              <img [src]="testimonial.image" [alt]="testimonial.author" class="testimonial-avatar">
              <div class="testimonial-author-info">
                <h4 class="testimonial-author">{{ testimonial.author }}</h4>
                <p class="testimonial-position">{{ testimonial.position }}</p>
                <p class="testimonial-company">{{ testimonial.company }}</p>
                <span class="testimonial-industry">{{ testimonial.industry }}</span>
              </div>
              <div class="testimonial-rating">
                <span class="star" *ngFor="let star of [1,2,3,4,5]" 
                      [class.filled]="star <= testimonial.rating">⭐</span>
              </div>
            </div>
            
            <div class="testimonial-content">
              <p class="testimonial-text">"{{ testimonial.text }}"</p>
            </div>

            <div class="testimonial-meta">
              <span class="testimonial-service">{{ testimonial.service }}</span>
              <span class="testimonial-year">{{ testimonial.year }}</span>
            </div>

            <div class="testimonial-badge" *ngIf="testimonial.verified">
              <span class="badge-icon">✓</span> Testimonio Verificado
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CASOS DE ESTUDIO DESTACADOS -->
    <section class="section case-studies-section">
      <div class="container">
        <div class="section-header">
          <h2>Casos de Estudio Destacados</h2>
          <p class="section-subtitle">
            Análisis detallado de operaciones exitosas en diferentes sectores
          </p>
        </div>

        <div class="cases-grid">
          <div class="case-card" *ngFor="let case of caseStudies">
            <div class="case-image">
              <img [src]="case.image" [alt]="case.title">
              <div class="case-category-badge">{{ case.category }}</div>
            </div>

            <div class="case-content">
              <h3>{{ case.title }}</h3>
              
              <div class="case-meta">
                <div class="meta-item">
                  <span class="meta-label">Cliente:</span>
                  <span class="meta-value">{{ case.client }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Duración:</span>
                  <span class="meta-value">{{ case.duration }}</span>
                </div>
              </div>

              <div class="case-section">
                <h4>Desafío</h4>
                <p>{{ case.challenge }}</p>
              </div>

              <div class="case-section">
                <h4>Solución</h4>
                <p>{{ case.solution }}</p>
              </div>

              <div class="case-section">
                <h4>Resultados</h4>
                <ul class="results-list">
                  <li *ngFor="let result of case.results">
                    <span class="check-icon">✓</span>
                    {{ result }}
                  </li>
                </ul>
              </div>

              <div class="case-tags">
                <span class="case-tag" *ngFor="let tag of case.tags">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTORES ATENDIDOS -->
    <section class="section sectors-section">
      <div class="container">
        <div class="section-header">
          <h2>Sectores Atendidos</h2>
          <p class="section-subtitle">
            Experiencia comprobada en las industrias más exigentes del Ecuador
          </p>
        </div>

        <div class="sectors-grid">
          <div class="sector-card" *ngFor="let sector of sectors">
            <div class="sector-icon">{{ sector.icon }}</div>
            <h3>{{ sector.name }}</h3>
            <p class="sector-desc">{{ sector.description }}</p>
            <div class="sector-stats">
              <div class="sector-stat">
                <span class="stat-number">{{ sector.clients }}</span>
                <span class="stat-label">Clientes</span>
              </div>
              <div class="sector-stat">
                <span class="stat-number">{{ sector.operations | number }}</span>
                <span class="stat-label">Operaciones</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="section cta-section">
      <div class="container">
        <h2>¿Quiere Formar Parte de Nuestros Casos de Éxito?</h2>
        <p>Solicite una evaluación gratuita y descubra cómo podemos proteger su empresa</p>
        <button class="btn btn-primary btn-lg" (click)="navigateTo('/contacto')">
          Solicitar Evaluación Gratuita
        </button>
      </div>
    </section>
  `,
  styles: [`
    /* HERO SECTION */
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

    /* ESTADÍSTICAS */
    .stats-section {
      background: var(--bg-section-light);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
    }

    .stat-box {
      background: white;
      padding: 40px 30px;
      border-radius: 15px;
      box-shadow: var(--shadow-md);
      text-align: center;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-10px);
      }

      &.highlight {
        background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
        color: white;
      }
    }

    .stat-number {
      font-size: 48px;
      font-weight: 800;
      color: var(--primary-blue-dark);
      margin-bottom: 10px;

      .highlight & {
        color: white;
      }
    }

    .stat-label {
      font-size: 18px;
      font-weight: 600;
      color: var(--dark-primary);
      margin-bottom: 10px;

      .highlight & {
        color: white;
      }
    }

    .stat-desc {
      font-size: 14px;
      color: var(--text-muted);
      margin: 0;

      .highlight & {
        color: rgba(255, 255, 255, 0.9);
      }
    }

    /* TESTIMONIOS */
    .testimonials-section {
      background: white;
    }

    .section-header {
      text-align: center;
      margin-bottom: 50px;

      h2 {
        font-size: clamp(2rem, 4vw, 3rem);
        color: var(--dark-primary);
        margin-bottom: 15px;
      }

      .section-subtitle {
        font-size: 1.1rem;
        color: var(--text-muted);
        max-width: 700px;
        margin: 0 auto;
      }
    }

    .filter-tabs {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 50px;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 12px 30px;
      background: var(--bg-section-light);
      border: 2px solid transparent;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      color: var(--dark-primary);
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--primary-blue);
      }

      &.active {
        background: var(--primary-blue);
        color: white;
        border-color: var(--primary-blue);
      }
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 30px;
    }

    .testimonial-card {
      background: var(--bg-section-light);
      padding: 30px;
      border-radius: 15px;
      box-shadow: var(--shadow-md);
      transition: all 0.3s ease;
      position: relative;

      &:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
      }
    }

    .testimonial-header {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      align-items: flex-start;
    }

    .testimonial-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
    }

    .testimonial-author-info {
      flex: 1;
    }

    .testimonial-author {
      font-size: 18px;
      font-weight: 700;
      color: var(--dark-primary);
      margin-bottom: 5px;
    }

    .testimonial-position {
      font-size: 14px;
      color: var(--text-muted);
      margin: 0;
    }

    .testimonial-company {
      font-size: 14px;
      font-weight: 600;
      color: var(--dark-primary);
      margin: 5px 0;
    }

    .testimonial-industry {
      display: inline-block;
      background: var(--primary-blue);
      color: white;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 11px;
      margin-top: 5px;
    }

    .testimonial-rating {
      display: flex;
      gap: 3px;

      .star {
        opacity: 0.3;

        &.filled {
          opacity: 1;
        }
      }
    }

    .testimonial-content {
      margin-bottom: 20px;
    }

    .testimonial-text {
      font-size: 15px;
      line-height: 1.7;
      color: var(--text-dark);
      font-style: italic;
    }

    .testimonial-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      font-size: 13px;
      color: var(--text-muted);
    }

    .testimonial-service {
      background: white;
      padding: 5px 12px;
      border-radius: 15px;
      font-weight: 600;
    }

    .testimonial-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--primary-blue-dark);
      font-size: 13px;
      font-weight: 600;

      .badge-icon {
        background: var(--primary-blue);
        color: white;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      }
    }

    /* CASOS DE ESTUDIO */
    .case-studies-section {
      background: var(--bg-section-light);
    }

    .cases-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 40px;
    }

    .case-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-10px);
        box-shadow: var(--shadow-lg);
      }
    }

    .case-image {
      position: relative;
      height: 250px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      &:hover img {
        transform: scale(1.1);
      }
    }

    .case-category-badge {
      position: absolute;
      top: 20px;
      right: 20px;
      background: var(--primary-blue);
      color: white;
      padding: 8px 20px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    }

    .case-content {
      padding: 30px;

      h3 {
        font-size: 24px;
        color: var(--dark-primary);
        margin-bottom: 20px;
      }
    }

    .case-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 25px;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .meta-label {
      font-size: 12px;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 600;
    }

    .meta-value {
      font-size: 14px;
      color: var(--dark-primary);
      font-weight: 600;
    }

    .case-section {
      margin-bottom: 20px;

      h4 {
        font-size: 16px;
        color: var(--primary-blue-dark);
        margin-bottom: 10px;
      }

      p {
        font-size: 14px;
        line-height: 1.7;
        color: var(--text-muted);
      }
    }

    .results-list {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 10px;
        font-size: 14px;
        line-height: 1.6;
        color: var(--text-muted);

        .check-icon {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 16px;
        }
      }
    }

    .case-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid var(--bg-section-light);
    }

    .case-tag {
      background: var(--bg-section-light);
      color: var(--dark-primary);
      padding: 6px 15px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: 600;
    }

    /* SECTORES */
    .sectors-section {
      background: white;
    }

    .sectors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 30px;
    }

    .sector-card {
      background: var(--bg-section-light);
      padding: 30px;
      border-radius: 15px;
      text-align: center;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-10px);
        box-shadow: var(--shadow-md);
      }
    }

    .sector-icon {
      font-size: 60px;
      margin-bottom: 20px;
    }

    .sector-card h3 {
      font-size: 22px;
      color: var(--dark-primary);
      margin-bottom: 15px;
    }

    .sector-desc {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .sector-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      padding-top: 20px;
      border-top: 2px solid rgba(144, 194, 227, 0.2);
    }

    .sector-stat {
      text-align: center;

      .stat-number {
        font-size: 28px;
        font-weight: 700;
        color: var(--primary-blue-dark);
        display: block;
      }

      .stat-label {
        font-size: 12px;
        color: var(--text-muted);
        display: block;
        margin-top: 5px;
      }
    }

    /* CTA SECTION */
    .cta-section {
      background: var(--dark-primary);
      text-align: center;
      padding: 80px 0;

      h2 {
        color: var(--text-light);
        font-size: clamp(2rem, 4vw, 3rem);
        margin-bottom: 20px;
      }

      p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.2rem;
        margin-bottom: 30px;
      }
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .page-hero {
        padding: 120px 0 60px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .testimonials-grid {
        grid-template-columns: 1fr;
      }

      .cases-grid {
        grid-template-columns: 1fr;
      }

      .sectors-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CasesComponent {
  selectedIndustry: string = 'Todos';

  industries: string[] = [
    'Todos',
    'Minería',
    'Construcción',
    'Corporativo',
    'Diplomacia',
    'Energía'
  ];

  testimonials: Testimonial[] = [
    {
      id: 1,
      author: 'Carlos Mendoza',
      position: 'CEO',
      company: 'Minera del Sur S.A.',
      industry: 'Minería',
      image: 'https://ui-avatars.com/api/?name=Carlos+Mendoza&background=487FC0&color=fff&size=128',
      text: 'Trabajamos con Sinergia desde 2018 en nuestra operación minera en Zamora. Su equipo no solo proporciona seguridad física excepcional, sino que su análisis de riesgos nos ha permitido prevenir múltiples incidentes potenciales. Profesionales de primer nivel.',
      service: 'Seguridad Minera Integral',
      year: 2024,
      rating: 5,
      verified: true
    },
    {
      id: 2,
      author: 'María Fernanda Torres',
      position: 'Directora de Seguridad',
      company: 'Constructora Pazmiño & Asociados',
      industry: 'Construcción',
      image: 'https://ui-avatars.com/api/?name=Maria+Torres&background=487FC0&color=fff&size=128',
      text: 'Durante el proyecto de construcción del Centro Empresarial Guayaquil Norte, Sinergia manejó toda la logística de seguridad y transporte de valores. Cero incidentes en 18 meses de obra. Su profesionalismo y discreción son impecables.',
      service: 'Seguridad en Construcción',
      year: 2023,
      rating: 5,
      verified: true
    },
    {
      id: 3,
      author: 'Roberto Salazar',
      position: 'Vicepresidente Ejecutivo',
      company: 'Banco Internacional del Pacífico',
      industry: 'Corporativo',
      image: 'https://ui-avatars.com/api/?name=Roberto+Salazar&background=487FC0&color=fff&size=128',
      text: 'El servicio de protección ejecutiva de Sinergia ha sido fundamental para nuestros directivos. Su equipo demuestra total profesionalismo, adaptándose perfectamente a nuestras necesidades corporativas sin interferir con las operaciones del día a día.',
      service: 'Protección Ejecutiva',
      year: 2024,
      rating: 5,
      verified: true
    },
    {
      id: 4,
      author: 'Ana Patricia Gómez',
      position: 'Cónsul General',
      company: 'Consulado de España',
      industry: 'Diplomacia',
      image: 'https://ui-avatars.com/api/?name=Ana+Gomez&background=487FC0&color=fff&size=128',
      text: 'Confiamos en Sinergia para la seguridad de nuestras instalaciones y eventos diplomáticos. Su conocimiento de protocolos internacionales y su capacidad de coordinación con autoridades locales es excepcional.',
      service: 'Seguridad Diplomática',
      year: 2023,
      rating: 5,
      verified: true
    },
    {
      id: 5,
      author: 'Diego Morales',
      position: 'Gerente de Operaciones',
      company: 'Petroecuador EP',
      industry: 'Energía',
      image: 'https://ui-avatars.com/api/?name=Diego+Morales&background=487FC0&color=fff&size=128',
      text: 'En el sector petrolero ecuatoriano, la seguridad no es opcional. Sinergia comprende perfectamente nuestros retos operacionales y ha implementado protocolos que nos permiten operar con tranquilidad incluso en zonas complejas.',
      service: 'Seguridad en Energía',
      year: 2024,
      rating: 5,
      verified: true
    },
    {
      id: 6,
      author: 'Patricia Vallejo',
      position: 'Directora Ejecutiva',
      company: 'Fundación Huertos Familiares',
      industry: 'ONG',
      image: 'https://ui-avatars.com/api/?name=Patricia+Vallejo&background=487FC0&color=fff&size=128',
      text: 'Como ONG trabajando en zonas rurales de alto riesgo, necesitábamos un socio de seguridad que entendiera nuestras limitaciones presupuestarias pero sin comprometer la protección de nuestro equipo. Sinergia diseñó una solución perfecta para nosotros.',
      service: 'Consultoría de Riesgos',
      year: 2023,
      rating: 5,
      verified: true
    }
  ];

  caseStudies: CaseStudy[] = [
    {
      id: 1,
      title: 'Resolución de Crisis K&R en Zona Minera',
      category: 'Gestión de Crisis',
      client: 'Confidencial - Sector Minero',
      duration: '72 horas',
      challenge: 'Secuestro de tres ejecutivos de nivel C en zona remota de Zamora Chinchipe durante inspección de sitio minero. Amenaza directa a la vida, demandas económicas elevadas, y complejidad logística por ubicación aislada.',
      solution: 'Activación inmediata de protocolo K&R con equipo especialista certificado. Negociación profesional con captores, coordinación discreta con autoridades, despliegue táctico de equipo de rescate, y gestión médica y psicológica post-liberación.',
      results: [
        'Liberación exitosa de los 3 ejecutivos sin lesiones',
        'Resolución en 72 horas desde activación del protocolo',
        'Coordinación efectiva con 4 agencias gubernamentales',
        'Protección completa de la reputación corporativa del cliente'
      ],
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
      tags: ['K&R', 'Crisis Management', 'Minería', 'Rescate Táctico']
    },
    {
      id: 2,
      title: 'Protección Ejecutiva 24 Meses',
      category: 'Protección Ejecutiva',
      client: 'Multinacional Tecnológica',
      duration: '24 meses',
      challenge: 'CEO de empresa Fortune 500 requería protección discreta durante residencia temporal en Ecuador para supervisar expansión regional. Alto perfil público, múltiples amenazas creíbles, necesidad de mantener agenda ejecutiva sin restricciones.',
      solution: 'Equipo rotativo de 8 agentes close protection certificados internacionalmente, análisis diario de amenazas, coordinación con seguridad corporativa global, rutas variables, vehículos blindados nivel B6, y escaneo constante de amenazas digitales.',
      results: [
        'Cero incidentes de seguridad en 24 meses',
        '1,200+ desplazamientos seguros realizados',
        'Cumplimiento del 100% de agenda ejecutiva planificada',
        'Operación completamente discreta - cero exposición mediática'
      ],
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=600&fit=crop',
      tags: ['Close Protection', 'Alto Perfil', 'Corporativo', 'Discreción']
    },
    {
      id: 3,
      title: 'Seguridad Integral Proyecto $120M',
      category: 'Seguridad Corporativa',
      client: 'Constructora Internacional',
      duration: '18 meses',
      challenge: 'Obra de construcción de $120 millones en Guayaquil Norte requería protección de materiales de alto valor, control de accesos para 300+ trabajadores, transporte semanal de $500K en valores, y prevención de sabotaje industrial.',
      solution: 'Despliegue de equipo de 12 guardias en turnos 24/7, sistema de CCTV con 40 cámaras, control biométrico de accesos, escolta blindada para transporte de valores, análisis de antecedentes de todo el personal, y protocolos anti-sabotaje.',
      results: [
        'Cero robos de material en 18 meses de obra',
        '150+ transportes de valores sin incidentes',
        'Detección y prevención de 3 intentos de infiltración',
        'Proyecto completado en tiempo y presupuesto'
      ],
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
      tags: ['Construcción', 'Transporte Valores', 'Control Accesos']
    }
  ];

  sectors: Sector[] = [
    {
      icon: '⛏️',
      name: 'Minería',
      description: 'Seguridad integral para operaciones mineras en zonas remotas',
      clients: 18,
      operations: 3200
    },
    {
      icon: '🏢',
      name: 'Corporativo',
      description: 'Protección ejecutiva y consultoría para empresas Fortune 500',
      clients: 45,
      operations: 2800
    },
    {
      icon: '🏗️',
      name: 'Construcción',
      description: 'Seguridad en proyectos de infraestructura y construcción',
      clients: 32,
      operations: 1500
    },
    {
      icon: '🏛️',
      name: 'Diplomacia',
      description: 'Protección de embajadas, consulados y personal diplomático',
      clients: 8,
      operations: 450
    },
    {
      icon: '⚡',
      name: 'Energía',
      description: 'Seguridad para sector petrolero, eléctrico y renovables',
      clients: 12,
      operations: 980
    },
    {
      icon: '🏦',
      name: 'Financiero',
      description: 'Transporte de valores y protección de instalaciones bancarias',
      clients: 22,
      operations: 4500
    }
  ];

  constructor(private router: Router) {}

  getFilteredTestimonials(): Testimonial[] {
    if (this.selectedIndustry === 'Todos') {
      return this.testimonials;
    }
    return this.testimonials.filter(t => t.industry === this.selectedIndustry);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}