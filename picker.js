/* jshint browser: true, -W030, devel: true */

var colors = '#ff0000,#ff0400,#ff0900,#ff0d00,#ff1100,#ff1500,#ff1a00,#ff1e00,#ff2200,#ff2600,#ff2b00,#ff2f00,#ff3300,#ff3700,#ff3c00,#ff4000,#ff4400,#ff4800,#ff4d00,#ff5100,#ff5500,#ff5900,#ff5e00,#ff6200,#ff6600,#ff6a00,#ff6e00,#ff7300,#ff7700,#ff7b00,#ff8000,#ff8400,#ff8800,#ff8c00,#ff9100,#ff9500,#ff9900,#ff9d00,#ffa200,#ffa600,#ffaa00,#ffae00,#ffb300,#ffb700,#ffbb00,#ffbf00,#ffc300,#ffc800,#ffcc00,#ffd000,#ffd500,#ffd900,#ffdd00,#ffe100,#ffe500,#ffea00,#ffee00,#fff200,#fff700,#fffb00,#ffff00,#fbff00,#f6ff00,#f2ff00,#eeff00,#eaff00,#e6ff00,#e1ff00,#ddff00,#d9ff00,#d4ff00,#d0ff00,#ccff00,#c8ff00,#c3ff00,#bfff00,#bbff00,#b7ff00,#b2ff00,#aeff00,#aaff00,#a6ff00,#a1ff00,#9dff00,#99ff00,#95ff00,#91ff00,#8cff00,#88ff00,#84ff00,#80ff00,#7bff00,#77ff00,#73ff00,#6eff00,#6aff00,#66ff00,#62ff00,#5eff00,#59ff00,#55ff00,#51ff00,#4cff00,#48ff00,#44ff00,#40ff00,#3bff00,#37ff00,#33ff00,#2fff00,#2bff00,#26ff00,#22ff00,#1eff00,#1aff00,#15ff00,#11ff00,#0dff00,#08ff00,#04ff00,#00ff00,#00ff04,#00ff09,#00ff0d,#00ff11,#00ff15,#00ff19,#00ff1e,#00ff22,#00ff26,#00ff2b,#00ff2f,#00ff33,#00ff37,#00ff3c,#00ff40,#00ff44,#00ff48,#00ff4d,#00ff51,#00ff55,#00ff59,#00ff5e,#00ff62,#00ff66,#00ff6a,#00ff6f,#00ff73,#00ff77,#00ff7b,#00ff80,#00ff84,#00ff88,#00ff8c,#00ff91,#00ff95,#00ff99,#00ff9d,#00ffa2,#00ffa6,#00ffaa,#00ffae,#00ffb3,#00ffb7,#00ffbb,#00ffbf,#00ffc4,#00ffc8,#00ffcc,#00ffd0,#00ffd5,#00ffd9,#00ffdd,#00ffe1,#00ffe6,#00ffea,#00ffee,#00fff2,#00fff7,#00fffb,#00ffff,#00fbff,#00f6ff,#00f2ff,#00eeff,#00eaff,#00e5ff,#00e1ff,#00ddff,#00d9ff,#00d4ff,#00d0ff,#00ccff,#00c8ff,#00c3ff,#00bfff,#00bbff,#00b7ff,#00b2ff,#00aeff,#00aaff,#00a6ff,#00a1ff,#009dff,#0099ff,#0095ff,#0091ff,#008cff,#0088ff,#0084ff,#007fff,#007bff,#0077ff,#0073ff,#006eff,#006aff,#0066ff,#0062ff,#005eff,#0059ff,#0055ff,#0051ff,#004cff,#0048ff,#0044ff,#0040ff,#003bff,#0037ff,#0033ff,#002fff,#002bff,#0026ff,#0022ff,#001eff,#0019ff,#0015ff,#0011ff,#000dff,#0008ff,#0004ff,#0000ff,#0400ff,#0800ff,#0d00ff,#1100ff,#1500ff,#1900ff,#1e00ff,#2200ff,#2600ff,#2a00ff,#2f00ff,#3300ff,#3700ff,#3c00ff,#4000ff,#4400ff,#4800ff,#4d00ff,#5100ff,#5500ff,#5900ff,#5e00ff,#6200ff,#6600ff,#6a00ff,#6e00ff,#7300ff,#7700ff,#7b00ff,#7f00ff,#8400ff,#8800ff,#8c00ff,#9000ff,#9500ff,#9900ff,#9d00ff,#a200ff,#a600ff,#aa00ff,#ae00ff,#b300ff,#b700ff,#bb00ff,#bf00ff,#c300ff,#c800ff,#cc00ff,#d000ff,#d400ff,#d900ff,#dd00ff,#e100ff,#e500ff,#ea00ff,#ee00ff,#f200ff,#f600ff,#fb00ff,#ff00ff,#ff00fb,#ff00f6,#ff00f2,#ff00ee,#ff00ea,#ff00e6,#ff00e1,#ff00dd,#ff00d9,#ff00d4,#ff00d0,#ff00cc,#ff00c8,#ff00c3,#ff00bf,#ff00bb,#ff00b7,#ff00b2,#ff00ae,#ff00aa,#ff00a6,#ff00a1,#ff009d,#ff0099,#ff0095,#ff0091,#ff008c,#ff0088,#ff0084,#ff0080,#ff007b,#ff0077,#ff0073,#ff006e,#ff006a,#ff0066,#ff0062,#ff005d,#ff0059,#ff0055,#ff0051,#ff004c,#ff0048,#ff0044,#ff0040,#ff003b,#ff0037,#ff0033,#ff002f,#ff002b,#ff0026,#ff0022,#ff001e,#ff001a,#ff0015,#ff0011,#ff000d,#ff0008,#ff0004'.split(',');


