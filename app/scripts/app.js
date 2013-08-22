'use strict';

angular.module('CapitalOne', ['chute', 'wu.masonry'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('popular', {
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: 'popular'
      });
  }]);
