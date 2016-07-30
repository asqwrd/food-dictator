import {Injectable,EventEmitter} from '@angular/core';
import {Http, Headers, Response, RequestOptions,Jsonp,URLSearchParams} from "@angular/http";
import {EventService} from "./event-services";


import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';


declare var PUBNUB:any;
declare var OAuth:any;
@Injectable()

export class ApiService {

    private headers = new Headers();
    private app: Object;
    private eventService;
    domain:string;
    userid:string;
    getty_key:string;
    shutterstock_key:string;
    yelp_key:string;
    getty_domain:string;
    shutterstock_domain:string;
    private pubnub:any;
    req_count:any;


    constructor(private http:Http,eventService:EventService,private jsonp:Jsonp) {
        this.headers.append('Content-Type', 'application/json');
        this.domain = '/webdamws/';
        this.eventService = eventService;
        this.getty_key = "n4g8tmvr29hsf4skpesurazm";
        this.shutterstock_key = 'Basic ' + window.btoa('e3a388de9784acba3043:cd6fcd0136a863eb48b4b38ad8172d93050e0aea');
        this.yelp_key = 'Basic ' + window.btoa('oauth_consumer_key:MyonSzZn31oETu2QwIwFFQ,oauth_token:Kfbla8RgUwBAVSKQhKYN6L0RyWomLIjK,oauth_signature_method:hmac-sha1,oauth_signature:Zy4-nXKE_D43cA_nz8EaA7rmpsU');
        this.shutterstock_domain = 'https://api.shutterstock.com/v2/images/search?view=full&query=';
        this.getty_domain = 'https://api.gettyimages.com/v3/search/images?fields=display_set&phrase=';
        this.req_count = 0;



    }

    getRestaurants(): Observable<Object[]>{
      let headers = new Headers();
      headers.append('Content-Type', 'application/javascript');
      var auth = {
         //
         // Update with your auth tokens.
         //
         consumerKey : "MyonSzZn31oETu2QwIwFFQ",
         consumerSecret : "6x_qt67gYKKqjWePkfEH2Rpc0IM",
         accessToken : "Kfbla8RgUwBAVSKQhKYN6L0RyWomLIjK",
         // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
         // You wouldn't actually want to expose your access token secret like this in a real application.
         accessTokenSecret : "Zy4-nXKE_D43cA_nz8EaA7rmpsU",
         serviceProvider : {
             signatureMethod : "HMAC-SHA1"
         }
     };

     var terms = 'food';
     var near = 'San+Francisco';

     var accessor = {
         consumerSecret : auth.consumerSecret,
         tokenSecret : auth.accessTokenSecret
     };

     var parameters = [];
     parameters.push(['callback', '__ng_jsonp__.__req'+this.req_count+'.finished']);
     parameters.push(['term', terms]);
     parameters.push(['location', near]);
     parameters.push(['oauth_consumer_key', auth.consumerKey]);
     parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
     parameters.push(['oauth_token', auth.accessToken]);
     parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

     var message = {
         'action' : 'https://api.yelp.com/v2/search',
         'method' : 'GET',
         'parameters' : parameters
     };

     OAuth.setTimestampAndNonce(message);
     OAuth.SignatureMethod.sign(message, accessor);

     var parameterMap = OAuth.getParameterMap(message.parameters);
     let qs  = Object.keys(parameterMap).map(function(k) {
          return encodeURIComponent(k) + '=' + encodeURIComponent(parameterMap[k])
      }).join('&')


      return this.jsonp.get(message.action +"?"+ qs,{headers:headers}).map((res:Response)=>{
        let data = res.json();
        let businesses = data['businesses'];
        businesses.forEach((business)=>{
          business.image_url = business.image_url.replace(/(.*)\/.*(\.jpg$)/i, '$1/o$2');
          business.type="restaurant";


        });

        this.req_count++;
        return businesses;
      });

    }

    getQuestion(): Observable<Object>{
      return Observable.forkJoin(
        this.http.get('http://jservice.io/api/random').map((res:Response)=>{
          let data = res.json();
          return data[0];
        }).flatMap((question)=>{
          let headers = new Headers();
          headers.append('Api-Key', this.getty_key);
          //headers.append('Authorization', this.shutterstock_key);
          return  this.http.get(this.getty_domain + encodeURIComponent(question['category'].title),{headers:headers}).map((res:Response)=>{
              let data = res.json();
              if(data.result_count > 0){
                question.image = data.images[0]['display_sizes'][0].uri;
              }else{
                question.image = "images/dictator.jpg";
              }

              return question;

            });
        })
      ).flatMap((data)=> {
          return this.createObservable(data[0]);
      });
    }


    private createObservable(data: any) : Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            observer.next(data);
            observer.complete();
        });
    }

    private handleError(error: any) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    //uuid function

    setUserId():string {

        this.userid = this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();

        return this.userid;
    }

    getUserId():string{
        return this.userid;
    }

    private s4():string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

      private levDist(s, t) {
      var d = []; //2d matrix

      // Step 1
      var n = s.length;
      var m = t.length;

      if (n == 0) return m;
      if (m == 0) return n;

      //Create an array of arrays in javascript (a descending loop is quicker)
      for (var i = n; i >= 0; i--) d[i] = [];

      // Step 2
      for (var i = n; i >= 0; i--) d[i][0] = i;
      for (var j = m; j >= 0; j--) d[0][j] = j;

      // Step 3
      for (let i = 1; i <= n; i++) {
          var s_i = s.charAt(i - 1);

          // Step 4
          for (let j = 1; j <= m; j++) {

              //Check the jagged ld total so far
              if (i == j && d[i][j] > 4) return n;

              var t_j = t.charAt(j - 1);
              var cost = (s_i == t_j) ? 0 : 1; // Step 5

              //Calculate the minimum
              var mi = d[i - 1][j] + 1;
              var b = d[i][j - 1] + 1;
              var c = d[i - 1][j - 1] + cost;

              if (b < mi) mi = b;
              if (c < mi) mi = c;

              d[i][j] = mi; // Step 6


          }
      }

      // Step 7
      return d[n][m];
  }

  check_answer(s1, s2) {
    let longer = s1.toLowerCase();
    let shorter = s2.toLowerCase();
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - this.levDist(longer, shorter)) / parseFloat(longerLength);
  }

  private randomString(length, chars) {
      var result = '';
      for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
      return result;
  }
}
