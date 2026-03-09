import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

interface VehicleType {
  id: string;
  name: string;
  type: string;
  description: string;
  images: { [angle: number]: string };
  features: string[];
  specs: { label: string; value: string; }[];
  crewSize: number;
}

interface Equipment {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  specs: { label: string; value: string; }[];
}

interface UniformType {
  id: string;
  name: string;
  category: string;
  description: string;
  images: { [angle: number]: string };
  features: string[];
  situations: string[];
}

interface VehicleUniformAssignment {
  vehicleIndex: number;
  uniformId: string;
}

interface SelectedVehicle {
  vehicle: VehicleType;
  quantity: number;
  uniformAssignments: VehicleUniformAssignment[];
}

@Component({
  selector: 'app-proteccion-ejecutiva',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './proteccion-ejecutiva.component.html',
  styleUrls: ['./proteccion-ejecutiva.component.scss']
})
export class ProteccionEjecutivaComponent {
  previewedVehicle: VehicleType | null = null;
  selectedVehicles: SelectedVehicle[] = [];
  selectedEquipment: Equipment[] = [];
  currentRotation: number = 0;

  uniformSelectionStep: 'vehicle' | 'uniform' = 'vehicle';
  currentUniformRotation: number = 0;
  previewedUniform: UniformType | null = null;
  pendingVehicleForUniform: SelectedVehicle | null = null;
  assignSameUniformToAll: boolean = false;
  vehicleUniformPreferences: { [vehicleId: string]: string } = {};

