'use strict';

angular.module('Test', ['chute']);

angular.module('Test').controller('MainCtrl', ['$scope', 'Chute.API.Asset', function($scope, Asset) {
  $scope.assets = Asset.query({album: 'abcqsrlx', perPage: 3});
}]);
