describe('Chute.API.Asset', function() {

  var Asset, apiUrl, $httpBackend;
  var get_album_abcqsrlx_assets, get_album_abcqsrlx_assets_vjp3miwob, post_albums_abcqsrlx_assets_vjp3miwob_hearts, delete_hearts_zhtuhmvggbhronuhklmp1377027594;

  beforeEach(function() {
    module('chute');
    inject(function($injector) {
      Asset = $injector.get('Chute.API.Asset');
      apiUrl = $injector.get('apiUrl');
      get_albums_abcqsrlx_assets = $injector.get('get_albums_abcqsrlx_assets');
      get_albums_abcqsrlx_assets_vjp3miwob = $injector.get('get_albums_abcqsrlx_assets_vjp3miwob');
      post_albums_abcqsrlx_assets_vjp3miwob_hearts = $injector.get('post_albums_abcqsrlx_assets_vjp3miwob_hearts');
      delete_hearts_zhtuhmvggbhronuhklmp1377027594 = $injector.get('delete_hearts_zhtuhmvggbhronuhklmp1377027594');
      $httpBackend = $injector.get('$httpBackend');
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation()
    $httpBackend.verifyNoOutstandingRequest()
  });

  describe('.query', function() {

    it('should fetch album assets', function() {
      $httpBackend.expectGET(apiUrl + '/albums/abcqsrlx/assets').respond(200, get_albums_abcqsrlx_assets);
      response = Asset.query({album: 'abcqsrlx'});
      $httpBackend.flush();
      expect(response.length).toEqual(5);
      expect(response[0].id).toEqual(462691751);
    });

    it('assets should have assigned album', function() {
      $httpBackend.expectGET(apiUrl + '/albums/abcqsrlx/assets').respond(200, get_albums_abcqsrlx_assets);
      response = Asset.query({album: 'abcqsrlx'});
      $httpBackend.flush();
      expect(response[0].album).toEqual('abcqsrlx');
    });

  });

  describe('.get', function() {

    it('should fetch album asset', function() {
      $httpBackend.expectGET(apiUrl + '/albums/abcqsrlx/assets/vjp3miwob').respond(200, get_albums_abcqsrlx_assets_vjp3miwob);
      response = Asset.get({album: 'abcqsrlx', id: 'vjp3miwob'});
      $httpBackend.flush();
      expect(response.id).toEqual(462690956);
    });

  });

  describe('.heart', function() {

    it('should heart an asset', function() {
      // ensure the key doesn't exist in local storage
      delete window.localStorage['abcqsrlx-vjp3miwob-heart'];

      $httpBackend.expectPOST(apiUrl + '/albums/abcqsrlx/assets/vjp3miwob/hearts').respond(201, post_albums_abcqsrlx_assets_vjp3miwob_hearts);
      var asset = new Asset({album: 'abcqsrlx', shortcut: 'vjp3miwob'});
      var options = { success: function(data){} };
      var success = spyOn(options, 'success');

      response = asset.toggleHeart(options);
      $httpBackend.flush();
      
      expect(success).toHaveBeenCalled();
      expect(asset.hearts).toBe(1);
      expect(window.localStorage['abcqsrlx-vjp3miwob-heart']).toBe('zhtuhmvggbhronuhklmp1377027594');
    });

  });

  describe('.unheart', function() {

    it('should unheart an asset', function() {
      // ensure the key exists in local storage
      window.localStorage['abcqsrlx-vjp3miwob-heart'] = 'zhtuhmvggbhronuhklmp1377027594';

      $httpBackend.expectDELETE(apiUrl + '/hearts/zhtuhmvggbhronuhklmp1377027594').respond(200, delete_hearts_zhtuhmvggbhronuhklmp1377027594);
      var asset = new Asset({album: 'abcqsrlx', shortcut: 'vjp3miwob', hearts: 4});
      var options = { success: function(data){} };
      var success = spyOn(options, 'success');

      response = asset.toggleHeart(options);
      $httpBackend.flush();

      expect(success).toHaveBeenCalled();
      expect(asset.hearts).toBe(3);
      expect(window.localStorage['abcqsrlx-vjp3miwob-heart']).toBeUndefined();
    });

  });

  describe('.hearted', function() {

    it('should be hearted', function() {
      // ensure the key exists in local storage
      window.localStorage['abcqsrlx-vjp3miwob-heart'] = 'zhtuhmvggbhronuhklmp1377027594';

      var asset = new Asset({album: 'abcqsrlx', shortcut: 'vjp3miwob'});
      expect(asset.hearted()).toBeTruthy();
    });

    it('should NOT be hearted', function() {
      // ensure the key doesn't exist in local storage
      delete window.localStorage['abcqsrlx-vjp3miwob-heart'];

      var asset = new Asset({album: 'abcqsrlx', shortcut: 'vjp3miwob'});
      expect(asset.hearted()).toBeFalsy();        
    });

  });

  describe('.toggleHeart', function() {

    it('should heart', function() {
      // ensure the key doesn't exist in local storage
      delete window.localStorage['abcqsrlx-vjp3miwob-heart'];

      $httpBackend.expectPOST(apiUrl + '/albums/abcqsrlx/assets/vjp3miwob/hearts').respond(201, post_albums_abcqsrlx_assets_vjp3miwob_hearts);
      var asset = new Asset({album: 'abcqsrlx', shortcut: 'vjp3miwob'});
      var options = { success: function(data){} };
      var success = spyOn(options, 'success');

      response = asset.toggleHeart(options);
      $httpBackend.flush();
      
      expect(success).toHaveBeenCalled();
      expect(asset.hearts).toBe(1);
      expect(window.localStorage['abcqsrlx-vjp3miwob-heart']).toBe('zhtuhmvggbhronuhklmp1377027594');
    });

    it('should unheart', function() {
      // ensure the key exists in local storage
      window.localStorage['abcqsrlx-vjp3miwob-heart'] = 'zhtuhmvggbhronuhklmp1377027594';

      $httpBackend.expectDELETE(apiUrl + '/hearts/zhtuhmvggbhronuhklmp1377027594').respond(200, delete_hearts_zhtuhmvggbhronuhklmp1377027594);
      var asset = new Asset({album: 'abcqsrlx', shortcut: 'vjp3miwob', hearts: 4});
      var options = { success: function(data){} };
      var success = spyOn(options, 'success');
      
      response = asset.toggleHeart(options);
      $httpBackend.flush();
      
      expect(success).toHaveBeenCalled();
      expect(asset.hearts).toBe(3);
      expect(window.localStorage['abcqsrlx-vjp3miwob-heart']).toBeUndefined();
    });

  });

});
