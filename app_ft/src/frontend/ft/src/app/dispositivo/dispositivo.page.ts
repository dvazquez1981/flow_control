import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonLabel,
  IonButton,  IonBackButton,
  IonButtons  
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DispositivoService, Dispositivo } from '../services/dispositivo.service';
import { ElectrovalvulaService, Electrovalvula } from '../services/electrovalvula.service';
import { MedicionService, Medicion } from '../services/medicion.service';
import { LogRiegoService, LogRiego } from '../services/log-riego.service';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.page.html',
  styleUrls: ['./dispositivo.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonBackButton,
    IonButtons  
  ]
})


export class DispositivoPage implements OnInit {
  dispositivo?: Dispositivo;
  electrovalvula: Electrovalvula = {} as Electrovalvula;
  logsRiego: LogRiego[] = [];
  ultimaMedicion: Medicion = {} as Medicion;
  intervaloMediciones: any; // para setInterval
  valvulaAbierta = false; 

  constructor(
    private route: ActivatedRoute,
    private dispositivoService: DispositivoService,
    private electrovalvulaService: ElectrovalvulaService,
    private medicionService: MedicionService,
    private logRiegoService: LogRiegoService,
    private router: Router
    

  ) {}


  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('dispositivoId'));
    if (!id) return;
    try {
        this.dispositivo = await this.dispositivoService.getDispositivo(id);
        console.log('Dispositivo:', this.dispositivo);
 
        if (this.dispositivo?.electrovalvulaId) {
            const electroId = Number(this.dispositivo.electrovalvulaId);
          
         this.electrovalvula = await this.electrovalvulaService.getElectrovalvula(electroId);
         console.log('Electrovalvula:', this.electrovalvula);

        //Obtener última medición
        this.ultimaMedicion = await this.medicionService.getUltimaMedicion(id);
        console.log('Última medición:', this.ultimaMedicion);
        //obtengo el log_riego
        this.logsRiego = await this.logRiegoService.getLogs(electroId);
        if(this.logsRiego.length>0)
        {
           this.valvulaAbierta=this.logsRiego[0].apertura==0?false:true;
        if(this.valvulaAbierta)
               this.iniciarMedicionesContinuas()       
        }
        console.log('Logs de riego:', this.logsRiego);
        }
      } catch (error) {
        console.error('Error al obtener el dispositivo:', error);
      }
    }
   
 async abrirValvula() {
  if (!this.electrovalvula) return;

  /*const ultimoLog = this.logsRiego[0];
  if (!ultimoLog?.logRiegoId) {
    console.warn('No hay log de riego disponible para abrir válvula');
    return;
  }
    */

  if (!this.dispositivo || !this.dispositivo.dispositivoId) {
  console.error('No hay dispositivo seleccionado');
  return;
  }


 

  try {
      const actualizado = await this.logRiegoService.addLog(
      this.electrovalvula.electrovalvulaId,
      1
    );
    console.log('Válvula abierta:', actualizado);
     this.logsRiego.unshift(actualizado);
     this.valvulaAbierta = true;
    this.iniciarMedicionesContinuas();
 
  } catch (err) {
    console.error('Error al abrir válvula:', err);
  }
}

async cerrarValvula() {
  if (!this.electrovalvula) return;


  try {
    const actualizado = await this.logRiegoService.addLog(
      this.electrovalvula.electrovalvulaId,
      0
    );
    console.log('Válvula cerrada:', actualizado);
    this.logsRiego.unshift(actualizado);
  
    
    this.detenerMedicionesContinuas() ;
    this.valvulaAbierta = false;


  } catch (err) {
    console.error('Error al cerrar válvula:', err);
  }
}

iniciarMedicionesContinuas() {
  if (this.intervaloMediciones) return;

  this.intervaloMediciones = setInterval(async () => {
    const valor = parseFloat((Math.random() * 100).toFixed(2)).toString(); // ahora es número
    const fecha = new Date();

    const nuevaMedicion: Medicion = {
      valor,
      dispositivoId: this.dispositivo!.dispositivoId,
      fecha
    };

    try {

      await this.medicionService.guardarMedicion(nuevaMedicion);
      this.ultimaMedicion=nuevaMedicion
      console.log('Medición guardada:', nuevaMedicion);
    } catch (error) {
      console.error('Error guardando medición:', error);
    }
  }, 10000); // cada 10 segundos (puedes ajustar el intervalo)
}


verMediciones(dispositivo: Dispositivo | any) {
  
this.router.navigate(['/medicion/dispositivo', dispositivo.dispositivoId], {
  queryParams: { valvulaAbierta: this.valvulaAbierta }
});

  console.log("valvula abierto" +this.valvulaAbierta)


}


detenerMedicionesContinuas() {
  if (this.intervaloMediciones) {
    clearInterval(this.intervaloMediciones);
    this.intervaloMediciones = null;
    console.log('Mediciones continuas detenidas');
  }
}

  }
