import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

interface Feature {
  icon: string;
  title: string;
  description: string;
  image: string;
}

interface CoveragePlan {
  id: string;
  name: string;
  amount: string;
  recommended: boolean;
  features: string[];
  exclusions: string[];
}

interface KRService {
  icon: string;
  title: string;
  description: string;
}

interface ProcessStep {
  number: number;
  phase: string;
  title: string;
  description: string;
  duration: string;
  actions: string[];
}

interface TeamMember {
  name: string;
  role: string;
  specialization: string;
  experience: string;
  image: string;
}

interface Testimonial {
  text: string;
  author: string;
  position: string;
  company: string;
  image: string;
  incident: string;
}

@Component({
  selector: 'app-crisis-kr',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './crisis-kr.component.html',
  styleUrls: ['./crisis-kr.component.scss']
})
export class CrisisKRComponent {
  selectedPlan: string = 'plan-2m';

  features: Feature[] = [
    {
      icon: '',
      title: 'Cobertura hasta $3.000.000 USD',
      description: 'Respaldo financiero robusto para negociaciones y resolución de crisis de secuestro y extorsión.',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop'
    },
    {
      icon: '',
      title: 'Sala de Crisis 24/7',
      description: 'Centro de operaciones permanente con equipo especializado disponible las 24 horas del día.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
    },
    {
      icon: '',
      title: 'Negociación Profesional',
      description: 'Expertos certificados en negociación de crisis con experiencia internacional en casos K&R.',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop'
    },
    {
      icon: '',
      title: 'Coordinación con Aseguradoras',
      description: 'Gestión directa con compañías aseguradoras internacionales especializadas en K&R.',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop'
    }
  ];

  coveragePlans: CoveragePlan[] = [
    {
      id: 'plan-1m',
      name: 'Plan Básico',
      amount: 'USD 1.000.000',
      recommended: false,
      features: [
        'Cobertura hasta $1.000.000 USD',
        'Sala de crisis 24/7',
        'Negociador profesional asignado',
        'Coordinación con autoridades locales',
        'Soporte psicológico post-incidente',
        'Cobertura nacional'
      ],
      exclusions: [
        'Coberturas internacionales limitadas',
        'Extracción táctica no incluida'
      ]
    },
    {
      id: 'plan-2m',
      name: 'Plan Empresarial',
      amount: 'USD 2.000.000',
      recommended: true,
      features: [
        'Cobertura hasta $2.000.000 USD',
        'Sala de crisis 24/7 con equipo dedicado',
        'Equipo de negociadores especializados',
        'Coordinación internacional',
        'Soporte psicológico familiar completo',
        'Extracción táctica incluida',
        'Cobertura regional (Latinoamérica)'
      ],
      exclusions: [
        'Eventos en zonas de guerra activa'
      ]
    },
    {
      id: 'plan-3m',
      name: 'Plan Premium',
      amount: 'USD 3.000.000',
      recommended: false,
      features: [
        'Cobertura hasta $3.000.000 USD',
        'Sala de crisis dedicada 24/7/365',
        'Equipo multidisciplinario completo',
        'Coordinación con agencias internacionales',
        'Soporte psicológico extendido (12 meses)',
        'Extracción táctica avanzada',
        'Cobertura global',
        'Consultoría preventiva incluida'
      ],
      exclusions: [
        'Sujeto a evaluación de elegibilidad'
      ]
    }
  ];

  krServices: KRService[] = [
    {
      icon: '🔍',
      title: 'Evaluación de Exposición',
      description: 'Análisis de riesgo de secuestro/extorsión y medidas preventivas personalizadas para ejecutivos y familiares.'
    },
    {
      icon: '⚡',
      title: 'Activación Inmediata 24/7',
      description: 'Gestión, coordinación y acompañamiento del cliente desde el primer momento de la crisis.'
    },
    {
      icon: '📋',
      title: 'Protocolos de Crisis',
      description: 'Comunicaciones estratégicas, toma de decisiones asistida y continuidad operacional durante el incidente.'
    },
    {
      icon: '⚖️',
      title: 'Marco Legal y Extracción',
      description: 'Apoyo legal especializado, coordinación con autoridades y extracción planificada de la víctima.'
    }
  ];

  processSteps: ProcessStep[] = [
    {
      number: 1,
      phase: 'Activación',
      title: 'Notificación y Activación de Protocolo',
      description: 'Activación inmediata de la sala de crisis y movilización del equipo especializado.',
      duration: '0-2 horas',
      actions: [
        'Recepción de notificación del incidente',
        'Activación del equipo K&R',
        'Contacto con aseguradora',
        'Establecimiento de sala de crisis'
      ]
    },
    {
      number: 2,
      phase: 'Evaluación',
      title: 'Análisis de Situación y Estrategia',
      description: 'Recopilación de información, evaluación de riesgos y diseño de estrategia de respuesta.',
      duration: '2-12 horas',
      actions: [
        'Recopilación de información del incidente',
        'Análisis de perfil de captores',
        'Evaluación de condición de víctima',
        'Diseño de estrategia de negociación'
      ]
    },
    {
      number: 3,
      phase: 'Negociación',
      title: 'Gestión y Negociación Profesional',
      description: 'Comunicación con captores, negociación de términos y coordinación con autoridades.',
      duration: 'Variable (días/semanas)',
      actions: [
        'Establecimiento de comunicación',
        'Negociación de condiciones',
        'Coordinación con autoridades',
        'Preparación logística para resolución'
      ]
    },
    {
      number: 4,
      phase: 'Resolución',
      title: 'Liberación y Recuperación',
      description: 'Ejecución del plan de liberación, extracción segura y soporte post-incidente.',
      duration: '24-72 horas',
      actions: [
        'Ejecución de plan de liberación',
        'Extracción segura de víctima',
        'Evaluación médica y psicológica',
        'Soporte familiar y reintegración'
      ]
    }
  ];

  crisisTeam: TeamMember[] = [
    {
      name: 'Dr. Fernando Morales',
      role: 'Director de Crisis K&R',
      specialization: 'Negociación de Rehenes',
      experience: '20+ años en casos internacionales',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
    },
    {
      name: 'Dra. Patricia Sánchez',
      role: 'Coordinadora de Crisis',
      specialization: 'Psicología de Crisis',
      experience: '15 años en gestión de riesgos',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
    },
    {
      name: 'Lcdo. Miguel Andrade',
      role: 'Asesor Legal Especializado',
      specialization: 'Derecho Penal Internacional',
      experience: '18 años en casos K&R',
      image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop'
    }
  ];

  testimonials: Testimonial[] = [
    {
      text: 'La profesionalidad y discreción del equipo de Sinergia fue fundamental para la resolución exitosa del caso. Su experiencia en negociación salvó a nuestro ejecutivo.',
      author: 'Confidencial',
      position: 'CEO',
      company: 'Empresa Internacional',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      incident: 'Secuestro Express - 2023'
    },
    {
      text: 'El soporte emocional que brindaron a nuestra familia durante la crisis fue invaluable. Nos acompañaron en cada paso del proceso.',
      author: 'Familia García',
      position: 'Cliente',
      company: 'Caso Resuelto 2024',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
      incident: 'Extorsión Familiar'
    }
  ];

  constructor(private router: Router) {}

  selectPlan(planId: string): void {
    this.selectedPlan = planId;
  }

  getSelectedPlan(): CoveragePlan {
    return this.coveragePlans.find(plan => plan.id === this.selectedPlan) || this.coveragePlans[1];
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}