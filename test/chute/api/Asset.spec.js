describe('Chute.API.Asset', function() {

  var Asset, apiUrl, $httpBackend, _;
  var get_album_abcqsrlx_assets, get_album_abcqsrlx_assets_vjp3miwob, post_albums_abcqsrlx_assets_vjp3miwob_hearts, delete_hearts_zhtuhmvggbhronuhklmp1377027594;

  beforeEach(function() {
    module('chute');
    inject(function($injector) {
      Asset = $injector.get('Chute.API.Asset');
      apiUrl = $injector.get('apiUrl');
      _ = $injector.get('_');
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

    describe('fetch albums assets', function() {
      var assets;
      beforeEach(function() {
        $httpBackend.expectGET(apiUrl + '/albums/abcqsrlx/assets').respond(200, get_albums_abcqsrlx_assets);
        assets = Asset.query({album: 'abcqsrlx'});
        $httpBackend.flush();
      });

      it('should fetch album assets', function() {
        expect(assets.length).toEqual(5);
        expect(assets[0].id).toEqual(462691751);
      });

      it('assets should have assigned album', function() {
        expect(assets[0].album).toEqual('abcqsrlx');
      });

      it('result should remember query params', function() {
        expect(assets.params.album).toBe('abcqsrlx');
      });

      it('result should have page set to 1', function() {
        expect(assets.params.page).toEqual(1);
      });

      it('result should have prevPage function', function() {
        expect(assets.prevPage).toBeDefined();
      });

      it('result should have nextPage function', function() {
        expect(assets.nextPage).toBeDefined();
      });
    });

    it('should have perPage param', function() {
      $httpBackend.expectGET(apiUrl + '/albums/abcqsrlx/assets?per_page=5').respond(200, get_albums_abcqsrlx_assets);
      var assets = Asset.query({album: 'abcqsrlx', perPage: 5});
      $httpBackend.flush();
      expect(assets[0].album).toEqual('abcqsrlx');
    });

    it('should use sort param', function() {
      $httpBackend.expectGET(apiUrl + '/albums/abcqsrlx/assets?sort=hot').respond(200, get_albums_abcqsrlx_assets);
      var assets = Asset.query({album: 'abcqsrlx', sort: 'hot'});
      $httpBackend.flush();
      expect(assets.params.sort).toEqual('hot');
    });

  });


  describe('Assets.prevPage', function() {
    it('should fetch previous page using first id', function() {
      $httpBackend.expectGET(apiUrl + '/albums/abcqsrlx/assets').respond(200, get_albums_abcqsrlx_assets);
      var assets = Asset.query({album: 'abcqsrlx'});
      $httpBackend.flush();

      var firstItem = assets[0];

      $httpBackend.expectGET(apiUrl + '/albums/abcqsrlx/assets?since_id=736347220').respond(200, get_albums_abcqsrlx_assets);
      assets.prevPage();
      $httpBackend.flush();
      expect(assets.length).toBe(10);
      expect(assets[5]).toBe(firstItem);  // verify assets shifted
    });

    it('should not fetch page 0', function() {
      $httpBackend.expectGET(apiUrl + '/albums/abcqsrlx/assets?sort=hot').respond(200, get_albums_abcqsrlx_assets);
      var assets = Asset.query({album: 'abcqsrlx', sort: 'hot'});
      $httpBackend.flush();

      expect(assets.params.page).toBe(1);
      expect(assets.params.sort).toBe('hot');
      expect(assets.params.album).toBe('abcqsrlx');
      expect(_.bind(assets.prevPage, assets)).toThrow(new RangeError("Cannot fetch previous page with index 0."));
    });
  });


  describe('Assets.nextPage', function() {
    it('should fetch next page using last id', function() {
      $httpBackend.expectGET(apiUrl + '/albums/abcqsrlx/assets').respond(200, get_albums_abcqsrlx_assets);
      var assets = Asset.query({album: 'abcqsrlx'});
      $httpBackend.flush();

      var lastItem = assets[4];

      $httpBackend.expectGET(apiUrl + '/albums/abcqsrlx/assets?max_id=736326673').respond(200, get_albums_abcqsrlx_assets);
      assets.nextPage();
      $httpBackend.flush();
      expect(assets.length).toBe(10);
      expect(assets[4]).toBe(lastItem);  // verify new assets were appended
    });

    it('should fetch next page using page param', function() {
      $httpBackend.expectGET(apiUrl + '/albums/abcqsrlx/assets?sort=hot').respond(200, get_albums_abcqsrlx_assets);
      var assets = Asset.query({album: 'abcqsrlx', sort: 'hot'});
      $httpBackend.flush();

      var lastItem = assets[4];

      $httpBackend.expectGET(apiUrl + '/albums/abcqsrlx/assets?page=2&sort=hot').respond(200, get_albums_abcqsrlx_assets);
      assets.nextPage();
      $httpBackend.flush();
      expect(assets.length).toBe(10);
      expect(assets[4]).toBe(lastItem);  // verify new assets were appended
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
