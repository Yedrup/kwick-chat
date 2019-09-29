 //User Controller
 function userInfoCtrl(kwickService, $rootScope, $http, $interval, $scope) {
     $rootScope.isUserConnected = false;
     var user = this;
     user.formInfo = {};
     // Function signup
     $scope.$watch(function (rootScope) {
             return rootScope.displayErrorMessage;
         },
         function (newValue, oldValue) {
             if (newValue !== null) {
                 $rootScope.displayErrorMessage = newValue;
             } else {
                $rootScope.displayErrorMessage = null;
             }
         }
     );

     user.signup = function () {
         kwickService
             .register(user.signupInfo.Name, user.signupInfo.Password)
             .then(function (userInfo) {
                 if (userInfo.status !== "failure") {
                     $rootScope.displayErrorMessage = null;
                     user.signupInfo.Name = "";
                     user.signupInfo.Password = "";

                     $rootScope.user.id = userInfo.id;
                     $rootScope.user.token = userInfo.token;
                     $rootScope.user.name = user.signupInfo.Name;

                     $rootScope.isUserConnected = true;
                 } else {
                     $rootScope.displayErrorMessage = userInfo.message;
                     $rootScope.isUserConnected = false;
                 }
             }).catch(function (error) {
                 console.error('error ==>', error);
             });
     }
     // Function login
     user.login = function () {
         kwickService
             .connect(user.loginInfo.Name, user.loginInfo.Password)
             .then(function (userInfo) {
                 if (userInfo.status !== "failure") {
                     $rootScope.displayErrorMessage = null;
                     user.loginInfo.Name = "";
                     user.loginInfo.Password = "";
                     $rootScope.user.id = userInfo.id;
                     $rootScope.user.token = userInfo.token;
                     $rootScope.user.name = user.loginInfo.Name;

                     $rootScope.isUserConnected = true;
                 } else {
                     $rootScope.displayErrorMessage = userInfo.message;
                     $rootScope.isUserConnected = false;
                 }
             }).catch(function (error) {
                 console.error('error ==>', error);
             });
     }
 };