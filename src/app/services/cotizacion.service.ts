import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VehiculoSeleccionado {
  tipo: string; // 'sedan', 'suv', 'todoterreno', etc.
  cantidad: number;
  unidades: Array<{
    numero: number;
    uniforme: string; // 'camuflaje', 'casual', 'formal'
  }>;
}

export interface EquipamientoSeleccionado {
  id: string;
  nombre: string;
  seleccionado: boolean;
}

export interface CotizacionData {
  servicio: string; // 'proteccion-ejecutiva', 'seguridad-minera', etc.
  vehiculos: VehiculoSeleccionado[];
  uniformePrincipal?: string;
  equipamiento: EquipamientoSeleccionado[];
  
  // Datos opcionales del cliente (si decide enviar)
  nombreCliente?: string;
  emailCliente?: string;
  telefonoCliente?: string;
  empresaCliente?: string;
  mensajeAdicional?: string;
}

export interface CotizacionResponse {
  success: boolean;
  message: string;
  cotizacionId?: string;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {
  private apiUrl = 'http://localhost:3000/api/cotizacion';

  constructor(private http: HttpClient) {}

  guardarCotizacion(data: CotizacionData): Observable<CotizacionResponse> {
    const cotizacion = {
      ...data,
      fecha: new Date().toLocaleDateString('es-EC'),
      hora: new Date().toLocaleTimeString('es-EC'),
      origen: window.location.href,
      navegador: navigator.userAgent
    };

    return this.http.post<CotizacionResponse>(this.apiUrl, cotizacion);
  }

  // Método para enviar cotización con datos del cliente
  enviarCotizacionCompleta(data: CotizacionData): Observable<CotizacionResponse> {
    return this.http.post<CotizacionResponse>(`${this.apiUrl}/completa`, data);
  }
}