import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resaltarHueco',
  standalone: true 
})
export class ResaltarHuecoPipe implements PipeTransform {

  transform(mediciones: any[], saltoMinutos: number = 60): boolean[] {
    if (!mediciones || mediciones.length === 0) return [];

    // Convertimos las fechas a Date y calculamos los saltos
    const res: boolean[] = [false]; // primera medición nunca tiene hueco anterior

    for (let i = 1; i < mediciones.length; i++) {
      const fechaPrev = new Date(mediciones[i - 1].fecha);
      const fechaActual = new Date(mediciones[i].fecha);

      const diffMinutos = (fechaActual.getTime() - fechaPrev.getTime()) / 60000;
      res.push(diffMinutos > saltoMinutos);
    }

    return res;
  }
}