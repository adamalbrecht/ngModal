(function() {
  var app;

  app = angular.module("ngModal", []);

  app.provider("ngModalDefaults", function() {
    this.options = {
      closeButtonHtml: "<span class='ng-modal-close-x'>X</span>"
    };
    this.$get = function() {
      return this.options;
    };
    return this.set = function(keyOrHash, value) {
      var k, v, _results;
      if (typeof keyOrHash === 'object') {
        _results = [];
        for (k in keyOrHash) {
          v = keyOrHash[k];
          _results.push(this.options[k] = v);
        }
        return _results;
      } else {
        return this.options[keyOrHash] = value;
      }
    };
  });

  app.directive('modalDialog', [
    'ngModalDefaults', function(ngModalDefaults) {
      return {
        restrict: 'E',
        scope: {
          show: '=',
          title: '@'
        },
        replace: true,
        transclude: true,
        link: function(scope, element, attrs) {
          var setupCloseButton, setupStyle;
          setupCloseButton = function() {
            return scope.closeButtonHtml = ngModalDefaults.closeButtonHtml;
          };
          setupStyle = function() {
            scope.dialogStyle = {};
            if (attrs.width) {
              scope.dialogStyle['width'] = attrs.width;
            }
            if (attrs.height) {
              return scope.dialogStyle['height'] = attrs.height;
            }
          };
          scope.hideModal = function() {
            return scope.show = false;
          };
          scope.$watch('show', function(newVal, oldVal) {
            if (newVal && !oldVal) {
              return document.getElementsByTagName("body")[0].style.overflow = "hidden";
            } else {
              return document.getElementsByTagName("body")[0].style.overflow = "";
            }
          });
          setupCloseButton();
          return setupStyle();
        },
        template: "<div class='ng-modal' ng-show='show'>\n  <div class='ng-modal-overlay' ng-click='hideModal()'></div>\n  <div class='ng-modal-dialog' ng-style='dialogStyle'>\n    <span class='ng-modal-title' ng-bind='title'></span>\n    <div class='ng-modal-close' ng-click='hideModal()'>\n      <div ng-bind-html-unsafe='closeButtonHtml'></div>\n    </div>\n    <div class='ng-modal-dialog-content' ng-transclude></div>\n  </div>\n</div>"
      };
    }
  ]);

}).call(this);
