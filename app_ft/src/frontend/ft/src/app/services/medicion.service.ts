import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ClasificacionService, Clasificacion } from '../services/clasificacion.service';

export interface Medicion {
  medicionId?: number;
  valor: string;
  fecha: Date;
  carril: number;
  clasificacionId: number;
  tipoContadorId: number;  
  clasificacionDescripcion?: string;
  dispositivoId: number;
}

@Injectable({
  providedIn: 'root'
})
export class MedicionService {
  private baseUrl = 'http://localhost:8000/medicion';

  constructor(
    private http: HttpClient,
    private clasificacionService: ClasificacionService
  ) {}

  // Obtener todas las mediciones de un dispositivo con descripción
  async getMediciones(dispositivoId: number): Promise<Medicion[]> {
    // 1️⃣ Obtener mediciones del backend
    const mediciones: Medicion[] = await firstValueFrom(
      this.http.get<Medicion[]>(`${this.baseUrl}/dispositivo/${dispositivoId}`).pipe(
        catchError(err => {
          console.error('Error al obtener mediciones', err);
          return throwError(() => err);
        })
      )
    );
    
  console.log('llego')
  console.log('Mediciones recibidas:', mediciones); 


    return mediciones;
  }

  getUltimaMedicion(dispositivoId: number): Promise<Medicion> {
    return firstValueFrom(
      this.http.get<{ status: number; data: Medicion }>(`${this.baseUrl}/ultima/${dispositivoId}`).pipe(
        catchError(err => {
          console.error('Error al obtener la última medición', err);
          return throwError(() => err);
        }),
        map(response => response.data)
      )
    );
  }

  guardarMedicion(medicion: { valor: string; dispositivoId: number; fecha: Date }): Promise<any> {
    return firstValueFrom(this.http.post<any>(this.baseUrl, medicion));
  }

  getMedicionesPorFecha(dispositivoId: number, fechaInicio: string, fechaFin: string): Promise<Medicion[]> {
    return firstValueFrom(
      this.http
        .get<Medicion[]>(
          `${this.baseUrl}?dispositivoId=${dispositivoId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
        )
        .pipe(
          catchError(err => {
            console.error('Error al obtener mediciones por fecha', err);
            return throwError(() => err);
          })
        )
    );
  }
}
