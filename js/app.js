var app = angular.module('fireideaz', ['firebase',
               'ngDialog',
               'lvl.directives.dragdrop',
               'ngSanitize',
               'ngAria']);


app.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on('$routeChangeError', function(e, next, prev, err) {
    if(err === 'AUTH_REQUIRED'){
      $location.path('/#');
    }
  })
}]);