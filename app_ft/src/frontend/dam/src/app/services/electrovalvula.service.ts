// src/app/services/electrovalvula.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Electrovalvula {
  electrovalvulaId: number;
  nombre: string;
 
}

@Injectable({
  providedIn: 'root'
})
export class ElectrovalvulaService {

  private baseUrl = 'http://localhost:8000/electrovalvula';

  constructor(private http: HttpClient) { }

  getElectrovalvulas(): Promise<Electrovalvula[]> {
    return firstValueFrom(
      this.http.get<Electrovalvula[]>(this.baseUrl).pipe(
        catchError(err => {
          console.error('Error al obtener electrovalvulas', err);
          return throwError(() => err);
        })
      )
    );
  }

  getElectrovalvula(electrovalvulaId: number): Promise<Electrovalvula> {
    return firstValueFrom(
      this.http.get<Electrovalvula>(`${this.baseUrl}/${electrovalvulaId}`).pipe(
        catchError(err => {
          console.error('Error al obtener electrovalvula', err);
          return throwError(() => err);
        })
      )
    );
  }
}
