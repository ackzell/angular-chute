'use strict';

// # Chute.API.Album
//
// Album represents a folder with image and/or video albums.
angular.module('chute').factory('Chute.API.Album',
  ['Chute.API.Resource', '$http', 'apiUrl', 'Chute.API.Asset', function(Resource, $http, apiUrl, Asset) {

  var AlbumResource = Resource(apiUrl + '/albums/:collectionRoute:id:shortcut/:memberRoute', {
    id: '@id',
    shortcut: '@shortcut',
    collectionRoute: '@collectionRoute',
    memberRoute: '@memberRoute'
  }, {
    /* custom resource methods */
  });


  // ## Album.query
  //
  // Fetch albums. Extends [Resource.query](Resource.html#query).
  // 
  // See [AngularJS docs](http://docs.angularjs.org/api/ngResource.$resource) for more information.
  //
  // **@params**
  //
  // - `params` {object}
  //   - `perPage` {number} - albums to return per page
  //   - and more... see Chute API docs
  // - `success` {function}
  // - `error` {function}
  //
  // **@return** {array} collection of albums. Has additional functions:
  // 
  // - `nextPage` - fetch next page using same params as for query
  // - `prevPage` - fetch previous page using same params as for query
  // - `hasMore` - whether next page of albums is available
  // 
  // **@example**
  // ```js
  // $scope.albums = Album.query();
  // ```
  AlbumResource.__query = AlbumResource.query;
  AlbumResource.query = function(params, success, error) {
    return AlbumResource.__query(params, success, error);
  };

  // ## Album.get
  //
  // Fetch album from an album. Overwrites default `Resource.get` method, maintaining the same API.
  // 
  // See [AngularJS docs](http://docs.angularjs.org/api/ngResource.$resource) for more information.
  // 
  // **@params**
  //
  // - `params` {object}
  //   - `id` or `shortcut` {string} - album id or shortcut (e.g. *234234* or *abcqsrlx*)
  // - `success` {function}
  // - `error` {function}
  //
  // **@return** {object} resource object that will be eventually filled with album data
  //
  // **@example**
  // ```js
  // var album = Album.get({shortcut: 'abcqsrlx'});
  // ```
  AlbumResource.__get = AlbumResource.get;
  AlbumResource.get = function(params, success, error) {
    return AlbumResource.__get(params, success, error);
  };  

  return AlbumResource;
}]);
