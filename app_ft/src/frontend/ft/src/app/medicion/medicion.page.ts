import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf, NgFor,CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UnidadPipe } from '../pipes/unidad.pipe';
import { ResaltarDirective } from '../directives/resaltar.directive';


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
  IonText  
} from '@ionic/angular/standalone';
import { MedicionService, Medicion } from '../services/medicion.service';

@Component({
  selector: 'app-medicion',
  templateUrl: './medicion.page.html',
  styleUrls: ['./medicion.page.scss'],
  standalone: true,
  imports: [

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
    IonText
  ]
})
export class MedicionPage implements OnInit, OnDestroy {

  mediciones: Medicion[] = [];
  intervaloMediciones?: any;


  constructor(
    private route: ActivatedRoute,
    private medicionService: MedicionService,
    private router: Router
  ) {}

  ngOnInit() {

    this.cargarMediciones();
    this.iniciarActualizacionMediciones(5000);


    /*this.route.queryParams.subscribe(params => {
      this.valvulaAbierta = params['valvulaAbierta'] === 'true' || params['valvulaAbierta'] === '1';
      console.log('Válvula abierta?', this.valvulaAbierta);
    });

    this.cargarMediciones();

    if (this.valvulaAbierta) {
      this.iniciarActualizacionMediciones(5000);
    }*/
  }

  ngOnDestroy() {
    this.detenerActualizacionMediciones();
  }

  async cargarMediciones() {
    const id = Number(this.route.snapshot.paramMap.get('dispositivoId'));
    if (!id) return;

    try {
      const datos = await this.medicionService.getMediciones(id);
      this.mediciones = datos.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      console.log('Mediciones cargadas:', this.mediciones);
    } catch (error) {
      console.error('Error al cargar mediciones:', error);
    }
  }

  iniciarActualizacionMediciones(intervaloMs: number = 5000) {
    if (this.intervaloMediciones) return;
    this.intervaloMediciones = setInterval(() => this.cargarMediciones(), intervaloMs);
  }

  detenerActualizacionMediciones() {
    if (this.intervaloMediciones) {
      clearInterval(this.intervaloMediciones);
      this.intervaloMediciones = undefined;
    }
  }
}
