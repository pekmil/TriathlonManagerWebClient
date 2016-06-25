'use strict';

tmwcapp.service('entryService', ['$http', '$q', 'AppConfig',
  function($http, $q, AppConfig){
  
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
        getRaceResults : getRaceResults,
        getRaceFamilyEntries : getRaceFamilyEntries
	});

    function getRaceEntries(raceId) {
        var request = $http({
            method: "GET",
            url: serviceURL + '/rid/' + raceId
        });
        return(request.then(handleSuccess, handleError));
    }

    function getFinishedResults(raceId) {
        var request = $http({
            method: "GET",
            url: serviceURL + '/finishedresults/' + raceId
        });
        return(request.then(handleSuccess, handleError));
    }

    function getRaceResults(raceId, params) {
        var categoryId = params.selectedCategory ? params.selectedCategory.id : 0;
        var national = params.national ? 1 : 0;
        var absolute = params.absolute ? 1 : 0;
        var team = params.team ? 1 : 0;
        var family = params.family ? 1 : 0;
        var request = $http({
            method: "GET",
            url: serviceURL + '/raceresults/' + raceId + '/' + categoryId + '?national=' + national + '&absolute=' + absolute + '&team=' + team + '&family=' + family
        });
        return(request.then(handleSuccess, handleError));
    }

    function getEntry(raceId, racenum) {
        var request = $http({
            method: "GET",
            url: serviceURL + '/raceid/' + raceId + '/racenum/' + racenum
        });
        return(request.then(handleSuccess, handleError));
    }

    function updateEntry(entry) {
        var request = $http({
            method: "PUT",
            url: serviceURL,
            data: entry
        });
        return( request.then( handleSuccess, handleError ) );
    }

    function updateContestant(contestant) {
        if(contestant.club !== undefined && contestant.club !== null && contestant.club.name === ''){
            delete contestant.club;
        }
        var request = $http({
            method: "PUT",
            url: contestantServiceURL + '/' + contestant.id,
            data: contestant
        });
        return( request.then( handleSuccess, handleError ) );
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
        var request = $http({
            method: "POST",
            url: serviceURL + '/' + raceId,
            data: entryData
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function deleteEntry(entry) {
        var request = $http({
            method: "DELETE",
            url: serviceURL + '/raceid/' + entry.key.raceId + '/racenum/' + entry.key.racenum
        });
        return( request.then( handleSuccess, handleError ) );
    }

     function postResult(raceId, resultData) {
        var request = $http({
            method: "POST",
            url: serviceURL + '/result/' + raceId,
            data: resultData
        });
        return( request.then( handleSuccess, handleError ) );
    }

     function applyResultmod(raceId, resultData) {
        var request = $http({
            method: "POST",
            url: serviceURL + '/resultmod/' + raceId,
            data: resultData
        });
        return( request.then( handleSuccess, handleError ) );
    }

    function getRaceFamilyEntries(raceId) {
        var request = $http({
            method: "GET",
            url: familyentryServiceURL + '/rid/' + raceId
        });
        return(request.then(handleSuccess, handleError));
    }

    function processCSVEntries(raceId, uploadedFileName){
        var request = $http({
            method : 'POST',
            url : serviceURL + '/processcsv/' + raceId,
            data : $.param({filename : uploadedFileName}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return( request.then( handleSuccess, handleError ) );
    }

     function handleError( response ) {
        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        if (!angular.isObject( response.data ) || !response.data.msg){
            return($q.reject({type : "error", msg : "Hiba: " + response.status + " - " + response.statusText}));
        }
        // Otherwise, use expected error message.
        return( $q.reject( response.data ) );
    }
    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    function handleSuccess( response ) {
        return( response.data );
    }
	
  }]);