import { Component, Input } from '@angular/core';
import { AuthService } from './auth.service';
import { WebService } from './web.service';
import { MovieCardComponent } from './moviecard.component';

@Component({
    selector: 'sresult',
    template: `
    <div id="mcontainer" *ngFor="let elem of data">
      <moviecard tv_id={{elem.id}} show_name={{elem.name}} first_aired={{elem.first_air_date}} 
      description={{elem.overview}} url={{elem.poster_path}}></moviecard>
    </div> 
    `
})

export class SearchResultComponent {

    data;

    // @Input() data: JSON;
    private name:string = 'You';

    constructor(private webService: WebService) {

        this.data = this.webService.getSearchData();
    }

}

//  ---------------------------------------------------------------------------------------------------------------------------------------









// @Component({
//   selector: 'sresult',
//   template: `
//       <md-card class="fresh">
//         <img style="position:absolute; left:0; top:0; width: 100%; height: 100%;" src={{movies[0]}} class="md-card-image" alt="popular movies">

//         <button md-button id="add-tl"><img id="add_image" src="/assets/icons/add_library/add_library.png" class="md-card-image" alt="add"></button>
                
//         <button md-button id="add-tr"><img id="add_image" src="/assets/icons/add_library/add_library.png" class="md-card-image" alt="add"></button>

//         <button md-button id="add-bl"><img id="add_image" src="/assets/icons/add_library/add_library.png" class="md-card-image" alt="add"></button>

//         <button md-button id="add-br"><img id="add_image" src="/assets/icons/add_library/add_library.png" class="md-card-image" alt="add"></button>


//       </md-card>
        
        
//   `
// })
// export class SearchResultComponent {
      
//     @Input() data: JSON;


//   constructor(private auth: AuthService) {}
// }
