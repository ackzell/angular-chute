describe('Chute.API.Heart', function() {

  var Heart, apiUrl, $httpBackend;
  var delete_hearts_zhtuhmvggbhronuhklmp1377027594;

  beforeEach(function() {
    module('chute');
    inject(function($injector) {
      Heart = $injector.get('Chute.API.Heart');
      apiUrl = $injector.get('apiUrl');
      delete_hearts_zhtuhmvggbhronuhklmp1377027594 = $injector.get('delete_hearts_zhtuhmvggbhronuhklmp1377027594');
      $httpBackend = $injector.get('$httpBackend');
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation()
    $httpBackend.verifyNoOutstandingRequest()
  });

  describe('.delete', function() {

    it('should delete heart', function() {
      $httpBackend.expectDELETE(apiUrl + '/hearts/zhtuhmvggbhronuhklmp1377027594').respond(200, delete_hearts_zhtuhmvggbhronuhklmp1377027594);
      var options = { success: function(){} };
      var success = spyOn(options, 'success');
      new Heart({identifier: 'zhtuhmvggbhronuhklmp1377027594'}).remove({}, success);
      $httpBackend.flush();
      expect(success).toHaveBeenCalled();
    });

  });

});
