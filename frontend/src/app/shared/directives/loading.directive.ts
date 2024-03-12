import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[vgmLoading]',
  standalone: true,
})
export class LoadingDirective {
  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
  ) {}

  @HostListener('click', ['$event']) onClick() {
    this.renderer.addClass(this.element.nativeElement, 'btn-disabled');

    const icon = this.element.nativeElement.children[0];
    this.renderer.removeChild(this.element.nativeElement, icon);

    const textSpan = this.element.nativeElement.children[0];
    this.renderer.setProperty(textSpan, 'innerHTML', 'Carregando...');

    const loadingSpinner = this.renderer.createElement('span');
    this.renderer.addClass(loadingSpinner, 'loading');
    this.renderer.addClass(loadingSpinner, 'loading-spinner');
    this.renderer.insertBefore(this.element.nativeElement, loadingSpinner, textSpan);
  }
}
