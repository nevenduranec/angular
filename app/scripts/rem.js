'use strict';

var viewport = function() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return {
        width : e[ a+'Width' ],
        height : e[ a+'Height' ]
    };
};

var updateVw = function(){

    var vw = (viewport().width/100);

    if(vw > 16) {
        vw = 16;
    }

    //document.documentElement.style.fontSize = vw + 'px';

};

updateVw();

if (window.addEventListener) {
    window.addEventListener('resize', updateVw, false);
} else if (window.attachEvent)  {
    window.attachEvent('resize', updateVw);
}