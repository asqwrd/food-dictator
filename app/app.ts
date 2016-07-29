import {
    Component,
} from "@angular/core";
import {enableProdMode, provide} from "@angular/core";
import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS,JSONP_PROVIDERS} from '@angular/http';
import {
    Location,
    LocationStrategy,
    HashLocationStrategy}
    from '@angular/common';


import {
    ROUTER_DIRECTIVES,
    Router,
} from '@angular/router';

import { APP_ROUTER_PROVIDERS } from './routes/main.routes';

//shared components
import {EventService} from './services/event-services';
import {ApiService} from "./services/api-service";
import {Layout} from "./layout/layout";
import { FIREBASE_PROVIDERS, defaultFirebase } from 'angularfire2';


declare var PUBNUB:any;


@Component({
  selector: "app",
  template: "<router-outlet></router-outlet>",
  directives: [ROUTER_DIRECTIVES],
  precompile: [Layout]
})

export class App {
  currentUser:Object;

  constructor(private api:ApiService,private router: Router, private location: Location) {
      this.api.setUserId();
      this.api.initPubnub();

  }
  ngOnInit(){
  }

}


bootstrap(App, [
  // These are dependencies of our App
    HTTP_PROVIDERS,
    JSONP_PROVIDERS,
    APP_ROUTER_PROVIDERS,
    EventService,
    ApiService,
    FIREBASE_PROVIDERS,
    // Initialize Firebase app
    defaultFirebase({
      apiKey: "AIzaSyAp1EQY6zd-qzxFwsnNXvUdGmWNvAFB9kI",
      authDomain: "food-dictator-66569.firebaseapp.com",
      databaseURL: "https://food-dictator-66569.firebaseio.com",
      storageBucket: ''
    }),
    provide(LocationStrategy, {useClass: HashLocationStrategy}) // use #/ routes, remove this for HTML5 mode
]).catch(err => console.error(err));
