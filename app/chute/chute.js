'use strict';

angular.module('chute', ['ngResource', 'wu.masonry']);

angular.module('chute').constant('apiUrl', 'http://api.getchute.com/v2');

angular.module('chute').constant('$', window.jQueryChute || window.jQuery);
angular.module('chute').constant('jQuery', window.jQueryChute || window.jQuery);

angular.module('chute').constant('_', window._);

// angular.module('chute').constant('config', {});  // allow apps to inject their config

// http://better-inter.net/enabling-cors-in-angular-js/
// angular.module('chute').config(['$httpProvider', function($httpProvider) {
//   $httpProvider.defaults.useXDomain = true;
//   delete $httpProvider.defaults.headers.common['X-Requested-With'];
// }]);

// angular.module('chute').config(function($provide) {
//   $provide.decorator('config', ['$delegate', function($delegate) {
//     return $delegate || {};
//   }]);
// });