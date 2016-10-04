'use strict';

angular.module('fireideaz').directive('boardContext', 'Auth', 'firebase' [function() {
    return {
      restrict: 'E',
      templateUrl : 'components/boardContext.html',
      resolve: {
        "currentAuth": function($firebaseObject, auth) {
          return auth.$requireAuth();
        }
      }
    };
  }]
);
