import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Clasificacion {
  clasificacionId: number;
  descripcion: string;
  tipoContadorId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClasificacionService {
  private baseUrl = 'http://localhost:8000/clasificacion'; 

  constructor(private http: HttpClient) {}

  // Obtener clasificación por ID y tipo de contador
  getClasificacion(clasificacionId: number, tipoContadorId: number): Promise<Clasificacion> {
 
    return firstValueFrom(
      this.http.get<Clasificacion>(`${this.baseUrl}/${clasificacionId}/${tipoContadorId}`).pipe(
        catchError(err => {
          console.error(`Error al obtener clasificación ${clasificacionId} tipo ${tipoContadorId}`, err);
          return throwError(() => err);
        })
      )
    );
  }
}
