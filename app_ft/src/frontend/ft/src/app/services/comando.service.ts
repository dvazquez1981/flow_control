import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Comando {
  cmdId: number;
  fecha: Date;
  tipoComandId: number;
  valor: string | null;
  dispositivoId: number;

}

@Injectable({
  providedIn: 'root'
})
export class ComandoService {
  private baseUrl = 'http://localhost:8000/comando';

  constructor(private http: HttpClient) {}

  /** Obtener un comando por su ID */
  async obtenerPorId(cmdId: number): Promise<Comando | null> {
    try {
      return await firstValueFrom(
        this.http.get<Comando>(`${this.baseUrl}/${cmdId}`).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      console.error('Error al obtener comando por ID:', error);
      return null;
    }
  }

  /** Obtener todos los comandos de un dispositivo */
  async obtenerPorDispositivoId(dispositivoId: number): Promise<Comando[]> {
    try {
      return await firstValueFrom(
        this.http.get<Comando[]>(`${this.baseUrl}?dispositivoId=${dispositivoId}`).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      console.error('Error al obtener comandos por dispositivoId:', error);
      return [];
    }
  }
async obtenerUltimoPorDispositivoId(dispositivoId: number): Promise<Comando | null> {
  const url = `${this.baseUrl}/ultima/${dispositivoId}`;

  try {
    const response = await firstValueFrom(
      this.http.get<any>(url).pipe(
        catchError(this.handleError)
      )
    );

    console.log(' Respuesta del backend (último comando):', response);

    if (response && response.data) {
      return response.data as Comando;
    }

    return null;
  } catch (error) {
    console.error('Error al obtener último comando por dispositivoId:', error);
    return null;
  }
}


/** ComandoService */
async crearComando(comando: Omit<Comando, 'cmdId'>): Promise<Comando | null> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  try {
    const response = await firstValueFrom(
      this.http.post<any>(this.baseUrl, comando, { headers }).pipe(
        map(res => res.data), // <-- tomamos el data del response
        catchError(this.handleError)
      )
    );
    if (response) {
      response.fecha = new Date(response.fecha); // convertimos fecha a Date
      return response as Comando;
    }
    return null;
  } catch (error) {
    console.error('Error al crear comando:', error);
    return null;
  }
}


  /** Actualizar parcialmente un comando */
  async actualizarComando(cmdId: number, cambios: Partial<Comando>): Promise<Comando | null> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    try {
      const response = await firstValueFrom(
        this.http.patch<Comando>(`${this.baseUrl}/${cmdId}`, cambios, { headers }).pipe(
          catchError(this.handleError)
        )
      );
      console.log('🛠️ Comando actualizado:', response);
      return response;
    } catch (error) {
      console.error('Error al actualizar comando:', error);
      return null;
    }
  }

  /** Eliminar un comando */
  async eliminarPorId(cmdId: number): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete(`${this.baseUrl}/${cmdId}`).pipe(
          catchError(this.handleError)
        )
      );
      console.log('🗑️ Comando eliminado:', cmdId);
      return true;
    } catch (error) {
      console.error('Error al eliminar comando:', error);
      return false;
    }
  }

  /** Manejo de errores HTTP */
  private handleError(error: HttpErrorResponse) {
    console.error('Error HTTP:', error);
    return throwError(() => new Error('Error en la comunicación con el servidor'));
  }
}
