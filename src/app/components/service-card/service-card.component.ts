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
    .service-card {
      position: relative;
      height: 450px;
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
        rgba(26, 29, 35, 0.2) 0%,
        rgba(26, 29, 35, 0.6) 40%,
        rgba(26, 29, 35, 0.95) 100%
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
      padding: 35px;
      transition: all 0.4s ease;
    }

    .card-title {
      color: var(--text-light);
      font-size: clamp(24px, 2.5vw, 32px);
      font-weight: 800;
      margin-bottom: 20px;
      line-height: 1.1;
      transition: all 0.4s ease;
      max-width: 90%;
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
      background: linear-gradient(
        135deg,
        rgba(26, 29, 35, 0.98) 0%,
        rgba(42, 47, 54, 0.98) 100%
      );
      padding: 35px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
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
      background: rgba(26, 29, 35, 0.98);
    }

    .hover-title {
      color: var(--primary-gold);
      font-size: clamp(20px, 2vw, 26px);
      font-weight: 800;
      margin-bottom: 15px;
      line-height: 1.2;
    }

    .hover-description {
      color: rgba(255, 255, 255, 0.9);
      font-size: clamp(14px, 1.2vw, 15px);
      line-height: 1.6;
      margin-bottom: 20px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .hover-features {
      list-style: none;
      margin: 0 0 auto 0;
      padding: 0;
      flex: 1;
      overflow-y: auto;
      max-height: calc(100% - 200px);
    }

    .hover-features::-webkit-scrollbar {
      width: 4px;
    }

    .hover-features::-webkit-scrollbar-thumb {
      background: var(--primary-gold);
      border-radius: 2px;
    }

    .hover-features li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 8px 0;
      color: rgba(255, 255, 255, 0.85);
      font-size: clamp(13px, 1.1vw, 14px);
      line-height: 1.4;
    }

    .check {
      width: 20px;
      height: 20px;
      background: var(--primary-gold);
      color: var(--dark-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 11px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .btn-primary-hover {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 12px 30px;
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
      width: 100%;
      margin-top: 20px;
      box-shadow: 0 4px 15px rgba(229, 198, 67, 0.3);
    }

    .btn-primary-hover:hover {
      background: var(--primary-gold-dark);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(229, 198, 67, 0.4);
    }

    .btn-primary-hover svg {
      stroke: currentColor;
      transition: transform 0.3s ease;
    }

    .btn-primary-hover:hover svg {
      transform: translateX(5px);
    }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .service-card {
        height: 420px;
      }

      .card-title {
        font-size: 26px;
      }

      .hover-title {
        font-size: 22px;
      }
    }

    @media (max-width: 768px) {
      .service-card {
        height: 380px;
      }

      .card-content {
        padding: 25px;
      }

      .card-title {
        font-size: 22px;
        margin-bottom: 15px;
      }

      .hover-title {
        font-size: 20px;
      }

      .hover-description {
        font-size: 14px;
        -webkit-line-clamp: 2;
      }

      .card-hover-content {
        padding: 25px;
      }

      .hover-features li {
        font-size: 13px;
        padding: 6px 0;
      }

      .btn-primary-hover {
        padding: 10px 25px;
        font-size: 13px;
      }
    }

    @media (max-width: 480px) {
      .service-card {
        height: 350px;
      }

      .card-content {
        padding: 20px;
      }

      .card-title {
        font-size: 20px;
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
