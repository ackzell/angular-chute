'use strict';

angular.module('angularChuteApp')
  .controller('MainCtrl', ['$scope', '$timeout', 'Asset', function($scope, $timeout, Asset) {

    $('.open-submission-modal').magnificPopup({
      type:'inline',
      midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
    });

    Asset.query({album: 'abcqsrlx'}, function(assets) {
      $scope.assets = _.map(assets, function(asset) { return new Asset(asset) });
      $timeout(function() {
        $('.wall').magnificPopup({
          delegate: 'a.magnific-popup',
          type: 'image',
          gallery: {enabled: true},
          image: {
            // markup: '<div class="mfp-figure">'+
            //           '<div class="mfp-close"></div>'+
            //           '<div class="mfp-img"></div>'+
            //           '<div class="mfp-bottom-bar">'+
            //             '<div class="mfp-title"></div>'+
            //             '<div class="mfp-counter"></div>'+
            //           '</div>'+
            //         '</div>',
            markup: '<div class="lightbox mfp-figure">'+
                      '<div class="mfp-close"></div>'+
                      '<div class="border">'+
                        '<div class="mfp-img"></div>'+
                        '<div class="like icon-star" ng-class="{\'active\': asset.hearted()}"></div>'+
                        '<span class="likes"><span class="likes-number">{{asset.hearts}}</span> votes</span>'+
                        '<div class="meta">'+
                          '<span class="username">{{asset._username()}}</span> | '+
                          '<i class="icon-map-marker"></i>&nbsp;&nbsp;{{asset.loc()}}'+
                        '</div>'+
                        '<p class="mfp-title"></p>'+
                        '<div class="sharing">'+
                          '<a href="#" class="facebook" target="_blank"><i class="icon-facebook icon-large"></i></a>'+
                          '<a href="#" class="twitter" target="_blank"><i class="icon-twitter icon-large"></i></a>'+
                          '<a href="#" class="pinterest" target="_blank"><i class="icon-pinterest icon-large"></i></a>'+
                          '<a href="#" class="tumblr" target="_blank"><i class="icon-tumblr icon-large"></i></a>'+
                        '</div>'+
                      '</div>'+
                    '</div>',
            cursor: null
          }
        });
      });
    });

  }]);
