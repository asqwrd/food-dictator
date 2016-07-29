import {Component,Input,ViewChild} from "@angular/core";
import {HTTP_PROVIDERS} from "@angular/http";
import {NgStyle,NgFor} from '@angular/common';


import 'rxjs/Rx';
import {Router} from "@angular/router";


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



    constructor() {
    }

    ngOnInit(){
    }
    ngAfterViewInit(){
    }


}
