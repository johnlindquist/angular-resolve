var app = angular.module('app', []);

app.config(function ($locationProvider, $routeProvider) {
    $routeProvider.when("/", {templateUrl:"partials/home.html"});
    $routeProvider.when("/cat", {
        templateUrl:"partials/cat.html",
        controller :"CatCtrl",
        resolve    :{
            toy:function ($timeout, $q) {
                var defer = $q.defer();

                //delay the response for 2 seconds, then succeed
                $timeout(function () {
                    //you can resolve and pass whatever you want here (use a resource, etc)
                    //the result is passed into the "toy" param in the CatCtrl
                    defer.resolve(
                        {type:"yarn"}
                    );
                }, 2000);

                return defer.promise;
            }
        }

    });
    $routeProvider.when("/dog", {
        templateUrl:"partials/dog.html",
        controller :"DogCtrl",
        resolve    :{
            toy:function ($timeout, $q) {
                var defer = $q.defer();

                //delay the response for 2 seconds, then reject
                $timeout(function () {
                    //the reject message is only useful for the $routeChangeError rejection
                    defer.reject("Dogs don't deserve toys!");
                }, 2000);

                return defer.promise;
            }
        }
    });

    //Even silly demo apps need Easter Eggs :)
    $routeProvider.when("/aquaman", {templateUrl:"partials/aquaman.html"});
});

function CatCtrl($scope, toy) {
    //notice that this is triggered AFTER the route has successfull changed
    //this means you can prepare any data in the "toy" that you want
    alert("CatCtrl ready - The cat likes: " + toy.type);
}
function DogCtrl($scope, toy) {
    //this will never happen since we're intentionally failing the route change
    alert("DogCtrl ready - The dog likes: " + toy.type);
}

function AppCtrl($scope, $rootScope, $location) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        $scope.alertType = "alert-info";
        $scope.alertMessage = "Changing routes";
        $scope.active = "progress-striped active";
    });
    $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
        $scope.alertType = "alert-success";
        $scope.alertMessage = "Successfully changed routes :)";
        $scope.active = "";
    });
    $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
        alert(rejection);
        $scope.alertType = "alert-error";
        $scope.alertMessage = "Failed to change routes :(";
        $scope.active = "";
    });

    $scope.alertType = "alert-info";
    $scope.alertMessage = "Welcome to the resolve demo";

    $scope.tabs = [
        {
            title:"Home - No Resolve",
            url  :"#/"
        },
        {
            title:"Cats Succeed",
            url  :"#/cat"
        },
        {
            title:"Dogs Fail",
            url  :"#/dog"
        }
    ];

    $scope.checkActive = function (url) {
        if (url == "#" + $location.path()) {
            return "active";
        } else {
            return "";
        }
    };
}
