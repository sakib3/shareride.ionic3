import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptions, RequestMethod, RequestOptionsArgs } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiProvider {
  private url: string = "https://shareridebd.herokuapp.com";
  //url: string = "http://localhost:8000";
  private token: string = null;
  constructor(public http: Http,
    private storage: Storage) {
  }

  setToken(): Promise<any> {
    var self = this;
    if (self.tokenIsSet())
      return new Promise((resolve, reject) => {
        resolve(self.token);
      });

    return this.storage.get('data').then((data) => {
      if(data != null)
        self.token = data.token;
      return self.token
    });
  }

  tokenIsSet() {
    return this.token != null;
  }

  getHeaders() {
    let header = new Headers();
    header.append('Content-Type', 'application/x-www-form-urlencoded');
    header.append('Accept', 'application/json');
    header.append('Authorization', 'Bearer ' + this.token);
    return { headers: header };
  }

  private _buildAuthHeader(): string {
    return 'Bearer ' + this.token;
  }
  get(endPoint: string, params?: any, reqOpts?: any) {
    console.log('Get with token: ', this.token);
    var url = this.url + '/' + endPoint;
    // return this.http
    //   .get(url,this.getHeaders())
    //   .map(res => res.json());
    return this._request(RequestMethod.Get, url);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    console.log('Post with token: ', this.token);

    var url = this.url + '/' + endpoint;
    if (reqOpts)
      return this.http
        .post(url, body, reqOpts)
        .map(res => res.json());

    return this._request(RequestMethod.Post, url, body);
  }

  private _request(method: RequestMethod, url: string, body?: string, options?: RequestOptionsArgs) {
    let requestOptions = new RequestOptions(Object.assign({
      method: method,
      url: url,
      body: body
    }, options));

    if (!requestOptions.headers) {
      requestOptions.headers = new Headers();
    }

    requestOptions.headers.append('Content-Type', 'application/json');

    requestOptions.headers.append("Authorization", this._buildAuthHeader())
    return this.http.request(new Request(requestOptions)).map(res => res.json())
  }
}
