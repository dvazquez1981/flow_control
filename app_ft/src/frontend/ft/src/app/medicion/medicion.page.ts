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
import { ClasificacionService, Clasificacion } from '../services/clasificacion.service';

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
export class MedicionPage implements OnInit, OnDestroy {
  mediciones: Medicion[] = [];
  medicionesAgrupadas: any[] = [];
  intervaloMediciones?: any;
  dispositivoId: any;
  private paramMapSub?: any;

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
    });

    this.cargarMediciones();
    this.iniciarActualizacionMediciones(30000);
  }

  ngOnDestroy() {
    this.detenerActualizacionMediciones();
    if (this.paramMapSub) this.paramMapSub.unsubscribe();
  }

  async cargarMediciones() {
    const id = Number(this.route.snapshot.paramMap.get('dispositivoId'));
    if (!id) return;

    try {
      const datos = await this.medicionService.getMediciones(id);
      this.mediciones = datos.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );

      // 🔹 Agrupar por hora
      this.medicionesAgrupadas = this.agruparPorFecha(this.mediciones);

      console.log('Mediciones agrupadas:', this.medicionesAgrupadas);
    } catch (error) {
      console.error('Error al cargar mediciones:', error);
    }
  }

agruparPorFecha(mediciones: Medicion[]): any[] {
  const grupos: { [fecha: string]: Medicion[] } = {};

  for (const m of mediciones) {
    // 🔹 Redondeamos a formato exacto de fecha (sin milisegundos)
    const fechaCompleta = new Date(m.fecha).toISOString().slice(0, 19); // yyyy-MM-ddTHH:mm:ss

    if (!grupos[fechaCompleta]) grupos[fechaCompleta] = [];
    grupos[fechaCompleta].push(m);
  }

  // 🔹 Convertimos a array y ordenamos las mediciones por carril dentro de cada grupo
  return Object.entries(grupos).map(([fecha, lista]) => ({
    fecha,
    mediciones: lista.sort((a, b) => a.carril - b.carril)
  }));
}



  iniciarActualizacionMediciones(intervaloMs: number = 10000) {
    if (this.intervaloMediciones) return;
    this.intervaloMediciones = setInterval(() => this.cargarMediciones(), intervaloMs);
  }

  detenerActualizacionMediciones() {
    if (this.intervaloMediciones) {
      clearInterval(this.intervaloMediciones);
      this.intervaloMediciones = undefined;
    }
  }

  trackMedicion(index: number, medicion: any): any {
    return medicion.id || index;
  }
}
