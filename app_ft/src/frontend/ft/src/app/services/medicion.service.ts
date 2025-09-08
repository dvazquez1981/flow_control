import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, throwError } from 'rxjs';
import { map,catchError } from 'rxjs/operators';


// Modelo de medición
export interface Medicion {
  medicionId?: number;
  valor:string;
  dispositivoId: number;
  fecha: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MedicionService {
  private baseUrl = 'http://localhost:8000/medicion';
 

  constructor(private http: HttpClient) {}

  // Obtener todas las mediciones de un dispositivo
  getMediciones(dispositivoId: number): Promise<Medicion[]> {
    console.log("estoy")
    return firstValueFrom(
      this.http.get<Medicion[]>(`${this.baseUrl}/dispositivo/${dispositivoId}`).pipe(
        catchError(err => {
          console.error('Error al obtener mediciones', err);
          return throwError(() => err);
        })
      )
    );
  }

getUltimaMedicion(dispositivoId: number): Promise<Medicion> {
  return firstValueFrom(
    this.http.get<{status: number, data: Medicion}>(`${this.baseUrl}/ultima/${dispositivoId}`).pipe(
      catchError(err => {
        console.error('Error al obtener la última medición', err);
        return throwError(() => err);
      }),
      map(response => response.data) // extrae solo la medición
    )
  );
}

    // Guardar una medición
  guardarMedicion(medicion: { valor: string; dispositivoId: number; fecha: Date }): Promise<any> {
    return firstValueFrom(this.http.post<any>(this.baseUrl, medicion));
  }


  // Obtener mediciones filtradas por fecha
  getMedicionesPorFecha(dispositivoId: number, fechaInicio: string, fechaFin: string): Promise<Medicion[]> {
    return firstValueFrom(
      this.http.get<Medicion[]>(`${this.baseUrl}?dispositivoId=${dispositivoId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`).pipe(
        catchError(err => {
          console.error('Error al obtener mediciones por fecha', err);
          return throwError(() => err);
        })
      )
    );
  }
}