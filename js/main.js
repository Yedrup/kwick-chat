(function () {
  'use strict';
  var app = angular.module('chatApp', []);

  // Whitlist API
  app.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'http://greenvelvet.alwaysdata.net/kwick/api/**'
    ]);
  });

  app.run(function($rootScope) {
    $rootScope.isUserConnected = false;
    $rootScope.user = {
      id : null,
      token : null,
      name : null
    };
  });

  // API
  app.service('kwickService', function ($http) {
    return {
      status: function () {
        return $http
          .jsonp('http://greenvelvet.alwaysdata.net/kwick/api/ping')
          .then(function(response) {
            return response.data.result;
        })
      },
      connect: function (username, password) {
        return $http
          .jsonp('http://greenvelvet.alwaysdata.net/kwick/api/login/'+username+'/'+password)
          .then(function(response) {
            return response.data.result;
          })
      },
      register: function (username, password) {
        return $http
          .jsonp('http://greenvelvet.alwaysdata.net/kwick/api/signup/'+username+'/'+password)
          .then(function(response) {
            return response.data.result;
          })
      },
      disconnect: function (token, user_id) {
        return $http
          .jsonp('http://greenvelvet.alwaysdata.net/kwick/api/logout/'+token+'/'+user_id)
          .then(function(response) {
            return response.data.result;
          })
      },  
      usersOnline: function (token) {
        return $http
          .jsonp('http://greenvelvet.alwaysdata.net/kwick/api/user/logged/'+token)
          .then(function(response) {
            return response.data.result;
          })
      }, 
      postMessage: function (token, user_id, message) {
        return $http
          .jsonp('http://greenvelvet.alwaysdata.net/kwick/api/say/'+token+'/'+user_id+'/'+message)
          .then(function(response) {
            return response.data.result;
          })
      },  
      getAllMessages: function (token, timestamp) {
        timestamp = timestamp || 0;
        return $http
          .jsonp('http://greenvelvet.alwaysdata.net/kwick/api/talk/list/'+token+'/'+timestamp)
          .then(function(response) {
            return response.data.result;
          })
      },                
    }   
  });
// var storage;
// var dataSaved;
//local storage
// function saveStorage (datas) {
//     var storage;
//     var dataSaved;
//     try {
//       storage = JSON.parse( localStorage.getItem('dataSaved') ) || null;
//     } catch (e) {
//       storage = null;
//     }
//     this.dataSaved = storage;
// }
// function getDatasFromStorage () {

//     try {
//       storage = JSON.parse( localStorage.getItem('dataSaved') ) || null;
//     } catch (e) {
//       storage = null;
//     }
//     this.dataSaved = storage;
// }

  
  app.controller('chatCtrl', function (kwickService, $rootScope) {

    var chat = this;

    chat.listMessages = [];

    kwickService.getAllMessages($rootScope.user.token).then(function(data) {
      console.log(data)
      chat.listMessages = data.talk;
    });

  });

  app.controller('userInfoCtrl', function (kwickService, $rootScope) {
    
    var user = this;

    user.formInfo = {};

    user.signup = function () {
      kwickService
        .register(user.formInfo.Name, user.formInfo.Password)
        .then(function(userInfo) {
          
          $rootScope.user.id = userInfo.id;
          $rootScope.user.token = userInfo.token;
          $rootScope.user.name = user.formInfo.Name;

          $rootScope.isUserConnected = true;
        });
    }
    
    user.login = function () {
      kwickService
        .connect(user.loginInfo.Name, user.loginInfo.Password)
        .then(function(userInfo) {
          
          $rootScope.user.id = userInfo.id;
          $rootScope.user.token = userInfo.token;
          $rootScope.user.name = user.loginInfo.Name;

          $rootScope.isUserConnected = true;
        });
    }
  });

//Directives
  app.directive("connectionForms", function () {
    return {
      templateUrl: "./templates/forms-template.html",
      restrict: "A",

    };
  });

    app.directive("chatFeed", function () {
    return {
      templateUrl: "./templates/chat-feed-template.html",
      restrict: "A"
    };
  });


})();


