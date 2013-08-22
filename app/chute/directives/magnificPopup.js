angular.module('chute').directive('magnificPopup', ['$compile', function($compile) {
  return {   
    restrict: 'AC',    
    link: function postLink(scope, element, attrs, ctrl) {
      var attrMagnificPopup = scope.$eval(attrs.magnificPopup) || {};

      var options = angular.extend(attrMagnificPopup || {}, {
        type: 'image',
        gallery: {enabled: true},
        image: {
          cursor: null
        },
        callbacks: {
          beforeAppend: function() {
            scope.$apply(function() {
              var el = $.magnificPopup.instance.currItem.el;
              var elScope = angular.element(el).scope();
              $.magnificPopup.instance.content = $compile($.magnificPopup.instance.content)(elScope);
            });
          }
        }
      });

      if (attrMagnificPopup.markup) {
        // take markup from html element
        attrMagnificPopup.image.markup = $(element).find(attrMagnificPopup.markup).remove().get(0).outerHTML.replace(/>\s+</g,'><').trim();
      }

      $(element).magnificPopup(options);
    }
  };  
}]);