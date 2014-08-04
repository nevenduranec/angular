'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular
.module('angularApp')
.controller('MainCtrl', function ($scope, Restangular, $http, $firebase, firebaseRef) {

    /*
    Restangular.setBaseUrl('https://api.mongolab.com/api/1/databases/angularjs/collections');
    Restangular.setDefaultRequestParams({ apiKey: '4f847ad3e4b08a2eed5f3b54' });

    $scope.test = Restangular.all('projects').getList().$object;

    $scope.test = Restangular.all('projects').one('13').get().then(function(response){
        console.log(response);
    });*/


    /*
    $scope.nomz = [];

    $http.get('nomz.json').then(function(data) {
        $scope.nomz = data.data;
        console.log(data.data);
    });

    $scope.addNom = function(){
        $scope.nomz.push({name: $scope.name, nom: $scope.nom, price: $scope.price});
        $http.get('save.php').then(function(data) {
            console.log(data);
        });
    };
    */


    var ref = firebaseRef('nomz');
    var sync = $firebase(ref);
    console.log(sync);
    $scope.nomz = sync.$asObject();

    console.log($scope.nomz);


});
