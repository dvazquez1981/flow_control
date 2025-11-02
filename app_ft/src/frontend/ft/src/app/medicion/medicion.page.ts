import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UnidadPipe } from '../pipes/unidad.pipe';
import { ResaltarDirective } from '../directives/resaltar.directive';
import { IonicModule } from '@ionic/angular';
import { FechaLocalPipe } from '../pipes/fecha-local.pipe';


import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonFooter,
  IonBackButton,
  IonButtons,
  IonText,
  IonListHeader,
} from '@ionic/angular/standalone';

import { MedicionService, Medicion } from '../services/medicion.service';

@Component({
  selector: 'app-medicion',
  templateUrl: './medicion.page.html',
  styleUrls: ['./medicion.page.scss'],
  standalone: true,
  imports: [
    IonListHeader,
    UnidadPipe,
    ResaltarDirective,
    CommonModule,
    NgIf,
    NgFor,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonFooter,
    IonBackButton,
    IonButtons,
    IonText,
    FechaLocalPipe
  ]
})

// 🔹 Exportar mediciones agrupadas a CSV
export class MedicionPage implements OnInit, OnDestroy {
  mediciones: Medicion[] = [];
  medicionesAgrupadas: any[] = [];
  intervaloMediciones?: any;
  dispositivoId: any;
  private paramMapSub?: any;

  // 🔹 Variables de paginación
  limit = 50;
  offset = 0;
  totalCargados = 0;

  constructor(
    private route: ActivatedRoute,
    private medicionService: MedicionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.paramMapSub = this.route.paramMap.subscribe(async params => {
      this.dispositivoId = Number(params.get('dispositivoId'));
      if (!this.dispositivoId) {
        console.warn('No se recibió un dispositivoId válido');
        return;
      }
      this.cargarMediciones();
    });

    this.iniciarActualizacionMediciones(30000);
  }

  ngOnDestroy() {
    this.detenerActualizacionMediciones();
    if (this.paramMapSub) this.paramMapSub.unsubscribe();
  }
  exportarCSV() {
    if (!this.mediciones || this.mediciones.length === 0) {
      console.warn('No hay mediciones para exportar');
      return;
    }
  
    // Construir filas CSV
    const filas = this.mediciones.map(m => ({
      fecha: new Date(m.fecha).toLocaleString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' }),
      carril: m.carril,
      valor: m.valor,
      clasificacion: m.clasificacionDescripcion || ''
    }));
  
    // Encabezados
    const encabezados = ['Fecha', 'Carril', 'Valor', 'Clasificación'];
  
    // Crear CSV
    const csvContent = [
      encabezados.join(';'),
      ...filas.map(f => `${f.fecha};${f.carril};${f.valor};${f.clasificacion}`)
    ].join('\n');
  
    // Crear blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
    // Crear enlace temporal y disparar descarga
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mediciones_dispositivo_${this.dispositivoId}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
    
  // 🔹 Cargar mediciones con paginación
  async cargarMediciones() {
    const id = Number(this.route.snapshot.paramMap.get('dispositivoId'));
    if (!id) return;

    try {
      const datos = await this.medicionService.getMediciones(id, this.limit, this.offset);
      this.mediciones = datos.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );

      // 🔹 Agrupar por hora
      this.medicionesAgrupadas = this.agruparPorFecha(this.mediciones);
      this.totalCargados = datos.length;

      console.log(`Mediciones agrupadas (offset ${this.offset}):`, this.medicionesAgrupadas);
    } catch (error) {
      console.error('Error al cargar mediciones:', error);
    }
  }

  // 🔹 Agrupar por fecha/hora
  agruparPorFecha(mediciones: Medicion[]): any[] {
    const grupos: { [clave: string]: Medicion[] } = {};

    for (const m of mediciones) {
      const fecha = new Date(m.fecha);

      const clave = fecha.toLocaleString('sv-SE', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour12: false
      }).slice(0, 16); // "YYYY-MM-DDTHH:mm"

      if (!grupos[clave]) grupos[clave] = [];
      grupos[clave].push(m);
    }

    return Object.entries(grupos).map(([clave, lista]) => ({
      fecha: new Date(clave),
      mediciones: lista.sort((a, b) => a.carril - b.carril)
    }));
  }

  // 🔹 Autorefresco
  iniciarActualizacionMediciones(intervaloMs: number = 25000) {
    if (this.intervaloMediciones) return;
    this.intervaloMediciones = setInterval(() => this.cargarMediciones(), intervaloMs);
  }

  detenerActualizacionMediciones() {
    if (this.intervaloMediciones) {
      clearInterval(this.intervaloMediciones);
      this.intervaloMediciones = undefined;
    }
  }

  // 🔹 Paginación
  siguientePagina() {
    if (this.totalCargados < this.limit) return; // no hay más registros
    this.offset += this.limit;
    this.cargarMediciones();
  }

  paginaAnterior() {
    this.offset = Math.max(this.offset - this.limit, 0);
    this.cargarMediciones();
  }

  // 🔹 Track by
  trackMedicion(index: number, medicion: any): any {
    return medicion.medicionId || index;
  }
}
