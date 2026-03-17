import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactFormData {
  tipoSolicitud: 'cotizacion' | 'contacto' | 'emergencia' | 'otro';
  nombreCompleto: string;
  empresa?: string;
  cargo?: string;
  email: string;
  telefono: string;
  servicio: string;
  asunto: string;
  mensaje: string;
  camposAdicionales?: Record<string, any>;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  ticketId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  // IMPORTANTE: Cambiar esta URL por tu backend real
  private apiUrl = 'http://localhost:3000/api/contact';

  constructor(private http: HttpClient) {}

  enviarSolicitud(data: ContactFormData): Observable<ContactResponse> {
    const solicitud = {
      ...data,
      fecha: new Date().toLocaleDateString('es-EC'),
      hora: new Date().toLocaleTimeString('es-EC'),
      origen: window.location.href,
      navegador: navigator.userAgent
    };

    return this.http.post<ContactResponse>(this.apiUrl, solicitud);
  }
}