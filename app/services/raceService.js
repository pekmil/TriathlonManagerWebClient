'use strict';

tmwcapp.service('raceService', ['$http', '$q', 'AppConfig',
  function($http, $q, AppConfig){
  
    var serviceURL = AppConfig.serviceBaseURL + "race";

    return ({
        getRace : getRace,
		getRaces: getRaces,
        getTournamentRaces: getTournamentRaces,
        updateRace: updateRace,
        createRace: createRace,
        deleteRace: deleteRace
	});
	
    function getRace(raceId) {
        var request = $http({
            method: "GET",
            url: serviceURL + '/' + raceId
        });
        return(request.then(handleSuccess, handleError));
    }

	function getRaces() {
        var request = $http({
            method: "GET",
            url: serviceURL
        });
        return(request.then(handleSuccess, handleError));
    }

    function getTournamentRaces(tournamentId) {
        var request = $http({
            method: "GET",
            url: serviceURL + '/tid/' + tournamentId
        });
        return(request.then(handleSuccess, handleError));
    }

    function updateRace(race) {
        var request = $http({
            method: "PUT",
            url: serviceURL + '/' + race.id,
            data: race
        });
        return( request.then( handleSuccess, handleError ) );
    }

    function createRace(race) {
        var request = $http({
            method: "POST",
            url: serviceURL,
            data: race
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function deleteRace(race) {
        var request = $http({
            method: "DELETE",
            url: serviceURL + '/' + race.id
        });
        return( request.then( handleSuccess, handleError ) );
    }

     function handleError( response ) {
        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        if (!angular.isObject( response.data ) || !response.data.msg){
            return($q.reject("Hiba: " + response.status + " - " + response.statusText));
        }
        // Otherwise, use expected error message.
        return( $q.reject( response.data.msg ) );
    }
    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    function handleSuccess( response ) {
        return( response.data );
    }
	
  }]);