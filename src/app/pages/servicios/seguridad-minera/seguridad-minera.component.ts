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

interface OperationType {
  id: string;
  name: string;
  description: string;
  services: string[];
  risks: string[];
  image: string;
}

interface Equipment {
  id: string;
  name: string;
  icon: string;
  description: string;
  capabilities: string[];
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
  duration: string;
}

interface MiningZone {
  province: string;
  operations: number;
  companies: number;
  coverage: string;
}

interface Testimonial {
  text: string;
  author: string;
  position: string;
  company: string;
  image: string;
}

@Component({
  selector: 'app-seguridad-minera',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './seguridad-minera.component.html',
  styleUrls: ['./seguridad-minera.component.scss']
})
export class SeguridadMineraComponent {
  selectedOperationType: string = 'superficie';

  features: Feature[] = [
    {
      icon: '',
      title: 'Protección Perimetral 24/7',
      description: 'Vigilancia continua de instalaciones con tecnología de punta y personal especializado.',
      image: 'https://microsegur.com/wp-content/uploads/2025/11/seguridad-perimetral-en-una-empresa-768x384.jpg'
    },
    {
      icon: '',
      title: 'Monitoreo Aéreo con Drones',
      description: 'Vigilancia aérea con drones equipados con cámaras térmicas y visión nocturna.',
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop'
    },
    {
      icon: '',
      title: 'Escoltas Especializadas',
      description: 'Protección de personal clave y transporte seguro en zonas de alto riesgo.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbDHoXXI5M6ESlozPIptVinMa_owbo3eAi_Q&s'
    },
    {
      icon: '',
      title: 'Centro de Monitoreo GPS',
      description: 'Rastreo en tiempo real de personal, vehículos y equipos con respuesta inmediata.',
      image: 'https://guinea.pe/wp-content/uploads/2024/06/85817.jpg'
    }
  ];

  operationTypes: OperationType[] = [
    {
      id: 'superficie',
      name: 'Minería de Superficie',
      description: 'Seguridad especializada para operaciones a cielo abierto con grandes extensiones de terreno.',
      services: [
        'Vigilancia perimetral con torres de observación',
        'Patrullaje vehicular 24/7',
        'Control de accesos con biometría',
        'Protección de maquinaria pesada',
        'Respuesta rápida ante intrusiones'
      ],
      risks: ['Intrusiones ilegales', 'Robo de equipo', 'Sabotaje', 'Conflictos comunitarios'],
      image: 'https://ieefa.org/sites/default/files/2022-12/coal-mine-shutterstock_1741881131.jpg'
    },
    {
      id: 'subterranea',
      name: 'Minería Subterránea',
      description: 'Protocolos especializados para operaciones bajo tierra con control de acceso estricto.',
      services: [
        'Control de acceso a túneles y galerías',
        'Escolta de personal en zonas profundas',
        'Vigilancia de entrada/salida de materiales',
        'Comunicaciones subterráneas seguras',
        'Protocolos de emergencia especializados'
      ],
      risks: ['Acceso no autorizado', 'Robo de mineral', 'Sabotaje interno', 'Emergencias subterráneas'],
      image: 'https://fatiguescience.com/hs-fs/hubfs/operator-Underground-female-Minerals-Mine-Nevada-2__1571344625_209.121.124.205%20(1).jpg?width=736&height=491&name=operator-Underground-female-Minerals-Mine-Nevada-2__1571344625_209.121.124.205%20(1).jpg'
    },
    {
      id: 'exploracion',
      name: 'Exploración y Prospección',
      description: 'Protección de equipos de exploración en zonas remotas y de difícil acceso.',
      services: [
        'Escolta de equipos de geólogos',
        'Campamentos seguros temporales',
        'Transporte blindado de muestras',
        'Comunicación satelital de emergencia',
        'Coordinación con autoridades locales'
      ],
      risks: ['Zonas remotas sin cobertura', 'Conflictos territoriales', 'Robo de equipos', 'Fauna peligrosa'],
      image: 'https://tresor.jamirfrancia.com/wp-content/uploads/2024/12/fidel-sanchez-alayo-aparece-mineria-1024x543.jpg'
    }
  ];

