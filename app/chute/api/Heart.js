'use strict';

angular.module('chute').factory('Chute.API.Heart', ['$resource', '$http', 'apiUrl', function($resource, $http, apiUrl) {
  var HeartResource = $resource(apiUrl + '/hearts/:collectionRoute:id/:memberRoute', {
    id: '@id',
    collectionRoute: '@collectionRoute',
    memberRoute: '@memberRoute'
  }, {
    // custom resource methods
  });

  HeartResource.prototype.remove = function(params, success, error) {
    success = (success || angular.noop);
    error   = (error || angular.noop);

    $http['delete'](apiUrl + '/hearts/' + this.identifier).success(success).error(error);
  };

  return HeartResource;
}]);
