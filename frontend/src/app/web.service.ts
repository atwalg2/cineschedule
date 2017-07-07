import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Rx'
import { MdSnackBar } from '@angular/material';
import { AuthService } from './auth.service';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/takeWhile";

@Injectable()
export class WebService {
  BASE_URL = 'http://localhost:8080/api';

  private messageStore = [];
  private searchData;
  private alive: boolean = true;

  constructor(private http: Http, private sb: MdSnackBar, private auth: AuthService) {
  }

  // getData(){
  //   this.http.get(this.BASE_URL + '/data').takeWhile(() => this.alive)
  //     .subscribe(response => {
  //     console.log(response.json());

  //   }, error =>{
  //     this.handleError("Unable to get messages");

  //   });
  // }

  
  getSearchData(){
    // console.log(this.searchData);
    return this.searchData;
  }
  
  storeSearchResults(searchResults){
    this.searchData = searchResults;
  }

  // -----------------------


  updateDB(){
    return this.http.get(this.BASE_URL + '/update', this.auth.tokenHeader).map(res => res.json());
  }

  getUser() {
    return this.http.get(this.BASE_URL + '/users/me', this.auth.tokenHeader).map(res => res.json());
  }

  saveUser(userData) {
    return this.http.post(this.BASE_URL + '/users/me', userData, this.auth.tokenHeader).map(res => res.json());
  }


  // save tv show from the search (adding to your favorites list)
  saveShow(tvData) {
    console.log(tvData);
    // tvData = JSON.stringify(tvData);
    return this.http.post(this.BASE_URL + '/search/add', tvData, this.auth.tokenHeader).map(res => res.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
    .takeWhile(() => this.alive)
    .subscribe();
        // return this.http.post(this.BASE_URL + '/add', tvData, this.auth.tokenHeader).map(res => res.json());

  }

  // getTrackedShows() {
  //   return this.http.get(this.BASE_URL + '/mytv', this.auth.tokenHeader).map(res => res.json())
  //   .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
  //   .subscribe();
  // }

  getTrackedShows() {
    return this.http.get(this.BASE_URL + '/myshows', this.auth.tokenHeader).map(res => res.json());
  //  .subscribe(response => {
      // var showsArray = [];
      // var res = response.json();

      // return response;
      // console.log(res.rows[0].poster_url);

      // console.log(res.rows.length);
      // console.log(res.rows[0].poster_url);

      // var i;
      // for( i = 0 ; i < res.rows.length ; i++ ){
      //   showsArray.push(res.rows[i].poster_url);
      // }

    // });
  }

  makeSearch(userData) {
    return this.http.get(this.BASE_URL + '/search/'+ userData.searchTerm, this.auth.tokenHeader).map(res => res.json());
  }

  private handleError(error) {
    // console.error(error);
    this.sb.open(error, 'close', { duration: 2000 });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}








      // var obj = response.json();
      // obj = JSON.parse(obj);
      // this.searchData = obj.results;
      // return obj;
    // });

  //  makeSearch(userData) {
  //   return this.http.get(this.BASE_URL + '/search/'+ userData.searchTerm, this.auth.tokenHeader).subscribe(response => {

  //     var obj = response.json();
  //     obj = JSON.parse(obj);
  //     this.searchData = obj.results;
  //     return obj;
  //   });
    
    // map(res => res.json());
    
    
    // subscribe(res => {
      // this.authenticate(res);
      // console.log(res);
      // return res;
    // });