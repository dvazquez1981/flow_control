import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface TipoComando {
  tipoComandId: number;
  descripcion: string;
  tipoContadorId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TipoComandoService {
  private baseUrl = 'http://localhost:8000/tipoComando'; // coincide con las rutas del backend

  constructor(private http: HttpClient) {}

  /** Obtener todos los tipos de comando */
  async obtenerTodos(): Promise<TipoComando[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<TipoComando[]>(this.baseUrl).pipe(
          map(data => data),
          catchError(this.handleError)
        )
      );
      return response;
    } catch (error) {
      console.error('Error al obtener tipos de comando:', error);
      return [];
    }
  }

  /** Obtener un tipo de comando por ID */
  async obtenerPorId(tipoComandId: number): Promise<TipoComando | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<TipoComando>(`${this.baseUrl}/${tipoComandId}`).pipe(
          map(data => data),
          catchError(this.handleError)
        )
      );
      return response;
    } catch (error) {
      console.error('Error al obtener tipo de comando por ID:', error);
      return null;
    }
  }

  /** 🔎 Obtener tipos de comando por tipoContadorId (usando la ruta REST del backend) */
  async obtenerPorTipoContadorId(tipoContadorId: number): Promise<TipoComando[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<TipoComando[]>(`${this.baseUrl}/tipoContador/${tipoContadorId}`).pipe(
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

  /** Manejo de errores HTTP */
  private handleError(error: HttpErrorResponse) {
    console.error('Error HTTP:', error);
    return throwError(() => new Error('Error en la comunicación con el servidor'));
  }
}
