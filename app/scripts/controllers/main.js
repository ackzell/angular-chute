'use strict';

angular.module('angularChuteApp')
  .controller('MainCtrl', ['$scope', 'DemoAsset', function($scope, DemoAsset) {
    DemoAsset.query({album: 'abcqsrlx'}, function(assets) {
      $scope.assets = _.map(assets, function(asset) { return new DemoAsset(asset) });
    });

  }]);
