import {Component, Input,  ComponentFactoryResolver, ViewContainerRef} from '@angular/core'
import { NavComponent } from './nav.component';
import { WebService } from './web.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SearchResultComponent } from './searchresult.component';


@Component({
  selector: 'moviecard',
  template: `

      <md-card class="fresh">
      
        <img style="position:absolute; left:0; top:0; width: 100%; height: 100%;" src="http://image.tmdb.org/t/p/w185//{{url}}" class="md-card-image" alt="movie result">


        <button md-button id="add-br" (click)="addToFavs()"><img id="add_image" src="/assets/icons/add_library/add_library.png" class="md-card-image" alt="add"></button>

      </md-card>

  `,
})

export class MovieCardComponent  {
    @Input() url: string;
    @Input() tv_id: number;
    @Input() show_name: string;
    @Input() first_aired: string;
    @Input() description: string;
    @Input() days: number;


    tv_data = {
      tv_id: 0,
      poster_url: "",
      show_name: "",
      first_aired: "",
      description: "",
      days: 0,
    }

    constructor(private webService: WebService){
      // this.webService.saveShow;
    }
    
    ngOnInit() {
      // console.log(this.url);

    }

    addToFavs() {
  
      this.tv_data.tv_id = this.tv_id;
      this.tv_data.poster_url = this.url;
      this.tv_data.show_name = this.show_name;
      this.tv_data.first_aired = this.first_aired;
      this.tv_data.description = this.description;
      this.tv_data.days = this.days;

      

      // Save show to the database
      var retVal = this.webService.saveShow(this.tv_data);
      console.log(retVal);
    }

    ngOnDestroy() {
      // console.log(this.url);

    }


}

