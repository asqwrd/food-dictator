declare var PUBNUB:any;

import {
    Component,
    ViewChild,
    ElementRef
} from "@angular/core";
import {
    Location}
    from '@angular/common';


import {
    ROUTER_DIRECTIVES,
    Router,
    ActivatedRoute,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
    CanActivate
} from '@angular/router';




//shared components
import {EventService} from '../services/event-services';
import {ApiService} from '../services/api-service';
import {LunchGroup} from '../pages/lunch-group/lunch-group';


@Component({
    selector: "layout",
    templateUrl: "app/layout/layout.html",
    directives: [ROUTER_DIRECTIVES,LunchGroup],
    precompile: [LunchGroup]
    /*host: {
        '(document:click)': 'hideDropdowns($event)',
    }*/
})


export class Layout{
    pubnub:any;

    constructor(private api:ApiService, router: Router, private location: Location,eventService:EventService) {
        window.addEventListener('beforeunload', this.leaveChat);
    }

    leaveChat = () => {
        this.api.getPubnub().unsubscribe({ channel: 'test2' });
    }




    ngOnInit(){
    }

}
