#
# ngModal
# by Adam Albrecht
# http://adamalbrecht.com
#
# Source Code: https://github.com/adamalbrecht/ngModal
#
# Compatible with Angular 1.2.x
#

app = angular.module("ngModal", [])

app.provider "ngModalDefaults", ->
  options: {
    closeButtonHtml: "<span class='ng-modal-close-x'>X</span>"
  }
  $get: ->
    @options

  set: (keyOrHash, value) ->
    if typeof(keyOrHash) == 'object'
      for k, v of keyOrHash
        @options[k] = v
    else
      @options[keyOrHash] = value

app.directive 'modalDialog', ['ngModalDefaults', '$sce', (ngModalDefaults, $sce) ->
  restrict: 'E'
  scope:
    show: '='
    dialogTitle: '@'
    onClose: '&?'
  replace: true
  transclude: true
  link: (scope, element, attrs) ->
    setupCloseButton = ->
      scope.closeButtonHtml = $sce.trustAsHtml(ngModalDefaults.closeButtonHtml)

    setupStyle = ->
      scope.dialogStyle = {}
      scope.dialogStyle['width'] = attrs.width if attrs.width
      scope.dialogStyle['height'] = attrs.height if attrs.height

    scope.hideModal = ->
      scope.show = false

    scope.$watch('show', (newVal, oldVal) ->
      if newVal && !oldVal
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
      else
        document.getElementsByTagName("body")[0].style.overflow = "";
      if (!newVal && oldVal) && scope.onClose?
        scope.onClose()
    )

    setupCloseButton()
    setupStyle()

  template: """
              <div class='ng-modal' ng-show='show'>
                <div class='ng-modal-overlay' ng-click='hideModal()'></div>
                <div class='ng-modal-dialog' ng-style='dialogStyle'>
                  <span class='ng-modal-title' ng-show='dialogTitle && dialogTitle.length' ng-bind='dialogTitle'></span>
                  <div class='ng-modal-close' ng-click='hideModal()'>
                    <div ng-bind-html='closeButtonHtml'></div>
                  </div>
                  <div class='ng-modal-dialog-content' ng-transclude></div>
                </div>
              </div>
            """
]
