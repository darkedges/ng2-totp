import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js'

@Injectable()
export class TOTPService {
    constructor() { }

    createTOTP(secret: string) {
        return this.getOTP(secret);
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