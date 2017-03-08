var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/login', {templateUrl: 'views/login.html', controller: 'loginController'})
        .when('/home', { templateUrl: 'views/home.html', controller: 'homeController'})
        .otherwise({redirectTo: '/login'});
}]);

app.controller('loginController', ["$scope", "$rootScope", "$http", "$location", function ($scope, $rootScope, $http, $location) {
    if($rootScope.logUser == undefined){
        $scope.logoutuser = "nobody"
    }else {
        $scope.logoutuser = $rootScope.logUser.username;
    }
    $scope.login = function () {
        var login_user = {
            "username": $scope.username,
            "password": $scope.password
        };
        $http.post('/login', login_user)
            .success(function (resp) {
                if(resp === "successful"){
                    $location.path('/home');
                }
            })
    }
}]);

app.controller('homeController', ["$scope", "$rootScope", "$http", "$location", function ($scope, $rootScope, $http, $location) {
    $http.get('/isloggedin')
        .success(function (resp) {
            if(!resp){
                $location.path('/login');
            }else {
                $scope.username = resp.username;
                $scope.password = resp.password;
                $rootScope.logUser = resp;
            }
        });
    $scope.logout = function () {
        $http.get('/logout')
            .success(function (resp) {
                if(resp === "successful"){
                    $location.path('/login');
                }
            })
    };
    $scope.update = function () {
        $http.post('/updatepassword', {"password": $scope.password})
            .success(function (resp) {
                
            })
    }
}]);