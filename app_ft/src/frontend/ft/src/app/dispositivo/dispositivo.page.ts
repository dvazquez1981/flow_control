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
  private paramMapSub?: any;

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

  ngOnInit() {
    this.paramMapSub = this.route.paramMap.subscribe(async params => {
      const id = Number(params.get('dispositivoId'));
      if (!id) {
        console.warn('No se recibió un dispositivoId válido');
        return;
      }
      await this.cargarDatosDelDispositivo(id);
    });
  }

  ngOnDestroy() {
    if (this.intervaloActualizar) clearInterval(this.intervaloActualizar);
    if (this.paramMapSub) this.paramMapSub.unsubscribe();
  }

  private async cargarDatosDelDispositivo(id: number) {
    // Reinicio todo para forzar refresco
    this.dispositivo = undefined;
    this.tiposComando = [];
    this.ultimoComando = undefined;
    this.tipoSeleccionado = undefined;
    this.valorComando = '';
    this.respuestasUltimoComando = [];

    // Cargo dispositivo
    this.dispositivo = await this.dispositivoService.getDispositivo(id);
    if (!this.dispositivo) return;

    // Cargo última medición
    try {
      this.ultimaMedicion = await this.medicionService.getUltimaMedicion(id);
    } catch {
      this.ultimaMedicion = {} as Medicion;
    }

    // Cargo tipos de comando
    if (this.dispositivo.tipoContadorId != null) {
      try {
        const tipos = await this.tipoComandoService.obtenerPorTipoContadorId(this.dispositivo.tipoContadorId);
        this.tiposComando = tipos ?? [];
      } catch {
        this.tiposComando = [];
      }
    } else {
      this.tiposComando = [];
    }

    // Cargo último comando
    await this.cargarUltimoComando(id);

    // Iniciar intervalo
    if (this.intervaloActualizar) clearInterval(this.intervaloActualizar);
    this.intervaloActualizar = setInterval(() => this.actualizarDatos(), 15000);
  }

  private async cargarUltimoComando(dispositivoId: number) {
    try {
      const ultimo = await this.comandoService.obtenerUltimoPorDispositivoId(dispositivoId);
      this.ultimoComando = ultimo ?? undefined;

      if (ultimo?.cmdId != null) {
        try {
          const respuestas = await this.respuestaService.getRespuestasPorComando(ultimo.cmdId);
          this.respuestasUltimoComando = respuestas ?? [];
        } catch {
          this.respuestasUltimoComando = [];
        }
      } else {
        this.respuestasUltimoComando = [];
      }
    } catch {
      this.ultimoComando = undefined;
      this.respuestasUltimoComando = [];
    }
  }

  private async actualizarDatos() {
    if (!this.dispositivo) return;

    try {
      this.ultimaMedicion = await this.medicionService.getUltimaMedicion(this.dispositivo.dispositivoId);

      const ultimo = await this.comandoService.obtenerUltimoPorDispositivoId(this.dispositivo.dispositivoId);
      this.ultimoComando = ultimo ?? undefined;

      if (ultimo?.cmdId != null) {
        const respuestas = await this.respuestaService.getRespuestasPorComando(ultimo.cmdId);
        this.respuestasUltimoComando = respuestas ?? [];
      } else {
        this.respuestasUltimoComando = [];
      }

      this.cdr.detectChanges();
    } catch (err) {
      console.error('Error al actualizar datos:', err);
    }
  }

  verMediciones() {
    if (this.dispositivo) this.router.navigate(['/medicion/dispositivo', this.dispositivo.dispositivoId]);
  }

  async crearComando() {
    if (!this.dispositivo || !this.tipoSeleccionado || !this.valorComando) return;

    const nuevoComando: Omit<Comando, 'cmdId'> = {
      dispositivoId: this.dispositivo.dispositivoId,
      tipoComandId: this.tipoSeleccionado.tipoComandId,
      valor: this.valorComando || null,
      fecha: new Date()
    };

    try {
      const creado = await this.comandoService.crearComando(nuevoComando);
      if (creado?.cmdId != null) {
        this.ultimoComando = creado;
        this.valorComando = '';
        this.tipoSeleccionado = undefined;

        try {
          const respuestas = await this.respuestaService.getRespuestasPorComando(creado.cmdId);
          this.respuestasUltimoComando = respuestas ?? [];
        } catch {
          this.respuestasUltimoComando = [];
        }

        this.cdr.detectChanges();
      } else {
        console.error('El backend no devolvió cmdId al crear el comando', creado);
      }
    } catch (err) {
      console.error('Error al crear comando:', err);
    }
  }

  get tieneTiposComandos(): boolean {
    return !!this.tiposComando && this.tiposComando.length > 0;
  }
}
