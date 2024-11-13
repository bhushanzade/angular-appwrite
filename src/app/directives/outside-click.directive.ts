import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  HostListener,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appOutsideClick]',
  standalone: true,
})
export class OutsideClickDirective {
  @Output() outsideClick: EventEmitter<MouseEvent> =
    new EventEmitter<MouseEvent>();

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    // Check if the clicked target is outside the element
    if (!this.el.nativeElement.contains(event.target)) {
      this.outsideClick.emit(event); // Emit event when the click is outside
    }
  }
}
