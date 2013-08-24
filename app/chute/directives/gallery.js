'use strict';

angular.module('chute').directive('chuteGallery', function() {
  return {   
    restrict: 'A',
    controller: ['$scope', '$attrs', 'Chute.API.Asset', function($scope, $attrs, Asset) {
      var options = $scope.$eval($attrs.chuteGallery);
      $scope.assets = Asset.query(options);
    }]
  };  
});