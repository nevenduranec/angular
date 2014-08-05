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
.controller('MainCtrl', function ($scope, $http, $firebase, syncData) {

    $scope.nomz = syncData('nomz');

    $scope.addNom = function(){
        var date  = Date.now();
        $scope.nomz.$add({name: $scope.name, nom: $scope.nom, price: $scope.price, date: date});
    };

    $scope.$watch('nomz', function () {
        $scope.total = 0;
        angular.forEach($scope.nomz, function(item){
            if(item.price){
                $scope.total += item.price;
            }
        });
    }, true);


});
