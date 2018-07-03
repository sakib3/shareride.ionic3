import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';
import { LoadingController, NavController, ModalController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Platform } from 'ionic-angular';
import { PickUpPage } from '../../pages/pick-up/pick-up';
import { SharePostPage } from '../../pages/share-post/share-post';
import { User } from '../../providers/user/user';
import { ApiProvider } from '../../providers/api/api';

declare var google;
var lastAddressFound = '';
var currentLocation : LatLng = null;
class LatLng {
  latitude: number;
  longitude: number;
  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent implements OnInit {
  showSearchRideButton: boolean;
  lastRoute: any;
  routeObject: any;
  public map;
  constructor(
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    public nav: NavController,
    private diagnostic: Diagnostic,
    private modalCtrl: ModalController,
    public platform: Platform,
    public user: User,
    public api: ApiProvider) {
    this.showSearchRideButton = false;
  }

  ngOnInit() {
    this.platform.ready()
      .then((readySource) => this.renderCurrentLocation());
  }

  findPostridesNearMe(){

    var self = this;
    this.diagnostic.isLocationEnabled()
      .then((isAvailable) => {
        if (isAvailable)
          this.getCurrentLocation()
            .subscribe(location => {
              self.api.setToken().then((token) => {
                self.api.post('api/postRides/nearCurrentLocation2', {sourceLocation:[location.longitude,location.latitude]})
                  .subscribe((res: any) => {

                    //alert(JSON.stringify(res));

                    var currentPosition = new google.maps.LatLng(location.latitude, location.longitude);
                    var locations = res.map((r)=> new google.maps.LatLng(r.sourceLocation[1], r.sourceLocation[0]));
                    var icon =  "https://developers.google.com/maps/documentation/javascript/images/circle.png";
                    //var self = this;
                    self.drawCustomCircle(currentPosition,self.map,icon);
                    locations.forEach(l => self.drawCustomMarker(l,self.map,icon));





                  }, (err) => {
                    console.log('error ', err._body)
                  });
              })
            });
        else
          alert('Please Turn On Your GPS!');
      })
      .catch((e) => alert(JSON.stringify(e)));
  }

  renderCurrentLocation() {
    this.diagnostic.isLocationEnabled()
      .then((isAvailable) => {
        if (isAvailable)
          this.getCurrentLocation()
            .subscribe(location => {
              currentLocation = new LatLng(location.latitude, location.longitude);
              this.createMap(currentLocation);
              this.getAddress(currentLocation);
            });
        else
          alert('Please Turn On Your GPS!');
      })
      .catch((e) => alert(JSON.stringify(e)));
  }

  getCurrentLocation() {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();
    let locationObs = Observable.create(obserable => {
      this.geolocation.getCurrentPosition()
        .then((resp) => {
          var location = new LatLng(resp.coords.latitude, resp.coords.longitude);
          obserable.next(location);
          loading.dismiss();
        })
        .catch((error) => {
          console.log('Error getting location', error);
          loading.dismiss();
        });
    });
    return locationObs;
  }

  createMap(location: LatLng) {
    this.setMap(location);
    document.getElementById('total').style.display = "none";
    this.drawMarker(location,this.map);
  }

  findRidesNearby(location: LatLng){
    var locations = this.generateRandomPoints(location);
   // var icon =  "https://png.icons8.com/barber-chair/color/48";
    var icon =  "https://png.icons8.com/swipe-down/androidL/35/000000";
    var self = this;
    locations.forEach(l => self.drawCustomMarker(l,self.map,icon));
  }

  setMap(location:LatLng){
    let mapEl = document.getElementById("map");
    let mapOptions = {
          center: new google.maps.LatLng(location.latitude, location.longitude),
          zoom: 11,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
    }
    this.map = new google.maps.Map(mapEl, mapOptions);
  }

  drawMarker(location:LatLng, map){
    var markerOption : any = {
      position: new google.maps.LatLng(location.latitude, location.longitude),
      map: map
    }
    new google.maps.Marker(markerOption);
  }

  drawCustomCircle(location, map, icon){
    new google.maps.Circle({
      center: location,
      map: map,
      radius: 5000, // in meters
      strokeOpacity: 0.1,
      strokeWeight: 1,
      fillColor: "#00F00F",
      fillOpacity: 0.2
    });
  }

  drawCustomMarker(location, map, icon){
    new google.maps.Marker({
      position: location,
      map: map,
      icon: icon,
      animation: google.maps.Animation.DROP
    });
  }

  getRandomArbitrary(number) {
    var sign = Math.floor (Math.random()) %2 == 0 ? 1 : -1;
    return Math.random()* .008*(sign) + number;
  }

  getAddress(location: LatLng) {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var geocoder = new google.maps.Geocoder;
    var latlng = { lat: location.latitude, lng: location.longitude };
    var self = this;
    geocoder.geocode({ 'location': latlng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          lastAddressFound = results[0].formatted_address;
          //this.createMap(location);
        }
        else
          alert('No results found');
      } else
        alert('Geocoder failed due to: ' + status);
    });
  }


  generateRandomPoints(location:LatLng) : Array<any>{
    var point = new google.maps.LatLng(location.latitude, location.longitude);
    var points = new Array();
    for(let i = 0; i < Math.floor(Math.random()*16+4); i++){
      var spherical = google.maps.geometry.spherical;
      var north = spherical.computeOffset(point, this.getRandomRange(100,500), this.getRandomRange(0,89));
      var west  = spherical.computeOffset(point, this.getRandomRange(600,1000), this.getRandomRange(-89,0));
      var south = spherical.computeOffset(point, this.getRandomRange(1100,1500), this.getRandomRange(90,180));
      var east  = spherical.computeOffset(point, this.getRandomRange(1600,2000), this.getRandomRange(181,270));
      points.push(north);
      points.push(west);
      points.push(south);
      points.push(east);
    }
    return points;
  }


  sharePostModal() {
    const pickUpModal = this.modalCtrl.create(SharePostPage, { source: lastAddressFound });
    pickUpModal.onDidDismiss(data => {
      if (data){
        this.displayRoute(data);
      }

      //this.showSearchRideButton = true;
    });
    this.showSearchRideButton = false;
    pickUpModal.present();
  }

  pickUpModal() {
    const pickUpModal = this.modalCtrl.create(PickUpPage, { source: lastAddressFound });
    pickUpModal.onDidDismiss(data => {
      if (data){
        this.displayRoute(data);
        //this.findRidesNearby(currentLocation);
        // this.user.x('blah').subscribe(
        //     (res: any) => {

        //     },
        //     (err) => console.log(err));
      }
      this.showSearchRideButton = true;
    });
    this.showSearchRideButton = false;
    pickUpModal.present();
  }

  getMapOptions(): any {
    return {
      zoom: 11,//15
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      scaleControl: true,
      disableDefaultUI: true
    };
  }

  initMap(){
    let mapOptions = this.getMapOptions();
    let mapEl = document.getElementById("map");
    let map = new google.maps.Map(mapEl, mapOptions);
    map.setOptions(this.getGoogleMapStyle());
    this.map = map;
  }

  searchRide() {
    this.findRidesNearby(currentLocation);
  }

  displayRoute(routeData) {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    this.initMap();
    directionsDisplay.setMap(this.map);
    var self = this;
    //this.diplayTotalDistanceTime(directionsDisplay.getDirections())
    directionsDisplay.addListener(
      'directions_changed',
      () => self.diplayTotalDistanceTime(directionsDisplay.getDirections())
    );
    this.calculateAndDisplayRoute(directionsService, directionsDisplay, routeData.source, routeData.destination, routeData.stopover);
    this.do(routeData.source, routeData.destination);
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination, waypoints) {
    directionsService.route({
      origin: origin,
      destination: destination,
      waypoints: waypoints,
      travelMode: 'DRIVING',
      optimizeWaypoints: true,
      //stopover: true
    }, function (response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

 diplayTotalDistanceTime(result){
  var totalDistance = 0;
  var totalDuration = 0;
  var myroute = result.routes[0];
  var that = this;
  this.routeObject = myroute;
  for (var i = 0; i < myroute.legs.length; i++) {
    totalDistance += myroute.legs[i].distance.value;
    totalDuration += myroute.legs[i].duration.value;
  }

  var data = that.getTotal(totalDistance, totalDuration);
  this.showSearchRideButton = true;
  that.pushDatatoDom(data);
 }


getRandomRange(min,max){
  return Math.floor(Math.random()*max)+min;
}

  pushDatatoDom(data) {
    document.getElementById('total').style.display = "block";
    document.getElementById('totaldistance').innerHTML = data.totaldistance + ' km';
    document.getElementById('totalduration').innerHTML = data.totalduration.hours + ' hours ' + data.totalduration.mins + ' minutes';
  }

  getTotal(distanceInMeters, totalTimeInSeconds): any {
    var totaldistance = distanceInMeters / 1000;
    var secondsForMin = totalTimeInSeconds % (3600);
    var hours = Math.floor(totalTimeInSeconds / 3600);
    var mins = Math.floor(totalTimeInSeconds / 60);
    return {
      'totaldistance': totaldistance,
      'totalduration': { 'hours': hours, 'mins': mins }
    };
  }

  do(origin, destination) {
       var service = new google.maps.DistanceMatrixService;
       service.getDistanceMatrix({
         origins: [origin],
         destinations: [destination],
         travelMode: 'DRIVING',
         unitSystem: google.maps.UnitSystem.METRIC,
         avoidHighways: false,
         avoidTolls: false,
       }, function (response, status) {
           if (status !== 'OK')
             alert('Error was: ' + status);
           else
             var geocoder = new google.maps.Geocoder;
      });
  }

  getLatLng2(lat, lon) {
    return new google.maps.LatLng(lat, lon);
  }

  addMarker(location, label = "", icon = null) {
    let mapEl = document.getElementById("map");

    let mapOptions = {
      center: location,
      zoom: 11, //15
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }

    let map = new google.maps.Map(mapEl, mapOptions);
    //map.setOptions(this.getGoogleMapStyle());
    var that = this;
    var markerOptions : any = {
      position: location,
      map: map,
      label:label,
    };


    if( icon != null )
      markerOptions.icon = icon;
    new google.maps.Marker(markerOptions);
  }

  secToHourMin(seconds) {
    var secondsForMin = seconds % (3600);
    var hours = Math.floor(seconds / 3600);
    var mins = Math.floor(secondsForMin / 60);
    return hours + ' hours ' + mins + ' minutes';
  }

  computeTotalDistance(result) {
    var total = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].distance.value;
    }
    total = total / 1000;
    var data = '<ion-icon name="leaf" item-start></ion-icon>'
      + total +
      '<ion-icon name="rose" item-end></ion-icon>';
    document.getElementById('total').innerHTML = data;
  }

  getGoogleMapStyle() {
    return {
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
        {
          featureType: 'administrative',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#c9b2a6' }]
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#dcd2be' }]
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#ae9e90' }]
        },
        {
          featureType: 'landscape.natural',
          elementType: 'geometry',
          stylers: [{ color: '#dfd2ae' }]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [{ color: '#dfd2ae' }]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#93817c' }]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry.fill',
          stylers: [{ color: '#a5b076' }]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#447530' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#f5f1e6' }]
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry',
          stylers: [{ color: '#fdfcf8' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: '#f8c967' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#e9bc62' }]
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry',
          stylers: [{ color: '#e98d58' }]
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#db8555' }]
        },
        {
          featureType: 'road.local',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#806b63' }]
        },
        {
          featureType: 'transit.line',
          elementType: 'geometry',
          stylers: [{ color: '#dfd2ae' }]
        },
        {
          featureType: 'transit.line',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#8f7d77' }]
        },
        {
          featureType: 'transit.line',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#ebe3cd' }]
        },
        {
          featureType: 'transit.station',
          elementType: 'geometry',
          stylers: [{ color: '#dfd2ae' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [{ color: '#b9d3c2' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#92998d' }]
        }
      ]
    };
  }

}
