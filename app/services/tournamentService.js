'use strict';

tmwcapp.service('tournamentService', ['$http', '$q', 'AppConfig', 'responseHandler',
  function($http, $q, AppConfig, responseHandler){
  
    var serviceURL = AppConfig.serviceBaseURL + "tournament";

    return ({
		getTournaments: getTournaments,
        updateTournament: updateTournament,
        createTournament: createTournament,
        deleteTournament: deleteTournament
	});
	
	function getTournaments() {
        var request = {
            method: "GET",
            url: serviceURL
        };
        return responseHandler.handle(request);
    }

    function updateTournament(tournament) {
        var request = {
            method: "PUT",
            url: serviceURL + '/' + tournament.id,
            data: tournament
        };
        return responseHandler.handle(request);
    }

    function createTournament(tournament) {
        var request = {
            method: "POST",
            url: serviceURL,
            data: tournament
        };
        return responseHandler.handle(request);
    }
    
    function deleteTournament(tournament) {
        var request = {
            method: "DELETE",
            url: serviceURL + '/' + tournament.id
        };
        return responseHandler.handle(request);
    }
	
  }]);