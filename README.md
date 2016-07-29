Puzzle #2: The Food Dictator<br>
This is meant to demo food dictator.  There are no database to save messages.  I wanted to demonstrate the flow of becoming a dictator.
<br>
<br>
How it Works:<br>
In each group there is a dictator.  If you are the current dictator then other users can try to usurp you.  When the usurp button is pressed a card appears with a trivia question that all the users can answer. If only one user gets the question correct they become the dictator and are able to select a restuarant based on their locations.  If more than one user gets the answer correct or if all of them get them wrong then another card appears with a new question.  This happens until one user is left as the winner.

Rules:<br>
If you are a dictator you have a slight advantage at being able to see the answers of all the users.  Other users can only see that their peers answered the question.

<br>
<br>

Requirements:<br>
Node and npm
<br>
<br>

API used:<br>
Yelp - For restuarants<br>
Getty - for Trivia Images<br>
jService.io - for Trivia questions<br>
<br>
<br>


Instructions:<br>
1. run npm install at root<br>
2. After build is complete a local server will run<br>
3. Navigate to localhost:3000/#/group<br>
