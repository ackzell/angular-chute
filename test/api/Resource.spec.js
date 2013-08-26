describe('Chute.API.Resource', function() {

  var Resource, $httpBackend;
  var get_resources, get_resources_page1, get_resources_page2, get_resources_1;

  beforeEach(function() {
    module('chute');
    inject(function($injector) {
      var ResourceFactory = $injector.get('Chute.API.Resource');
      Resource = ResourceFactory('/resources/:id');

      get_resources = $injector.get('get_resources');
      get_resources_page1 = $injector.get('get_resources_page1');
      get_resources_page2 = $injector.get('get_resources_page2');
      get_resources_1 = $injector.get('get_resources_1');
      $httpBackend = $injector.get('$httpBackend');
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation()
    $httpBackend.verifyNoOutstandingRequest()
  });


  describe('.query', function() {

    describe('fetch resources', function() {
      var resources;
      beforeEach(function() {
        $httpBackend.expectGET('/resources').respond(200, get_resources);
        resources = Resource.query();
        $httpBackend.flush();
      });

      it('should fetch resources', function() {
        expect(resources.length).toEqual(5);
        expect(resources[0].id).toEqual(1);
      });

      it('collection should have page set to 1', function() {
        expect(resources.params.page).toEqual(1);
      });

      it('collection should have prevPage function', function() {
        expect(resources.prevPage).toBeDefined();
      });

      it('collection should have nextPage function', function() {
        expect(resources.nextPage).toBeDefined();
      });

      it('collection should have hasMore function', function() {
        expect(resources.hasMore).toBeDefined();
      });
    });

    it('should convert perPage param to per_page', function() {
      $httpBackend.expectGET('/resources?per_page=5').respond(200, get_resources);
      var resources = Resource.query({perPage: 5});
      $httpBackend.flush();
      expect(resources.params.per_page).toEqual(5);
    });

    it('should return enhanced Resources in callback', function() {
      $httpBackend.expectGET('/resources').respond(200, get_resources);
      var success = jasmine.createSpy();
      var resources = Resource.query({}, success);
      $httpBackend.flush();
      expect(success).toHaveBeenCalled();
      var resourcesInCallback = success.mostRecentCall.args[0];
      expect(resourcesInCallback.nextPage).toBeDefined();
      expect(resourcesInCallback[0] instanceof Resource).toBeTruthy();
      expect(resourcesInCallback.length).toBe(5);
    });

  });


  describe('Resources.prevPage', function() {
    it('should not fetch page 0', function() {
      $httpBackend.expectGET('/resources').respond(200, get_resources);
      var resources = Resource.query({});
      $httpBackend.flush();

      expect(resources.params.page).toBe(1);
      expect(angular.bind(resources, resources.prevPage)).toThrow(new RangeError("Cannot fetch previous page with index 0."));
    });

    it('should return newly added Resources in callback', function() {
      $httpBackend.expectGET('/resources?page=2').respond(200, get_resources_page2);
      var resources = Resource.query({page: 2});
      $httpBackend.flush();

      $httpBackend.expectGET('/resources?page=1').respond(200, get_resources_page1);
      var success = jasmine.createSpy();
      resources.prevPage(success);
      $httpBackend.flush();
      var newResources = success.mostRecentCall.args[0];
      expect(newResources[0] instanceof Resource).toBeTruthy();
      expect(newResources.length).toBe(5);
      expect(newResources.prevPage).toBeDefined();
      expect(newResources[0]).toBe(resources[0]);
      expect(newResources[3]).toBe(resources[3]);
    });
  });


  describe('Resources.nextPage', function() {
    it('should fetch next page using page param', function() {
      $httpBackend.expectGET('/resources').respond(200, get_resources_page1);
      var resources = Resource.query();
      $httpBackend.flush();

      var lastItem = resources[4];

      $httpBackend.expectGET('/resources?page=2').respond(200, get_resources_page2);
      resources.nextPage();
      $httpBackend.flush();
      expect(resources.length).toBe(7);
      expect(resources[4]).toBe(lastItem);  // verify new resources were appended
    });

    it('should return newly added Resources in callback', function() {
      $httpBackend.expectGET('/resources').respond(200, get_resources);
      var resources = Resource.query();
      $httpBackend.flush();

      $httpBackend.expectGET('/resources?page=2').respond(200, get_resources);
      var success = jasmine.createSpy();
      resources.nextPage(success);
      $httpBackend.flush();
      var newResources = success.mostRecentCall.args[0];
      expect(newResources[0] instanceof Resource).toBeTruthy();
      expect(newResources.length).toBe(5);
      expect(newResources.nextPage).toBeDefined();
      expect(newResources[0]).toBe(resources[5]);
    });

    it('should leave hasMore after full next page set to true', function() {
      $httpBackend.expectGET('/resources').respond(200, get_resources_page1);
      var resources = Resource.query();
      $httpBackend.flush();

      $httpBackend.expectGET('/resources?page=2').respond(200, get_resources_page1); // send full page1 again
      resources.nextPage();
      $httpBackend.flush();
      expect(resources.hasMore()).toBeTruthy();
    });

    it('should set hasMore after last page to false', function() {
      $httpBackend.expectGET('/resources').respond(200, get_resources_page1);
      var resources = Resource.query();
      $httpBackend.flush();

      $httpBackend.expectGET('/resources?page=2').respond(200, get_resources_page2);
      resources.nextPage();
      $httpBackend.flush();
      expect(resources.hasMore()).toBeFalsy();
    });
  });


  describe('Resources.hasMore', function() {
    it('should have more resources by default', function() {
      $httpBackend.expectGET('/resources').respond(200, get_resources_page1);
      var resources = Resource.query();
      $httpBackend.flush();
      expect(resources.hasMore()).toBeTruthy();
    });

    it('should have more resources with string per_page', function() {
      $httpBackend.expectGET('/resources?per_page=5').respond(200, get_resources_page1);
      var resources = Resource.query({perPage: '5'});
      $httpBackend.flush();
      expect(resources.hasMore()).toBeTruthy();
    });

    it('should NOT have more resources when returning less than requested', function() {
      $httpBackend.expectGET('/resources?per_page=10').respond(200, get_resources);
      var resources = Resource.query({perPage: 10});
      $httpBackend.flush();
      expect(resources.hasMore()).toBeFalsy();
    });

    it('should NOT have more albums when pagination.next_page is null', function() {
      $httpBackend.expectGET('/resources').respond(200, get_resources);
      var albums = Resource.query();
      $httpBackend.flush();
      expect(albums.hasMore()).toBeFalsy();
    });

    it('should NOT have more resources when returning 0 resources', function() {
      $httpBackend.expectGET('/resources').respond(200, {});
      var resources = Resource.query();
      $httpBackend.flush();
      expect(resources.hasMore()).toBeFalsy();
    });
  });


  describe('.get', function() {

    it('should fetch resource', function() {
      $httpBackend.expectGET('/resources/1').respond(200, get_resources_1);
      var resource = Resource.get({id: '1'});
      $httpBackend.flush();
      expect(resource.id).toEqual(1);
      expect(resource instanceof Resource).toBeTruthy();
    });

  });


});