//create CSS
var head = document.head || document.getElementsByTagName('head')[0];
var style = document.createElement('style');
style.type = 'text/css';
var gradient = colors.map(function(el, i){
    return el + ' ' + ((i+1)/360 * 100) + '%';
});

//var gradient = 'red 0%, orange 15%, yellow 30%, green 45%, blue 60%, indigo 75%, violet 100%'
// hue gradient
var css = '.t-picker-gradient{ background: -webkit-linear-gradient(left, ' + gradient + ');}';
// lightness gradient
css += '';

//insert CSS into the stylesheet and head
(style.styleSheet) ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css));
//insert stylesheet into head
head.appendChild(style);

//#element {  
//    background: linear-gradient(top, red 0%, orange 15%, yellow 30%, green 45%, blue 60%, indigo 75%, violet 100%);  
//}

// https://gist.github.com/catdad/9399313
var ready = function(){
    var translateTemplate = 'translate3d({{x}}px, {{y}}px, 0px)';
    var picker = document.querySelector('.t-picker-gradient');
    var selector = document.querySelector('.t-selector');
    
    
    function setSelectorLocation(ev){
        var x = ev.layerX;
        var y = ev.layerY;
        
//        console.log(x, y);
        
        var translateText = translateTemplate.replace('{{x}}', x - 7).replace('{{y}}', y - 7);
        selector.style.transform = translateText;
        
        
    }
    
    function onmousedown(ev){
    
        setSelectorLocation(ev);
        
        var onmousemove = function(ev){
            setSelectorLocation(ev);
        
        };
        var onmouseup = function(ev){
        
            setSelectorLocation(ev);
        
            picker.removeEventListener('mousemove', onmousemove);
            picker.removeEventListener('mouseup', onmouseup);
        };
        
        picker.addEventListener('mousemove', onmousemove);
        picker.addEventListener('mouseup', onmouseup);
    }
    
    picker.addEventListener('mousedown', onmousedown);
    
    
    
};
var readyCheck = function(){ (document.readyState === 'complete') && ready(); };
//check for when the document is ready
if (document.addEventListener) document.addEventListener('readystatechange', readyCheck, false);
else document.attachEvent('onreadystatechange', readyCheck);