  equipment: Equipment[] = [
    {
      id: 'k9',
      name: 'Unidades Caninas K-9',
      icon: '',
      description: 'Canes entrenados para detección de explosivos, narcóticos y rastreo de personas.',
      capabilities: [
        'Detección de explosivos',
        'Rastreo de personas',
        'Patrullaje nocturno',
        'Búsqueda y rescate'
      ]
    },
    {
      id: 'drones',
      name: 'Drones de Vigilancia',
      icon: '',
      description: 'Monitoreo aéreo con cámaras térmicas y transmisión en vivo a centro de control.',
      capabilities: [
        'Vigilancia aérea 24/7',
        'Cámaras térmicas',
        'Transmisión en tiempo real',
        'Alcance de 5km'
      ]
    },
    {
      id: 'vehiculos',
      name: 'Vehículos 4x4 Tácticos',
      icon: '',
      description: 'Flotilla de vehículos todoterreno equipados para operaciones en zonas extremas.',
      capabilities: [
        'Tracción 4x4 permanente',
        'Equipos de comunicación',
        'Kit de primeros auxilios',
        'GPS satelital'
      ]
    },
    {
      id: 'torres',
      name: 'Torres de Vigilancia',
      icon: '',
      description: 'Estructuras móviles con visión 360° equipadas con cámaras de largo alcance.',
      capabilities: [
        'Visión panorámica 360°',
        'Visión nocturna',
        'Radio de 3km',
        'Instalación en 2 horas'
      ]
    },
    {
      id: 'comunicacion',
      name: 'Sistema de Comunicaciones',
      icon: '',
      description: 'Red de radios encriptados y comunicación satelital para zonas sin cobertura.',
      capabilities: [
        'Encriptación AES-256',
        'Comunicación satelital',
        'Alcance ilimitado',
        'Batería 48 horas'
      ]
    },
    {
      id: 'barreras',
      name: 'Barreras de Seguridad',
      icon: '',
      description: 'Sistemas de control perimetral con sensores de movimiento y alarmas.',
      capabilities: [
        'Sensores de movimiento',
        'Alarmas integradas',
        'Material anti-corte',
        'Instalación rápida'
      ]
    }
  ];

  processSteps: ProcessStep[] = [
    {
      number: 1,
      title: 'Evaluación de Riesgo',
      description: 'Análisis exhaustivo de la operación minera, identificación de vulnerabilidades y amenazas específicas del sector.',
      duration: '3-5 días'
    },
    {
      number: 2,
      title: 'Diseño de Protocolo',
      description: 'Creación de plan de seguridad personalizado con protocolos específicos para cada tipo de operación.',
      duration: '5-7 días'
    },
    {
      number: 3,
      title: 'Implementación',
      description: 'Despliegue de personal, equipamiento y tecnología. Instalación de sistemas de vigilancia y control.',
      duration: '7-10 días'
    },
    {
      number: 4,
      title: 'Monitoreo Continuo',
      description: 'Operación 24/7 con reportes diarios, ajustes según necesidades y coordinación con autoridades locales.',
      duration: 'Permanente'
    }
  ];

  miningZones: MiningZone[] = [
    {
      province: 'Zamora Chinchipe',
      operations: 45,
      companies: 12,
      coverage: 'Cobertura Total'
    },
    {
      province: 'Morona Santiago',
      operations: 28,
      companies: 8,
      coverage: 'Cobertura Total'
    },
    {
      province: 'Azuay',
      operations: 18,
      companies: 6,
      coverage: 'Cobertura Parcial'
    },
    {
      province: 'El Oro',
      operations: 15,
      companies: 5,
      coverage: 'Cobertura Parcial'
    },
    {
      province: 'Imbabura',
      operations: 12,
      companies: 4,
      coverage: 'En Expansión'
    },
    {
      province: 'Pichincha',
      operations: 8,
      companies: 3,
      coverage: 'En Expansión'
    }
  ];

  testimonials: Testimonial[] = [
    {
      text: 'Desde que contratamos a Sinergia Security, los incidentes de intrusión en nuestra mina se redujeron a cero. Su sistema de vigilancia perimetral con drones es excepcional.',
      author: 'Ing. Carlos Mendoza',
      position: 'Gerente de Operaciones',
      company: 'Minera del Sur S.A.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
    },
    {
      text: 'El profesionalismo del equipo de Sinergia es impresionante. Coordinan perfectamente con nuestras operaciones sin interrumpir la producción.',
      author: 'Dra. María Gutiérrez',
      position: 'Directora de Seguridad',
      company: 'Extractora Amazónica',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop'
    },
    {
      text: 'La respuesta ante una emergencia fue inmediata y efectiva. Su centro de monitoreo 24/7 realmente hace la diferencia en zonas remotas.',
      author: 'Ing. Roberto Silva',
      position: 'Jefe de Seguridad Industrial',
      company: 'Minera Oriente',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
    }
  ];

  constructor(private router: Router) {}

  selectOperationType(typeId: string): void {
    this.selectedOperationType = typeId;
  }

  getSelectedOperation(): OperationType {
    return this.operationTypes.find(op => op.id === this.selectedOperationType) || this.operationTypes[0];
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}