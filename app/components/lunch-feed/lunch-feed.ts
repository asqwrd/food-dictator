import {
    Component, Input, ViewChild, EventEmitter,ElementRef, NgZone, SimpleChanges, SimpleChange, OnChanges,
    KeyValueDiffers, IterableDiffers
} from "@angular/core";
import {HTTP_PROVIDERS} from "@angular/http";
import {NgStyle,NgFor} from '@angular/common';


import 'rxjs/Rx';
import {Router} from "@angular/router";

//shared components and service
import {ApiService} from "../../services/api-service";
import {EventService} from "../../services/event-services";
import {MomentPipe,Translate} from "../../pipes/pipes";
import {FeedCard} from "../feed-card/feed-card";
import {YelpCard} from "../yelp/yelp";





@Component({
    selector: 'lunch-feed',
    viewProviders: [HTTP_PROVIDERS],
    templateUrl: 'app/components/lunch-feed/lunch-feed.html',
    directives:[NgStyle,NgFor,FeedCard,YelpCard],
    pipes:[MomentPipe],
    outputs:['answered']
})


export class LunchFeed {
    @Input() userid:string;
    @Input() cards:Array<Object>;
    @Input() restaurants:Array<Object>;
    @Input() dictator:string;
    @Input() users:Array<string>;
    @Input() usurpers:Array<string>;
    answered = new EventEmitter();
    router:Router;
    api:ApiService;
    eventService:EventService;
    differ: any;

    @ViewChild('feedContent') feedContent:ElementRef;
    @ViewChild('restaurantsModal') restaurantsModal:ElementRef;


    constructor(private differs: KeyValueDiffers,private zone:NgZone,eventService:EventService,router:Router,apiService:ApiService) {
        this.router = router;
        this.api = apiService;
        this.eventService = eventService;
        this.differ = differs.find([{}]).create(null);
    }

    ngDoCheck() {
        let changes = this.differ.diff(this.cards);

        if(changes){
          setTimeout(()=>{
            this.scrollToBottom();
          },300);
        }


    }


    ngOnChanges(changes: {[ propName: string]: SimpleChange}) {

    }

    onScroll(){

    }

    isBottom(){
        let feedContent = this.feedContent.nativeElement;
        let scrollPos = feedContent.scrollTop;
        let scrollBottom = (feedContent.scrollHeight - feedContent.clientHeight);
        return (scrollBottom === 0) || (scrollPos === scrollBottom);
    }


    scrollToBottom(){
        let feedContent = this.feedContent.nativeElement;
        let scrollHeight = feedContent.scrollHeight;
        let height = feedContent.clientHeight;
        let maxScrollTop = scrollHeight;
        //feedContent.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        this.eventService.smoothScroll(feedContent,maxScrollTop,600);
    }

    answered_question(data){
      this.answered.emit({data:data,feedContent:this.feedContent.nativeElement,restaurantsModal:this.restaurantsModal.nativeElement});
    }

    selectRestaurant(restaurant){
      this.answered.emit({restaurant:restaurant,feedContent:this.feedContent.nativeElement,restaurantsModal:this.restaurantsModal.nativeElement});
    }




}
