angular.module('angularChuteApp').factory('Asset', ['Chute.API.Asset', function(ChuteAsset) {

  var Asset = angular.extend(ChuteAsset);

  Asset.prototype.loc = function() {
    if (! this._location) {
      var locationTag = _.find(this.tags, function(tag) { return tag.indexOf('^') === 0 });

      this._location = locationTag ? locationTag.substr(1).replace(/_/g, ' ').replace(/;/g, ',') : null;
    }

    return this._location;
  }

  Asset.prototype._username = function() {
    return this.username || (this.account && this.account.username) || (this.user && (this.user.username || this.user.name));
  }

  return Asset;
}]);
