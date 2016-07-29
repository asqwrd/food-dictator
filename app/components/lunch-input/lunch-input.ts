import {Component, Input, ViewChild, EventEmitter, ElementRef, NgZone} from "@angular/core";
import {HTTP_PROVIDERS} from "@angular/http";
import {NgStyle,NgFor} from '@angular/common';


import 'rxjs/Rx';
import {Router} from "@angular/router";

//shared components and service
import {ApiService} from "../../services/api-service";
import {EventService} from "../../services/event-services";
import {ComponentHandler} from "../../directives/component-handler";





@Component({
    selector: 'lunch-input',
    viewProviders: [HTTP_PROVIDERS],
    templateUrl: 'app/components/lunch-input/lunch-input.html',
    directives:[NgStyle,NgFor,ComponentHandler],
    outputs:['typing','sent']
})


export class LunchInput {
    @Input() userid:string;
    typing = new EventEmitter();
    sent = new EventEmitter();
    router:Router;
    api:ApiService;
    eventService:EventService;
    @ViewChild('md1textfield') md1textfield:ElementRef;


    constructor(private zone:NgZone,eventService:EventService,router:Router,apiService:ApiService) {
        this.router = router;
        this.api = apiService;
        this.eventService = eventService;
    }

    ngOnInit(){
    }
    ngAfterViewInit(){
    }

    onScroll(){

    }

    onSubmit(e,input:HTMLInputElement,form:HTMLFormElement){
        e.preventDefault();
        if(input.value.trim().length >0) {
            let message = {
                type:"user",
                content: {answer:input.value},
                who: this.userid,
                when: new Date().valueOf()
            };
            this.md1textfield.nativeElement.classList.remove('is-dirty');
            form.reset();

        }
    }

    onKeypress(e,button:HTMLButtonElement){
        if(e.which == 13) {
            this.zone.run(()=>{
                button.click();
            });
            e.preventDefault();

        }
    }

    onInput(e,input:HTMLInputElement,form:HTMLFormElement){

        this.typing.emit({id:this.userid});
    }

    onChange(input:HTMLInputElement){

    }


}
