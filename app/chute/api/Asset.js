angular.module('chute').factory('Asset', ['$resource', '$http', 'apiUrl', 'Heart', function($resource, $http, apiUrl, Heart) {
  var AssetResource = $resource(apiUrl + '/albums/:album/assets/:collectionRoute:id/:memberRoute', {
    album: '@album',
    id: '@id',
    collectionRoute: '@collectionRoute',
    memberRoute: '@memberRoute'
  }, {
    // custom resource methods
  });

  /**
  * Fetch album assets. Overwrites default 'Resource.query' method, maintaining the same API.
  *
  * See http://docs.angularjs.org/api/ngResource.$resource for documentation.
  *
  * @method query
  * @param {object} params - query params
  * @return Array array that will be eventually filled with assets
  * @async
  */
  AssetResource.query = function(params, success, error) {
    success = (success || angular.noop);
    error   = (error   || angular.noop);

    var assets = [];

    $http.get(apiUrl + '/albums/' + params.album + '/assets').success(function(response) {
      if (response && response.data) {
        assets.length = 0;
        angular.forEach(response.data, function(data) {
          data.album = params.album;
          assets.push(new AssetResource(data));
        });
      }
      success(response.data, response.headers);
    }).error(error);

    return assets;
  };

  /**
  * Fetch album asset. Overwrites default 'Resource.get' method, maintaining the same API.
  *
  * See http://docs.angularjs.org/api/ngResource.$resource for documentation.
  *
  * @method get
  * @param {object} params - query params
  * @return Object object that will be eventually filled with asset data
  * @async
  */
  AssetResource.get = function(params, success, error) {
    success = (success || angular.noop);
    error   = (error   || angular.noop);

    var data = {};

    var asset = this instanceof AssetResource ? this : new AssetResource(data);

    $http.get(apiUrl + '/albums/' + params.album + '/assets/' + params.id).success(function(response) {
      angular.copy(response.data, asset);
      success(response.data, response.headers);
    }).error(error);

    return asset;
  };  

  /**
  * Heart an asset
  * @method heart
  * @param {object} options - object specifying success and error callbacks
  * @example
      asset.heart({
        // Success callback
        'success': function(){
          // asset hearted
        },
        // Error callback
        'error': function(){
          // error happened during request
        }
      );
  * @async
  */
  AssetResource.prototype.heart = function(options) {
    options = (options || {});
      
    var key = this.album + '-' + this.shortcut + '-heart';
    var identifier = window.localStorage[key];
    if (identifier) {
      (options.error || angular.noop)();
      return false;
    }

    var self = this;

    $http.post(apiUrl + '/albums/' + this.album + '/assets/' + this.shortcut + '/hearts')
    .success(function(response) {
      window.localStorage[key] = response.data.identifier;
      self.hearts = (parseInt(self.hearts) || 0) + 1;
      (options.success || angular.noop)(response.data);
    }).error(options.error || angular.noop);
  };

  /**
  * Unheart an asset
  * @method unheart
  * @param {object} options - object specifying success and error callbacks
  * @example
      asset.unheart({
        // Success callback
        'success': function(){
          // asset hearted
        },
        // Error callback
        'error': function(){
          // error happened during request
        }
      );
  * @async
  */
  AssetResource.prototype.unheart = function(options) {
    options = (options || {});

    var key = this.album + '-' + this.shortcut + '-heart';
    var identifier = window.localStorage[key];
    if (! identifier) {
      (options.error || angular.noop)();
      return false;
    }

    var self = this;

    new Heart({identifier: identifier}).remove({}, function(response) {
      delete window.localStorage[key];
      self.hearts = (parseInt(self.hearts) || 0) - 1;
      (options.success || angular.noop)(response.data);
    }, options.error || angular.noop);
  };
  
  /**
  * Check if asset was already hearted before
  * @method hearted
  * @return Boolean
  * @example
      var isHearted = asset.hearted();
  */
  AssetResource.prototype.hearted = function() {
    return !!window.localStorage[this.album + '-' + this.shortcut + '-heart'];
  }

  /**
  * Heart if hearted, unheart if not hearted.
  * @method toggleHeart
  * @param {object} options - object specifying success and error callbacks
  * @example
      asset.toggleHeart({
        // Success callback
        'success': function(){
          // asset hearted
        },
        // Error callback
        'error': function(){
          // error happened during request
        }
      });
  * @async
  */
  AssetResource.prototype.toggleHeart = function(options) {
    if (this.hearted()) {
      this.unheart(options);
    } else {
      this.heart(options);
    }
  }

  return AssetResource;
}]);
