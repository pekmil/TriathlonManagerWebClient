'use strict';

tmwcapp.service('raceService', ['$http', '$q', 'AppConfig', 'responseHandler',
  function($http, $q, AppConfig, responseHandler){
  
    var serviceURL = AppConfig.serviceBaseURL + "race";

    return ({
        getRace : getRace,
		getRaces: getRaces,
        getTournamentRaces: getTournamentRaces,
        updateRace: updateRace,
        createRace: createRace,
        deleteRace: deleteRace,
        createRaceadjustment : createRaceadjustment,
        deleteRaceadjustment : deleteRaceadjustment
	});
	
    function getRace(raceId) {
        var request = {
            method: "GET",
            url: serviceURL + '/' + raceId
        };
        return responseHandler.handle(request);
    }

	function getRaces() {
        var request = {
            method: "GET",
            url: serviceURL
        };
        return responseHandler.handle(request);
    }

    function getTournamentRaces(tournamentId) {
        var request = {
            method: "GET",
            url: serviceURL + '/tid/' + tournamentId
        };
        return responseHandler.handle(request);
    }

    function updateRace(race) {
        var request = {
            method: "PUT",
            url: serviceURL + '/' + race.id,
            data: race
        };
        return responseHandler.handle(request);
    }

    function createRace(race) {
        var request = {
            method: "POST",
            url: serviceURL,
            data: race
        };
        return responseHandler.handle(request);
    }
    
    function deleteRace(race) {
        var request = {
            method: "DELETE",
            url: serviceURL + '/' + race.id
        };
        return responseHandler.handle(request);
    }

    function createRaceadjustment(raceadjustment) {
        var request = {
            method: "POST",
            url: serviceURL + "/adjustment",
            data: raceadjustment
        };
        return responseHandler.handle(request);
    }
    
    function deleteRaceadjustment(key) {
        var request = {
            method: "DELETE",
            url: serviceURL + '/' + key.raceId + "/" + key.categoryId + "/" + key.resultmodId
        };
        return responseHandler.handle(request);
    }
	
  }]);