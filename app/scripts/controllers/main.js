'use strict';

angular.module('angularChuteApp')
  .controller('MainCtrl', ['$scope', 'Asset', function($scope, Asset) {
    Asset.query({album: 'abcqsrlx'}, function(assets) {
      $scope.assets = _.map(assets, function(asset) { return new Asset(asset) });
    });

  }]);
