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
    hideCloseButton: false
    closeOnEscape: true
    closeOnOutsideClick: true
  }
  $get: ->
    @options

  set: (keyOrHash, value) ->
    if typeof(keyOrHash) == 'object'
      for k, v of keyOrHash
        @options[k] = v
    else
      @options[keyOrHash] = value

app.directive 'modalDialog', ['ngModalDefaults', '$sce', '$timeout', (ngModalDefaults, $sce, $timeout) ->
  restrict: 'E'
  scope:
    show: '='
    dialogTitle: '@'
    onClose: '&?'
    hideCloseButton: '='
    closeOnEscape: '='
    closeOnOutsideClick: '='
  replace: true
  transclude: true
  link: (scope, element, attrs) ->
    scope.hCB = if scope.hideCloseButton == undefined then ngModalDefaults.hideCloseButton else scope.hideCloseButton
    scope.cOE = if scope.closeOnEscape == undefined then ngModalDefaults.closeOnEscape else scope.closeOnEscape
    scope.cOOC = if scope.closeOnOutsideClick == undefined then ngModalDefaults.closeOnOutsideClick else scope.closeOnOutsideClick

    bindEscKeyPress = ->
      if scope.cOE
        document.onkeydown = (evt) ->
          evt = evt || window.event
          isEscape = false

          if "key" in evt
            isEscape = evt.key == "Escape" || evt.key == "Esc"
          else
            isEscape = evt.keyCode == 27

          if isEscape
            scope.hideModal()

    unbindEscKeyPress = ->
      document.onkeydown = ->

    setupCloseButton = ->
      scope.closeButtonHtml = $sce.trustAsHtml(ngModalDefaults.closeButtonHtml)

    setupStyle = ->
      scope.dialogStyle = {}
      scope.dialogStyle['width'] = attrs.width if attrs.width
      scope.dialogStyle['height'] = attrs.height if attrs.height

    scope.hideModal = ->
      scope.show = false
      triggerDigest = $timeout(() ->
        $timeout.cancel(triggerDigest);
      )

    scope.$watch('show', (newVal, oldVal) ->
      if newVal && !oldVal
        bindEscKeyPress()
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
      else
        unbindEscKeyPress()
        document.getElementsByTagName("body")[0].style.overflow = "";
      if (!newVal && oldVal) && scope.onClose?
        unbindEscKeyPress()
        scope.onClose()
    )

    setupCloseButton()
    setupStyle()

  template: """
              <div class='ng-modal' ng-show='show'>
                <div class='ng-modal-overlay' ng-click='cOOC && hideModal()'></div>
                <div class='ng-modal-dialog' ng-style='dialogStyle'>
                  <span class='ng-modal-title' ng-show='dialogTitle && dialogTitle.length' ng-bind='dialogTitle'></span>
                  <div class='ng-modal-close' ng-if='!hCB' ng-click='hideModal()'>
                    <div ng-bind-html='closeButtonHtml'></div>
                  </div>
                  <div class='ng-modal-dialog-content' ng-transclude></div>
                </div>
              </div>
            """
]
