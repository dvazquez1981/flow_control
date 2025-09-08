// src/app/services/dispositivo.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Dispositivo {
  dispositivoId: number; 
  nombre: string;
  ubicacion: string;
  electrovalvulaId: string;
  
}

@Injectable({
  providedIn: 'root'
})
export class DispositivoService {
  private baseUrl = "http://localhost:8000/device";

  constructor(private _http: HttpClient) { }

  // Obtener todos los dispositivos
  getDispositivos(): Promise<Dispositivo[]> {
    return firstValueFrom(
      this._http.get<Dispositivo[]>(this.baseUrl).pipe(
        catchError(err => {
          console.error('Error al obtener dispositivos', err);
          return throwError(() => err);
        })
      )
    );
  }

  // Obtener un dispositivo por ID
  getDispositivo(id: number): Promise<Dispositivo> {
    return firstValueFrom(
      this._http.get<Dispositivo>(`${this.baseUrl}/${id}`).pipe(
        catchError(err => {
          console.error('Error al obtener dispositivo', err);
          return throwError(() => err);
        })
      )
    );
  }
}