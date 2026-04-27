import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer';

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

interface ArmamentoType {
  id: string;
  tipo: string;
  descripcion: string;
  calibre: string;
  imagen: string;
}

interface VehicleUniformAssignment {
  vehicleIndex: number;
  uniformId: string;
}

interface VehicleArmamentoAssignment {
  vehicleIndex: number;
  armamentoId: string;
}

interface SelectedVehicle {
  vehicle: VehicleType;
  quantity: number;
  uniformAssignments: VehicleUniformAssignment[];
  armamentoAssignments: VehicleArmamentoAssignment[];
}

@Component({
  selector: 'app-proteccion-ejecutiva',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './proteccion-ejecutiva.component.html',
  styleUrls: ['./proteccion-ejecutiva.component.scss']
})
export class ProteccionEjecutivaComponent {
  previewedVehicle: VehicleType | null = null;
  selectedVehicles: SelectedVehicle[] = [];
  selectedEquipment: Equipment[] = [];
  currentRotation: number = 0;

  uniformSelectionStep: 'vehicle' | 'uniform' | 'armamento' = 'vehicle';
  
  currentUniformRotation: number = 0;
  previewedUniform: UniformType | null = null;
  pendingVehicleForUniform: SelectedVehicle | null = null;
  assignSameUniformToAll: boolean = false;
  vehicleUniformPreferences: { [vehicleId: string]: string } = {};

  previewedArmamento: ArmamentoType | null = null;
  pendingVehicleForArmamento: SelectedVehicle | null = null;
  assignSameArmamentoToAll: boolean = false;
  vehicleArmamentoPreferences: { [vehicleId: string]: string } = {};

  vehicleTypes: VehicleType[] = [];
  uniformTypes: UniformType[] = [];
  armamentoTypes: ArmamentoType[] = [];

  cotizacionForm: FormGroup;
  enviandoCotizacion: boolean = false;
  cotizacionEnviada: boolean = false;
  errorEnvio: string = '';

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

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.initializeVehicles();
    this.initializeUniforms();
    this.initializeArmamento();
    
