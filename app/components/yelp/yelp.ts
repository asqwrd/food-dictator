import {Component,Input,ViewChild} from "@angular/core";
import {HTTP_PROVIDERS} from "@angular/http";
import {NgStyle,NgFor} from '@angular/common';


import 'rxjs/Rx';
import {Router} from "@angular/router";

//shared components and service
import {ApiService} from "../../services/api-service";
import {EventService} from "../../services/event-services";
import {ComponentHandler} from "../../directives/component-handler";





//noinspection TypeScriptValidateTypes
@Component({
    selector: 'yelp-card',
    viewProviders: [HTTP_PROVIDERS],
    templateUrl: 'app/components/yelp/yelp.html',
    directives:[NgStyle,NgFor,ComponentHandler]
})


export class YelpCard {
    @Input() restaurant:Object;



    constructor(eventService:EventService,router:Router,apiService:ApiService) {
    }

    ngOnInit(){
    }
    ngAfterViewInit(){
    }


}
