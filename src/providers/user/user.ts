import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ApiProvider } from '../api/api';

@Injectable()
export class User {
  _user: any;

  constructor(public api: ApiProvider) {
  }

  login(accountInfo: any){
    let seq = this.api.post('login', accountInfo);
    seq.subscribe(
      (res: any) => {
        if(res.status =='success')
          console.log(res);
      },
      (err) => console.log(err)
    );
  }
  x(accountInfo: any){
    return this.api.get('rides', accountInfo);
  }
}
