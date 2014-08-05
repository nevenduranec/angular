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
.controller('MainCtrl', function ($rootScope, $scope, $http, syncData, simpleLogin, $timeout) {

    var date = new Date(),
        today = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();

    //today = '6-8-2014';

    $scope.nomz = syncData(today);

    $scope.login = function(service) {
        simpleLogin.login(service, function(err, user) {
            $scope.err = err ? err + '' : null;
            $scope.user = user ? user : null;
        });
    };

    $scope.logout = function() {
        $rootScope.auth.$logout();
    };

    $scope.addNom = function(form){
        if(form.$valid){
            var now = Date.now();
            $scope.nomz.$add({name: $scope.name, nom: $scope.nom, price: $scope.price, date: now, userID: $rootScope.auth.user.id});
            $scope.name = '';
            $scope.nom = '';
            $scope.price = '';
            $scope.form.$setPristine();
        }
    };


    $scope.removeNom = function(id){
        $scope.nomz.$remove(id);
    };

    $scope.updateNom = function(id){
        $timeout(function() {
            var now = Date.now();
            $scope.nomz.$save(id, {name: $scope.nomz[id].name, nom: $scope.nomz[id].nom, price: $scope.nomz[id].price, date: now, userID: $rootScope.auth.user.id});
        }, 1000);
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
