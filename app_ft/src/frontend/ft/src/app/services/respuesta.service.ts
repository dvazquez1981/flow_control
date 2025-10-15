import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Respuesta {
  RespId: number;
  fecha: string; // ISO string
  cmdId: number;
  valor: string;
  dispositivoId: number;
}

@Injectable({
  providedIn: 'root'
})
export class RespuestaService {
  private baseUrl = 'http://localhost:8000/respuesta';

  constructor(private http: HttpClient) {}

  /** Obtener todas las respuestas */
  async getAll(): Promise<Respuesta[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<Respuesta[]>(this.baseUrl).pipe(
          map(data => data),
          catchError(this.handleError)
        )
      );
      return response;
    } catch (error) {
      console.error('Error al obtener todas las respuestas:', error);
      return [];
    }
  }

  /** Obtener una respuesta por RespId */
  async getOne(RespId: number): Promise<Respuesta | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<Respuesta>(`${this.baseUrl}/${RespId}`).pipe(
          map(data => data),
          catchError(this.handleError)
        )
      );
      return response;
    } catch (error) {
      console.error(`Error al obtener respuesta ${RespId}:`, error);
      return null;
    }
  }

/** Obtener respuestas asociadas a un comando por cmdId */
async getRespuestasPorComando(cmdId: number): Promise<Respuesta[]> {
  if (!cmdId || isNaN(cmdId)) {
    console.warn('cmdId inválido:', cmdId);
    return [];
  }

  try {
    const response = await firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/comando/${cmdId}`).pipe(
        catchError(err => {
          console.error(`Error HTTP al obtener respuestas para comando ${cmdId}:`, err);
          return throwError(() => new Error('Error al obtener respuestas por comando'));
        })
      )
    );

    // Aquí manejamos el envoltorio { status, data }
    if (response && response.data) {
      // Si data es un array, retornamos tal cual, sino lo convertimos en array
      return Array.isArray(response.data) ? response.data : [response.data];
    }

    return [];
  } catch (error) {
    console.error(`Error inesperado al obtener respuestas para comando ${cmdId}:`, error);
    return [];
  }
}

  /** Crear nueva respuesta */
  async crear(respuesta: Omit<Respuesta, 'RespId'>): Promise<Respuesta | null> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    try {
      const response = await firstValueFrom(
        this.http.post<Respuesta>(this.baseUrl, respuesta, { headers }).pipe(
          map(data => data),
          catchError(this.handleError)
        )
      );
      return response;
    } catch (error) {
      console.error('Error al crear respuesta:', error);
      return null;
    }
  }

  /** Actualizar una respuesta existente (PATCH) */
  async update(RespId: number, cambios: Partial<Respuesta>): Promise<Respuesta | null> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    try {
      const response = await firstValueFrom(
        this.http.patch<Respuesta>(`${this.baseUrl}/${RespId}`, cambios, { headers }).pipe(
          map(data => data),
          catchError(this.handleError)
        )
      );
      return response;
    } catch (error) {
      console.error(`Error al actualizar respuesta ${RespId}:`, error);
      return null;
    }
  }

  /** Eliminar una respuesta por RespId */
  async delete(RespId: number): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete(`${this.baseUrl}/${RespId}`).pipe(
          catchError(this.handleError)
        )
      );
      return true;
    } catch (error) {
      console.error(`Error al eliminar respuesta ${RespId}:`, error);
      return false;
    }
  }

  /** Manejo de errores HTTP */
  private handleError(error: HttpErrorResponse) {
    console.error('Error HTTP:', error);
    return throwError(() => new Error('Error en la comunicación con el servidor'));
  }
}
