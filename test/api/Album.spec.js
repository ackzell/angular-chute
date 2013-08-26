describe('Chute.API.Album', function() {

  var Album, Asset, apiUrl, $httpBackend;
  var get_album, get_album_abcqsrlx;

  beforeEach(function() {
    module('chute');
    inject(function($injector) {
      Album = $injector.get('Chute.API.Album');
      Asset = $injector.get('Chute.API.Asset');
      apiUrl = $injector.get('apiUrl');
      get_albums = $injector.get('get_albums');
      get_albums_abcqsrlx = $injector.get('get_albums_abcqsrlx');
      $httpBackend = $injector.get('$httpBackend');
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation()
    $httpBackend.verifyNoOutstandingRequest()
  });


  describe('.query', function() {

    describe('fetch albums', function() {
      var albums;
      beforeEach(function() {
        $httpBackend.expectGET(apiUrl + '/albums').respond(200, get_albums);
        albums = Album.query();
        $httpBackend.flush();
      });

      it('should fetch albums', function() {
        expect(albums.length).toEqual(5);
        expect(albums[0].id).toEqual(2466049);
      });

      it('result should have page set to 1', function() {
        expect(albums.params.page).toEqual(1);
      });

      it('result should have prevPage function', function() {
        expect(albums.prevPage).toBeDefined();
      });

      it('result should have nextPage function', function() {
        expect(albums.nextPage).toBeDefined();
      });
    });

    it('should have perPage param', function() {
      $httpBackend.expectGET(apiUrl + '/albums?per_page=5').respond(200, get_albums);
      var albums = Album.query({perPage: 5});
      $httpBackend.flush();
      expect(albums.params.per_page).toEqual(5);
    });

    it('should return enhanced Albums in callback', function() {
      $httpBackend.expectGET(apiUrl + '/albums').respond(200, get_albums);
      var success = jasmine.createSpy();
      var albums = Album.query({}, success);
      $httpBackend.flush();
      expect(success).toHaveBeenCalled();
      var albumsInCallback = success.mostRecentCall.args[0];
      expect(albumsInCallback.nextPage).toBeDefined();
      expect(albumsInCallback[0] instanceof Album).toBeTruthy();
      expect(albumsInCallback.length).toBe(5);
    });

  });


  describe('Albums.prevPage', function() {
    it('should fetch previous page using first id', function() {
      $httpBackend.expectGET(apiUrl + '/albums?page=2').respond(200, get_albums);
      var albums = Album.query({page: 2});
      $httpBackend.flush();

      var firstItem = albums[0];

      $httpBackend.expectGET(apiUrl + '/albums?page=1').respond(200, get_albums);
      albums.prevPage();
      $httpBackend.flush();
      expect(albums.length).toBe(10);
      expect(albums[5]).toBe(firstItem);  // verify albums shifted
    });

    it('should not fetch page 0', function() {
      $httpBackend.expectGET(apiUrl + '/albums').respond(200, get_albums);
      var albums = Album.query();
      $httpBackend.flush();

      expect(albums.params.page).toBe(1);
      expect(angular.bind(albums, albums.prevPage)).toThrow(new RangeError("Cannot fetch previous page with index 0."));
    });

    it('should return newly added Albums in callback', function() {
      $httpBackend.expectGET(apiUrl + '/albums?page=2').respond(200, get_albums);
      var albums = Album.query({page: 2});
      $httpBackend.flush();

      $httpBackend.expectGET(apiUrl + '/albums?page=1').respond(200, get_albums);
      var success = jasmine.createSpy();
      albums.prevPage(success);
      $httpBackend.flush();
      var newAlbums = success.mostRecentCall.args[0];
      expect(newAlbums[0] instanceof Album).toBeTruthy();
      expect(newAlbums.length).toBe(5);
      expect(newAlbums.prevPage).toBeDefined();
      expect(newAlbums[0]).toBe(albums[0]);
      expect(newAlbums[3]).toBe(albums[3]);
    });
  });


  describe('Albums.nextPage', function() {
    it('should fetch next page using page param', function() {
      $httpBackend.expectGET(apiUrl + '/albums').respond(200, get_albums);
      var albums = Album.query();
      $httpBackend.flush();

      var lastItem = albums[4];

      $httpBackend.expectGET(apiUrl + '/albums?page=2').respond(200, get_albums);
      albums.nextPage();
      $httpBackend.flush();
      expect(albums.length).toBe(10);
      expect(albums[4]).toBe(lastItem);  // verify new albums were appended
    });

    it('should return newly added Albums in callback', function() {
      $httpBackend.expectGET(apiUrl + '/albums').respond(200, get_albums);
      var albums = Album.query();
      $httpBackend.flush();

      $httpBackend.expectGET(apiUrl + '/albums?page=2').respond(200, get_albums);
      var success = jasmine.createSpy();
      albums.nextPage(success);
      $httpBackend.flush();
      var newAlbums = success.mostRecentCall.args[0];
      expect(newAlbums[0] instanceof Album).toBeTruthy();
      expect(newAlbums.length).toBe(5);
      expect(newAlbums.nextPage).toBeDefined();
      expect(newAlbums[0]).toBe(albums[5]);
    });
  });


  describe('.get', function() {

    it('should fetch album', function() {
      $httpBackend.expectGET(apiUrl + '/albums/abcqsrlx').respond(200, get_albums_abcqsrlx);
      response = Album.get({id: 'abcqsrlx'});
      $httpBackend.flush();
      expect(response.id).toEqual(2448736);
    });

  });

});
