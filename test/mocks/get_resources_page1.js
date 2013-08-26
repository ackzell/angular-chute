// GET /resources
angular.module('chute').constant('get_resources_page1', 
  {
    "response": {
      "title": "Resource Listing",
      "version": 2,
      "code": 200,
      "href": "/resources"
    },
    "data": [
      {
        "id": 1
      },
      {
        "id": 2
      },
      {
        "id": 3
      },
      {
        "id": 4
      },
      {
        "id": 5
      }
    ],
    "pagination": {
      "current_page": 1,
      "next_page": "/resources?page=2",
      "previous_page": null,
      "first_page": "/resources",
      "per_page": 5
    }
  }
);
