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
  dispositivoId: number;
  clasificacionDescripcion?: string;
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

// Obtener todas las mediciones de un dispositivo con descripción, paginación y rango opcional
async getMediciones(
  dispositivoId: number,
  limit = 100,
  offset = 0,
  fechaDesde?: string,
  fechaHasta?: string
): Promise<Medicion[]> {
  // 🔹 Construcción dinámica de la URL con query params
  let url = `${this.baseUrl}/dispositivo/${dispositivoId}?limit=${limit}&offset=${offset}`;

  if (fechaDesde) {
    url += `&fechaDesde=${encodeURIComponent(fechaDesde)}`;
  }
  if (fechaHasta) {
    url += `&fechaHasta=${encodeURIComponent(fechaHasta)}`;
  }

  console.log('Llamando a:', url);

  // 🔹 Llamada HTTP con manejo de errores
  return await firstValueFrom(
    this.http.get<Medicion[]>(url).pipe(
      catchError(err => {
        console.error('Error al obtener mediciones', err);
        return throwError(() => err);
      })
    )
  );
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
