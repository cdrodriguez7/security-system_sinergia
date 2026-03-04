import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  specialty: string;
  experience: string;
  image: string;
  certifications: string[];
  background: string;
  skills: string[];
  languages: string[];
}

interface Department {
  name: string;
  icon: string;
  description: string;
  members: number;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <section class="page-hero">
      <div class="container">
        <div class="breadcrumb">
          <a (click)="navigateTo('/')">Inicio</a>
          <span>/</span>
          <span>Nuestro Equipo</span>
        </div>
        <h1>Equipo de Élite</h1>
        <p class="hero-description">
          75+ especialistas certificados con experiencia en Fuerzas Especiales, GIR, 
          y protección ejecutiva internacional
        </p>
      </div>
    </section>

    <!-- ESTADÍSTICAS DEL EQUIPO -->
    <section class="section stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-number">75+</div>
            <div class="stat-label">Especialistas Activos</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎖️</div>
            <div class="stat-number">85%</div>
            <div class="stat-label">Ex-Fuerzas Especiales</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📜</div>
            <div class="stat-number">200+</div>
            <div class="stat-label">Certificaciones Internacionales</div>
          </div>
          <div class="stat-card highlight">
            <div class="stat-icon">⏱️</div>
            <div class="stat-number">200hrs</div>
            <div class="stat-label">Entrenamiento Anual</div>
          </div>
        </div>
      </div>
    </section>

    <!-- LIDERAZGO -->
    <section class="section leadership-section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">LIDERAZGO</span>
          <h2>Equipo Directivo</h2>
          <p class="section-subtitle">
            Líderes con décadas de experiencia en operaciones especiales y seguridad ejecutiva
          </p>
        </div>

        <div class="leadership-grid">
          <div class="leader-card" *ngFor="let leader of leadership">
            <div class="leader-image-container">
              <img [src]="leader.image" [alt]="leader.name" class="leader-image">
              <div class="leader-overlay">
                <div class="leader-contact">
                  <button class="btn-contact" (click)="navigateTo('/contacto')">
                    Contactar
                  </button>
                </div>
              </div>
            </div>
            
            <div class="leader-content">
              <h3>{{ leader.name }}</h3>
              <p class="leader-position">{{ leader.position }}</p>
              <p class="leader-specialty">{{ leader.specialty }}</p>
              
              <div class="leader-experience">
                <div class="experience-icon">🎖️</div>
                <span>{{ leader.experience }}</span>
              </div>

              <div class="leader-background">
                <h4>Trayectoria</h4>
                <p>{{ leader.background }}</p>
              </div>

              <div class="leader-certifications">
                <h4>Certificaciones Principales</h4>
                <div class="cert-tags">
                  <span class="cert-tag" *ngFor="let cert of leader.certifications">
                    {{ cert }}
                  </span>
                </div>
              </div>

