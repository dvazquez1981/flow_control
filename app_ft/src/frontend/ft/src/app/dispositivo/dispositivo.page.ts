import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonLabel,
  IonButton, IonBackButton, IonButtons,
  IonSelect, IonSelectOption, IonInput
} from '@ionic/angular/standalone';

import { DispositivoService, Dispositivo } from '../services/dispositivo.service';
import { TipoComandoService, TipoComando } from '../services/tipo-comando.service';
import { ComandoService, Comando } from '../services/comando.service';
import { MedicionService, Medicion } from '../services/medicion.service';
import { RespuestaService, Respuesta } from '../services/respuesta.service';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.page.html',
  styleUrls: ['./dispositivo.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    IonButtons,
    IonSelect,
    IonSelectOption,
    IonInput
  ]
})
export class DispositivoPage implements OnInit, OnDestroy {
  dispositivo?: Dispositivo;
  tiposComando: TipoComando[] = [];
  ultimoComando?: Comando;
  tipoSeleccionado?: TipoComando;
  valorComando: string = '';
  ultimaMedicion: Medicion = {} as Medicion;
  respuestasUltimoComando: Respuesta[] = [];

  private intervaloActualizar?: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dispositivoService: DispositivoService,
    private tipoComandoService: TipoComandoService,
    private comandoService: ComandoService,
    private medicionService: MedicionService,
    private respuestaService: RespuestaService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('dispositivoId'));
    if (!id) return;

    try {
      // Cargar dispositivo y medición inicial
      this.dispositivo = await this.dispositivoService.getDispositivo(id);
      this.ultimaMedicion = await this.medicionService.getUltimaMedicion(id);

      // Tipos de comando
      if (this.dispositivo?.tipoContadorId) {
        this.tiposComando = await this.tipoComandoService.obtenerPorTipoContadorId(this.dispositivo.tipoContadorId);
      }

      // Cargar último comando
      await this.cargarUltimoComando(id);

      // Actualizar respuestas y medición cada 15 segundos
      this.intervaloActualizar = setInterval(async () => {
        if (this.dispositivo?.dispositivoId) {
          // Actualizar última medición
          this.ultimaMedicion = await this.medicionService.getUltimaMedicion(this.dispositivo.dispositivoId);

          // Actualizar respuestas si hay un comando
          if (this.ultimoComando?.cmdId) {
            this.respuestasUltimoComando = await this.respuestaService.getRespuestasPorComando(this.ultimoComando.cmdId);
          }

          // Forzar refresco de la vista
          this.cdr.detectChanges();
        }
      }, 15000);

    } catch (error) {
      console.error('❌ Error en DispositivoPage:', error);
    }
  }

  ngOnDestroy() {
    if (this.intervaloActualizar) {
      clearInterval(this.intervaloActualizar);
    }
  }

  verMediciones() {
    if (this.dispositivo) {
      this.router.navigate(['/medicion/dispositivo', this.dispositivo.dispositivoId]);
    }
  }

  async crearComando() {
    if (!this.dispositivo || !this.tipoSeleccionado || !this.valorComando) return;

    const nuevoComando: Omit<Comando, 'cmdId'> = {
      dispositivoId: this.dispositivo.dispositivoId,
      tipoComandId: this.tipoSeleccionado.tipoComandId,
      valor: this.valorComando  ||  null, 
      fecha: new Date()
    };

    try {
      const creado = await this.comandoService.crearComando(nuevoComando);

      if (creado?.cmdId != null) {
        creado.fecha = new Date(creado.fecha);
        this.ultimoComando = creado;

        // Limpiar formulario
        this.valorComando = '';
        this.tipoSeleccionado = undefined;

        // Cargar respuestas del nuevo comando inmediatamente
        this.respuestasUltimoComando = await this.respuestaService.getRespuestasPorComando(creado.cmdId);
        this.cdr.detectChanges();
      } else {
        console.error('El backend no devolvió cmdId al crear el comando', creado);
      }
    } catch (error) {
      console.error('Error al crear comando:', error);
    }
  }

  private async cargarUltimoComando(dispositivoId: number) {
    try {
      const ultimo = await this.comandoService.obtenerUltimoPorDispositivoId(dispositivoId);
      if (ultimo?.cmdId != null) {
        ultimo.fecha = new Date(ultimo.fecha);
        this.ultimoComando = ultimo;
        this.respuestasUltimoComando = await this.respuestaService.getRespuestasPorComando(ultimo.cmdId);
      } else {
        this.ultimoComando = undefined;
        this.respuestasUltimoComando = [];
      }
    } catch (error) {
      console.error('Error al cargar último comando:', error);
      this.ultimoComando = undefined;
      this.respuestasUltimoComando = [];
    }
  }
}
