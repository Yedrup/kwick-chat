(function () {
  'use strict';
  var app = angular.module('chatApp', []);

  app.controller('chatCtrl', function () {
    this.messages = [{'name':'Pippo','text':'Hello'},
            {'name':'Pluto','text':'Hello'},
            {'name':'Pippo','text':'how are you ?'},
            {'name':'Pluto','text':'fine thanks'},
            {'name':'Pluto','text':'Bye'}]
    });


  app.directive("connectionForms", function () {
    return {
      templateUrl: "./templates/forms-template.html",
      restrict: "A"
    };
  });

})();