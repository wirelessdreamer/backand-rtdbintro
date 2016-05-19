# backand-rtdbintro

Create a mobile application using the real time database with [ionic](http://www.ionicframework.com) and [backand](http://www.backand.com).

1 - To run starter, download zip and run ionic start:

    ionic start myApp https://github.com/wirelessdreamer/backand-rtdbintro
    cd myApp

2 - Install dependencies from npm
    npm install

3 - Install the backand SDK (required for real time database updates)
    bower install angularbknd-sdk#1.8.2

4 - Run with ionic serve function

    ionic serve

5 - Login as guest or with  user and password:

  <b>user</b>: ionic@backand.com

  <b>pwd</b>: backand

6 - Enjoy your mobile application, with backand at server side and full CRUD commands to server.

7 - Want to customize data model or change authorization?
create a free personal application at [backand.com](https://www.backand.com/apps/#/sign_up)

8 - Use following model (or just keep the default Model):

    [
      {
        "name": "items",
        "fields": {
          "name": {
            "type": "string"
          },
          "description": {
            "type": "text"
          },
          "user": {
            "object": "users"
          }
        }
      },
      {
        "name": "users",
        "fields": {
          "email": {
            "type": "string"
          },
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "items": {
            "collection": "items",
            "via": "user" 
          }
        }
      }
    ]

9 - Create the server side events that our application will listen for
  Select your app on Backand.com, navigate to Objects->items
    - Click on Actions
      - Under Create click on the + next to After
        name the action: item_created
        add this javascript code:
        ```javascript
        'use strict';
        function backandCallback(userInput, dbRow, parameters, userProfile) {
          socket.emitAll("item_created",dbRow);
          return {};
        } 
        ```
      click save
      - Under Update click on the + next to After
        name the action: item_created
        add this javascript code:
        ```javascript
        'use strict';
        function backandCallback(userInput, dbRow, parameters, userProfile) {
          socket.emitAll("item_updated",dbRow);
          return {};
        } 
        ```
        click save
10 - Configure app.js Config section:
    Select your app on Backand.com, navigate to Docs & API->Ionic Mobile Starter
    Under: Configure Backand's REST API copy the .config entries listed, and replace the corrosponding entries in the starter app's app.js file

    example section:
    ```javascript
        .config(function (BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
          BackandProvider.setAppName('rtdbintro');
          BackandProvider.setSignUpToken('2f50d55a-e958-4e3e-8d60-67949366d8f4');
          BackandProvider.setAnonymousToken('66efb4e9-f9cc-45ce-b8fd-916b0bef373d');
      })

    ```

11 - change application name in  /js/app.js file at line 26
to your new application name.
