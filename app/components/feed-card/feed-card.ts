import {Component,Input,ViewChild,EventEmitter,ElementRef} from "@angular/core";
import {HTTP_PROVIDERS} from "@angular/http";
import {NgStyle,NgFor} from '@angular/common';


import 'rxjs/Rx';

//shared components and service
import {ApiService} from "../../services/api-service";
import {EventService} from "../../services/event-services";
import {ComponentHandler} from "../../directives/component-handler";
import {YelpCard} from "../yelp/yelp";






//noinspection TypeScriptValidateTypes
@Component({
    selector: 'feed-card',
    viewProviders: [HTTP_PROVIDERS],
    templateUrl: 'app/components/feed-card/feed-card.html',
    directives:[NgStyle,NgFor,ComponentHandler,YelpCard],
    outputs:['answered']
})


export class FeedCard {
    @Input() userid:string;
    @Input() dictator:string;
    @Input() card:Object;
    @Input() users:Array<string>;
    @Input() usurpers:Array<string>;
    answered = new EventEmitter();
    eventService:EventService;
    submitted:Boolean;
    @ViewChild('input') input:ElementRef;
    @ViewChild('form') form:ElementRef;

    constructor(eventService:EventService,private api:ApiService) {
      this.submitted = false;
    }

    ngOnInit(){

    }
    ngAfterViewInit(){
    }

    submit(event){
      event.preventDefault();
      let answer = {
        id:this.userid,
        answer: this.input.nativeElement.value,
        dictator:false
      }
      if(this.userid == this.dictator){
        answer.dictator = true;
      }
      this.card['user_answers'].push(answer);

      this.submitted = true;

      //if backend was attached I would emit this event up to the parent in order to save to the database
      this.answered.emit({userid:this.userid,answer:this.input.nativeElement.value,question:this.card});

      //clear the input field after answering the question
      this.form.nativeElement.reset();


    }


}
