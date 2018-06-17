import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { ApiProvider } from '../api/api';

export class User {
  name: string;
  password: string;
  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
  }
}

@Injectable()
export class AuthServiceProvider {
  currentUser: User;

  constructor(public api: ApiProvider) {
  }

  public signup(credentials): Observable <any> {
    return this.api.post('signup', credentials, true);
  }
  public login(credentials): Observable <any> {
    return this.api.post('signin', credentials, true)
    //.map((res:any) => res.json())
    //.catch((error)=> Observable.throw(error.json().error || 'Server error'));

    // return Observable.create(observer => {
    //   return this.api.post('signin', credentials)
    //     .subscribe(
    //       (res: any) => {
    //         console.log('res', res.ok);
    //         let access = res.status == 'success';
    //         console.log('access', access);
    //         return Observable.create(o => {
    //           o.next(access);
    //           o.complete();
    //           console.log('complete', access);
    //         });

    //       },
    //       (err) => {
    //         console.log('error ', err._body)
    //         return Observable.throw("Please insert credentials");
    //       }
    //     )
    // })


    //return this.api.post('signin', credentials);
    // .subscribe(
    //   (res: any) => {
    //     if(res.status =='success')
    //     return Observable.create(observer => {
    //           //check in backend
    //           let access = (credentials.name === "user" || credentials.password === "password");
    //           this.currentUser = new User("user","password")
    //           observer.next(access);
    //           observer.complete();
    //     });
    //     else
    //       return Observable.throw("Something went wrong");
    //   },
    //   (err) => {
    //     console.log('error ',err)
    //     return Observable.throw("Please insert credentials");
    //   }
    // );
    // // console.log(credentials);
    // // if(credentials.name === null || credentials.password === null)
    // //   return Observable.throw("Please insert credentials");
    // // else
    // //   return Observable.create(observer => {
    // //     //check in backend
    // //     let access = (credentials.name === "user" || credentials.password === "password");
    // //     this.currentUser = new User("user","password")
    // //     observer.next(access);
    // //     observer.complete();
    // //   });
  }

  public register(credentials) {
    if (credentials.name === null || credentials.password === null)
      return Observable.throw("Please insert credentials");
    else
      return Observable.create(observer => {
        //store to db
        observer.next(true);
        observer.complete();
      });
  }

  public getUser() {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }

}
