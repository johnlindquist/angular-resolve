var app = angular.module('app', ['starTrekServices']);

app.config(function ($locationProvider, $routeProvider) {
    $routeProvider.when("/", {templateUrl:"partials/home.html"});

    $routeProvider.when("/:starship", {
        templateUrl:"partials/starship.html",
        controller :function ($scope, $routeParams, crew) {
            $scope.img = $routeParams.starship + ".jpg";
            $scope.crew = crew;
        },
        resolve    :{
            crew:function ($q, $route, $timeout, starTrekResource) {
                var deferred = $q.defer();

                var starship = $route.current.params.starship;

                var successCb = function (result) {
                    if (angular.equals(result, [])) {
                        deferred.reject("No starship found by that name");
                    }
                    else {
                        deferred.resolve(result);
                    }
                };
                //the timeout is only to exaggerate the example, it's completely unnecessary
                $timeout(function () {
                    starTrekResource.getCrewByStarship(starship, successCb);
                }, 2000);

                return deferred.promise;
            }
        }

    });
});

function AppCtrl($scope, $rootScope, $location) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        $scope.alertType = "";
        $scope.alertMessage = "Loading...";
        $scope.active = "progress-striped active progress-warning";
    });
    $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
        $scope.alertType = "alert-success";
        $scope.alertMessage = "Successfully changed routes :)";
        $scope.active = "progress-success";

        $scope.newLocation = $location.path();
    });
    $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
        alert("ROUTE CHANGE ERROR: " + rejection);
        $scope.alertType = "alert-error";
        $scope.alertMessage = "Failed to change routes :(";
        $scope.active = "";
    });

    $scope.alertType = "alert-info";
    $scope.alertMessage = "Welcome to the resolve demo";

    $scope.tabs = [
        {
            title:"Home",
            url  :"#/"
        },
        {
            title:"Enterprise-D",
            url  :"#/Enterprise-D"
        },
        {
            title:"Voyager",
            url  :"#/Voyager"
        }
    ];

    $scope.checkActive = function (url) {
        if (url == "#" + $scope.newLocation) {
            return "active";
        } else {
            return "";
        }
    };


}
