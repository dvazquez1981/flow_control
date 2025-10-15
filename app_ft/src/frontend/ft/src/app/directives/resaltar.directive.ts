import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[resaltar]',
  standalone: true
})
export class ResaltarDirective implements OnChanges {
  @Input('resaltar') valor!: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}
//300 como alarma
  ngOnChanges() {
    if (this.valor > 300) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#ff0000');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'background-color');
    }
  }
}
