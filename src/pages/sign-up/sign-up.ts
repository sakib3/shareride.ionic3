import { Component} from '@angular/core';
import { IonicPage,App, AlertController} from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../../pages/home/home';
import { Storage } from '@ionic/storage';
import { LoadingProvider } from '../../providers/loading/loading';
import { Events } from 'ionic-angular';
//@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  public rootPage: any ;
  registerCredentials = { countrycode:null, phone: null, name:'', email: '', password: '', gender:null};
  alert;
  public gender;
  constructor(
    public alertCtrl: AlertController,
    public loadingProvider: LoadingProvider,
    public appCtrl: App,
    public auth: AuthServiceProvider,
    private storage: Storage,
    private events: Events) {
  }

  public selectGender($event, item){
    this.gender = item;
  }
  public signup(){
    this.loadingProvider.showLoading();
    this.auth.signup(this.registerCredentials)
      .subscribe(data => {
        if(data.token){
          this.events.publish('user:login', data.user, Date.now());
          this.storage.set('data', data)
          .then(
            () =>this.navigatePage(HomePage),
            (e)=> console.log(e)
          );
        }
        else{
          this.loadingProvider.stopLoading();
          this.showError('Access Denied');
        }
      },(err) => {
        this.loadingProvider.stopLoading();
        this.showError('Error occured');
        console.log(err);
      });
  }

  navigatePage(Page){
    var root  =this.appCtrl.getRootNav();
    root.popToRoot();
    root.setRoot(Page);
  }

  showError(text){
    this.alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    this.alert.present();
  }

}
