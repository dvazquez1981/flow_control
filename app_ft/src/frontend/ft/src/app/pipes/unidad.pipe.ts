import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unidad',
  standalone: true
})
export class UnidadPipe implements PipeTransform {
  transform(value: number | null | undefined, unidad: string = ''): string {
    if (value === null || value === undefined) return '';
    return `${value} ${unidad}`;
  }
}
