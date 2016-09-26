# Fun Retro customization
Easy to use and beautiful restrospective board.

[![Build](https://snap-ci.com/funretro/distributed/branch/master/build_image)](https://snap-ci.com/funretro/distributed/branch/master)
<a href="https://codeclimate.com/github/glauberramos/fireideaz"><img src="https://codeclimate.com/github/glauberramos/fireideaz/badges/gpa.svg" /></a>&nbsp;[![devDependency Status](https://david-dm.org/funretro/distributed/dev-status.svg)](https://david-dm.org/funretro/distributed#info=devDependencies)

## User interface

![Fun retro screenshot](http://i.imgur.com/iY1zc2Y.png)

## How to setup local environment

1. Clone the repository
2. Install [Node.js](https://nodejs.org/en/)
3. Run ```npm install``` (inside the project folder)
4. Run ```gulp```
5. Fun Retro is using [Firebase](http://www.firebase.com). First create an account at firebase. Then create a test app
6. After creating the app you can save the new url (ex: https://funretrotest.firebaseio.com/) and replace the variable ```firebaseUrl``` inside ```js/firebaseService.js```
7. Now you can open the app on [http://localhost:4000/](http://localhost:4000/) and start creating your boards.
   You will notice that the app has this architecture on firebase:
![Fun retro architecture](https://i.imgur.com/etYgDia.png)

## Running the application

1. Install [Node.js](https://nodejs.org/en/)
2. Run ```npm install``` (inside the project folder)
3. Run ```gulp```
4. Point your browser to [http://localhost:4000/](http://localhost:4000/) or open dist/index.html

## Continuous Integration

Our tests run on SnapCI [SnapCI](https://snap-ci.com/funretro/distributed/branch/master)

## Running the tests

1. Run ```gulp test```
2. Refactor and watch tests re-run.
3. Fix any red tests
4. Note: you can open http://localhost:9876/debug.html to run tests with a browser
