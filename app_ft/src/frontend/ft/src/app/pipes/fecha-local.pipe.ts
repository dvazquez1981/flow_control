import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaLocal',
    standalone: true 
})
export class FechaLocalPipe implements PipeTransform {

  /**
   * Convierte una fecha ISO o Date a formato 'YYYY-MM-DD HH:mm:ss'
   * @param fecha string ISO o Date
   */
  transform(fecha: string | Date | null | undefined): string {
    if (!fecha) return 'No disponible';

    let d: Date;
    if (typeof fecha === 'string') {
      d = new Date(fecha);
    } else {
      d = fecha;
    }

    if (isNaN(d.getTime())) return 'No disponible';

    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = d.getUTCFullYear();
    const month = pad(d.getUTCMonth() + 1);
    const day = pad(d.getUTCDate());
    const hours = pad(d.getUTCHours());
    const minutes = pad(d.getUTCMinutes());
    const seconds = pad(d.getUTCSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
  }

}
