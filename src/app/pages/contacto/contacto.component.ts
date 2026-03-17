import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ContactService, ContactFormData, ContactResponse } from '../../services/service';

interface Servicio {
  id: string;
  nombre: string;
}

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitting: boolean = false;
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  errorMessage: string = '';

  servicios: Servicio[] = [
    { id: 'proteccion-ejecutiva', nombre: 'Protección Ejecutiva' },
    { id: 'seguridad-minera', nombre: 'Seguridad Minera' },
    { id: 'crisis-kr', nombre: 'Gestión Crisis K&R' },
    { id: 'academy', nombre: 'Sinergia Academy' },
    { id: 'otro', nombre: 'Otro Servicio' }
  ];

  tiposSolicitud = [
    { id: 'cotizacion', nombre: 'Solicitar Cotización' },
    { id: 'contacto', nombre: 'Información General' },
    { id: 'emergencia', nombre: 'Emergencia / Urgente' },
    { id: 'otro', nombre: 'Otro' }
  ];

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkQueryParams();
  }

  initForm(): void {
    this.contactForm = this.fb.group({
      tipoSolicitud: ['cotizacion', Validators.required],
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      empresa: [''],
      cargo: [''],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      servicio: ['', Validators.required],
      asunto: ['', [Validators.required, Validators.minLength(5)]],
      mensaje: ['', [Validators.required, Validators.minLength(20)]],
      // Campos adicionales opcionales
      fechaPreferida: [''],
      horaPreferida: [''],
      presupuestoEstimado: [''],
      urgencia: ['media']
    });
  }

  checkQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['servicio']) {
        this.contactForm.patchValue({ servicio: params['servicio'] });
      }
      if (params['tipo']) {
        this.contactForm.patchValue({ tipoSolicitud: params['tipo'] });
      }
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.markFormGroupTouched(this.contactForm);
      return;
    }

    this.isSubmitting = true;
    this.showSuccessMessage = false;
    this.showErrorMessage = false;

    const formData: ContactFormData = {
      tipoSolicitud: this.contactForm.value.tipoSolicitud,
      nombreCompleto: this.contactForm.value.nombreCompleto,
      empresa: this.contactForm.value.empresa,
      cargo: this.contactForm.value.cargo,
      email: this.contactForm.value.email,
      telefono: this.contactForm.value.telefono,
      servicio: this.contactForm.value.servicio,
      asunto: this.contactForm.value.asunto,
      mensaje: this.contactForm.value.mensaje,
      camposAdicionales: {
        fechaPreferida: this.contactForm.value.fechaPreferida,
        horaPreferida: this.contactForm.value.horaPreferida,
        presupuestoEstimado: this.contactForm.value.presupuestoEstimado,
        urgencia: this.contactForm.value.urgencia
      }
    };

    this.contactService.enviarSolicitud(formData).subscribe({
      next: (response: ContactResponse) => { 
        this.isSubmitting = false;
        this.showSuccessMessage = true;
        this.contactForm.reset();
        
        setTimeout(() => {
          const successElement = document.querySelector('.success-message');
          if (successElement) {
            successElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      },
      error: (error: any) => { 
        this.isSubmitting = false;
        this.showErrorMessage = true;
        this.errorMessage = 'Hubo un error al enviar su solicitud. Por favor intente nuevamente o contáctenos por teléfono.';
        console.error('Error al enviar formulario:', error);
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (field?.hasError('email')) {
      return 'Email inválido';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (field?.hasError('pattern')) {
      return 'Formato inválido (10 dígitos)';
    }
    
    return '';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}