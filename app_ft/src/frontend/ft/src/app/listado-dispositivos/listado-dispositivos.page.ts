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
import { TipoContadorService, TipoContador} from '../services/tipo-contador.service';

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

  tiposContador: TipoContador[] = [];

  constructor(private dispositivoService: DispositivoService, private tipoContadorService: TipoContadorService,private router: Router) {}

 async ngOnInit() {
  try {
    // Traemos dispositivos y tipos de contador en paralelo
    const [dispositivos, tipos] = await Promise.all([
      this.dispositivoService.getDispositivos(),
      this.tipoContadorService.getTiposContador()
    ]);

  this.tiposContador = tipos;
    // Mapear la descripción sobre cada dispositivo
     this.dispositivos = dispositivos.map(disp => {
      const tipo = tipos.find(t => String(t.TC_Id) === String(disp.tipoContadorId));
      return { ...disp, tipoContadorDescripcion: tipo?.TC_TipoContador || 'Desconocido' };
    });

    console.log('Dispositivos:', this.dispositivos);
    console.log('Tipo contador:',this.tiposContador);

  } catch (error) {
    console.error('Error al cargar dispositivos:', error);
  }
}


verDetalle(dispositivo: Dispositivo | any) {
  
  this.router.navigate(['/dispositivo', dispositivo.dispositivoId]);
}
}

