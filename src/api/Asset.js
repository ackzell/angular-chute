'use strict';

// # Chute.API.Asset
//
// Asset represents metadata about an image or a video.
angular.module('chute').factory('Chute.API.Asset',
  ['$resource', '$http', 'apiUrl', 'Chute.API.Heart', function($resource, $http, apiUrl, Heart) {

  var AssetResource = $resource(apiUrl + '/albums/:album/assets/:collectionRoute:id/:memberRoute', {
    album: '@album',
    id: '@id',
    collectionRoute: '@collectionRoute',
    memberRoute: '@memberRoute'
  }, {
    /* custom resource methods */

    query: {method: 'GET', isArray: false}
  });


  var PER_PAGE = 5;

  // <a name="Assets"></a>
  // ## Assets
  // 
  // Collection of assets returned by `Asset.query`.
  var Assets = {
    // ### Assets.prevPage
    //
    // Fetch previous page of assets and prepend them to current instance of assets.
    //
    // When the assets are sorted naturally (`sort` param is 'id', 'time' or none), continuous paging is used. Otherwise uses standard paging (using `page` param).
    //
    // **@params**
    //
    // - `success` {function} - will be passed these arguments:
    //   - {array} detached set of newly fetched assets (in case you need them)
    //   - {object} response headers
    // - `error` {function}
    //
    // **@example**
    // ```js
    // var assets = Asset.query({album: 'abcqsrlx', page: 10});
    // assets.prevPage();
    // ```
    prevPage: function(success, error) {
      this.params.page--;

      var params = angular.copy(this.params);

      if (!this.params.sort || this.params.sort === 'id' || this.params.sort === 'time') {
        params.since_id = this[0].chute_asset_id;
        delete params.page;  // don't send the page param
      } else if (this.params.page <= 0) {
        throw new RangeError("Cannot fetch previous page with index " + this.params.page + ".");
      }
      
      var assets = this;
      AssetResource._query(params, function(response) {
        var newAssets = angular.extend([], {params: angular.copy(assets.params)}, Assets);
        if (response && response.data) {
          angular.forEach(response.data, function(data) {
            data.album = params.album;
            var asset = new AssetResource(data);
            newAssets.push(asset);
          });
          /* prepend new assets to the original array */
          assets.unshift.apply(assets, newAssets);
        }
        (success||angular.noop)(newAssets, response.headers);
      }, error);
    },

    // ### Assets.nextPage
    //
    // Fetch next page of assets and append them to current instance of assets.
    //
    // When the assets are sorted naturally (`sort` param is 'id', 'time' or none), continuous paging is used. Otherwise uses standard paging (using `page` param).
    //
    // **@params**
    //
    // - `success` {function} - will be passed these arguments:
    //   - {array} detached set of newly fetched assets (in case you need them)
    //   - {object} response headers
    // - `error` {function}
    //
    // **@example**
    // ```js
    // var assets = Asset.query({album: 'abcqsrlx'});
    // assets.nextPage();
    // ```
    nextPage: function(success, error) {
      this.params.page++;

      var params = angular.copy(this.params);

      if (!this.params.sort || this.params.sort === 'id' || this.params.sort === 'time') {
        params.max_id = this[this.length-1].chute_asset_id;
        delete params.page;  // don't send the page param
      }

      var assets = this;
      AssetResource._query(params, function(response) {
        var newAssets = angular.extend([], {params: angular.copy(assets.params)}, Assets);
        if (response && response.data) {
          angular.forEach(response.data, function(data) {
            data.album = params.album;
            var asset = new AssetResource(data);
            newAssets.push(asset);
          });
          /* append new asssets to the original array */
          assets.push.apply(assets, newAssets);
        }
        if (!response || !response.data || response.data.length != (params.per_page || PER_PAGE)) {
          assets._hasMore = false;
        }
        (success||angular.noop)(newAssets, response.headers);
      }, error);
    },

    // ### Assets.hasMore
    //
    // Check if there are more assets available.
    //
    // This method doesn't trigger any external request. The resolution is based on the result of the last query (if it returned less than requested number of items, it's a signal there are no more available).
    //
    // **@returns** {boolean}
    //
    // - true if there are more assets on the server;
    // - false if we have reached the end
    //
    // **@example**
    // ```js
    // var assets = Asset.query({album: 'abcqsrlx'});
    // if (assets.hasMore()) {
    //   assets.nextPage();
    // }
    // ```
    hasMore: function() {
      return !! this._hasMore;
    }
  };

  // ## Asset.query
  //
  // Fetch album assets. Overwrites default `Resource.query` method, maintaining the same API.
  // 
  // **@params**
  //
  // - `params`
  //   - `album` {string} - album shortcut like *abcqsrlx*
  //   - `perPage` {number} - assets to return per page
  //   - and more... see Chute API docs
  // - `success` {function}
  // - `error` {function}
  //
  // **@return** {array} [Assets](#Assets). Has additional functions (see above):
  // 
  // - `nextPage` - fetch next page using same params as for query
  // - `prevPage` - fetch previous page using same params as for query
  // - `hasMore` - whether next page of assets is available
  // 
  // See [AngularJS docs](http://docs.angularjs.org/api/ngResource.$resource) for more information.
  //
  // **@example**
  // ```js
  // $scope.assets = Asset.query({album: 'abcqsrlx'});
  // ```
  AssetResource._query = AssetResource.query;
  AssetResource.query = function(params, success, error) {
    if (params.perPage) {
      params.per_page = params.perPage;
      delete params.perPage;
    }

    var saveParams = angular.extend({page: 1}, params);
    /* this is a nice trick to get array with helper functions */
    var assets = angular.extend([], {params: saveParams}, Assets);

    AssetResource._query(params, function(response) {
      if (response && response.data) {
        assets.length = 0;
        angular.forEach(response.data, function(data) {
          data.album = params.album;
          assets.push(new AssetResource(data));
        });

        if (response.data.length == (params.per_page || PER_PAGE)) {
          assets._hasMore = true;
        }
      }
      (success||angular.noop)(assets, response.headers);
    }, error);

    return assets;
  };

  // ## Asset.get
  //
  // Fetch asset from an album. Overwrites default `Resource.get` method, maintaining the same API.
  // 
  // See [AngularJS docs](http://docs.angularjs.org/api/ngResource.$resource) for more information.
  // 
  // **@params**
  //
  // - `params`
  //   - `album` {string} - album shortcut
  //   - `asset` {string} - asset shortcut
  // - `success` {function}
  // - `error` {function}
  //
  // **@return** {object} resource object that will be eventually filled with asset data
  //
  // **@example**
  // ```js
  // var asset = Asset.get({album: 'abcqsrlx', asset: 'vjp3miwob'});
  // ```
  AssetResource._get = AssetResource.get;
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

  // <a name="heart"></a>
  // ## asset.heart
  //
  // Heart an asset.
  //
  // **@params**
  //
  // - `options` {object} - specify success and error callbacks
  //
  // **@example**
  //
  // ```javascript
  // asset.heart({
  //   // Success callback
  //   'success': function(){
  //     // asset hearted
  //   },
  //   // Error callback
  //   'error': function(){
  //     // error happened during request
  //   }
  // );
  // ```
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
      var heart = new Heart(response.data);
      window.localStorage[key] = heart.identifier;
      self.hearts = (parseInt(self.hearts) || 0) + 1;
      (options.success || angular.noop)(heart);
    }).error(options.error || angular.noop);
  };

  // ## Asset.unheart
  //
  // Unheart an asset.
  //
  // **@params**
  //
  // - `options` {object} - specify success and error callbacks
  //
  // **@example**
  //
  // ```js
  // asset.unheart({
  //   // Success callback
  //   'success': function(){
  //     // asset hearted
  //   },
  //   // Error callback
  //   'error': function(){
  //     // error happened during request
  //   }
  // );
  // ```
  AssetResource.prototype.unheart = function(options) {
    options = (options || {});

    var key = this.album + '-' + this.shortcut + '-heart';
    var identifier = window.localStorage[key];
    if (! identifier) {
      (options.error || angular.noop)();
      return false;
    }

    var self = this;

    new Heart({identifier: identifier}).$remove({}, function(response) {
      delete window.localStorage[key];
      self.hearts = (parseInt(self.hearts) || 0) - 1;
      (options.success || angular.noop)(response.data);
    }, options.error || angular.noop);
  };
  
  // ## Asset.hearted
  //
  // Check if asset was already hearted before.
  //
  // **@return** {boolean}
  //
  // **@example**
  //
  // ```js
  // var isHearted = asset.hearted();
  // ```
  AssetResource.prototype.hearted = function() {
    return !!window.localStorage[this.album + '-' + this.shortcut + '-heart'];
  }

  // ## Asset.toggleHeart
  //
  // Heart if hearted, unheart if not hearted.
  //
  // **@params**
  //
  // - `options` {object} - specify success and error callbacks
  //
  // **@example**
  //
  // ```js
  // asset.toggleHeart({
  //   // Success callback
  //   'success': function(){
  //     // asset hearted
  //   },
  //   // Error callback
  //   'error': function(){
  //     // error happened during request
  //   }
  // });
  // ```
  AssetResource.prototype.toggleHeart = function(options) {
    if (this.hearted()) {
      this.unheart(options);
    } else {
      this.heart(options);
    }
  }

  return AssetResource;
}]);
