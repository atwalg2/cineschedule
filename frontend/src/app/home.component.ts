import {Component, ComponentFactoryResolver, ViewContainerRef} from '@angular/core'
import { NavComponent } from './nav.component';
import { WebService } from './web.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SearchResultComponent } from './searchresult.component';


@Component({
  selector: 'home',
  template: `
    <md-card id="search-tv">
    <md-card-title style="font-size:28px; color:white; float: left; padding-top:3px;">Search</md-card-title>
      <md-input-container style="left:20px; width:55%; border-radius: 2px; background-color:white; float: left; top:0px; opacity: 0.6; height:35px;">
        <input mdInput (keypress)="eventHandler($event.keyCode)" placeholder=" Show name" [(ngModel)]="model.searchTerm">
      </md-input-container>

      <button md-raised-button (click)="makeSearch(model)" (keypress)="eventHandler($event)" style="left:30px; float: left;" color="primary">Login</button>
    </md-card>


    <div> <!-- List OF CardComponents       <sresult data={{this.searchResults[0]}}></sresult>
 -->
    
    </div>
  `,
})

export class HomeComponent  {

  model = {
    searchTerm: ''  
  };

  private alive: boolean = true;

  searchResults;


  constructor(private webService: WebService, private componentFactoryResolver: ComponentFactoryResolver,
                private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    this.webService.getUser().takeWhile(() => this.alive).subscribe( res => {
      this.model.searchTerm = res.searchTerm;
    })
  }

  makeSearch(userData) {
    var results = this.webService.makeSearch(userData).takeWhile(() => this.alive).subscribe( res => {
      // res.json();

      res = JSON.parse(res);
      // console.log(res.results);
      this.searchResults = res.results;
      
      this.webService.storeSearchResults(res.results);

      const factory = this.componentFactoryResolver.resolveComponentFactory(SearchResultComponent);
      if(this.viewContainerRef != null){
        this.viewContainerRef.clear();
      }
      const ref = this.viewContainerRef.createComponent(factory);
      ref.changeDetectorRef.detectChanges();
    
    })
  }

  public ngOnDestroy() {
    this.alive = false;
    this.searchResults = null;
  }


  eventHandler(event) {
    if(event == 13){
      this.makeSearch(this.model)
    }
  } 

}






      // this.url = "home.results.component.html"
      // var i;
      // for(i=0; i<res.results.length; i++){


      // <md-card class="fresh">
      //   <img style="position:absolute; left:0; top:0; width: 100%; height: 100%;" src={{movies[0]}} class="md-card-image" alt="popular movies">

      //   <button md-button id="add-tl"><img id="add_image" src="/assets/icons/add_library/add_library.png" class="md-card-image" alt="add"></button>
                
      //   <button md-button id="add-tr"><img id="add_image" src="/assets/icons/add_library/add_library.png" class="md-card-image" alt="add"></button>

      //   <button md-button id="add-bl"><img id="add_image" src="/assets/icons/add_library/add_library.png" class="md-card-image" alt="add"></button>

      //   <button md-button id="add-br"><img id="add_image" src="/assets/icons/add_library/add_library.png" class="md-card-image" alt="add"></button>


      // </md-card>
      // }
    // console.log((res.json()));




      // <md-card id="search-tv">
      // <md-card-title>Search</md-card-title>
      // <md-input-container>
      //   <input mdInput placeholder="Search for a show" [mdAutocomplete]="auto" [formControl]="stateCtrl">
      // </md-input-container>
      // </md-card>