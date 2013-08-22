'use strict';

angular.module('CapitalOne')
  .controller('MainCtrl', ['$scope', 'Asset', function($scope, Asset) {

    $('.open-submission-modal').magnificPopup({
      type:'inline',
      midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
    });

    Asset.query({album: 'abcqsrlx', perPage: 15}, function(assets) {
      $scope.assets = _.map(assets, function(asset) { return new Asset(asset) });
    });

    $scope.ord = Math.floor(Math.random() * 1e16);

  }]);
