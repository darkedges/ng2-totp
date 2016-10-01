import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[totpDirective]'
})
export class TOTPDirective {
  @Input()
  result: any;
  constructor(private el: ElementRef) {
    console.log(`* AppRoot 22 highlight called for ${el.nativeElement.tagName}`);
  }

}