import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private storage: Storage) {
  }

  ngOnInit() {
    this.storage.get('data').then((val) => {
      console.log('Your token is', val.token);
    })
    .catch((e) =>{
      console.log(e);
      this.navCtrl.setRoot(LoginPage);
    });
  }

  logOut() {
    this.storage.remove('data').then(()=>{
      console.log('Storage is clear');
      this.navCtrl.setRoot(LoginPage);
    });

  }
}
