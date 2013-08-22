'use strict';

angular.module('chute').directive('chuteGallery', ['config', '$', function(config, $) {
  config = config || {};

  return {   
    restrict: 'AC',
    controller: ['$scope', '$attrs', 'Asset', function($scope, $attrs, Asset) {
      var options = $.extend(true, {}, config, $scope.$eval($attrs.chuteGallery));

      $scope.assets = Asset.query({album: options.album, perPage: options.perPage});
    }]
  };  
}]);