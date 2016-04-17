'use strict';

tmwcapp.service('tournamentService', ['$http', '$q', 'AppConfig',
  function($http, $q, AppConfig){
  
    var serviceURL = AppConfig.serviceBaseURL + "tournament";

    return ({
		getTournaments: getTournaments,
        updateTournament: updateTournament,
        createTournament: createTournament,
        deleteTournament: deleteTournament
	});
	
	function getTournaments() {
        var request = $http({
            method: "GET",
            url: serviceURL
        });
        return(request.then(handleSuccess, handleError));
    }

    function updateTournament(tournament) {
        var request = $http({
            method: "PUT",
            url: serviceURL + '/' + tournament.id,
            data: tournament
        });
        return( request.then( handleSuccess, handleError ) );
    }

    function createTournament(tournament) {
        var request = $http({
            method: "POST",
            url: serviceURL,
            data: tournament
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function deleteTournament(tournament) {
        var request = $http({
            method: "DELETE",
            url: serviceURL + '/' + tournament.id
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