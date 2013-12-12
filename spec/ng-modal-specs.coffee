"use strict"

describe "ngModal", ->
  beforeEach angular.mock.module("ngModal")
  describe 'modal-dialog', ->
    element = undefined
    $scope = undefined
    describe 'Given a basic modal dialog', ->
      beforeEach angular.mock.inject(($compile, $rootScope) ->
        $scope = $rootScope
        $scope.shown = false
        element = $compile("<modal-dialog show-on='shown'><h1>My Content</h1></modal-dialog>")($scope)
      )

      it 'is hidden by default since shown is false'
      describe 'and the shown variable is set to true', ->
        beforeEach ->
          $scope.shown = true

        it 'is displayed'
        it 'is hidden when the close button is clicked'
        it 'is hidden when the overlay is clicked'
