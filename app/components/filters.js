'use strict';

tmwcapp.filter('statusString', function() {
  return function(input) {
    switch (input) {
	    case 'CHECKED':
	        return "Bejelentkezett";
	        break;
	    case 'FINISHED':
	        return "Célba ért";
	        break;
        case 'NOTPRESENT':
	        return "Nem jött el";
	        break; 
        case 'DSQ':
	        return "Kizárt";
	        break; 
        case 'DNF':
	        return "Feladta";
	        break; 
        case 'PRE':
	        return "Előnevezett";
	        break; 
        case 'NOTSTARTED':
	        return "Nem indult";
	        break; 
	    default:
	        return "N/A";
	}
  };
});

tmwcapp.filter('gender', function() {
  return function(input) {
    switch (input) {
	    case 'MALE':
	        return "férfi";
	        break;
	    case 'FEMALE':
	        return "nő";
	        break;
	    default:
	        return "N/A";
	}
  };
});

tmwcapp.filter('paymentmethod', function() {
  return function(input) {
    switch (input) {
	    case 'CASH':
	        return "készpénz";
	        break;
	    case 'TRANSFER':
	        return "átutalás";
	        break;
	    default:
	        return "N/A";
	}
  };
});