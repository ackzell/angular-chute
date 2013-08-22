'use strict';

angular.module('chute', ['ngResource']);

angular.module('chute').constant('apiUrl', 'http://api.getchute.com/v2');

angular.module('chute').constant('$', window.jQueryChute || window.jQuery);
angular.module('chute').constant('jQuery', window.jQueryChute || window.jQuery);

angular.module('chute').constant('_', window._);
