'use strict';

tmwcapp.service('entryService', ['$http', '$q', 'AppConfig', 'responseHandler',
  function($http, $q, AppConfig, responseHandler){
  
    var serviceURL = AppConfig.serviceBaseURL + "entry";
    var contestantServiceURL = AppConfig.serviceBaseURL + "contestant";
    var familyentryServiceURL = AppConfig.serviceBaseURL + "familyentry";

    return ({
        getRaceEntries: getRaceEntries,
        updateEntry: updateEntry,
        createEntry: createEntry,
        deleteEntry: deleteEntry,
        getEntry : getEntry,
        updateContestant : updateContestant,
        processCSVEntries : processCSVEntries,
        getFinishedResults : getFinishedResults,
        postResult : postResult,
        applyResultmod : applyResultmod,
        getRaceResultsObject : getRaceResultsObject,
        getRaceResultsExcel : getRaceResultsExcel,
        getRaceFamilyEntries : getRaceFamilyEntries,
        getStartlist : getStartlist
	});

    function getRaceEntries(raceId) {
        var request = {
            method: "GET",
            url: serviceURL + '/rid/' + raceId
        };
        return responseHandler.handle(request);
    }

    function getFinishedResults(raceId) {
        var request = {
            method: "GET",
            url: serviceURL + '/finishedresults/' + raceId
        };
        return responseHandler.handle(request);
    }

    function getStartlist(raceId, categoryId) {
        var request = {
            method: "GET",
            url: serviceURL + '/startlist/' + raceId + '/' + categoryId
        };
        return responseHandler.handle(request);
    }

    function getRaceResults(raceId, params, endpoint) {
        var categoryId = params.selectedCategory ? params.selectedCategory.id : 0;
        var resultParams = {
            national : params.national,
            absolute : params.absolute,
            team : params.team,
            family : params.family
        }
        var request = {
            method: "POST",
            url: serviceURL + '/' + endpoint + '/' + raceId + '/' + categoryId,
            data: resultParams
        };
        return responseHandler.handle(request);
    }

    function getRaceResultsObject(raceId, params) {
        return getRaceResults(raceId, params, 'raceresults');
    }

    function getRaceResultsExcel(raceId, params) {
        return getRaceResults(raceId, params, 'resultlist');
    }

    function getEntry(raceId, racenum) {
        var request = {
            method: "GET",
            url: serviceURL + '/raceid/' + raceId + '/racenum/' + racenum
        };
        return responseHandler.handle(request);
    }

    function updateEntry(entry) {
        var request = {
            method: "PUT",
            url: serviceURL,
            data: entry
        };
        return responseHandler.handle(request);
    }

    function updateContestant(contestant) {
        if(contestant.club !== undefined && contestant.club !== null && contestant.club.name === ''){
            delete contestant.club;
        }
        var request = {
            method: "PUT",
            url: contestantServiceURL + '/' + contestant.id,
            data: contestant
        };
        return responseHandler.handle(request);
    }

    function createEntry(raceId, entry) {
        var entryData = {
            birthYear : entry.contestant.birthyear,
            fromTown : entry.contestant.fromtown,
            gender : entry.contestant.gender,
            name : entry.contestant.name,
            agegroup : entry.agegroup.name,
            category : entry.category.name,
            racenum : entry.key.racenum,
            preentry : false,
            status : 'CHECKED',
            licencenum : entry.licencenum,
            paid : entry.paid            
        };
        if(entry.contestant.club && entry.contestant.club.name){
            entryData.clubName = entry.contestant.club.name;
        }
        var request = {
            method: "POST",
            url: serviceURL + '/' + raceId,
            data: entryData
        };
        return responseHandler.handle(request);
    }
    
    function deleteEntry(entry) {
        var request = {
            method: "DELETE",
            url: serviceURL + '/raceid/' + entry.key.raceId + '/racenum/' + entry.key.racenum
        };
        return responseHandler.handle(request);
    }

     function postResult(raceId, resultData) {
        var request = {
            method: "POST",
            url: serviceURL + '/result/' + raceId,
            data: resultData
        };
        return responseHandler.handle(request);
    }

     function applyResultmod(raceId, resultData) {
        var request = {
            method: "POST",
            url: serviceURL + '/resultmod/' + raceId,
            data: resultData
        };
        return responseHandler.handle(request);
    }

    function getRaceFamilyEntries(raceId) {
        var request = {
            method: "GET",
            url: familyentryServiceURL + '/rid/' + raceId
        };
        return responseHandler.handle(request);
    }

    function processCSVEntries(raceId, uploadedFileName){
        var request = {
            method : 'POST',
            url : serviceURL + '/processcsv/' + raceId,
            data : $.param({filename : uploadedFileName}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        };
        return responseHandler.handle(request);
    }
	
  }]);