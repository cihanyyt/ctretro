'use strict';

angular
  .module('fireideaz')
  .service('Auth', function () {
    var mainRef = new Firebase('https://ctretro.firebaseio.com');

    function getCurrentUser() {
      return mainRef.getAuth();
    }

    function logUser(email, pass, callback) {
      mainRef.unauth();
      mainRef.authWithPassword({
        email: email,
        password: pass
      }, function (error, authData) {
        if (error) {
          console.log('Log user failed: ', error);
        }
        callback(authData);
      });
    }
    function createUserAndLog(email, pass, callback) {
      mainRef.createUser({
        email    : email,
        password : pass
      }, function(error) {
        if (error) {
          console.log('Create user failed: try to log in', error);
        }
        logUser(email, pass, callback);
      });
    }
    return {
      getCurrentUser : getCurrentUser,
      createUserAndLog: createUserAndLog,
      logUser: logUser
    };
  });
