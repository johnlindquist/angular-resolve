angular.module('starTrekServices', ['ngResource']).
    factory('starTrekResource', function ($resource) {
        var StarTrekResource = $resource('https://api.mongolab.com/api/1/databases' +
                '/johnlindquist/collections/star-trek/',
                {apiKey:'4f0f9e96e4b04ac27016b99a'},
                {monogolabQuery:{method:'GET', params:{q:""}, isArray:true}});


        StarTrekResource.prototype.getCrewByStarship = function (starshipQuery, successCb, failCb) {
            var queryObj = {starship:starshipQuery};
            var query = JSON.stringify(queryObj);
            return StarTrekResource.monogolabQuery({q:query}, successCb, failCb);
        };

        return new StarTrekResource;
    });