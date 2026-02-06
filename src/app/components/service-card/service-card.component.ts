import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="service-card" 
         [style.background-image]="'url(' + imageUrl + ')'"
         (click)="navigateToService()">
      <div class="card-overlay"></div>
      <div class="card-content">
        <h3 class="card-title">{{ title }}</h3>
        <button class="btn-read-more">
          Leer más
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
      
      <!-- Hover State con información -->
      <div class="card-hover-content">
        <h3 class="hover-title">{{ title }}</h3>
        <p class="hover-description">{{ description }}</p>
        <ul class="hover-features">
          <li *ngFor="let feature of features">
            <span class="check">✓</span>
            {{ feature }}
          </li>
        </ul>
        <button class="btn-primary-hover">
          Ver servicios
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .service-card {
      position: relative;
      height: 400px;
      border-radius: 20px;
      overflow: hidden;
      cursor: pointer;
      background-size: cover;
      background-position: center;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        180deg,
        rgba(26, 29, 35, 0.3) 0%,
        rgba(26, 29, 35, 0.7) 50%,
        rgba(26, 29, 35, 0.9) 100%
      );
      transition: all 0.4s ease;
    }

    .card-content {
      position: relative;
      z-index: 2;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 30px;
      transition: all 0.4s ease;
    }

    .card-title {
      color: var(--text-light);
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 20px;
      line-height: 1.2;
      transition: all 0.4s ease;
    }

    .btn-read-more {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 28px;
      background: var(--primary-gold);
      color: var(--dark-primary);
      border: none;
      border-radius: 50px;
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.3s ease;
      width: fit-content;
    }

    .btn-read-more svg {
      stroke: currentColor;
      transition: transform 0.3s ease;
    }

    .btn-read-more:hover svg {
      transform: translateX(5px);
    }

    /* HOVER STATE */
    .card-hover-content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(26, 29, 35, 0.97);
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow-y: auto;
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s ease;
      z-index: 3;
    }

    .service-card:hover .card-hover-content {
      opacity: 1;
      visibility: visible;
    }

    .service-card:hover .card-overlay {
      background: rgba(26, 29, 35, 0.95);
    }

    .hover-title {
      color: var(--primary-gold);
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 8px;
      flex-shrink: 0;
    }

    .hover-description {
      color: rgba(255, 255, 255, 0.9);
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 12px;
      flex-shrink: 0;
    }

    .hover-features {
      list-style: none;
      margin: 0 0 14px 0;
      padding: 0;
      flex-shrink: 0;
    }

    .hover-features li {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 4px 0;
      color: rgba(255, 255, 255, 0.85);
      font-size: 13px;
      line-height: 1.3;
    }

    .check {
      width: 20px;
      height: 20px;
      min-width: 20px;
      background: var(--primary-gold);
      color: var(--dark-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 10px;
      flex-shrink: 0;
    }

    .btn-primary-hover {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 11px 26px;
      background: var(--primary-gold);
      color: var(--dark-primary);
      border: none;
      border-radius: 50px;
      font-weight: 700;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.3s ease;
      width: fit-content;
      flex-shrink: 0;
      box-shadow: 0 4px 20px rgba(229, 198, 67, 0.3);
    }

    .btn-primary-hover:hover {
      background: var(--primary-gold-dark);
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(229, 198, 67, 0.5);
    }

    .btn-primary-hover svg {
      stroke: currentColor;
      transition: transform 0.3s ease;
    }

    .btn-primary-hover:hover svg {
      transform: translateX(5px);
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .service-card {
        height: 350px;
      }

      .card-title {
        font-size: 22px;
      }

      .hover-title {
        font-size: 18px;
      }

      .hover-description {
        font-size: 12px;
        margin-bottom: 10px;
      }

      .hover-features li {
        font-size: 12px;
        padding: 3px 0;
      }

      .card-hover-content {
        padding: 20px 16px;
      }

      .btn-primary-hover {
        padding: 10px 22px;
        font-size: 12px;
      }
    }
  `]
})
export class ServiceCardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() features: string[] = [];
  @Input() imageUrl: string = '';
  @Input() route: string = '';

  constructor(private router: Router) {}

  navigateToService() {
    if (this.route) {
      this.router.navigate([this.route]);
    }
  }
}
