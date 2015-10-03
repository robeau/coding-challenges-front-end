/**
 * Created by natalie on 10/1/2015.
 */

angular.module('buddyApp', ['buddyApp.home', 'buddyApp.signup', 'ui.router']).config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('/', {
            url: '/',
            templateUrl: 'app/index/_index.html',
            controller: 'HomeController'
        })
        .state('home', {
            url: '/home',
            templateUrl: 'app/home/_home.html',
            controller: 'HomeController'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'app/signup/_signup.html',
            controller: 'SignupController',
            reloadOnSearch: false
        })
        .state('success', {
            url: '/success',
            templateUrl: 'app/signup/_success.html',
            controller: 'SignupController',
            reloadOnSearch: false
        });
    $urlRouterProvider.otherwise('/');
});