import {Component, Input} from '@angular/core';

@Component({
  selector: 'totp-component',
  template: `TOTP component`
})
export class TOTPComponent {

  @Input()
  result: any;

  constructor() {
    console.log('TOTPComponent called')

  }

}