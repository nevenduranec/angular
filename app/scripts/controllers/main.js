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

    $scope.superUser = false;

    var date = new Date(),
        today = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();

    //today = '1-1-1111';

    $scope.restaurants = syncData(today + '/restaurants/');
    $scope.nomz = syncData(today + '/people/');

    simpleLogin.init();

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
            $scope.nomz.$add({name: $scope.name, nom: $scope.nom, price: $scope.price, date: now, userID: $rootScope.auth.user.id, paid: false});
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
            $scope.nomz.$save(id, {name: $scope.nomz[id].name, nom: $scope.nomz[id].nom, price: $scope.nomz[id].price, date: now, userID: $rootScope.auth.user.id, paid: $scope.nomz[id].paid});
        }, 500);
    };

    $scope.updateRestaurant = function(id){
        $timeout(function() {
            var now = Date.now();
            $scope.restaurants.$save(id, {name: $scope.restaurants[id].restaurantName, url: $scope.restaurants[id].restaurantURL, date: now});
        }, 500);
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


    $scope.showEditForm = function(elem, id){

        if (id) {
            $scope.nom = $scope.nomz[id].nom;
            $scope.price = $scope.nomz[id].price;
        }

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
                visible.querySelector('.cancel').click();
            }
        }

    });



    window.cheet('a d m i n enter', function () {
        window.cheet.disable('a d m i n enter');
        $scope.superUser = true;
        $scope.$apply();
    });



    if (window.annyang) { // So much fun :D

        window.annyang.setLanguage('hr-HR');

        var commands = {
            'gladan sam': function() {
                $scope.showEditForm('addNom');
            },
            'gladna sam': function() {
                $scope.showEditForm('addNom');
            },
            'naruči': function(){
                document.querySelector('#addNom').querySelector('.save').click();
            }
        };

        window.annyang.addCommands(commands);
        window.annyang.start();
    }



});
