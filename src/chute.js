'use strict';

angular.module('chute', ['ngResource']);

angular.module('chute').constant('apiUrl', 'http://api.getchute.com/v2');

// http://better-inter.net/enabling-cors-in-angular-js/
// angular.module('chute').config(['$httpProvider', function($httpProvider) {
//   $httpProvider.defaults.useXDomain = true;
//   delete $httpProvider.defaults.headers.common['X-Requested-With'];
// }]);
