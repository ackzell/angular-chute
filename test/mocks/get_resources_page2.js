// GET /resources?page=2
angular.module('chute').constant('get_resources_page2', 
  {
    "response": {
      "title": "Resource Listing",
      "version": 2,
      "code": 200,
      "href": "/resources?page=2"
    },
    "data": [
      {
        "id": 6
      },
      {
        "id": 7
      }
    ],
    "pagination": {
      "current_page": 2,
      "next_page": null,
      "previous_page": "/resources?page=1",
      "first_page": "/resources",
      "per_page": 5
    }
  }
);
