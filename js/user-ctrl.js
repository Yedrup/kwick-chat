 //User Controller
 function userInfoCtrl(kwickService, $rootScope, $http, $interval) {
     $rootScope.isUserConnected = false;
     var user = this;
     user.formInfo = {};
     // Function signup
     user.signup = function() {
         kwickService
             .register(user.signupInfo.Name, user.signupInfo.Password)
             .then(function(userInfo) {
                 user.signupInfo.Name = "";
                 user.signupInfo.Password = "";
                 console.log("you're now registered");

                 $rootScope.user.id = userInfo.id;
                 $rootScope.user.token = userInfo.token;
                 $rootScope.user.name = user.signupInfo.Name;

                 $rootScope.isUserConnected = true;
             });
     }
     // Function login
     user.login = function() {
         kwickService
             .connect(user.loginInfo.Name, user.loginInfo.Password)
             .then(function(userInfo) {
                 user.loginInfo.Name = "";
                 user.loginInfo.Password = "";
                 console.log("you're now connected");
                 console.log(userInfo);
                 $rootScope.user.id = userInfo.id;
                 $rootScope.user.token = userInfo.token;
                 $rootScope.user.name = user.loginInfo.Name;

                 $rootScope.isUserConnected = true;
             });
     }
 };