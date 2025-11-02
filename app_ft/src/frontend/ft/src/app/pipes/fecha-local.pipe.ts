import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaLocal',
  standalone: true
})
export class FechaLocalPipe implements PipeTransform {

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

    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

}
