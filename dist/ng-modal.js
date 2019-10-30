(function() {
  var app,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  app = angular.module("ngModal", []);

  app.provider("ngModalDefaults", function() {
    return {
      options: {
        closeButtonHtml: "<span class='ng-modal-close-x'>X</span>",
        hideCloseButton: false,
        closeOnEscape: true,
        closeOnOutsideClick: true
      },
      $get: function() {
        return this.options;
      },
      set: function(keyOrHash, value) {
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
      }
    };
  });

  app.directive('modalDialog', [
    'ngModalDefaults', '$sce', '$timeout', function(ngModalDefaults, $sce, $timeout) {
      return {
        restrict: 'E',
        scope: {
          show: '=',
          dialogTitle: '@',
          onClose: '&?',
          hideCloseButton: '=',
          closeOnEscape: '=',
          closeOnOutsideClick: '='
        },
        replace: true,
        transclude: true,
        link: function(scope, element, attrs) {
          var bindEscKeyPress, setupCloseButton, setupStyle, unbindEscKeyPress;
          scope.hCB = scope.hideCloseButton === void 0 ? ngModalDefaults.hideCloseButton : scope.hideCloseButton;
          scope.cOE = scope.closeOnEscape === void 0 ? ngModalDefaults.closeOnEscape : scope.closeOnEscape;
          scope.cOOC = scope.closeOnOutsideClick === void 0 ? ngModalDefaults.closeOnOutsideClick : scope.closeOnOutsideClick;
          bindEscKeyPress = function() {
            if (scope.cOE) {
              return document.onkeydown = function(evt) {
                var isEscape;
                evt = evt || window.event;
                isEscape = false;
                if (__indexOf.call(evt, "key") >= 0) {
                  isEscape = evt.key === "Escape" || evt.key === "Esc";
                } else {
                  isEscape = evt.keyCode === 27;
                }
                if (isEscape) {
                  return scope.hideModal();
                }
              };
            }
          };
          unbindEscKeyPress = function() {
            return document.onkeydown = function() {};
          };
          setupCloseButton = function() {
            return scope.closeButtonHtml = $sce.trustAsHtml(ngModalDefaults.closeButtonHtml);
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
            var triggerDigest;
            scope.show = false;
            return triggerDigest = $timeout(function() {
              return $timeout.cancel(triggerDigest);
            });
          };
          scope.$watch('show', function(newVal, oldVal) {
            if (newVal && !oldVal) {
              bindEscKeyPress();
              document.getElementsByTagName("body")[0].style.overflow = "hidden";
            } else {
              unbindEscKeyPress();
              document.getElementsByTagName("body")[0].style.overflow = "";
            }
            if ((!newVal && oldVal) && (scope.onClose != null)) {
              unbindEscKeyPress();
              return scope.onClose();
            }
          });
          setupCloseButton();
          return setupStyle();
        },
        template: "<div class='ng-modal' ng-show='show'>\n  <div class='ng-modal-overlay' ng-click='cOOC && hideModal()'></div>\n  <div class='ng-modal-dialog' ng-style='dialogStyle'>\n    <span class='ng-modal-title' ng-show='dialogTitle && dialogTitle.length' ng-bind='dialogTitle'></span>\n    <div class='ng-modal-close' ng-if='!hCB' ng-click='hideModal()'>\n      <div ng-bind-html='closeButtonHtml'></div>\n    </div>\n    <div class='ng-modal-dialog-content' ng-transclude></div>\n  </div>\n</div>"
      };
    }
  ]);

}).call(this);
