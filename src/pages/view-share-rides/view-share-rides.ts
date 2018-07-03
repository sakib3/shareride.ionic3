import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoadingProvider } from '../../providers/loading/loading';

class PostRideModel {
  _id: any;
  name: string;
  from: string;
  destinationLocation: Array<any>;
  to: string;
  sourceLocation: Array<any>;
  stopover: Array<string>;
  shareType: string;
  journeyFrequency: string;
  daysOfTravel: Array<string>;
  journeyDate: string;
  returnDate: string;
  rate;
  availability: string;
  constructor() { }
}

@Component({
  selector: 'page-view-share-rides',
  templateUrl: 'view-share-rides.html',
})
export class ViewShareRidesPage {
  public models = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public api: ApiProvider,
    public loadingProvider: LoadingProvider
  ) { }

  ionViewDidLoad() {
    var self = this;
    self.loadingProvider.showLoading();
    self.api.setToken().then((token) => {
      //self.api.get('api/postRides')
      self.api.get('api/postRides/nearCurrentLocation', {sourceLocation:[1,2]})
        .subscribe((res: any) => {
          self.models = res;
          self.loadingProvider.stopLoading();
          alert(JSON.stringify(res));
        }, (err) => {
          self.loadingProvider.stopLoading();
          console.log('error ', err._body)
        });
    })

  }
  closeModal() {
    this.viewCtrl.dismiss();
  }

}
