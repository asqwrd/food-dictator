import {Component,Input,ViewChild} from "@angular/core";
import {HTTP_PROVIDERS} from "@angular/http";
import {NgStyle,NgFor} from '@angular/common';


import 'rxjs/Rx';
import {Router} from "@angular/router";


import {ComponentHandler} from "../../directives/component-handler";





//noinspection TypeScriptValidateTypes
@Component({
    selector: 'user-header',
    viewProviders: [HTTP_PROVIDERS],
    templateUrl: 'app/components/user-header/user-header.html',
    directives:[NgStyle,NgFor,ComponentHandler]
})


export class UserHeader {
    @Input() lng:string;
    @Input() userid:string;
    @Input() users:Array<Object>;
    @Input() dictator:string;


    constructor() {

    }

    ngOnInit(){
    }
    ngAfterViewInit(){
    }


}
