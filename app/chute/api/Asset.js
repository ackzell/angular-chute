'use strict';

angular.module('chute').factory('Chute.API.Asset', ['$resource', '$http', 'apiUrl', 'Chute.API.Heart', function($resource, $http, apiUrl, Heart) {
  var AssetResource = $resource(apiUrl + '/albums/:album/assets/:collectionRoute:id/:memberRoute', {
    album: '@album',
    id: '@id',
    collectionRoute: '@collectionRoute',
    memberRoute: '@memberRoute'
  }, {
    // custom resource methods

    query: {method: 'GET', isArray: false}
  });


  var Assets = {
    /**
    * Fetch previous page of assets and prepend them to current instance of assets.
    * When the assets are sorted naturally (`sort` param is 'id', 'time' or none), continuous paging is used. Otherwise uses standard paging (using `page` param).
    * @params {Function} success - will be passed these arguments:
    *   - {Array} newly fetched assets - detached subset of the new assets (in case you need them)
    *   - {object} response headers
    * @params {Function} error
    */
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
          // prepend new assets to the original array
          assets.unshift.apply(assets, newAssets);
        }
        (success||angular.noop)(newAssets, response.headers);
      }, error);
    },

    /**
    * Fetch next page of assets and append them to current instance of assets.
    * When the assets are sorted naturally (`sort` param is 'id', 'time' or none), continuous paging is used. Otherwise uses standard paging (using `page` param).
    * @params {Function} success - will be passed these arguments:
    *   - {Array} newly fetched assets - detached subset of the new assets (in case you need them)
    *   - {object} response headers
    * @params {Function} error
    */
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
          // append new asssets to the original array
          assets.push.apply(assets, newAssets);
        }
        (success||angular.noop)(newAssets, response.headers);
      }, error);
    }
  };

  AssetResource._query = AssetResource.query;
  /**
  * Fetch album assets. Overwrites default 'Resource.query' method, maintaining the same API.
  *
  * The returned array has additional functions:
  *  - nextPage() - fetch next page using same params as for query
  *  - prevPage() - fetch previous page using same params as for query
  *
  * See http://docs.angularjs.org/api/ngResource.$resource for documentation.
  *
  * @method query
  * @param {object} params - query params
  * @return Array array that will be eventually filled with assets
  * @async
  */
  AssetResource.query = function(params, success, error) {
    if (params.perPage) {
      params.per_page = params.perPage;
      delete params.perPage;
    }

    var saveParams = angular.extend({page: 1}, params);
    // this is a nice trick to get array with helper functions
    var assets = angular.extend([], {params: saveParams}, Assets);

    AssetResource._query(params, function(response) {
      if (response && response.data) {
        assets.length = 0;
        angular.forEach(response.data, function(data) {
          data.album = params.album;
          assets.push(new AssetResource(data));
        });
      }
      (success||angular.noop)(assets, response.headers);
    }, error);

    return assets;
  };

  AssetResource._get = AssetResource.get;
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
