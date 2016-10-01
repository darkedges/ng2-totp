import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";

import { TOTPDirective } from "./totp.directive";
import { TOTPComponent } from "./totp.component";

export { TOTPDirective } from "./totp.directive";
export { TOTPComponent } from "./totp.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TOTPComponent,
    TOTPDirective
  ],
  exports: [
    TOTPComponent,
    TOTPDirective
  ]
})
export class TOTPModule {

}
