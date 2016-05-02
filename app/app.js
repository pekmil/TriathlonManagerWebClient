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
value('version', '0.1');
