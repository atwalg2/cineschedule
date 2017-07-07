import { Component } from '@angular/core';
import { WebService } from './web.service';
import "rxjs/add/operator/takeWhile";

@Component({
  selector: 'user',
  template: `
    <md-card class="card">
      <md-input-container>
        <input mdInput [(ngModel)]="model.firstName" placeholder="First Name">
      </md-input-container>
      <md-input-container>
        <input mdInput [(ngModel)]="model.lastName" placeholder="Last Name">
      </md-input-container>
      <button md-raised-button color="primary" (click)="saveUser(model)">Save Changes</button>
    </md-card>
  `
})
export class UserComponent {

  model = {
    firstName: '',
    lastName: ''
  }

  private alive: boolean = true;

  constructor(private webService: WebService) {}

  ngOnInit() {
    this.webService.getUser().takeWhile(() => this.alive).subscribe( res => {
      this.model.firstName = res.firstName;
      this.model.lastName = res.lastName;
    })
  }

  saveUser(userData) {
    this.webService.saveUser(userData).takeWhile(() => this.alive).subscribe();
  }
  
  ngOnDestroy() {
    this.alive = false;
  }
}
