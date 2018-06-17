import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class LoadingProvider {
  private loading: Loading;
  constructor(public loadingCtrl: LoadingController) {}

  showLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  stopLoading(){
    this.loading.dismiss();
  }

}
