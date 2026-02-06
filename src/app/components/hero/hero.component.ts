import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit {
  currentSlide = 0;
  
  slides = [
    {
      title: 'Seguridad que Salva Vidas',
      subtitle: 'Protección Ejecutiva de Alto Nivel',
      description: 'Resguardamos a autoridades, empresarios y operaciones mineras en Ecuador con 14 años de experiencia comprobada.',
      cta: 'Evaluación Gratuita',
      ctaSecondary: 'Ver Servicios',
      image: 'hero-1.jpg'
    },
    {
      title: 'Cobertura Nacional K&R',
      subtitle: 'Hasta $3M USD de Protección',
      description: 'Gestión profesional de crisis y protocolos especializados para situaciones críticas de secuestro y extorsión.',
      cta: 'Conocer Más',
      ctaSecondary: 'Contactar Ahora',
      image: 'hero-2.jpg'
    },
    {
      title: 'Movilidad Segura Garantizada',
      subtitle: 'Escoltas y Convoy Táctico',
      description: 'Transporte seguro de personal clave y carga valiosa con tecnología de rastreo GPS y comunicaciones encriptadas.',
      cta: 'Solicitar Cotización',
      ctaSecondary: 'Ver Cobertura',
      image: 'hero-3.jpg'
    }
  ];

  stats = [
    { number: '14+', label: 'Años de Experiencia', icon: '🛡️' },
    { number: '75+', label: 'Especialistas Certificados', icon: '👥' },
    { number: '$3M', label: 'Cobertura K&R', icon: '💼' },
    { number: '24/7', label: 'Monitoreo Continuo', icon: '📡' }
  ];

  ngOnInit() {
    // Auto-slide cada 7 segundos
    setInterval(() => {
      this.nextSlide();
    }, 7000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
