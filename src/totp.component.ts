import { Component, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { Observable, Subscription } from "rxjs";

import { TOTPService } from './totp.service';

/**
 * Code based on https://www.thepolyglotdeveloper.com/2014/10/generate-time-based-one-time-passwords-javascript/
 */

@Component({
  selector: 'totp-component',
  template: `TOTP component: updating in {{ tick }} seconds.<p>{{ TOTP }}`,
  providers: [TOTPService]
})
export class TOTPComponent implements OnInit, OnDestroy {

  @Input() public secret: string;
  @Output() private tick: number;
  @Output() private TOTP: string
  private subscription: any;

  constructor(private totpService: TOTPService) {
  }

  ngOnInit() {
    this.calculateNextUpdate()
    let timer = Observable.timer(0, 1000);
    this.subscription = timer.subscribe(t => this.calculateNextUpdate(), e => console.log('onError: %s', e),
      () => console.log('onCompleted'));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  calculateNextUpdate() {
    var currentSeconds = new Date().getSeconds();
    // Perform calculation to work out how many seconds remaining
    var secsToUpdate = 0;
    if (currentSeconds == 0 || currentSeconds == 30 || !this.TOTP) {
      this.TOTP = this.totpService.createTOTP(this.secret);
    }
    // If less than 30, next update is at 30
    if (currentSeconds < 30) {
      secsToUpdate = 30 - currentSeconds;
    } else if (currentSeconds > 30) {
      secsToUpdate = 60 - currentSeconds;
    }
    this.tick = secsToUpdate;
  }
}