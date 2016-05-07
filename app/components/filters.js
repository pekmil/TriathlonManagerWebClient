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