              <div class="leader-skills">
                <h4>Especialidades</h4>
                <ul>
                  <li *ngFor="let skill of leader.skills">
                    <span class="skill-icon">✓</span>
                    {{ skill }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DEPARTAMENTOS -->
    <section class="section departments-section">
      <div class="container">
        <div class="section-header">
          <h2>Departamentos Especializados</h2>
          <p class="section-subtitle">
            Equipos dedicados a cada área de operación
          </p>
        </div>

        <div class="departments-grid">
          <div class="department-card" *ngFor="let dept of departments">
            <div class="dept-icon">{{ dept.icon }}</div>
            <h3>{{ dept.name }}</h3>
            <p class="dept-description">{{ dept.description }}</p>
            <div class="dept-members">
              <span class="members-icon">👥</span>
              <span class="members-count">{{ dept.members }} especialistas</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- EQUIPO OPERATIVO -->
    <section class="section team-section">
      <div class="container">
        <div class="section-header">
          <h2>Equipo Operativo</h2>
          <p class="section-subtitle">
            Especialistas certificados desplegados en todo el país
          </p>
        </div>

        <!-- FILTROS -->
        <div class="filter-tabs">
          <button class="filter-btn" 
                  *ngFor="let specialty of specialties"
                  [class.active]="selectedSpecialty === specialty"
                  (click)="selectedSpecialty = specialty">
            {{ specialty }}
          </button>
        </div>

        <!-- GRID DE EQUIPO -->
        <div class="team-grid">
          <div class="team-card" *ngFor="let member of getFilteredMembers()">
            <div class="team-image-wrapper">
              <img [src]="member.image" [alt]="member.name" class="team-image">
              <div class="team-overlay">
                <div class="overlay-certifications">
                  <span class="cert-badge" *ngFor="let cert of member.certifications.slice(0, 2)">
                    {{ cert }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="team-content">
              <h3>{{ member.name }}</h3>
              <p class="team-position">{{ member.position }}</p>
              <p class="team-specialty">{{ member.specialty }}</p>
              
              <div class="team-experience">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L10 6L14 6.5L11 10L12 14L8 12L4 14L5 10L2 6.5L6 6L8 2Z" fill="currentColor"/>
                </svg>
                <span>{{ member.experience }}</span>
              </div>

              <div class="team-skills">
                <span class="skill-pill" *ngFor="let skill of member.skills.slice(0, 3)">
                  {{ skill }}
                </span>
              </div>

              <div class="team-languages" *ngIf="member.languages.length > 0">
                <span class="lang-icon">🌐</span>
                <span class="lang-list">{{ member.languages.join(', ') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- REQUISITOS DE SELECCIÓN -->
    <section class="section requirements-section">
      <div class="container">
        <div class="requirements-grid">
          <div class="requirements-content">
            <h2>Proceso de Selección de Élite</h2>
            <p class="requirements-intro">
              Nuestro proceso de selección es uno de los más rigurosos del sector de seguridad privada. 
              Solo el 8% de los candidatos logra completar exitosamente todas las etapas.
            </p>

            <div class="requirements-list">
              <div class="requirement-item">
                <div class="req-number">01</div>
                <div class="req-content">
                  <h4>Experiencia Militar o Policial de Élite</h4>
                  <p>Mínimo 5 años en unidades especiales: GIR, GOE, Fuerzas Especiales, UMO, o equivalentes internacionales.</p>
                </div>
              </div>

              <div class="requirement-item">
                <div class="req-number">02</div>
                <div class="req-content">
                  <h4>Certificaciones Internacionales</h4>
                  <p>Close Protection International, Crisis Management, K&R Specialist, o certificaciones equivalentes vigentes.</p>
                </div>
              </div>

              <div class="requirement-item">
                <div class="req-number">03</div>
                <div class="req-content">
                  <h4>Evaluaciones Psicológicas</h4>
                  <p>Baterías completas de pruebas psicológicas, evaluación de estabilidad emocional y manejo de estrés extremo.</p>
                </div>
              </div>

              <div class="requirement-item">
                <div class="req-number">04</div>
                <div class="req-content">
                  <h4>Antecedentes Impecables</h4>
                  <p>Verificación exhaustiva de antecedentes penales, laborales, financieros y referencias personales.</p>
                </div>
              </div>

              <div class="requirement-item">
                <div class="req-number">05</div>
                <div class="req-content">
                  <h4>Capacitación Continua Obligatoria</h4>
                  <p>200+ horas anuales de entrenamiento, simulacros mensuales, y re-certificación anual de todas las credenciales.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="requirements-stats">
            <div class="process-stat">
              <div class="process-number">500+</div>
              <div class="process-label">Candidatos Evaluados Anualmente</div>
            </div>
            <div class="process-stat">
              <div class="process-number">8%</div>
              <div class="process-label">Tasa de Aprobación</div>
            </div>
            <div class="process-stat">
              <div class="process-number">6-12</div>
              <div class="process-label">Meses de Proceso</div>
            </div>
            <div class="process-stat highlight">
              <div class="process-number">100%</div>
              <div class="process-label">Certificados Internacionalmente</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ENTRENAMIENTO CONTINUO -->
    <section class="section training-section">
      <div class="container">
        <div class="section-header">
          <h2>Capacitación Continua</h2>
          <p class="section-subtitle">
            Entrenamiento permanente en las últimas técnicas y protocolos internacionales
          </p>
        </div>

        <div class="training-grid">
          <div class="training-card">
            <div class="training-icon">🎯</div>
            <h3>Entrenamiento Táctico</h3>
            <ul>
              <li>Técnicas de close protection avanzadas</li>
              <li>Conducción evasiva y ofensiva</li>
              <li>Defensa personal y combate cuerpo a cuerpo</li>
              <li>Uso táctico de armas de fuego</li>
            </ul>
          </div>

          <div class="training-card">
            <div class="training-icon">🧠</div>
            <h3>Análisis y Gestión</h3>
            <ul>
              <li>Análisis de amenazas y vulnerabilidades</li>
              <li>Gestión de crisis y negociación</li>
              <li>Inteligencia táctica y contra-vigilancia</li>
              <li>Planificación de rutas seguras</li>
            </ul>
          </div>

          <div class="training-card">
            <div class="training-icon">⚕️</div>
            <h3>Respuesta Médica</h3>
            <ul>
              <li>Primeros auxilios tácticos (TCCC)</li>
              <li>Manejo de heridas de combate</li>
              <li>Evacuación médica de emergencia</li>
              <li>RCP y desfibrilación</li>
            </ul>
          </div>

          <div class="training-card">
            <div class="training-icon">💻</div>
            <h3>Tecnología y Comunicaciones</h3>
            <ul>
              <li>Sistemas de comunicación encriptada</li>
              <li>Contramedidas electrónicas</li>
              <li>Uso de GPS y rastreo satelital</li>
              <li>Ciberseguridad operacional</li>
            </ul>
          </div>
        </div>

        <div class="training-schedule">
          <h3>Calendario de Entrenamiento 2025</h3>
          <div class="schedule-grid">
            <div class="schedule-item">
              <div class="schedule-month">Mensual</div>
              <div class="schedule-activity">Simulacros Tácticos</div>
            </div>
            <div class="schedule-item">
              <div class="schedule-month">Trimestral</div>
              <div class="schedule-activity">Certificaciones de Armas</div>
            </div>
            <div class="schedule-item">
              <div class="schedule-month">Semestral</div>
              <div class="schedule-activity">Evaluación Psicológica</div>
            </div>
            <div class="schedule-item">
              <div class="schedule-month">Anual</div>
              <div class="schedule-activity">Re-certificación Internacional</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA RECLUTAMIENTO -->
    <section class="section recruitment-cta">
      <div class="container">
        <div class="recruitment-content">
          <h2>¿Eres Ex-Militar o Policía de Élite?</h2>
          <p>
            Buscamos constantemente los mejores profesionales para unirse a nuestro equipo. 
            Si tienes experiencia en unidades especiales y certificaciones internacionales, 
            queremos conocerte.
          </p>
          <div class="recruitment-buttons">
            <button class="btn btn-primary btn-lg" (click)="navigateTo('/contacto')">
              Enviar CV
            </button>
            <button class="btn btn-secondary btn-lg" (click)="navigateTo('/contacto')">
              Ver Requisitos Completos
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="section cta-section">
      <div class="container">
        <h2>¿Listo para Trabajar con los Mejores?</h2>
        <p>Nuestro equipo está preparado para proteger lo que más importa</p>
        <button class="btn btn-primary btn-lg" (click)="navigateTo('/contacto')">
          Solicitar Consulta
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

    /* STATS SECTION */
    .stats-section {
      background: var(--bg-section-light);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 30px;
    }

    .stat-card {
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

    .stat-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .stat-number {
      font-size: 42px;
      font-weight: 800;
      color: var(--primary-blue-dark);
      margin-bottom: 10px;

      .highlight & {
        color: white;
      }
    }

    .stat-label {
      font-size: 16px;
      color: var(--text-muted);

      .highlight & {
        color: rgba(255, 255, 255, 0.95);
      }
    }

    /* SECTION HEADER */
    .section-header {
      text-align: center;
      margin-bottom: 60px;

      .section-label {
        display: block;
        font-size: 14px;
        font-weight: 700;
        color: var(--primary-blue);
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 15px;
      }

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

    /* LEADERSHIP SECTION */
    .leadership-section {
      background: white;
    }

    .leadership-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
      gap: 50px;
    }

    .leader-card {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 30px;
      background: var(--bg-section-light);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-10px);
        box-shadow: var(--shadow-lg);
      }
    }

    .leader-image-container {
      position: relative;
      height: 100%;
      min-height: 500px;
      overflow: hidden;

      &:hover .leader-overlay {
        opacity: 1;
      }
    }

    .leader-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .leader-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, transparent 0%, rgba(72, 127, 192, 0.95) 100%);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 30px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .btn-contact {
      background: white;
      color: var(--primary-blue-dark);
      padding: 12px 30px;
      border: none;
      border-radius: 25px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      }
    }

    .leader-content {
      padding: 40px;

      h3 {
        font-size: 28px;
        color: var(--dark-primary);
        margin-bottom: 10px;
      }

      .leader-position {
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-blue-dark);
        margin-bottom: 5px;
      }

      .leader-specialty {
        font-size: 14px;
        color: var(--text-muted);
        margin-bottom: 20px;
      }
    }

