import { Injectable } from '@angular/core';
import { firstValueFrom, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';

export interface TipoContador {
  TC_Id: number;
  TC_TipoContador: string;
}

@Injectable({
  providedIn: 'root'
})
export class TipoContadorService {

  private baseUrl = 'http://localhost:8000/tipoContador'; // reemplazá con tu endpoint real

  constructor(private http: HttpClient) {}

  // Devuelve un Promise con la lista de tipos de contador
async getTiposContador(): Promise<TipoContador[]> {
  try {
    const response = await firstValueFrom(
      this.http.get<TipoContador[]>(this.baseUrl).pipe(
        map(data => data),
        catchError(this.handleError)
      )
    );
   
    return response;
  } catch (error) {
    console.error('Error al obtener tipos de contador:', error);
    return [];
  }
}

  /** 🔎 Obtener tipos de comando por tipoContadorId (usando la ruta REST del backend) */
  async obtenerPorTipoContadorId(tipoContadorId: number): Promise<TipoContador[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<TipoContador[]>(`${this.baseUrl}${tipoContadorId}`).pipe(
          map(data => data),
          catchError(this.handleError)
        )
      );
      return response;
    } catch (error) {
      console.error('Error al obtener tipos de comando por tipoContadorId:', error);
      return [];
    }
  }


  private handleError(error: HttpErrorResponse) {
    console.error('Error HTTP:', error);
    return throwError(() => new Error('Error en la comunicación con el servidor'));
  }

}
