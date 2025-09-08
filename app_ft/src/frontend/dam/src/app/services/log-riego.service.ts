import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, throwError } from 'rxjs';
import { map,catchError } from 'rxjs/operators';

export interface LogRiego {
  logRiegoId: number;
  apertura: number;
  fecha: Date;
  electrovalvulaId: number;
  
}

@Injectable({
  providedIn: 'root'
})
export class LogRiegoService {
  private baseUrl = 'http://localhost:8000/log_riego';

  constructor(private http: HttpClient) {}

  getLogs(electrovalvulaId: number): Promise<LogRiego[]> {
    return firstValueFrom(
      this.http.get<LogRiego[]>(`${this.baseUrl}/electrovalvula/${electrovalvulaId}`).pipe(
        catchError(err => {
          console.error('Error al obtener logs de riego', err);
          return throwError(() => err);
        })
      )
    );
  }



  updateApertura(logRiegoId: number,electrovalvulaId: number, apertura: 0 | 1): Promise<LogRiego> {

     const fechaSistema = new Date().toISOString();
    return firstValueFrom(
      
      this.http.patch<{ status: number; data: LogRiego }>(
        `${this.baseUrl}/${logRiegoId}`,
        { apertura,
          electrovalvulaId,
          fecha: fechaSistema }      // solo enviamos apertura
      ).pipe(
        catchError(err => {
          console.error('Error al actualizar apertura', err);
          return throwError(() => err);
        }),
        map(res => res.data)
      )
    );
  }

  // log-riego.service.ts
addLog(electrovalvulaId: number, apertura: 0 | 1): Promise<LogRiego> {
  const fechaSistema = new Date().toISOString();
  return firstValueFrom(
    this.http.post<{ status: number; data: LogRiego }>(
      `${this.baseUrl}`,
      {
        electrovalvulaId,
        apertura,
        fecha: fechaSistema
      }
    ).pipe(
      catchError(err => {
        console.error('Error al crear log de riego', err);
        return throwError(() => err);
      }),
      map(res => res.data)
    )
  );
}

}


