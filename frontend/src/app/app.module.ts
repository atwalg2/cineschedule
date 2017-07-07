import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { AppComponent } from './app.component';
import { WebService } from './web.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavComponent } from './nav.component';
import { SearchResultComponent } from './searchresult.component';
import { MovieCardComponent } from './moviecard.component';
import { HomeComponent } from './home.component';
import { MyShowsComponent } from './myshows.component';
import { RegisterComponent } from './register.component';
import { LoginComponent } from './login.component';
import { UserComponent } from './user.component';
import { AuthService } from './auth.service';


var routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'myshows',
    component: MyShowsComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'user',
    component: UserComponent
  }];

@NgModule({
  imports: [BrowserModule, HttpModule, BrowserAnimationsModule , MaterialModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot(routes)],
  declarations: [AppComponent, RegisterComponent, MovieCardComponent, SearchResultComponent, NavComponent, HomeComponent, MyShowsComponent, LoginComponent, UserComponent],
  entryComponents: [SearchResultComponent],
  bootstrap: [AppComponent],
  providers: [WebService, AuthService]
})
export class AppModule { }
