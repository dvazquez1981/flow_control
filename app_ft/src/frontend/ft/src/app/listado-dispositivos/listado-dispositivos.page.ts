import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonFooter
} from '@ionic/angular/standalone'; // <-- asegúrate de incluirlos todos
import { Router } from '@angular/router';
import { DispositivoService, Dispositivo } from '../services/dispositivo.service';

@Component({
  selector: 'app-listado-dispositivos',
  templateUrl: './listado-dispositivos.page.html',
  styleUrls: ['./listado-dispositivos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,     
    IonButton,   
    IonFooter     
  ]
})
export class ListadoDispositivosPage implements OnInit {
  dispositivos: Dispositivo[] = [];

  constructor(private dispositivoService: DispositivoService, private router: Router) {}

  async ngOnInit() {
    try {
      this.dispositivos = await this.dispositivoService.getDispositivos();
      console.log('Dispositivos:', this.dispositivos);
    } catch (error) {
      console.error('Error al cargar dispositivos:', error);
    }
  }

verDetalle(dispositivo: Dispositivo | any) {
  
  this.router.navigate(['/dispositivo', dispositivo.dispositivoId]);
}
}

