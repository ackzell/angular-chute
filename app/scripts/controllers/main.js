'use strict';

angular.module('angularChuteApp')
  .controller('MainCtrl', ['$scope', '$timeout', 'Asset', function($scope, $timeout, Asset) {

    $('.open-submission-modal').magnificPopup({
      type:'inline',
      midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
    });

    Asset.query({album: 'abcqsrlx'}, function(assets) {
      $scope.assets = _.map(assets, function(asset) { return new Asset(asset) });
    });

  }]);
