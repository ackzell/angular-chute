# angular-chute

> [Chute API](http://api.getchute.com/v2) wrapper for AngularJS.

## Installation

- `bower install angular-chute`

  or

- `npm install angular-chute`

  or

- Download [angular-chute.js](dist/angular.chute.js) or [angular-chute.min.js](dist/angular-chute.min.js)


## Getting started

To display images from an album inside a gallery:

```html
<div ng-app="myApp" class="gallery" ng-controller="GalleryCtrl">
  <div class="gallery-item" ng-repeat="asset in assets">
    <img ng-src="{{asset.url}}/w/300" alt="{{asset.caption}}" width="300">

    <div class="heart" ng-class="{'active': asset.hearted()}" ng-click="asset.toggleHeart()"></div>
    
    <p>{{asset.caption}}</p>
    
    <div ng-pluralize class="hearts" count="asset.hearts" when="{'one':'1 heart', 'other':'{} hearts'}"></div>
  </div>
</div>
```

```js
angular.module('myApp').controller('GalleryCtrl', ['$scope', function($scope) {
  $scope.assets = Asset.query({album: 'shortcut'});
});
```

Now that you have a collection of assets, you can request next page as simply as:

```js
$scope.assets.nextPage();
```

Thanks to Angular's data binding, the view will be updated automatically.


## Documentation

Available as [annotated source code](http://chute.github.io/angular-chute/docs/chute.html).


## License

MIT License. Copyright (c) 2013 Chute Corporation.