    .leader-experience {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px;
      background: white;
      border-radius: 10px;
      margin-bottom: 25px;

      .experience-icon {
        font-size: 24px;
      }

      span {
        font-size: 14px;
        font-weight: 600;
        color: var(--dark-primary);
      }
    }

    .leader-background,
    .leader-certifications,
    .leader-skills {
      margin-bottom: 25px;

      h4 {
        font-size: 16px;
        color: var(--dark-primary);
        margin-bottom: 12px;
      }

      p {
        font-size: 14px;
        line-height: 1.7;
        color: var(--text-muted);
      }
    }

    .cert-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .cert-tag {
      background: var(--primary-blue);
      color: white;
      padding: 6px 15px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: 600;
    }

    .leader-skills ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
        font-size: 14px;
        color: var(--text-muted);

        .skill-icon {
          color: var(--primary-blue);
          font-weight: 700;
        }
      }
    }

    /* DEPARTMENTS */
    .departments-section {
      background: var(--bg-section-light);
    }

    .departments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 30px;
    }

    .department-card {
      background: white;
      padding: 35px;
      border-radius: 15px;
      box-shadow: var(--shadow-md);
      text-align: center;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-10px);
        box-shadow: var(--shadow-lg);
      }

      .dept-icon {
        font-size: 60px;
        margin-bottom: 20px;
      }

      h3 {
        font-size: 22px;
        color: var(--dark-primary);
        margin-bottom: 15px;
      }

      .dept-description {
        font-size: 14px;
        color: var(--text-muted);
        line-height: 1.6;
        margin-bottom: 20px;
      }

      .dept-members {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: var(--primary-blue-dark);
        font-weight: 600;
        font-size: 14px;
      }
    }

    /* TEAM SECTION */
    .team-section {
      background: white;
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

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 30px;
    }

    .team-card {
      background: var(--bg-section-light);
      border-radius: 15px;
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-10px);
        box-shadow: var(--shadow-lg);
      }
    }

    .team-image-wrapper {
      position: relative;
      height: 320px;
      overflow: hidden;

      &:hover .team-overlay {
        opacity: 1;
      }
    }

    .team-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .team-card:hover .team-image {
      transform: scale(1.1);
    }

    .team-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 20px;
      background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.9) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .overlay-certifications {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .cert-badge {
      background: var(--primary-blue);
      color: white;
      padding: 5px 12px;
      border-radius: 15px;
      font-size: 11px;
      font-weight: 600;
    }

    .team-content {
      padding: 25px;

      h3 {
        font-size: 20px;
        color: var(--dark-primary);
        margin-bottom: 8px;
      }

      .team-position {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-blue-dark);
        margin-bottom: 5px;
      }

      .team-specialty {
        font-size: 13px;
        color: var(--text-muted);
        margin-bottom: 15px;
      }
    }

    .team-experience {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--dark-primary);
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 15px;

      svg {
        color: var(--primary-blue);
      }
    }

    .team-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 15px;
    }

    .skill-pill {
      background: white;
      color: var(--dark-primary);
      padding: 5px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    .team-languages {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--text-muted);
      padding-top: 15px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    /* REQUIREMENTS SECTION */
    .requirements-section {
      background: var(--bg-section-light);
    }

    .requirements-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 60px;
      align-items: start;
    }

    .requirements-content {
      h2 {
        font-size: clamp(2rem, 4vw, 3rem);
        color: var(--dark-primary);
        margin-bottom: 20px;
      }

      .requirements-intro {
        font-size: 1.1rem;
        color: var(--text-muted);
        line-height: 1.8;
        margin-bottom: 40px;
      }
    }

    .requirements-list {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .requirement-item {
      display: flex;
      gap: 25px;
      padding: 30px;
      background: white;
      border-radius: 15px;
      box-shadow: var(--shadow-md);
      transition: all 0.3s ease;

      &:hover {
        transform: translateX(10px);
        box-shadow: var(--shadow-lg);
      }
    }

    .req-number {
      font-size: 32px;
      font-weight: 800;
      color: var(--primary-blue);
      min-width: 60px;
    }

    .req-content {
      h4 {
        font-size: 18px;
        color: var(--dark-primary);
        margin-bottom: 10px;
      }

      p {
        font-size: 14px;
        color: var(--text-muted);
        line-height: 1.7;
      }
    }

    .requirements-stats {
      display: flex;
      flex-direction: column;
      gap: 25px;
      position: sticky;
      top: 100px;
    }

    .process-stat {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: var(--shadow-md);
      text-align: center;

      &.highlight {
        background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
        color: white;
      }

      .process-number {
        font-size: 42px;
        font-weight: 800;
        color: var(--primary-blue-dark);
        margin-bottom: 10px;

        .highlight & {
          color: white;
        }
      }

      .process-label {
        font-size: 14px;
        color: var(--text-muted);
        font-weight: 600;

        .highlight & {
          color: rgba(255, 255, 255, 0.95);
        }
      }
    }

    /* TRAINING SECTION */
    .training-section {
      background: white;
    }

    .training-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 30px;
      margin-bottom: 60px;
    }

    .training-card {
      background: var(--bg-section-light);
      padding: 35px;
      border-radius: 15px;
      box-shadow: var(--shadow-md);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-10px);
        box-shadow: var(--shadow-lg);
      }

      .training-icon {
        font-size: 50px;
        margin-bottom: 20px;
      }

      h3 {
        font-size: 20px;
        color: var(--dark-primary);
        margin-bottom: 20px;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          padding: 8px 0 8px 20px;
          font-size: 14px;
          color: var(--text-muted);
          position: relative;

          &::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--primary-blue);
            font-weight: 700;
          }
        }
      }
    }

    .training-schedule {
      background: var(--bg-section-light);
      padding: 50px;
      border-radius: 20px;

      h3 {
        text-align: center;
        font-size: 28px;
        color: var(--dark-primary);
        margin-bottom: 40px;
      }
    }

    .schedule-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 25px;
    }

    .schedule-item {
      background: white;
      padding: 25px;
      border-radius: 12px;
      text-align: center;
      box-shadow: var(--shadow-md);

      .schedule-month {
        font-size: 18px;
        font-weight: 700;
        color: var(--primary-blue-dark);
        margin-bottom: 10px;
      }

      .schedule-activity {
        font-size: 14px;
        color: var(--text-muted);
      }
    }

    /* RECRUITMENT CTA */
    .recruitment-cta {
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
      color: white;
    }

    .recruitment-content {
      text-align: center;
      max-width: 800px;
      margin: 0 auto;

      h2 {
        font-size: clamp(2rem, 4vw, 3rem);
        margin-bottom: 20px;
      }

      p {
        font-size: 1.1rem;
        line-height: 1.8;
        margin-bottom: 40px;
        opacity: 0.95;
      }
    }

    .recruitment-buttons {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    /* CTA SECTION */
    .cta-section {
      background: var(--dark-primary);
      text-align: center;
      padding: 80px 0;

      h2 {
        color: white;
        font-size: clamp(2rem, 4vw, 3rem);
        margin-bottom: 15px;
      }

      p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.2rem;
        margin-bottom: 30px;
      }
    }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .leadership-grid {
        grid-template-columns: 1fr;
      }

      .leader-card {
        grid-template-columns: 1fr;
      }

      .leader-image-container {
        min-height: 400px;
      }

      .requirements-grid {
        grid-template-columns: 1fr;
      }

      .requirements-stats {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .page-hero {
        padding: 120px 0 60px;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .team-grid,
      .departments-grid,
      .training-grid {
        grid-template-columns: 1fr;
      }

      .leader-content {
        padding: 25px;
      }

      .recruitment-buttons {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class TeamComponent {
  selectedSpecialty: string = 'Todos';

  specialties: string[] = [
    'Todos',
    'Close Protection',
    'K&R Specialist',
    'Análisis de Amenazas',
    'Seguridad Minera',
    'Conducción Táctica'
  ];

  leadership: TeamMember[] = [
    {
      id: 1,
      name: 'Crnl. (r) Patricio Vélez',
      position: 'Director General',
      specialty: 'Close Protection & Crisis Management',
      experience: '25 años - Ex-Comandante GIR',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=600&fit=crop',
      certifications: ['PSP', 'CPP', 'K&R Specialist', 'Crisis Management'],
      background: 'Coronel (r) de las Fuerzas Especiales del Ecuador con 25 años de servicio activo. Ex-Comandante del Grupo de Intervención y Rescate (GIR). Certificado internacionalmente en Close Protection, K&R y gestión de crisis por instituciones británicas y estadounidenses.',
      skills: [
        'Operaciones especiales en zonas de conflicto',
        'Gestión de crisis de alto nivel',
        'Entrenamiento de equipos tácticos',
        'Coordinación con agencias gubernamentales'
      ],
      languages: ['Español', 'Inglés', 'Portugués']
    },
    {
      id: 2,
      name: 'Mayor (r) Carlos Mendoza',
      position: 'Director de Operaciones',
      specialty: 'Seguridad Minera & K&R',
      experience: '18 años - Ex-Fuerzas Especiales',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop',
      certifications: ['K&R Specialist', 'Hostile Environment', 'TCCC'],
      background: 'Mayor (r) de Fuerzas Especiales con especialización en operaciones en ambiente hostil. Más de 12 años de experiencia en seguridad minera en zonas remotas de Ecuador. Experto certificado en K&R con resolución exitosa de múltiples casos.',
      skills: [
        'Seguridad en zonas mineras',
        'Negociación en crisis K&R',
        'Operaciones en ambiente hostil',
        'Gestión de equipos en terreno'
      ],
      languages: ['Español', 'Inglés']
    }
  ];

  departments: Department[] = [
    {
      name: 'Close Protection',
      icon: '🛡️',
      description: 'Protección ejecutiva y escolta personal certificada',
      members: 28
    },
    {
      name: 'K&R Specialist',
      icon: '🎯',
      description: 'Gestión de crisis de secuestro y extorsión',
      members: 8
    },
    {
      name: 'Seguridad Minera',
      icon: '⛏️',
      description: 'Operaciones en zonas remotas y de alto riesgo',
      members: 15
    },
    {
      name: 'Análisis de Amenazas',
      icon: '🔍',
      description: 'Inteligencia táctica y evaluación de riesgos',
      members: 6
    },
    {
      name: 'Conducción Táctica',
      icon: '🚗',
      description: 'Conductores especializados en evasión',
      members: 12
    },
    {
      name: 'Respuesta Médica',
      icon: '⚕️',
      description: 'Paramédicos tácticos certificados TCCC',
      members: 6
    }
  ];

  teamMembers: TeamMember[] = [
    {
      id: 3,
      name: 'Sgto. Juan Ramírez',
      position: 'Líder de Equipo CP',
      specialty: 'Close Protection',
      experience: '12 años - Ex-GIR',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
      certifications: ['Close Protection Int.', 'Advanced Driving', 'TCCC'],
      background: '',
      skills: ['Escolta ejecutiva', 'Conducción evasiva', 'Primeros auxilios'],
      languages: ['Español', 'Inglés']
    },
    {
      id: 4,
      name: 'Cabo Diego Morales',
      position: 'Especialista K&R',
      specialty: 'K&R Specialist',
      experience: '10 años - Ex-UMO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
      certifications: ['K&R Specialist', 'Crisis Negotiation', 'Hostile Env.'],
      background: '',
      skills: ['Negociación', 'Inteligencia táctica', 'Gestión de crisis'],
      languages: ['Español', 'Inglés']
    },
    {
      id: 5,
      name: 'Sgto. Roberto Silva',
      position: 'Supervisor Minero',
      specialty: 'Seguridad Minera',
      experience: '15 años - Ex-GOE',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
      certifications: ['Mining Security', 'K&R', 'First Aid'],
      background: '',
      skills: ['Seguridad en zonas remotas', 'Logística operativa', 'Manejo de conflictos'],
      languages: ['Español']
    },
    {
      id: 6,
      name: 'Analista María Torres',
      position: 'Analista de Amenazas',
      specialty: 'Análisis de Amenazas',
      experience: '8 años - Ex-Inteligencia Militar',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      certifications: ['Threat Analysis', 'OSINT', 'Risk Assessment'],
      background: '',
      skills: ['Inteligencia de fuentes abiertas', 'Evaluación de riesgos', 'Informes tácticos'],
      languages: ['Español', 'Inglés', 'Francés']
    },
    {
      id: 7,
      name: 'Conductor Pedro Gómez',
      position: 'Conductor Táctico',
      specialty: 'Conducción Táctica',
      experience: '14 años - Ex-Policía Nacional',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop',
      certifications: ['Advanced Driving', 'Evasive Maneuvers', 'B6 Vehicles'],
      background: '',
      skills: ['Conducción evasiva', 'Vehículos blindados', 'Rutas seguras'],
      languages: ['Español']
    },
    {
      id: 8,
      name: 'Paramédico Luis Andrade',
      position: 'Paramédico Táctico',
      specialty: 'Close Protection',
      experience: '9 años - Certificado TCCC',
      image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=500&fit=crop',
      certifications: ['TCCC', 'EMT-B', 'Combat Medic'],
      background: '',
      skills: ['Primeros auxilios tácticos', 'Trauma de combate', 'Evacuación médica'],
      languages: ['Español', 'Inglés']
    }
  ];

  constructor(private router: Router) {}

  getFilteredMembers(): TeamMember[] {
    if (this.selectedSpecialty === 'Todos') {
      return this.teamMembers;
    }
    return this.teamMembers.filter(m => m.specialty === this.selectedSpecialty);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}