import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PickUpPage } from './pick-up';

@NgModule({
  declarations: [
    PickUpPage,
  ],
  imports: [
    IonicPageModule.forChild(PickUpPage),
  ],
})
export class PickUpPageModule {}
