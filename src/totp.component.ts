import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from "rxjs";
import * as CryptoJS from 'crypto-js'

/**
 * Code based on https://www.thepolyglotdeveloper.com/2014/10/generate-time-based-one-time-passwords-javascript/
 */

@Component({
  selector: 'totp-component',
  template: `TOTP component: updating in {{ tick }} seconds.<p>{{ TOTP }}`
})
export class TOTPComponent implements OnInit, OnDestroy {

  public tick: number;
  private TOTP: string
  private subscription: any;


  constructor() {
    console.log('TOTPComponent called')
  }

  ngOnInit() {
    this.createTOTP("H5UFORDGKVRV4XJOKRVVAYSYFRWCQJJ6");
    let timer = Observable.timer(0, 1000);
    this.subscription = timer.subscribe(t => this.calculateNextUpdate(t), e => console.log('onError: %s', e),
      () => console.log('onCompleted'));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  calculateNextUpdate(t: any) {
    var currentSeconds = new Date().getSeconds();
    // Perform calculation to work out how many seconds remaining
    var secsToUpdate = 0;
    if (currentSeconds == 0 || currentSeconds == 30) {
      this.createTOTP("H5UFORDGKVRV4XJOKRVVAYSYFRWCQJJ6");
    }
    // If less than 30, next update is at 30
    if (currentSeconds < 30) {
      secsToUpdate = 30 - currentSeconds;
    } else if (currentSeconds > 30) {
      secsToUpdate = 60 - currentSeconds;
    }
    this.tick = secsToUpdate;
  }

  createTOTP(secret: string) {
    this.TOTP = this.getOTP(secret);
  }

  dec2hex(s: number) {
    return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
  };

  hex2dec(s: string) {
    return parseInt(s, 16);
  };

  leftpad(s: string, l: number, p: string) {
    if (l + 1 >= s.length) {
      s = Array(l + 1 - s.length).join(p) + s;
    }
    return s;
  };

  base32tohex(base32: string) {
    var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    var bits = "";
    var hex = "";
    for (var i = 0; i < base32.length; i++) {
      var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
      bits += this.leftpad(val.toString(2), 5, '0');
    }
    for (var i = 0; i + 4 <= bits.length; i += 4) {
      var chunk = bits.substr(i, 4);
      hex = hex + parseInt(chunk, 2).toString(16);
    }
    return hex;
  };

  getOTP(secret: string) {
    try {
      var epoch = Math.round(new Date().getTime() / 1000.0);
      console.log(epoch);
      var time = this.leftpad(this.dec2hex(Math.floor(epoch / 30)), 16, "0");
      var hexMsg = CryptoJS.enc.Hex.parse(time);
      var hexKey = CryptoJS.enc.Hex.parse(this.base32tohex(secret));
      var hash = CryptoJS.HmacSHA1(hexMsg, hexKey);
      /**
       * had to split it this way as 
       * var hmac = CryptoJS.HmacSHA1(hexMsg, hexKey).toString(CryptoJS.enc.Hex);
       * produced 
       * error TS2346: Supplied parameters do not match any signature of call target.
       */
      var hmac = CryptoJS.enc.Hex.stringify(hash);
      var offset = this.hex2dec(hmac.substring(hmac.length - 1));
      var otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec("7fffffff")) + "";
      otp = otp.substr(otp.length - 6, 6);
    } catch (error) {
      throw error;
    }
    return otp;
  };

}