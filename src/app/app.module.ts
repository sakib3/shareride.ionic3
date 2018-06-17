
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { MapComponent } from '../pages/../components/map/map';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { PickUpPage } from '../pages/pick-up/pick-up';
import { SharePostPage } from '../pages/share-post/share-post';
import { ViewShareRidesPage } from './../pages/view-share-rides/view-share-rides';

import { ApiProvider } from '../providers/api/api';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { LoadingProvider } from '../providers/loading/loading';
import { IonicStorageModule } from '@ionic/storage';
import { User } from '../providers/user/user';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignUpPage,
    PickUpPage,
    SharePostPage,
    ViewShareRidesPage,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignUpPage,
    PickUpPage,
    SharePostPage,
    ViewShareRidesPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Diagnostic,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    AuthServiceProvider,
    LoadingProvider,
    User
  ]
})
export class AppModule {}