  vehicleTypes: VehicleType[] = [];
  uniformTypes: UniformType[] = [];

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
    },
    {
      id: 'k9',
      name: 'Servicio de Canes K-9',
      category: 'Seguridad Especializada',
      description: 'Unidad canina especializada en detección de explosivos, narcóticos y rastreo.',
      icon: '🐕',
      specs: [
        { label: 'Especialidad', value: 'Detección/Rastreo' },
        { label: 'Certificación', value: 'K-9 Internacional' },
        { label: 'Manejador', value: 'Incluido' },
        { label: 'Entrenamiento', value: '500+ horas' }
      ]
    },
    {
      id: 'drone',
      name: 'Monitoreo con Drones',
      category: 'Vigilancia Aérea',
      description: 'Sistema de vigilancia con drones equipados con cámaras térmicas.',
      icon: '🚁',
      specs: [
        { label: 'Cámara', value: 'Térmica 4K' },
        { label: 'Autonomía', value: '45 minutos' },
        { label: 'Alcance', value: '5 km' },
        { label: 'Operador', value: 'Certificado' }
      ]
    }
  ];

  constructor(private router: Router) {
    this.initializeVehicles();
    this.initializeUniforms();
  }

  initializeVehicles() {
    this.vehicleTypes = [
      {
        id: 'sedan',
        name: 'Sedán',
        type: 'Ejecutivo',
        crewSize: 2,
        description: 'Vehículo sedán blindado ideal para desplazamientos ejecutivos discretos.',
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
        crewSize: 2,
        description: 'SUV blindado de alto rendimiento, perfecto para terrenos variados.',
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
        crewSize: 2,
        description: 'Vehículo todoterreno blindado para operaciones en zonas de difícil acceso.',
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
        crewSize: 2,
        description: 'Camioneta pick-up blindada para operaciones de logística.',
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
        crewSize: 2,
        description: 'Vehículo compacto blindado ideal para desplazamientos urbanos.',
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
        crewSize: 1,
        description: 'Motocicleta táctica blindada para desplazamientos rápidos.',
        images: {
          0: 'assets/vehicles/motocicleta/0.png',
          90: 'assets/vehicles/motocicleta/90.png',
          180: 'assets/vehicles/motocicleta/180.png',
          270: 'assets/vehicles/motocicleta/270.png'
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
      },
      {
        id: 'helicoptero',
        name: 'Helicóptero',
        type: 'Aéreo',
        crewSize: 3,
        description: 'Helicóptero ejecutivo blindado para desplazamientos aéreos.',
        images: {
          0: 'assets/vehicles/helicoptero/0.png',
          90: 'assets/vehicles/helicoptero/90.png',
          180: 'assets/vehicles/helicoptero/180.png',
          270: 'assets/vehicles/helicoptero/270.png'
        },
        features: [
          'Cabina blindada con vidrios anti-bala',
          'Sistema anti-misiles y contramedidas',
          'Asientos eyectables de emergencia',
          'Comunicación satelital encriptada',
          'Sistema de visión nocturna avanzado',
          'Capacidad: 4-6 pasajeros + 2 pilotos'
        ],
        specs: [
          { label: 'Protección', value: 'Nivel B6 (cabina)' },
          { label: 'Motor', value: 'Twin Turboshaft' },
          { label: 'Pasajeros', value: '4-6 + 2 pilotos' },
          { label: 'Autonomía', value: '650 km' },
          { label: 'Velocidad máx.', value: '280 km/h' },
          { label: 'Altitud máx.', value: '6,000 m' }
        ]
      }
    ];
  }

  initializeUniforms() {
    this.uniformTypes = [
      {
        id: 'camuflaje',
        name: 'Uniforme Táctico Camuflaje',
        category: 'Operativo',
        description: 'Uniforme militar táctico multicam para operaciones en zonas de alto riesgo.',
        images: {
          0: 'assets/uniforms/camuflaje/0.png',
          90: 'assets/uniforms/camuflaje/90.png',
          180: 'assets/uniforms/camuflaje/180.png',
          270: 'assets/uniforms/camuflaje/270.png'
        },
        features: [
          'Patrón multicam para diversas zonas',
          'Tela ripstop resistente',
          'Chaleco táctico modular incluido',
          'Múltiples bolsillos funcionales',
          'Rodilleras y coderas reforzadas',
          'Compatible con equipo táctico'
        ],
        situations: ['Zonas mineras', 'Operaciones rurales', 'Alto riesgo', 'Escolta táctica']
      },
      {
        id: 'casual',
        name: 'Uniforme Ejecutivo Casual',
        category: 'Discreto',
        description: 'Vestimenta ejecutiva casual que permite pasar desapercibido en entornos urbanos.',
        images: {
          0: 'assets/uniforms/casual/0.png',
          90: 'assets/uniforms/casual/90.png',
          180: 'assets/uniforms/casual/180.png',
          270: 'assets/uniforms/casual/270.png'
        },
        features: [
          'Camisa tipo polo o botones',
          'Pantalón casual resistente',
          'Chaqueta ligera con bolsillos ocultos',
          'Calzado táctico discreto',
          'Portación oculta de equipo',
          'Apariencia profesional civil'
        ],
        situations: ['Entornos urbanos', 'Protección discreta', 'Eventos sociales', 'Reuniones ejecutivas']
      },
      {
        id: 'formal',
        name: 'Traje Formal Ejecutivo',
        category: 'Corporativo',
        description: 'Traje formal de corte ejecutivo para escoltas de alto perfil.',
        images: {
          0: 'assets/uniforms/formal/0.png',
          90: 'assets/uniforms/formal/90.png',
          180: 'assets/uniforms/formal/180.png',
          270: 'assets/uniforms/formal/270.png'
        },
        features: [
          'Traje de dos o tres piezas',
          'Telas elastizadas para movilidad',
          'Corte ejecutivo elegante',
          'Corbata o moño incluido',
          'Adaptado para portación oculta',
          'Zapatos formales de cuero'
        ],
        situations: ['Eventos corporativos', 'Reuniones diplomáticas', 'Ceremonias oficiales', 'Protección VIP']
      }
    ];
  }

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
        
        const savedUniformId = this.vehicleUniformPreferences[vehicle.id];
        
        if (savedUniformId) {
          existing.uniformAssignments.push({
            vehicleIndex: existing.uniformAssignments.length + 1,
            uniformId: savedUniformId
          });
        } else {
          this.pendingVehicleForUniform = existing;
          this.uniformSelectionStep = 'uniform';
          this.previewedUniform = this.uniformTypes[0];
          this.currentUniformRotation = 0;
          this.assignSameUniformToAll = false;
        }
      }
    } else {
      const newSelection: SelectedVehicle = {
        vehicle,
        quantity: 1,
        uniformAssignments: []
      };
      this.selectedVehicles.push(newSelection);
      this.previewedVehicle = vehicle;
      this.currentRotation = 0;
      
      const savedUniformId = this.vehicleUniformPreferences[vehicle.id];
      
      if (savedUniformId) {
        newSelection.uniformAssignments.push({
          vehicleIndex: 1,
          uniformId: savedUniformId
        });
      } else {
        this.pendingVehicleForUniform = newSelection;
        this.uniformSelectionStep = 'uniform';
        this.previewedUniform = this.uniformTypes[0];
        this.currentUniformRotation = 0;
        this.assignSameUniformToAll = false;
      }
    }
  }

  decreaseQuantity(vehicle: VehicleType) {
    const existing = this.selectedVehicles.find(sv => sv.vehicle.id === vehicle.id);
    
    if (existing) {
      existing.quantity--;
      
      if (existing.uniformAssignments.length > existing.quantity) {
        existing.uniformAssignments.pop();
      }
      
      if (existing.quantity === 0) {
        delete this.vehicleUniformPreferences[vehicle.id];
        
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
      delete this.vehicleUniformPreferences[vehicle.id];
      
      this.selectedVehicles = this.selectedVehicles.filter(sv => sv.vehicle.id !== vehicle.id);
      if (this.previewedVehicle?.id === vehicle.id) {
        this.previewedVehicle = this.selectedVehicles.length > 0 ? this.selectedVehicles[0].vehicle : null;
      }
    } else if (existing) {
      const oldQuantity = existing.quantity;
      existing.quantity = quantity;
      
      if (quantity < oldQuantity && existing.uniformAssignments.length > quantity) {
        existing.uniformAssignments = existing.uniformAssignments.slice(0, quantity);
      }
      
      if (quantity > oldQuantity) {
        const savedUniformId = this.vehicleUniformPreferences[vehicle.id];
        
        if (savedUniformId) {
          const missing = quantity - existing.uniformAssignments.length;
          for (let i = 0; i < missing; i++) {
            existing.uniformAssignments.push({
              vehicleIndex: existing.uniformAssignments.length + 1,
              uniformId: savedUniformId
            });
          }
        } else {
          this.pendingVehicleForUniform = existing;
          this.uniformSelectionStep = 'uniform';
          this.previewedUniform = this.uniformTypes[0];
          this.currentUniformRotation = 0;
          this.assignSameUniformToAll = false;
        }
      }
    } else {
      const newSelection: SelectedVehicle = {
        vehicle,
        quantity,
        uniformAssignments: []
      };
      this.selectedVehicles.push(newSelection);
      this.previewedVehicle = vehicle;
      this.currentRotation = 0;
      
      const savedUniformId = this.vehicleUniformPreferences[vehicle.id];
      
      if (savedUniformId) {
        for (let i = 0; i < quantity; i++) {
          newSelection.uniformAssignments.push({
            vehicleIndex: i + 1,
            uniformId: savedUniformId
          });
        }
      } else {
        this.pendingVehicleForUniform = newSelection;
        this.uniformSelectionStep = 'uniform';
        this.previewedUniform = this.uniformTypes[0];
        this.currentUniformRotation = 0;
        this.assignSameUniformToAll = false;
      }
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

  confirmUniformSelection(uniform: UniformType) {
    if (!this.pendingVehicleForUniform) return;
    
    const vehicleIndex = this.pendingVehicleForUniform.uniformAssignments.length + 1;
    
    if (this.assignSameUniformToAll) {
      this.vehicleUniformPreferences[this.pendingVehicleForUniform.vehicle.id] = uniform.id;
      
      const remainingVehicles = this.pendingVehicleForUniform.quantity - this.pendingVehicleForUniform.uniformAssignments.length;
      for (let i = 0; i < remainingVehicles; i++) {
        this.pendingVehicleForUniform.uniformAssignments.push({
          vehicleIndex: vehicleIndex + i,
          uniformId: uniform.id
        });
      }
      
      this.uniformSelectionStep = 'vehicle';
      this.pendingVehicleForUniform = null;
      this.previewedUniform = null;
      this.assignSameUniformToAll = false;
    } else {
      this.pendingVehicleForUniform.uniformAssignments.push({
        vehicleIndex,
        uniformId: uniform.id
      });
      
      if (this.pendingVehicleForUniform.uniformAssignments.length === this.pendingVehicleForUniform.quantity) {
        this.uniformSelectionStep = 'vehicle';
        this.pendingVehicleForUniform = null;
        this.previewedUniform = null;
      } else {
        this.previewedUniform = this.uniformTypes[0];
        this.currentUniformRotation = 0;
      }
    }
  }

  cancelUniformSelection() {
    if (!this.pendingVehicleForUniform) return;
    
    if (this.pendingVehicleForUniform.uniformAssignments.length === 0) {
      this.selectedVehicles = this.selectedVehicles.filter(
        sv => sv.vehicle.id !== this.pendingVehicleForUniform!.vehicle.id
      );
      delete this.vehicleUniformPreferences[this.pendingVehicleForUniform.vehicle.id];
    } else {
      this.pendingVehicleForUniform.quantity = this.pendingVehicleForUniform.uniformAssignments.length;
    }
    
    this.uniformSelectionStep = 'vehicle';
    this.pendingVehicleForUniform = null;
    this.previewedUniform = null;
    this.assignSameUniformToAll = false;
  }

  previewUniform(uniform: UniformType) {
    this.previewedUniform = uniform;
    this.currentUniformRotation = 0;
  }

  rotateUniform(direction: 'left' | 'right') {
    if (!this.previewedUniform) return;
    
    const availableAngles = [0, 90, 180, 270];
    const currentIndex = availableAngles.indexOf(this.currentUniformRotation);
    
    if (direction === 'left') {
      const newIndex = (currentIndex - 1 + availableAngles.length) % availableAngles.length;
      this.currentUniformRotation = availableAngles[newIndex];
    } else {
      const newIndex = (currentIndex + 1) % availableAngles.length;
      this.currentUniformRotation = availableAngles[newIndex];
    }
  }

  getRotatedUniformImage(): string {
    if (!this.previewedUniform) return '';
    return this.previewedUniform.images[this.currentUniformRotation];
  }

  getUniformIcon(uniformId: string): string {
    const icons: { [key: string]: string } = {
      'camuflaje': '🪖',
      'casual': '👔',
      'formal': '🤵'
    };
    return icons[uniformId] || '👕';
  }

  getUniformNameById(uniformId: string): string {
    const uniform = this.uniformTypes.find(u => u.id === uniformId);
    return uniform ? uniform.name : 'Sin especificar';
  }

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

  requestCustomQuote() {
    const vehiclesSummary = this.selectedVehicles
      .map(sv => `${sv.quantity}x ${sv.vehicle.name}`)
      .join(', ');
    const equipmentNames = this.selectedEquipment.map(eq => eq.name).join(', ');
    
    const uniformsSummary = this.selectedVehicles
      .map(sv => {
        const uniforms = sv.uniformAssignments.map(ua => {
          const uniform = this.uniformTypes.find(u => u.id === ua.uniformId);
          return uniform ? uniform.name : 'Sin especificar';
        }).join(', ');
        return `${sv.vehicle.name}: ${uniforms}`;
      })
      .join(' | ');
    
    this.router.navigate(['/contacto'], { 
      queryParams: { 
        service: 'proteccion-ejecutiva',
        vehicles: vehiclesSummary,
        total: this.getTotalVehicles(),
        equipment: equipmentNames,
        uniforms: uniformsSummary
      } 
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}