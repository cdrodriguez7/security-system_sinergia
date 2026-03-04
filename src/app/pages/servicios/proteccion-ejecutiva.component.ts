import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';

interface VehicleType {
  id: string;
  name: string;
  type: string;
  description: string;
  images: { [angle: number]: string };
  features: string[];
  specs: { label: string; value: string; }[];
}

interface Equipment {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  specs: { label: string; value: string; }[];
}

interface SelectedVehicle {
  vehicle: VehicleType;
  quantity: number;
}

@Component({
  selector: 'app-proteccion-ejecutiva',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
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

    <section class="section services-features-section">
      <div class="container">
        <div class="service-intro">
          <h2>¿Qué Incluye Nuestro Servicio?</h2>
          <p>
            Protección ejecutiva discreta y profesional diseñada específicamente para su perfil de riesgo. 
            Nuestro equipo de especialistas certificados garantiza su seguridad en todo momento.
          </p>
        </div>

        <div class="features-grid">
          <!-- SERVICIO 1: Close Protection -->
          <div class="feature-card">
            <div class="feature-background" 
                style="background-image: url('https://www.grsprotection.com/wp-content/uploads/2024/12/global-risk-solutions-situational-awareness-in-cp-scaled.jpg');">
            </div>
            <div class="feature-content">
              <div class="feature-icon"></div>
              <h3>Close Protection 24/7</h3>
              <p>Equipo de escolta personal entrenado en metodologías internacionales</p>
            </div>
          </div>

          <!-- SERVICIO 2: Análisis de Amenazas -->
          <div class="feature-card">
            <div class="feature-background" 
                style="background-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5OU0GhhYAAg43OpqJs3Y3cFdjI5KuDqz4orthdXON0Q&s');">
            </div>
            <div class="feature-content">
              <div class="feature-icon"></div>
              <h3>Análisis de Amenazas</h3>
              <p>Evaluación continua de riesgos y vulnerabilidades</p>
            </div>
          </div>

          <!-- SERVICIO 3: Movilidad Segura -->
          <div class="feature-card">
            <div class="feature-background" 
                style="background-image: url('https://media.istockphoto.com/id/168961182/photo/bodyguard-protecting-politician-in-backseat-of-car.jpg?s=612x612&w=0&k=20&c=Nab9hpJTOLAEjgBIm_ngDzpQOP7SfhJphbyPSGG4C1Q=');">
            </div>
            <div class="feature-content">
              <div class="feature-icon"></div>
              <h3>Movilidad Segura</h3>
              <p>Vehículos blindados y rutas seguras predefinidas</p>
            </div>
          </div>

          <!-- SERVICIO 4: Monitoreo GPS -->
          <div class="feature-card">
            <div class="feature-background" 
                style="background-image: url('https://www.instatelcr.com/wp-content/uploads/freshizer/b3bdddb1f74d2cbaf18cb62c55225f77_Como-maximizar-la-seguridad-de-sus-activos-con-monitoreo-y-rastreo-GPS-863-430-c.jpg');">
            </div>
            <div class="feature-content">
              <div class="feature-icon"></div>
              <h3>Monitoreo GPS</h3>
              <p>Rastreo en tiempo real y comunicaciones encriptadas</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section vehicles-section">
      <div class="container">
        <div class="section-header">
          <h2>Configure su flota de Vehículos Blindados</h2>
          <p class="section-subtitle">
            Seleccione los tipos de vehículos y cantidades que necesita para su operación de seguridad
          </p>
        </div>

        <div class="vehicle-selector">
          <h3>1. Seleccione Vehículos y Cantidades</h3>
          <p class="selector-hint">Puede seleccionar múltiples tipos de vehículos</p>
          
          <div class="vehicle-types-grid">
            <div class="vehicle-type-card" 
                 *ngFor="let vehicle of vehicleTypes"
                 [class.selected]="isVehicleSelected(vehicle.id)"
                 (click)="previewVehicle(vehicle)">
              <div class="vehicle-icon-container">
                <img [src]="vehicle.images[90]" [alt]="vehicle.name" class="vehicle-image-thumb">
              </div>
              <h4>{{ vehicle.name }}</h4>
              <p class="vehicle-type-label">{{ vehicle.type }}</p>
              
              <!-- CONTADOR DE CANTIDAD -->
              <div class="quantity-controls" (click)="$event.stopPropagation()">
                <button class="quantity-btn minus" 
                        (click)="decreaseQuantity(vehicle)"
                        [disabled]="getVehicleQuantity(vehicle.id) === 0">
                  −
                </button>
                <input type="number" 
                       class="quantity-input" 
                       [value]="getVehicleQuantity(vehicle.id)"
                       (input)="setQuantity(vehicle, $event)"
                       min="0"
                       max="99"
                       (click)="$event.stopPropagation()">
                <button class="quantity-btn plus" 
                        (click)="increaseQuantity(vehicle)"
                        [disabled]="getVehicleQuantity(vehicle.id) >= 99">
                  +
                </button>
              </div>
              
              <!-- INDICADOR DE SELECCIÓN -->
            </div>
          </div>
        </div>

        <!-- VISTA PREVIA DEL VEHÍCULO -->
        <div class="vehicle-details" *ngIf="previewedVehicle">
          <div class="vehicle-display">
            <div class="vehicle-360">
              <div class="rotation-controls">
                <button class="rotation-btn" (click)="rotateVehicle('left')">
                  ←
                </button>
                <span class="rotation-indicator">Vista {{ currentRotation }}°</span>
                <button class="rotation-btn" (click)="rotateVehicle('right')">
                  →
                </button>
              </div>
              
              <div class="vehicle-view-large">
                <img [src]="getRotatedImage()" 
                     [alt]="previewedVehicle.name" 
                     class="vehicle-image-xlarge">
              </div>
              
              <p class="rotation-hint">← Usa las flechas para rotar la vista →</p>
            </div>

            <div class="vehicle-info">
              <h3>{{ previewedVehicle.name }}</h3>
              <p class="vehicle-description">{{ previewedVehicle.description }}</p>
              
              <div class="vehicle-features">
                <h4>Características Incluidas:</h4>
                <ul>
                  <li *ngFor="let feature of previewedVehicle.features">
                    <span class="check-icon">✓</span>
                    {{ feature }}
                  </li>
                </ul>
              </div>

              <div class="vehicle-specs">
                <h4>Especificaciones de Blindaje:</h4>
                <div class="spec-item" *ngFor="let spec of previewedVehicle.specs">
                  <span class="spec-label">{{ spec.label }}</span>
                  <span class="spec-value">{{ spec.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- EQUIPAMIENTO -->
        <div class="equipment-selector" *ngIf="selectedVehicles.length > 0">
          <h3>2. Seleccione Equipamiento Adicional</h3>
          <div class="equipment-grid">
            <div class="equipment-card" 
                 *ngFor="let item of equipment"
                 [class.selected]="isEquipmentSelected(item.id)"
                 (click)="toggleEquipment(item)">
              <div class="equipment-checkbox">
                <span *ngIf="isEquipmentSelected(item.id)">✓</span>
              </div>
              <div class="equipment-icon">{{ item.icon }}</div>
              <h4>{{ item.name }}</h4>
              <p class="equipment-category">{{ item.category }}</p>
              <p class="equipment-description">{{ item.description }}</p>
            </div>
          </div>
        </div>

        <!-- RESUMEN DE COTIZACIÓN -->
        <div class="quote-summary" *ngIf="selectedVehicles.length > 0">
          <div class="summary-content">
            <h3>Resumen de Configuración</h3>
            <div class="summary-items">
              <div class="summary-item">
                <span class="summary-label">Vehículos Seleccionados:</span>
                <div class="selected-vehicles-list">
                  <div class="vehicle-summary-item" *ngFor="let sv of selectedVehicles">
                    <span class="vehicle-quantity-badge">{{ sv.quantity }}x</span>
                    <span class="vehicle-name">{{ sv.vehicle.name }}</span>
                    <span class="vehicle-type">({{ sv.vehicle.type }})</span>
                  </div>
                </div>
              </div>
              
              <div class="summary-item">
                <span class="summary-label">Total de Vehículos:</span>
                <span class="summary-value total-vehicles">{{ getTotalVehicles() }} unidades</span>
              </div>
              
              <div class="summary-item" *ngIf="selectedEquipment.length > 0">
                <span class="summary-label">Equipamiento Seleccionado:</span>
                <div class="selected-equipment-list">
                  <span *ngFor="let eq of selectedEquipment" class="equipment-tag">
                    {{ eq.name }}
                  </span>
                </div>
              </div>
            </div>
            <button class="btn btn-primary btn-lg" (click)="requestCustomQuote()">
              Solicitar Cotización Personalizada
            </button>
            <p class="quote-note">
              * Un asesor de seguridad se pondrá en contacto en menos de 24 horas
            </p>
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
        transition: color 0.2s;

        &:hover {
          color: var(--primary-blue);
        }
      }

      span {
        color: rgba(255, 255, 255, 0.6);
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

    /* ========================================
       SECCIÓN DE SERVICIOS
       ======================================== */
    .services-features-section {
      padding: 100px 0;
      background: var(--bg-section-light);
    }

    /* SERVICE INTRO */
    .service-intro {
      text-align: center;
      max-width: 800px;
      margin: 0 auto 60px;

      h2 {
        margin-bottom: 20px;
        color: var(--dark-primary);
      }

      p {
        color: #6B7280;
        font-size: 1.1rem;
        line-height: 1.8;
      }
    }

    /* FEATURES GRID */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr); 
      gap: 25px;
      margin-top: 50px;
    }

    /* ========================================
       FEATURE CARD CON IMAGEN DE FONDO
       ======================================== */
    .feature-card {
      position: relative;
      aspect-ratio: 1 / 1; 
      border-radius: 20px;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      transition: all 0.4s ease;
    }

    .feature-card:hover {
      transform: translateY(-15px) scale(1.02);
      box-shadow: 0 20px 50px rgba(72, 127, 192, 0.4);
    }

    /* IMAGEN DE FONDO DE CADA TARJETA */
    .feature-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      transition: transform 0.4s ease;
    }

    .feature-card:hover .feature-background {
      transform: scale(1.1);
    }

    /* OVERLAY OSCURO SOBRE LA IMAGEN */
    .feature-background::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        180deg,
        rgba(79, 79, 79, 0.5) 0%,
        rgba(79, 79, 79, 0.85) 100%
      );
      transition: background 0.3s ease;
    }

    .feature-card:hover .feature-background::before {
      background: linear-gradient(
        180deg,
        rgba(72, 127, 192, 0.6) 0%,
        rgba(72, 127, 192, 0.9) 100%
      );
    }

    /* CONTENIDO DE LA TARJETA */
    .feature-content {
      position: relative;
      z-index: 2;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 35px;
      color: var(--text-light);
    }

    .feature-icon {
      font-size: 56px;
      margin-bottom: 20px;
      filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
      transition: transform 0.3s ease;
    }

    .feature-card:hover .feature-icon {
      transform: scale(1.15) rotate(-5deg);
    }

    .feature-card h3 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 12px;
      color: var(--text-light);
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
      transition: transform 0.3s ease;
    }

    .feature-card:hover h3 {
      transform: translateX(5px);
    }

    .feature-card p {
      color: rgba(255, 255, 255, 0.95);
      line-height: 1.6;
      font-size: 15px;
      text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
      transition: transform 0.3s ease;
    }

    .feature-card:hover p {
      transform: translateX(5px);
    }

    /* BARRA DECORATIVA INFERIOR */
    .feature-card::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(
        90deg,
        var(--primary-blue) 0%,
        var(--primary-blue-dark) 100%
      );
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.4s ease;
      z-index: 3;
    }

    .feature-card:hover::after {
      transform: scaleX(1);
    }

    /* VEHICLES SECTION */
    .vehicles-section {
      background: var(--bg-section-light);
    }

    .section-header {
      text-align: center;
      margin-bottom: 60px;

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

    /* VEHICLE SELECTOR */
    .vehicle-selector {
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: var(--shadow-md);
      margin-bottom: 40px;

      h3 {
        font-size: 24px;
        color: var(--dark-primary);
        margin-bottom: 30px;
        text-align: center;
      }
    }

    .selector-hint {
      text-align: center;
      color: var(--text-muted);
      font-size: 14px;
      margin-top: -15px;
      margin-bottom: 25px;
    }

    .vehicle-types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 20px;
    }

    .vehicle-type-card {
      background: var(--bg-section-light);
      padding: 20px 15px;
      border-radius: 15px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 3px solid transparent;
      position: relative;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      }

      &.selected {
        border-color: var(--primary-blue);
        background: white;
        box-shadow: 0 8px 25px rgba(144, 194, 227, 0.4);
      }

      .vehicle-icon-container {
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 15px;
      }

      .vehicle-image-thumb {
        width: 100%;
        max-width: 140px;
        height: 100%;
        object-fit: contain;
        transition: transform 0.3s ease;
      }

      &:hover .vehicle-image-thumb {
        transform: scale(1.05);
      }

      h4 {
        font-size: 16px;
        font-weight: 700;
        color: var(--dark-primary);
        margin-bottom: 5px;
      }

      .vehicle-type-label {
        font-size: 13px;
        color: var(--text-muted);
        margin: 0 0 15px 0;
      }
    }

    /* CONTROLES DE CANTIDAD */
    .quantity-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 15px;
      padding: 10px;
      background: rgba(144, 194, 227, 0.05);
      border-radius: 10px;
    }

    .quantity-btn {
      width: 35px;
      height: 35px;
      border: 2px solid var(--primary-blue);
      background: white;
      color: var(--primary-blue);
      border-radius: 8px;
      font-size: 20px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover:not(:disabled) {
        background: var(--primary-blue);
        color: white;
        transform: scale(1.1);
      }

      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      &:active:not(:disabled) {
        transform: scale(0.95);
      }
    }

    .quantity-input {
      width: 60px;
      height: 35px;
      text-align: center;
      border: 2px solid var(--primary-blue);
      border-radius: 8px;
      font-size: 16px;
      font-weight: 700;
      color: var(--dark-primary);
      background: white;
      
      -moz-appearance: textfield;
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }

    /* BADGE DE SELECCIÓN */
    .selection-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(72, 127, 192, 0.4);
      animation: slideInRight 0.3s ease;
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* VEHICLE DETAILS - 360 VIEW */
    .vehicle-details {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: var(--shadow-md);
      margin-bottom: 40px;
    }

    .vehicle-display {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 0;
    }

    .vehicle-360 {
      background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf0 100%);
      padding: 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-right: 2px solid var(--bg-section-light);
    }

    .rotation-controls {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 30px;

      .rotation-btn {
        width: 50px;
        height: 50px;
        border: 2px solid var(--primary-blue);
        background: white;
        border-radius: 50%;
        font-size: 24px;
        color: var(--primary-blue);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;

        &:hover {
          background: var(--primary-blue);
          color: white;
          transform: scale(1.1);
        }

        &:active {
          transform: scale(0.95);
        }
      }

      .rotation-indicator {
        font-size: 16px;
        font-weight: 700;
        color: var(--dark-primary);
        min-width: 100px;
        text-align: center;
      }
    }

    .vehicle-view-large {
      width: 100%;
      max-width: 600px;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .vehicle-image-xlarge {
      width: 100%;
      height: 100%;
      object-fit: contain;
      animation: fadeIn 0.2s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0.7; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }

    .rotation-hint {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 20px;
      text-align: center;
    }

    .vehicle-info {
      padding: 50px 40px;

      h3 {
        font-size: 28px;
        color: var(--dark-primary);
        margin-bottom: 15px;
      }

      .vehicle-description {
        color: var(--text-muted);
        line-height: 1.7;
        margin-bottom: 30px;
      }

      .vehicle-features {
        margin-bottom: 30px;

        h4 {
          font-size: 18px;
          color: var(--dark-primary);
          margin-bottom: 15px;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            padding: 8px 0;
            color: var(--text-muted);
            display: flex;
            align-items: center;
            gap: 10px;

            .check-icon {
              color: var(--primary-blue);
              font-weight: 700;
              font-size: 18px;
            }
          }
        }
      }

      .vehicle-specs {
        background: var(--bg-section-light);
        padding: 20px;
        border-radius: 10px;

        h4 {
          font-size: 16px;
          color: var(--dark-primary);
          margin-bottom: 15px;
        }

        .spec-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
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
            font-weight: 500;
          }
        }
      }
    }

    /* EQUIPMENT SELECTOR */
    .equipment-selector {
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: var(--shadow-md);
      margin-bottom: 40px;

      h3 {
        font-size: 24px;
        color: var(--dark-primary);
        margin-bottom: 30px;
        text-align: center;
      }
    }

    .equipment-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .equipment-card {
      background: var(--bg-section-light);
      padding: 25px;
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 3px solid transparent;
      position: relative;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      }

      &.selected {
        border-color: var(--primary-blue);
        background: white;
        box-shadow: 0 8px 25px rgba(144, 194, 227, 0.4);

        .equipment-checkbox {
          background: var(--primary-blue);
          color: white;
        }
      }

      .equipment-checkbox {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 30px;
        height: 30px;
        border: 2px solid var(--primary-blue);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 700;
        transition: all 0.3s ease;
      }

      .equipment-icon {
        font-size: 40px;
        margin-bottom: 15px;
        text-align: center;
      }

      h4 {
        font-size: 18px;
        font-weight: 700;
        color: var(--dark-primary);
        margin-bottom: 5px;
      }

      .equipment-category {
        font-size: 12px;
        color: var(--primary-blue);
        font-weight: 600;
        text-transform: uppercase;
        margin-bottom: 10px;
      }

      .equipment-description {
        font-size: 14px;
        color: var(--text-muted);
        line-height: 1.5;
        margin: 0;
      }
    }

    /* QUOTE SUMMARY */
    .quote-summary {
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
      border-radius: 20px;
      padding: 50px;
      text-align: center;
      box-shadow: var(--shadow-lg);

      .summary-content {
        max-width: 800px;
        margin: 0 auto;

        h3 {
          font-size: 32px;
          color: white;
          margin-bottom: 30px;
        }

        .summary-items {
          background: white;
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 30px;
          text-align: left;

          .summary-item {
            padding: 15px 0;
            border-bottom: 1px solid var(--bg-section-light);

            &:last-child {
              border-bottom: none;
            }

            .summary-label {
              display: block;
              font-weight: 700;
              color: var(--dark-primary);
              margin-bottom: 12px;
              font-size: 16px;
            }

            .summary-value {
              display: block;
              color: var(--text-muted);
              font-size: 18px;
            }
          }
        }

        .btn {
          margin-bottom: 15px;
        }

        .quote-note {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }
      }
    }

    /* LISTA DE VEHÍCULOS SELECCIONADOS */
    .selected-vehicles-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 15px;
    }

    .vehicle-summary-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--bg-section-light);
      border-radius: 10px;
      border-left: 4px solid var(--primary-blue);
    }

    .vehicle-quantity-badge {
      background: var(--primary-blue);
      color: white;
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 14px;
      min-width: 45px;
      text-align: center;
    }

    .vehicle-name {
      font-weight: 700;
      color: var(--dark-primary);
      font-size: 16px;
    }

    .vehicle-type {
      color: var(--text-muted);
      font-size: 14px;
    }

    .total-vehicles {
      font-size: 24px !important;
      font-weight: 700 !important;
      color: var(--primary-blue-dark) !important;
    }

    .selected-equipment-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;

      .equipment-tag {
        background: var(--bg-section-light);
        color: var(--dark-primary);
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
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
        color: rgba(255, 255, 255, 0.8);
        font-size: 1.2rem;
        margin-bottom: 30px;
      }
    }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .vehicle-display {
        grid-template-columns: 1fr;
      }

      .vehicle-360 {
        border-right: none;
        border-bottom: 2px solid var(--bg-section-light);
      }
    }

    @media (max-width: 768px) {
      .page-hero {
        padding: 120px 0 60px;
      }

      .services-features-section {
        padding: 60px 0;
      }

      .features-grid {
        grid-template-columns: 1fr;
        gap: 25px;
      }

      .feature-card {
        height: 320px;
      }

      .feature-content {
        padding: 25px;
      }

      .feature-icon {
        font-size: 48px;
      }

      .feature-card h3 {
        font-size: 22px;
      }

      .feature-card p {
        font-size: 14px;
      }

      .vehicle-types-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .equipment-grid {
        grid-template-columns: 1fr;
      }

      .vehicle-selector,
      .equipment-selector,
      .quote-summary {
        padding: 25px;
      }

      .vehicle-info {
        padding: 30px 25px;
      }

      .vehicle-360 {
        padding: 30px 20px;
      }

      .rotation-controls {
        .rotation-btn {
          width: 40px;
          height: 40px;
          font-size: 20px;
        }
      }

      .vehicle-view-large {
        max-width: 400px;
        height: 300px;
      }
    }

    @media (max-width: 480px) {
      .feature-card {
        height: 300px;
      }

      .feature-icon {
        font-size: 42px;
        margin-bottom: 15px;
      }

      .feature-card h3 {
        font-size: 20px;
      }

      .vehicle-types-grid {
        grid-template-columns: 1fr;
      }

      .vehicle-view-large {
        max-width: 320px;
        height: 240px;
      }
    }
  `]
})
export class ProteccionEjecutivaComponent {
  previewedVehicle: VehicleType | null = null;
  selectedVehicles: SelectedVehicle[] = [];
  selectedEquipment: Equipment[] = [];
  currentRotation: number = 0;

  vehicleTypes: VehicleType[] = [];

  equipment: Equipment[] = [
    {
      id: 'comm',
      name: 'Sistema de Comunicación Segura',
      category: 'Comunicaciones',
      description: 'Radio encriptado AES-256 con alcance de 50km y batería de 24 horas.',
      icon: '📡',
      specs: [
        { label: 'Encriptación', value: 'AES-256' },
        { label: 'Alcance', value: '50 km' },
        { label: 'Batería', value: '24 horas' }
      ]
    },
    {
      id: 'gps',
      name: 'Rastreo GPS Avanzado',
      category: 'Monitoreo',
      description: 'Sistema de rastreo satelital con botón de pánico y geofencing.',
      icon: '🛰️',
      specs: [
        { label: 'Precisión', value: '5 metros' },
        { label: 'Actualización', value: 'Tiempo real' },
        { label: 'Backup', value: 'Batería 72h' }
      ]
    },
    {
      id: 'armor',
      name: 'Chalecos Balísticos NIJ III',
      category: 'Protección Personal',
      description: 'Chalecos antibalas nivel III certificados por NIJ, incluye 4 unidades.',
      icon: '🛡️',
      specs: [
        { label: 'Nivel', value: 'NIJ III' },
        { label: 'Peso', value: '3.5 kg' },
        { label: 'Material', value: 'Kevlar' }
      ]
    },
    {
      id: 'medical',
      name: 'Kit Médico Táctico',
      category: 'Emergencias',
      description: 'Kit completo de primeros auxilios tácticos con torniquetes y vendajes.',
      icon: '⚕️',
      specs: [
        { label: 'Contenido', value: '50+ items' },
        { label: 'Certificación', value: 'Militar' },
        { label: 'Validez', value: '3 años' }
      ]
    },
    {
      id: 'jammer',
      name: 'Inhibidor de Señales',
      category: 'Contramedidas',
      description: 'Bloqueador de frecuencias para prevenir detonaciones remotas.',
      icon: '📵',
      specs: [
        { label: 'Frecuencias', value: '20MHz-6GHz' },
        { label: 'Radio', value: '50 metros' },
        { label: 'Batería', value: '8 horas' }
      ]
    },
    {
      id: 'camera',
      name: 'Sistema de Cámaras 360°',
      category: 'Vigilancia',
      description: 'Cámaras perimetrales con visión nocturna y grabación continua.',
      icon: '📹',
      specs: [
        { label: 'Cámaras', value: '6 unidades' },
        { label: 'Resolución', value: '4K' },
        { label: 'Almacenamiento', value: '1TB' }
      ]
    }
  ];

  constructor(private router: Router) {
    this.initializeVehicles();
  }

  initializeVehicles() {
    this.vehicleTypes = [
      {
        id: 'sedan',
        name: 'Sedán',
        type: 'Ejecutivo',
        description: 'Vehículo sedán blindado ideal para desplazamientos ejecutivos discretos. Combina elegancia, confort y máxima seguridad con blindaje nivel B6/B7.',
        images: {
          0: 'assets/vehicles/sedan/0.png',
          90: 'assets/vehicles/sedan/90.png',
          180: 'assets/vehicles/sedan/180.png',
          270: 'assets/vehicles/sedan/270.png'
        },
        features: [
          'Blindaje certificado nivel B6/B7',
          'Vidrios anti-bala de 4 capas',
          'Sistema de escape a prueba de explosivos',
          'Neumáticos run-flat',
          'GPS y comunicación satelital encriptada',
          'Capacidad: 4-5 pasajeros'
        ],
        specs: [
          { label: 'Blindaje', value: 'Nivel B6/B7' },
          { label: 'Motor', value: 'V6 3.5L' },
          { label: 'Pasajeros', value: '4-5' },
          { label: 'Autonomía', value: '600 km' },
          { label: 'Peso adicional', value: '+800 kg' }
        ]
      },
      {
        id: 'suv',
        name: 'SUV',
        type: 'Versátil',
        description: 'SUV blindado de alto rendimiento, perfecto para terrenos variados. Ofrece mayor capacidad de pasajeros y espacio interior sin comprometer la protección.',
        images: {
          0: 'assets/vehicles/suv/0.png',
          90: 'assets/vehicles/suv/90.png',
          180: 'assets/vehicles/suv/180.png',
          270: 'assets/vehicles/suv/270.png'
        },
        features: [
          'Blindaje certificado nivel B6',
          'Suspensión reforzada para peso adicional',
          'Sistema 4x4 con control de tracción',
          'Vidrios polarizados anti-bala',
          'Sistema de comunicación avanzado',
          'Capacidad: 5-7 pasajeros'
        ],
        specs: [
          { label: 'Blindaje', value: 'Nivel B6' },
          { label: 'Motor', value: 'V8 5.7L' },
          { label: 'Pasajeros', value: '5-7' },
          { label: 'Autonomía', value: '700 km' },
          { label: 'Peso adicional', value: '+1000 kg' }
        ]
      },
      {
        id: 'todoterreno',
        name: 'Todo Terreno',
        type: 'Extremo',
        description: 'Vehículo todoterreno blindado para operaciones en zonas de difícil acceso. Diseñado para enfrentar terrenos complejos manteniendo la máxima protección.',
        images: {
          0: 'assets/vehicles/todoterreno/0.png',
          90: 'assets/vehicles/todoterreno/90.png',
          180: 'assets/vehicles/todoterreno/180.png',
          270: 'assets/vehicles/todoterreno/270.png'
        },
        features: [
          'Blindaje militar nivel B7',
          'Suspensión off-road reforzada',
          'Protección de bajos y tanque de combustible',
          'Sistema de tracción total permanente',
          'Neumáticos todoterreno run-flat',
          'Capacidad: 4-5 pasajeros'
        ],
        specs: [
          { label: 'Blindaje', value: 'Nivel B7' },
          { label: 'Motor', value: 'V8 5.0L Diesel' },
          { label: 'Pasajeros', value: '4-5' },
          { label: 'Autonomía', value: '650 km' },
          { label: 'Peso adicional', value: '+1200 kg' }
        ]
      },
      {
        id: 'pickup',
        name: 'Camioneta',
        type: 'Operativo',
        description: 'Camioneta pick-up blindada para operaciones de logística y transporte de valores. Combina capacidad de carga con protección balística certificada.',
        images: {
          0: 'assets/vehicles/pickup/0.png',
          90: 'assets/vehicles/pickup/90.png',
          180: 'assets/vehicles/pickup/180.png',
          270: 'assets/vehicles/pickup/270.png'
        },
        features: [
          'Blindaje de cabina nivel B6',
          'Platón reforzado con cobertura opcional',
          'Sistema de suspensión heavy-duty',
          'Capacidad de remolque aumentada',
          'GPS y rastreo satelital',
          'Capacidad: 4-5 pasajeros'
        ],
        specs: [
          { label: 'Blindaje', value: 'Nivel B6' },
          { label: 'Motor', value: 'V6 3.5L Turbo' },
          { label: 'Pasajeros', value: '4-5' },
          { label: 'Carga', value: '800 kg' },
          { label: 'Peso adicional', value: '+900 kg' }
        ]
      },
      {
        id: 'hatchback',
        name: 'Hatchback',
        type: 'Urbano',
        description: 'Vehículo compacto blindado ideal para desplazamientos urbanos discretos. Ágil en tráfico denso sin sacrificar protección certificada.',
        images: {
          0: 'assets/vehicles/hatchback/0.png',
          90: 'assets/vehicles/hatchback/90.png',
          180: 'assets/vehicles/hatchback/180.png',
          270: 'assets/vehicles/hatchback/270.png'
        },
        features: [
          'Blindaje certificado nivel B4/B6',
          'Diseño compacto para maniobras urbanas',
          'Bajo consumo de combustible',
          'Sistema de comunicación integrado',
          'Vidrios anti-bala',
          'Capacidad: 4 pasajeros'
        ],
        specs: [
          { label: 'Blindaje', value: 'Nivel B4/B6' },
          { label: 'Motor', value: 'I4 2.0L' },
          { label: 'Pasajeros', value: '4' },
          { label: 'Autonomía', value: '550 km' },
          { label: 'Peso adicional', value: '+600 kg' }
        ]
      },
      {
        id: 'motocicleta',
        name: 'Motocicleta',
        type: 'Táctica',
        description: 'Motocicleta táctica blindada para desplazamientos rápidos en zonas urbanas. Ideal para escoltas móviles y operaciones de reconocimiento con máxima agilidad.',
        images: {
          0: 'assets/vehicles/motocicleta/0.png',
          90: 'assets/vehicles/motocicleta/90.png',
          180: 'assets/vehicles/motocicleta/180.png'
        },
        features: [
          'Chasis reforzado con placas balísticas',
          'Sistema de comunicación integrado',
          'GPS de rastreo en tiempo real',
          'Maletas laterales blindadas',
          'Neumáticos anti-pinchazo',
          'Capacidad: 1-2 personas'
        ],
        specs: [
          { label: 'Protección', value: 'Nivel B4' },
          { label: 'Motor', value: 'Parallel Twin 650cc' },
          { label: 'Pasajeros', value: '1-2' },
          { label: 'Autonomía', value: '400 km' },
          { label: 'Velocidad máx.', value: '180 km/h' }
        ]
      }
    ];
  }

  // MÉTODOS PARA MANEJO DE CANTIDADES
  
  getVehicleQuantity(vehicleId: string): number {
    const selected = this.selectedVehicles.find(sv => sv.vehicle.id === vehicleId);
    return selected ? selected.quantity : 0;
  }

  isVehicleSelected(vehicleId: string): boolean {
    return this.getVehicleQuantity(vehicleId) > 0;
  }

  increaseQuantity(vehicle: VehicleType) {
    const existing = this.selectedVehicles.find(sv => sv.vehicle.id === vehicle.id);
    
    if (existing) {
      if (existing.quantity < 99) {
        existing.quantity++;
      }
    } else {
      this.selectedVehicles.push({ vehicle, quantity: 1 });
      this.previewedVehicle = vehicle;
      this.currentRotation = 0;
    }
  }

  decreaseQuantity(vehicle: VehicleType) {
    const existing = this.selectedVehicles.find(sv => sv.vehicle.id === vehicle.id);
    
    if (existing) {
      existing.quantity--;
      if (existing.quantity === 0) {
        this.selectedVehicles = this.selectedVehicles.filter(sv => sv.vehicle.id !== vehicle.id);
        if (this.previewedVehicle?.id === vehicle.id) {
          this.previewedVehicle = this.selectedVehicles.length > 0 ? this.selectedVehicles[0].vehicle : null;
        }
      }
    }
  }

  setQuantity(vehicle: VehicleType, event: Event) {
    const input = event.target as HTMLInputElement;
    let quantity = parseInt(input.value) || 0;
    
    if (quantity < 0) quantity = 0;
    if (quantity > 99) quantity = 99;
    
    const existing = this.selectedVehicles.find(sv => sv.vehicle.id === vehicle.id);
    
    if (quantity === 0) {
      this.selectedVehicles = this.selectedVehicles.filter(sv => sv.vehicle.id !== vehicle.id);
      if (this.previewedVehicle?.id === vehicle.id) {
        this.previewedVehicle = this.selectedVehicles.length > 0 ? this.selectedVehicles[0].vehicle : null;
      }
    } else if (existing) {
      existing.quantity = quantity;
    } else {
      this.selectedVehicles.push({ vehicle, quantity });
      this.previewedVehicle = vehicle;
      this.currentRotation = 0;
    }
    
    input.value = quantity.toString();
  }

  previewVehicle(vehicle: VehicleType) {
    this.previewedVehicle = vehicle;
    this.currentRotation = 0;
  }

  getTotalVehicles(): number {
    return this.selectedVehicles.reduce((total, sv) => total + sv.quantity, 0);
  }

  // MÉTODOS PARA EQUIPAMIENTO
  
  toggleEquipment(item: Equipment) {
    const index = this.selectedEquipment.findIndex(eq => eq.id === item.id);
    if (index > -1) {
      this.selectedEquipment.splice(index, 1);
    } else {
      this.selectedEquipment.push(item);
    }
  }

  isEquipmentSelected(id: string): boolean {
    return this.selectedEquipment.some(eq => eq.id === id);
  }

  // MÉTODOS PARA ROTACIÓN
  
  rotateVehicle(direction: 'left' | 'right') {
    if (!this.previewedVehicle) return;
    
    const availableAngles = this.previewedVehicle.id === 'motocicleta' 
      ? [0, 90, 180] 
      : [0, 90, 180, 270];
    
    const currentIndex = availableAngles.indexOf(this.currentRotation);
    
    if (direction === 'left') {
      const newIndex = (currentIndex - 1 + availableAngles.length) % availableAngles.length;
      this.currentRotation = availableAngles[newIndex];
    } else {
      const newIndex = (currentIndex + 1) % availableAngles.length;
      this.currentRotation = availableAngles[newIndex];
    }
  }

  getRotatedImage(): string {
    if (!this.previewedVehicle) return '';
    
    if (this.previewedVehicle.images[this.currentRotation]) {
      return this.previewedVehicle.images[this.currentRotation];
    }
    
    const availableAngles = this.previewedVehicle.id === 'motocicleta' 
      ? [0, 90, 180] 
      : [0, 90, 180, 270];
    
    return this.previewedVehicle.images[availableAngles[0]];
  }

  // NAVEGACIÓN
  
  requestCustomQuote() {
    const vehiclesSummary = this.selectedVehicles
      .map(sv => `${sv.quantity}x ${sv.vehicle.name}`)
      .join(', ');
    const equipmentNames = this.selectedEquipment.map(eq => eq.name).join(', ');
    
    this.router.navigate(['/contacto'], { 
      queryParams: { 
        service: 'proteccion-ejecutiva',
        vehicles: vehiclesSummary,
        total: this.getTotalVehicles(),
        equipment: equipmentNames
      } 
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}