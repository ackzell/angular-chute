'use strict';

angular.module('chute').directive('chuteGallery', [function() {
  return {   
    restrict: 'AC',
    controller: ['$scope', '$attrs', 'Asset', function($scope, $attrs, Asset) {
      var options = $scope.$eval($attrs.chuteGallery) || {};

      $scope.assets = Asset.query({album: options.album, perPage: options.perPage});
    }]
  };  
}]);