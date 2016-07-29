import {Component, Input, ViewChild, NgZone,ElementRef} from "@angular/core";
import {HTTP_PROVIDERS} from "@angular/http";
import {NgStyle,NgFor} from '@angular/common';


import 'rxjs/Rx';
import {Router} from "@angular/router";

//shared components and service
import {ApiService} from "../../services/api-service";
import {EventService} from "../../services/event-services";


import {UserHeader} from "../../components/user-header/user-header";
import {LunchFeed} from "../../components/lunch-feed/lunch-feed";
import {ComponentHandler} from "../../directives/component-handler";

import {Subject} from "rxjs/Rx";
declare var MaterialSnackbar:any;



@Component({
    selector: 'lunch-group',
    viewProviders: [HTTP_PROVIDERS],
    templateUrl: 'app/pages/lunch-group/lunch-group.html',
    directives:[NgStyle,NgFor,UserHeader,LunchFeed,ComponentHandler]
})


export class LunchGroup {
    router:Router;
    eventService:EventService;
    last_timestamp:any;
    cards:Array<Object>;
    userid:string;
    users:Array<string>;
    usurpers:Array<string>;
    dictator:string;
    restaurants:Array<Object>;
    @ViewChild('notification') notification:ElementRef;



    constructor(private zone:NgZone,eventService:EventService,router:Router,private api:ApiService) {
        this.router = router;
        this.cards = [];
        let index = Math.round(Math.random()*3);
        let user1 = this.api.setUserId();
        let user2 = this.api.setUserId();
        let user3 = this.api.setUserId();
        this.userid = this.api.setUserId();
        this.users = [user1,user2,user3,this.userid];
        this.eventService = eventService;
        this.dictator = this.users[index];


        //Snipet for demo purposes to simulate selecting a new dictator if you are the current dictator at refresh
        if(this.userid == this.dictator){
          this.start();
        }

        this.api.getRestaurants().subscribe((data)=>{
          this.restaurants = data;

        })


    }

    ngOnInit(){
    }
    ngAfterViewInit(){
    }


    start(){
      if(this.usurpers == undefined || this.usurpers.length == 0){
        this.usurpers = this.users;
      }
      this.api.getQuestion().subscribe((data)=>{
        let card = {
          type:'question',
          question:data['question'],
          answer: data['answer'],
          image:data['image'],
          user_answers:[],
          when: new Date().valueOf()
        }

        //simulating question being answered by other users.  Dictator can see all the answers for an advantage to use one of the users answers
        if(this.userid == this.dictator){
          this.usurpers.forEach((user,index)=>{
            if(user !== this.userid){
              let user_answer = {
                id:user,
                answer:"blah",
              }
              if(index == 0){
                user_answer.answer = card['answer'];
              }


              card['user_answers'].push(user_answer);
            }

          })
        }else{
          this.usurpers.forEach((user,index)=>{
            if(user !== this.userid){
              let user_answer = {
                id:user,
                answer:"blah",
              }
              card['user_answers'].push(user_answer);
            }

          })
        }
        this.sent(card);

      })
    }

    sent(data){
      //answer to move through the demo
      if(data.answer){
        console.log("Answer to question: "+ data.answer);
      }
      //this function is where I would do the socket call to broadcast new messages to all users currently online. So that they would recieve realtime updates.  Since I have not implemented sockets for demo puposes I am updating the cards array
      this.cards.push(data);
    }





    answered_question(data){
      //this is where I would save the answered questions to a database and using sockets check to see if all the questions are answered before revealing who got the answer correct.
      /*
      ex do api call to get question by id:  api.com/question/id
      returns the card with json object similar to this
      response = {question:"What is this?", answer:"that", user_answers:[]}
      since I would be using sockets for realtime updates I would check each time a user answers the question to see if they are all answered based on whether 'user_answer' has the same number of items as users in the group or the minumum number required.
      Users would be able to set a minimum number or require all people in the group to respond to the question.

      */
      let feedContent = data.feedContent;
      let restaurantsModal = data.restaurantsModal;

      if(data.restaurant){
        this.sent(data.restaurant);
        restaurantsModal.classList.remove('open');
        feedContent.classList.remove('open');
      }else{
        let correct_users = [];
        data.data['question'].user_answers.forEach((user)=>{
          let correct_percent = this.api.check_answer(data.data['question'].answer,user['answer']);
          if(correct_percent >= .60){
            correct_users.push(user.id);
          }
        });

        if(this.dictator == this.userid && correct_users.indexOf(this.userid) == -1){
          this.dictator = "";
        }

        this.usurpers = correct_users;
        if(this.usurpers.length == 1){
          this.dictator = this.usurpers[0];
          this.usurpers = undefined;
          if(this.dictator == this.userid){
            let data = {message: 'You are the new dictator'};
            this.notification.nativeElement.MaterialSnackbar.showSnackbar(data);
            this.api.getRestaurants().subscribe((data)=>{
              this.restaurants = data;
              restaurantsModal.classList.add('open');
              feedContent.classList.add('open');


            })
          }else{
            let data = {message: "User " + this.dictator + ' is the new dictator.'};
            this.notification.nativeElement.MaterialSnackbar.showSnackbar(data);
            this.api.getRestaurants().subscribe((data)=>{
              //If you do not become the dictator after a usurp.  Simulates the new dictator picking where to eat.
              this.sent(data[0]);
            })
          }
        }else{
          this.start();
        }
      }
    }

    open_nav(){
      let nav = document.querySelector('.lunch-group-list');
      nav.classList.add('open');
    }

}
