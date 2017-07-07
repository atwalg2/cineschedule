import { Component} from '@angular/core';
import { NavComponent } from './nav.component';
import { WebService } from './web.service';
import "rxjs/add/operator/takeWhile";


@Component({
  selector: 'myshows',
  template: `
    <div>
      <!-- <div><button (click)="this.loadInFavs()" >UPDATE</button></div> -->
      
      <div><button (click)="this.updateDB()" style="margin-top:5px;width:200px;height:100px;background-color:#166c84">Update TV DB</button></div>
      <div *ngFor="let movie of movies">
      <md-card class="fresh">
        <img style="position:absolute; left:0; top:0; width: 100%; height: 100%;" src={{movie[0]}} class="md-card-image" alt="popular movies">
        <md-card-title style="position:absolute; left:0; top:95%; width: 100%; background-color:black; color: white">{{movie[1] + 1}} Days</md-card-title>		

      </md-card>
      </div>

    </div>
  `,
})
export class MyShowsComponent  {

  // Array of movie images  
  movies = [];
  private alive: boolean = true;

  
  constructor(private webService: WebService) {

    // webService.getData();
    // this.webService.getHome();
  }

  ngOnInit() {

    this.loadInFavs();
  }
  
  ngOnDestroy(){
    this.alive = false;

    this.movies = [
      
    ];
  }

  updateDB(){
    this.webService.updateDB().takeWhile(() => this.alive)
    .subscribe(response => {

      console.log(response);
    }, error =>{
      console.log("update error");
      // this.handleError("Unable to get messages");

    });
  }

  loadInFavs(){
   this.webService.getTrackedShows().takeWhile(() => this.alive)
    .subscribe(response => {

      console.log("HERE");
      console.log(response);
      var res = response;
      // console.log(res);
    //   var res = response.json();
      var i;

      // for( i = 0 ; i < res.rows.length ; i++ ){
      for( i = 0 ; i < res.length ; i++ ){
        var daysTemp = res[i].days;
        if(daysTemp == 0){
          daysTemp--;
        }

        this.movies.push(["http://image.tmdb.org/t/p/w185/" + res[i].poster_url, daysTemp]);
        
      }
    }, error =>{
      console.log("track show error");
      // this.handleError("Unable to get messages");

    });

  }

}


//       <md-card class="fresh">
//         <img style="position:absolute; left:0; top:0; width: 100%; height: 100%;" src={{movies[0]}} class="md-card-image" alt="popular movies">

//         <!--<button md-button id="add-tl"><img id="add_image" src="/assets/icons/add_library/add_library.png" class="md-card-image" alt="add"></button>
                
//         <button md-button id="add-tr"><img id="add_image" src="/assets/icons/add_library/add_library.png" class="md-card-image" alt="add"></button>

//         <button md-button id="add-bl"><img id="add_image" src="/assets/icons/add_library/add_library.png" class="md-card-image" alt="add"></button>

//         <button md-button id="add-br"><img id="add_image" src="/assets/icons/add_library/add_library.png" class="md-card-image" alt="add"></button>
// -->

//       </md-card>
       
//       <md-card class="fresh">

//         <img style="position:absolute; left:0; top:0; width: 100%; height: 100%;" src={{movies[1]}} class="md-card-image" alt="popular movies">
        
//         <img id="add" src="/assets/icons/add_queue/add_queue_large.png" class="md-card-image" alt="add movie icon">
//       </md-card>

//       <md-card class="fresh"><h2>HELLO</h2></md-card>
//       <md-card class="fresh"><h2>HELLO</h2></md-card>
//       <md-card class="fresh"><h2>HELLO</h2></md-card>

//       <!--<md-card class="fresh"></md-card>-->


  // ngOnInit() {

  //   this.loadInFavs();
  //   // this.webService.getTrackedShows().takeWhile(() => this.alive)
  //   // .subscribe(response => {

  //   //   console.log(response);
  //   //   var res = response;
  //   // //   var res = response.json();
  //   //   var i;

  //   //   // for( i = 0 ; i < res.rows.length ; i++ ){
  //   //   for( i = 0 ; i < res.rows.length ; i++ ){
  //   //     this.movies.push("http://image.tmdb.org/t/p/w185/" + res.rows[i].poster_url);
        
  //   //   }
  //   // }, error =>{
  //   //   console.log("track show error");
  //   //   // this.handleError("Unable to get messages");

  //   // });

  // }