    this.cotizacionForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      empresa: [''],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      mensajeAdicional: ['']
    });
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

  initializeArmamento() {
    this.armamentoTypes = [
      {
        id: 'arma-corta',
        tipo: 'Arma Corta',
        descripcion: 'Pistola semiautomática de alto calibre',
        calibre: '9mm / .40 / .45',
        imagen: 'assets/weapons/arma-corta.png' 
      },
      {
        id: 'fusil',
        tipo: 'Fusil',
        descripcion: 'Fusil de asalto o carabina táctica',
        calibre: '5.56mm / 7.62mm',
        imagen: 'assets/weapons/fusil.png' 
      }
    ];
  }

  getVehicleQuantity(vehicleId: string): number {
    const selected = this.selectedVehicles.find(sv => sv.vehicle.id === vehicleId);
    return selected ? selected.quantity : 0;
  }

  getCompositeImage(vehicleId: string, uniformId: string, armamentoId?: string): string {
    const armaSuffix = armamentoId ? `_${armamentoId}` : '_sin-arma';
    const fileName = `${vehicleId}_${uniformId}${armaSuffix}.png`;
  
    return 'assets/resumen/hash_camu_corta.png';
  }

  isVehicleSelected(vehicleId: string): boolean {
    return this.getVehicleQuantity(vehicleId) > 0;
  }

  // ============================================
  // LÓGICA MODIFICADA: increaseQuantity
  // ============================================
  increaseQuantity(vehicle: VehicleType) {
    const existing = this.selectedVehicles.find(sv => sv.vehicle.id === vehicle.id);
    
    if (existing) {
      // Ya existe este tipo de vehículo
      if (existing.quantity < 99) {
        existing.quantity++;
        
        const savedUniformId = this.vehicleUniformPreferences[vehicle.id];
        const savedArmamentoId = this.vehicleArmamentoPreferences[vehicle.id];
        
        // Si ya hay preferencias guardadas, usarlas automáticamente
        if (savedUniformId && savedArmamentoId) {
          existing.uniformAssignments.push({
            vehicleIndex: existing.uniformAssignments.length + 1,
            uniformId: savedUniformId
          });
          existing.armamentoAssignments.push({
            vehicleIndex: existing.armamentoAssignments.length + 1,
            armamentoId: savedArmamentoId
          });
        } else {
          // No hay preferencias, abrir modal
          this.pendingVehicleForUniform = existing;
          this.uniformSelectionStep = 'uniform';
          this.previewedUniform = this.uniformTypes[0];
          this.currentUniformRotation = 0;
          this.assignSameUniformToAll = false;
        }
      }
    } else {
      // Es el PRIMER vehículo de este tipo
      const newSelection: SelectedVehicle = {
        vehicle,
        quantity: 1,
        uniformAssignments: [],
        armamentoAssignments: []
      };
      this.selectedVehicles.push(newSelection);
      this.previewedVehicle = vehicle;
      this.currentRotation = 0;
      
      // Abrir modal SIEMPRE para el primer vehículo
      this.pendingVehicleForUniform = newSelection;
      this.uniformSelectionStep = 'uniform';
      this.previewedUniform = this.uniformTypes[0];
      this.currentUniformRotation = 0;
      this.assignSameUniformToAll = false; // ⬅️ Checkbox visible desde el inicio
    }
  }

  decreaseQuantity(vehicle: VehicleType) {
    const existing = this.selectedVehicles.find(sv => sv.vehicle.id === vehicle.id);
    
    if (existing) {
      existing.quantity--;
      
      if (existing.uniformAssignments.length > existing.quantity) {
        existing.uniformAssignments.pop();
      }
      if (existing.armamentoAssignments.length > existing.quantity) {
        existing.armamentoAssignments.pop();
      }
      
      if (existing.quantity === 0) {
        // ⬅️ NUEVO: Limpiar preferencias al llegar a cero
        delete this.vehicleUniformPreferences[vehicle.id];
        delete this.vehicleArmamentoPreferences[vehicle.id];
        
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
      // Limpiar preferencias
      delete this.vehicleUniformPreferences[vehicle.id];
      delete this.vehicleArmamentoPreferences[vehicle.id];
      
      this.selectedVehicles = this.selectedVehicles.filter(sv => sv.vehicle.id !== vehicle.id);
      if (this.previewedVehicle?.id === vehicle.id) {
        this.previewedVehicle = this.selectedVehicles.length > 0 ? this.selectedVehicles[0].vehicle : null;
      }
    } else if (existing) {
      const oldQuantity = existing.quantity;
      existing.quantity = quantity;
      
      if (quantity < oldQuantity) {
        if (existing.uniformAssignments.length > quantity) {
          existing.uniformAssignments = existing.uniformAssignments.slice(0, quantity);
        }
        if (existing.armamentoAssignments.length > quantity) {
          existing.armamentoAssignments = existing.armamentoAssignments.slice(0, quantity);
        }
      }
      
      if (quantity > oldQuantity) {
        const savedUniformId = this.vehicleUniformPreferences[vehicle.id];
        const savedArmamentoId = this.vehicleArmamentoPreferences[vehicle.id];
        
        if (savedUniformId && savedArmamentoId) {
          const missing = quantity - existing.uniformAssignments.length;
          for (let i = 0; i < missing; i++) {
            existing.uniformAssignments.push({
              vehicleIndex: existing.uniformAssignments.length + 1,
              uniformId: savedUniformId
            });
            existing.armamentoAssignments.push({
              vehicleIndex: existing.armamentoAssignments.length + 1,
              armamentoId: savedArmamentoId
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
        uniformAssignments: [],
        armamentoAssignments: []
      };
      this.selectedVehicles.push(newSelection);
      this.previewedVehicle = vehicle;
      this.currentRotation = 0;
      
      const savedUniformId = this.vehicleUniformPreferences[vehicle.id];
      const savedArmamentoId = this.vehicleArmamentoPreferences[vehicle.id];
      
      if (savedUniformId && savedArmamentoId) {
        for (let i = 0; i < quantity; i++) {
          newSelection.uniformAssignments.push({
            vehicleIndex: i + 1,
            uniformId: savedUniformId
          });
          newSelection.armamentoAssignments.push({
            vehicleIndex: i + 1,
            armamentoId: savedArmamentoId
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

  // ============================================
  // LÓGICA MODIFICADA: confirmUniformSelection
  // ============================================
  confirmUniformSelection(uniform: UniformType) {
    if (!this.pendingVehicleForUniform) return;
    
    const vehicleIndex = this.pendingVehicleForUniform.uniformAssignments.length + 1;
    
    if (this.assignSameUniformToAll) {
      this.vehicleUniformPreferences[this.pendingVehicleForUniform.vehicle.id] = uniform.id;
      
      // Asignar a todos los vehículos pendientes
      const remainingVehicles = this.pendingVehicleForUniform.quantity - this.pendingVehicleForUniform.uniformAssignments.length;
      for (let i = 0; i < remainingVehicles; i++) {
        this.pendingVehicleForUniform.uniformAssignments.push({
          vehicleIndex: vehicleIndex + i,
          uniformId: uniform.id
        });
      }
      
      // Pasar a selección de armamento
      this.uniformSelectionStep = 'armamento';
      this.pendingVehicleForArmamento = this.pendingVehicleForUniform;
      this.pendingVehicleForUniform = null;
      this.previewedUniform = null;
      this.previewedArmamento = this.armamentoTypes[0];
      this.assignSameUniformToAll = false;
      this.assignSameArmamentoToAll = false;
    } else {
      // Solo asignar a este vehículo
      this.pendingVehicleForUniform.uniformAssignments.push({
        vehicleIndex,
        uniformId: uniform.id
      });
      
      if (this.pendingVehicleForUniform.uniformAssignments.length === this.pendingVehicleForUniform.quantity) {
        // Terminaron todos los uniformes, pasar a armamento
        this.uniformSelectionStep = 'armamento';
        this.pendingVehicleForArmamento = this.pendingVehicleForUniform;
        this.pendingVehicleForUniform = null;
        this.previewedUniform = null;
        this.previewedArmamento = this.armamentoTypes[0];
      } else {
        this.previewedUniform = this.uniformTypes[0];
        this.currentUniformRotation = 0;
      }
    }
  }

  // ============================================
  // LÓGICA MODIFICADA: confirmArmamentoSelection
  // ============================================
  confirmArmamentoSelection(armamento: ArmamentoType) {
    if (!this.pendingVehicleForArmamento) return;
    
    const vehicleIndex = this.pendingVehicleForArmamento.armamentoAssignments.length + 1;
    
    if (this.assignSameArmamentoToAll) {
      // ⬅️ Guardar preferencia para futuros vehículos del mismo tipo
      this.vehicleArmamentoPreferences[this.pendingVehicleForArmamento.vehicle.id] = armamento.id;
      
      // Asignar a todos los vehículos pendientes
      const remainingVehicles = this.pendingVehicleForArmamento.quantity - this.pendingVehicleForArmamento.armamentoAssignments.length;
      for (let i = 0; i < remainingVehicles; i++) {
        this.pendingVehicleForArmamento.armamentoAssignments.push({
          vehicleIndex: vehicleIndex + i,
          armamentoId: armamento.id
        });
      }
      
      // Finalizar
      this.uniformSelectionStep = 'vehicle';
      this.pendingVehicleForArmamento = null;
      this.previewedArmamento = null;
      this.assignSameArmamentoToAll = false;
    } else {
      // Solo asignar a este vehículo
      this.pendingVehicleForArmamento.armamentoAssignments.push({
        vehicleIndex,
        armamentoId: armamento.id
      });
      
      if (this.pendingVehicleForArmamento.armamentoAssignments.length === this.pendingVehicleForArmamento.quantity) {
        // Finalizar
        this.uniformSelectionStep = 'vehicle';
        this.pendingVehicleForArmamento = null;
        this.previewedArmamento = null;
      } else {
        this.previewedArmamento = this.armamentoTypes[0];
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
      delete this.vehicleArmamentoPreferences[this.pendingVehicleForUniform.vehicle.id];
    } else {
      this.pendingVehicleForUniform.quantity = this.pendingVehicleForUniform.uniformAssignments.length;
    }
    
    this.uniformSelectionStep = 'vehicle';
    this.pendingVehicleForUniform = null;
    this.previewedUniform = null;
    this.assignSameUniformToAll = false;
  }

  cancelArmamentoSelection() {
    if (!this.pendingVehicleForArmamento) return;
    
    if (this.pendingVehicleForArmamento.armamentoAssignments.length === 0) {
      this.selectedVehicles = this.selectedVehicles.filter(
        sv => sv.vehicle.id !== this.pendingVehicleForArmamento!.vehicle.id
      );
      delete this.vehicleUniformPreferences[this.pendingVehicleForArmamento.vehicle.id];
      delete this.vehicleArmamentoPreferences[this.pendingVehicleForArmamento.vehicle.id];
    } else {
      this.pendingVehicleForArmamento.quantity = this.pendingVehicleForArmamento.armamentoAssignments.length;
    }
    
    this.uniformSelectionStep = 'vehicle';
    this.pendingVehicleForArmamento = null;
    this.previewedArmamento = null;
    this.assignSameArmamentoToAll = false;
  }

  previewUniform(uniform: UniformType) {
    this.previewedUniform = uniform;
    this.currentUniformRotation = 0;
  }

  previewArmamento(armamento: ArmamentoType) {
    this.previewedArmamento = armamento;
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
    'camuflaje': 'assets/uniforms/camuflaje/icon.png',
    'casual': 'assets/uniforms/casual/icon.png',
    'formal': 'assets/uniforms/formal/icon.png'
  };
  return icons[uniformId] || 'assets/uniforms/default.png';
}

getArmamentoIcon(armamentoId: string): string {
  const icons: { [key: string]: string } = {
    'arma-corta': 'assets/weapons/arma-corta.png',
    'fusil': 'assets/weapons/fusil.png'
  };
  return icons[armamentoId] || 'assets/weapons/default.png';
}

getArmamentoImage(armamentoId: string): string {
  const images: { [key: string]: string } = {
    'arma-corta': 'assets/weapons/arma-corta-large.png',
    'fusil': 'assets/weapons/fusil-large.png'
  };
  return images[armamentoId] || 'assets/weapons/default-large.png';
}

  getUniformNameById(uniformId: string): string {
    const uniform = this.uniformTypes.find(u => u.id === uniformId);
    return uniform ? uniform.name : 'Sin especificar';
  }

  getArmamentoNameById(armamentoId: string): string {
    const armamento = this.armamentoTypes.find(a => a.id === armamentoId);
    return armamento ? armamento.tipo : 'Sin especificar';
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

  enviarCotizacion(): void {
    if (this.cotizacionForm.invalid) {
      Object.keys(this.cotizacionForm.controls).forEach(key => {
        this.cotizacionForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (this.selectedVehicles.length === 0) {
      this.errorEnvio = 'Debe seleccionar al menos un vehículo';
      return;
    }

    this.enviandoCotizacion = true;
    this.errorEnvio = '';

    const cotizacionData = {
      nombreCompleto: this.cotizacionForm.value.nombreCompleto,
      empresa: this.cotizacionForm.value.empresa || 'No especificada',
      telefono: this.cotizacionForm.value.telefono,
      email: this.cotizacionForm.value.email,
      mensajeAdicional: this.cotizacionForm.value.mensajeAdicional || '',
      
      servicio: 'Protección Ejecutiva',
      totalVehiculos: this.getTotalVehicles(),
      vehiculos: this.selectedVehicles.map(sv => ({
        tipo: sv.vehicle.name,
        cantidad: sv.quantity,
        uniformes: sv.uniformAssignments.map(ua => 
          this.getUniformNameById(ua.uniformId)
        ),
        armamento: sv.armamentoAssignments.map(aa => 
          this.getArmamentoNameById(aa.armamentoId)
        )
      })),
      equipamiento: this.selectedEquipment.map(eq => eq.name),
      
      fecha: new Date().toLocaleDateString('es-EC'),
      hora: new Date().toLocaleTimeString('es-EC'),
      origen: window.location.href
    };

    this.http.post('http://localhost:3000/api/cotizacion', cotizacionData)
      .subscribe({
        next: (response: any) => {
          console.log('✅ Cotización enviada:', response);
          this.enviandoCotizacion = false;
          this.cotizacionEnviada = true;
          
          setTimeout(() => {
            this.cotizacionForm.reset();
            this.selectedVehicles = [];
            this.selectedEquipment = [];
            this.cotizacionEnviada = false;
          }, 3000);
        },
        error: (error) => {
          console.error('❌ Error al enviar cotización:', error);
          this.enviandoCotizacion = false;
          this.errorEnvio = 'Error al enviar la cotización. Por favor intente nuevamente.';
        }
      });
  }

  get nombreValido(): boolean {
    const campo = this.cotizacionForm.get('nombreCompleto');
    return !!(campo && campo.invalid && campo.touched);
  }

  get emailValido(): boolean {
    const campo = this.cotizacionForm.get('email');
    return !!(campo && campo.invalid && campo.touched);
  }

  get telefonoValido(): boolean {
    const campo = this.cotizacionForm.get('telefono');
    return !!(campo && campo.invalid && campo.touched);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}