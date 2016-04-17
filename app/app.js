'use strict';

var tmwcapp = angular.module('TriathlonManagerWebClient', [
  'ngRoute',
  'ui.bootstrap',
  'ngWebSocket',
]).
config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider
  	.when('/tournaments', {
      templateUrl: 'views/partial/tournament.html',
      controller: 'TournamentCtrl'
    })
    .when('/races', {
      templateUrl: 'views/partial/race.html',
      controller: 'RaceCtrl'
    })
    .when('/races/:tournamentId', {
      templateUrl: 'views/partial/race.html',
      controller: 'RaceCtrl'
    })
    .when('/entries/:raceId', {
      templateUrl: 'views/partial/entry.html',
      controller: 'EntryCtrl'
    })
    .when('/results/:raceId', {
      templateUrl: 'views/partial/result.html',
      controller: 'ResultCtrl'
    })
    .when('/raceresults/:raceId', {
      templateUrl: 'views/partial/raceresult.html',
      controller: 'EntryCtrl'
    })
    .when('/invoices/:raceId', {
      templateUrl: 'views/partial/invoice.html',
      controller: 'InvoiceCtrl'
    })
    .when('/familyentries/:raceId', {
      templateUrl: 'views/partial/familyentry.html',
      controller: 'EntryCtrl'
    })
    .when('/parameters', {
      templateUrl: 'views/partial/parameter.html',
      controller: 'ParameterCtrl'
    })
    .when('/admin', {
      templateUrl: 'views/partial/admin.html',
      controller: 'AdminCtrl'
    })
    .when('/licences', {
      templateUrl: 'views/partial/licence.html',
      controller: 'LicenceCtrl'
    })
  	.otherwise({
      templateUrl: 'views/partial/welcome.html',
      controller: 'WelcomeCtrl'
    }
  	);

	$httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $httpProvider.interceptors.push('httpInterceptor');
}
]).
run(['WSNotification', function(WSNotification) {
  //init the notification service
}]).
constant('AppConfig',
  {
    entryFees : {
      "Újonc" : {
        pre : 2000,
        normal : 4000
      },
      "Gyermek" : {
        pre : 4000,
        normal : 6000
      },
      "Serdülő" : {
        pre : 4000,
        normal : 6000
      },
      "Sprint" : {
        pre : 6000,
        normal : 9000
      },
      "Rövid" : {
        pre : 8000,
        normal : 11000
      }
    },
    carouselImages : [
      {src : 'resources/images/carousel/triathlon-swim.jpg', caption : 'Úszás', desc : ''},
      {src : 'resources/images/carousel/triathlon-bicycle.jpg', caption : 'Biciklizés', desc : ''},
      {src : 'resources/images/carousel/triathlon-run.jpg', caption : 'Futás', desc : ''}
    ],
    serviceBaseURL : 'http://192.168.1.103:8080/TriathlonManager/rest/',
    notificationWSEndpoint : 'ws://192.168.1.103:8080/TriathlonManager/notification'
  }).
value('version', '0.1');
