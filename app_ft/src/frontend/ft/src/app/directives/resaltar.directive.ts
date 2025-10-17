import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[resaltar]',
  standalone: true
})
export class ResaltarDirective implements OnChanges {
  @Input() valor!: number | string;
  @Input() carril!: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}
  //300 como alarma
  ngOnChanges() {
    const valorNum = Number(this.valor);
    if ((this.carril==1 && valorNum> 300) || (this.carril==2 && valorNum> 100) )
    {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#ff0000');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'background-color');
    }
  }
}
