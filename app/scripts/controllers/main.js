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
.controller('MainCtrl', function ($rootScope, $scope, $http, syncData, simpleLogin, $timeout, $location, waitForAuth, $document) {

    window.skope = $scope;

    $scope.superUser = $location.$$search.direktornabave;

    var date = new Date(),
        today = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();

    //today = '6-8-2019';

    $scope.restaurants = syncData(today + '/restaurants/');
    $scope.nomz = syncData(today + '/people/');

    waitForAuth.then(function() {
        if (!$rootScope.auth.user) {
            simpleLogin.login('anonymous', function(err, user) {
                $scope.err = err ? err + '' : null;
                $scope.user = user ? user : null;
            });
        }
    });

    $scope.logout = function() {
        $rootScope.auth.$logout();
    };

    $scope.addNom = function(form){
        $scope.nomSubmitted = true;
        if(form.$valid){
            var now = Date.now();
            $scope.nomz.$add({name: $scope.name, nom: $scope.nom, price: $scope.price, date: now, userID: $rootScope.auth.user.id, paid: 0});
            $scope.name = '';
            $scope.nom = '';
            $scope.price = '';
            $scope.form.$setPristine();
            $scope.nomSubmitted = false;
            $scope.hideEditForm('addNom');
        }
    };

    $scope.addRestaurant = function(restaurantForm){
        $scope.restaurantSubmitted = true;
        if(restaurantForm.$valid){
            var now = Date.now();
            $scope.restaurants.$add({name: $scope.restaurantName, url: $scope.restaurantURL, date: now, userID: $rootScope.auth.user.id});
            $scope.restaurantName = '';
            $scope.restaurantURL = '';
            $scope.restaurantForm.$setPristine();
            $scope.restaurantSubmitted = false;
            $scope.hideEditForm('addRestaurant');
        }
    };


    $scope.removeNom = function(id){
        $scope.nomz.$remove(id);
    };

    $scope.removeRestaurant = function(id){
        $scope.restaurants.$remove(id);
    };

    $scope.updateNom = function(id){
        $timeout(function() {
            var now = Date.now();
            $scope.nomz.$save(id, {name: $scope.nomz[id].name, nom: $scope.nomz[id].nom, price: $scope.nomz[id].price, date: now, userID: $rootScope.auth.user.id});
        }, 1000);
    };

    $scope.updateRestaurant = function(id){
        $timeout(function() {
            var now = Date.now();
            $scope.restaurants.$save(id, {name: $scope.restaurants[id].restaurantName, url: $scope.restaurants[id].restaurantURL, date: now});
        }, 1000);
    };

    $scope.$watch('nomz', function () {
        $scope.total = 0;
        $scope.nomzLength = 0;
        angular.forEach($scope.nomz, function(item){
            if(item.price){
                $scope.nomzLength++;
                $scope.total += parseInt(item.price);
            }
        });
    }, true);

    $scope.$watch('restaurants', function () {
        $scope.restaurantsLength = 0;
        angular.forEach($scope.restaurants, function(item){
            if(item.name){
                $scope.restaurantsLength++;
            }
        });
    }, true);


    $scope.showEditForm = function(elem){

        elem = '#' + elem;
        document.querySelector(elem).classList.add('is-visible');
        var tl = new window.TimelineLite();
        tl.to(elem, 0.2, {scale: 1.3, opacity: 1});
        tl.to(elem, 0.2, {scale: 1});

        if(elem === '#addRestaurant' || elem === '#addNom'){
            document.querySelector(elem).querySelector('input').focus();
        }

    };

    $scope.hideEditForm = function(elem){

        elem = '#' + elem;
        document.querySelector(elem).classList.remove('is-visible');
        var tl = new window.TimelineLite();
        tl.to(elem, 0.2, {scale: 1.3, opacity: 1});
        tl.to(elem, 0.2, {scale: 0, opacity: 0});

        $scope.restaurantName = '';
        $scope.restaurantURL = '';
        $scope.restaurantForm.$setPristine();
        $scope.restaurantSubmitted = false;

        $scope.name = '';
        $scope.nom = '';
        $scope.price = '';
        $scope.form.$setPristine();
        $scope.nomSubmitted = false;

    };



    $document.bind('keydown', function(e) {
        if(e.which === 27){
            var visible = document.querySelector('form.is-visible');
            if(visible){
                var elem = visible.getAttribute('id');
                $scope.hideEditForm(elem);
            }
        }
    });



});
