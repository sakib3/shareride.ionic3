import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
declare var google;
var route= {source : '', destination: '', stopover:[]};

class FindRideModel{
   name: string;
   from: string;
   destinationLocation: Array<any>;
   to: string;
   sourceLocation: Array<any>;
   journeyFrequency: string;
   daysOfTravel: Array<string>;
   journeyDate: string;
   returnDate: string;
   constructor(){}
}
@Component({
  selector: 'page-pick-up',
  templateUrl: 'pick-up.html',
})
export class PickUpPage {
  target= {fromActiveIcon:"md-radio-button-off",toActiveIcon:"md-radio-button-off"};
  source:string = '';
  stopover:string;
  stopOverArray:Array<string> = [];
  days:Array<any> = [
    { day:"Sat", checked: true },
    { day:"Sun", checked: true },
    { day:"Mon", checked: true },
    { day:"Tue", checked: true },
    { day:"Wed", checked: true },
    { day:"Thu", checked: true },
    { day:"Fri", checked: true }];
  isReturnDay = false;
  model: FindRideModel;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    public api: ApiProvider
    ) {
      this.model = new FindRideModel();
      this.api.setToken().then(() => {});
  }

  addStopOver(){
    this.stopOverArray = this.stopOverArray.concat(this.stopover);
    document.getElementById('stopover').nodeValue = '';
  }
  ionViewDidLoad() {
    var self = this;
    if(this.navParams.get('source'))
      route.source = this.navParams.get('source');
    this.source = route.source;
    var destination = document.getElementById('destination');
    var autocompleteDestination = new google.maps.places.Autocomplete(destination);
    var source = document.getElementById('source');
    document.getElementById('source').nodeValue = route.source;
    var autocompleteSource = new google.maps.places.Autocomplete(source);
    var stopover = document.getElementById('stopover');
    var autocompleteStopover = new google.maps.places.Autocomplete(stopover);
    google.maps.event.addListener(autocompleteStopover, 'place_changed', function () {
      self.stopover = autocompleteStopover.getPlace().formatted_address;
      console.log(self.stopover);
    });

    google.maps.event.addListener(autocompleteSource, 'place_changed', function () {
      var sourceLocation = autocompleteSource.getPlace().geometry.location;
      self.model.sourceLocation = [sourceLocation.lng(), sourceLocation.lat()];
      route.source = autocompleteSource.getPlace().formatted_address;
      self.model.from = route.source;
    });

    google.maps.event.addListener(autocompleteDestination, 'place_changed', function () {
      var destinationLocation = autocompleteDestination.getPlace().geometry.location;
      self.model.destinationLocation = [destinationLocation.lng(), destinationLocation.lat()];
      route.destination = autocompleteDestination.getPlace().formatted_address;
      self.model.to = route.destination;
    });
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
  focusFunction(key){
    console.log(key);
    this.target[key] = "md-radio-button-on";
  }
  focusOutFunction(key){
    this.target[key] = "md-radio-button-off";
  }
  onSubmit() {
    var waypts = [];
    for (var i = 0; i < this.stopOverArray.length; i++)
    waypts.push({
      location: this.stopOverArray[i],
      stopover: true
    });
    //route.stopover = waypts;
    let checkedDays = this.days.filter((d)=> d.checked == true);
    if(checkedDays.length > 0)
      this.model.daysOfTravel = checkedDays.map((d) => d.day);

    this.api.post('api/rides',this.model)
    .subscribe((res: any) => {
      console.log(res)
    }, (err) => {
              console.log('error ', err._body)

    });
    console.log(JSON.stringify(this.model));
    this.viewCtrl.dismiss(route);
  }
}
