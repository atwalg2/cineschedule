import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import "rxjs/add/operator/takeWhile";

@Injectable()
export class AuthService {

  BASE_URL = 'http://localhost:8080/auth';
  NAME_KEY = 'name';
  TOKEN_KEY = 'token';
  // TOKEN_KEY = 'token'

  private alive: boolean = true;



  constructor(private http: Http, private router: Router) { }

  get name() {
    return localStorage.getItem(this.NAME_KEY);
  }

  get isAuthenticated() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  get tokenHeader() {
    var header = new Headers({'Authorization': 'Bearer ' + localStorage.getItem(this.TOKEN_KEY)});
    return new RequestOptions({ headers: header});
  }

  login(loginData) {
    this.http.post(this.BASE_URL + '/login', loginData).takeWhile(() => this.alive).subscribe(res => {
      console.log(res);
      this.authenticate(res);
    })
  }

  register(user) {
    delete user.confirmPassword;
    this.http.post(this.BASE_URL + '/register', user).takeWhile(() => this.alive).subscribe(res => {
      // this.authenticate(res);
    });
  }

  logout() {
    localStorage.removeItem(this.NAME_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  authenticate(res) {
    var authResponse = res.json();
    // console.log(authResponse);

    if (!authResponse.token) {
      return;
    }

    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.NAME_KEY, authResponse.firstName);

    console.log(authResponse.firstName);
    console.log(localStorage.getItem("uid"));

    this.router.navigate(['/']);

  }

  ngOnDestroy() {
    this.alive = false;
  }

}
