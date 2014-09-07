/* jshint browser: true, -W030, devel: true */
/* global Color */

!function(){
    // Events module
    // https://gist.github.com/catdad/9acd13dd3a8a34a79de6
    var EventEmitter = function(){
        var events = {};

        this.on = function(name, callback){
            name = name.toLowerCase();
            events[name] = events[name] || [];
            events[name].push(callback);

            return this;
        };

        this.off = function(name, callback){
            name = name.toLowerCase();
            if (name in events === false) return this;
            events[name].splice(events[name].indexOf(callback), 1);
            return this;
        };

        this.once = function(name, callback){
            function disposable(){
                this.off(name, disposable);
                callback.apply(this, arguments);
            }

            this.on(name, disposable);
        };

        this.trigger = function(name){
            var that = this, args = arguments;
            name = name.toLowerCase();

            if (name in events === false) return this;
            events[name].forEach(function(fn){
                fn.apply(that, [].slice.call(args, 1));
            });
        };

        this.asyncTrigger = function(name){
            var args = arguments, that = this;
            setTimeout(function(){
                that.trigger.apply(that, args);
            }, 0);
        };
    };
    
    // browser CSS prefix module
    // https://gist.github.com/catdad/cd88c43d916e4602ad1a
    var prefix = (function(){
        var styles = window.getComputedStyle(document.documentElement, '');
        var matches = [].slice.call(styles).join(' ').match(/-(moz|webkit|ms|o)-/);
        return (matches) ? matches.shift() : null;
    })();
    console.log('browser prefix:', prefix);
    
    // ***********************
    // CREATE CSS
    // ***********************
    var colors = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'];
    
    var percent = 100 / (colors.length - 1);
    var gradient = colors.map(function(el, i){
        return el + ' ' + (percent * i) + '%';
    });
    
    //create CSS
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    
    var hueGradientTemplate = '-webkit-linear-gradient(left, ' + gradient + ')';
    var saturationGradientTemplate = '-webkit-gradient(linear, left top, left bottom, from({{from}}), to({{to}}))';
    var valueGradientTemplate = '-webkit-gradient(linear, left top, left bottom, from(rgba(255,255,255,{{saturation}})), to(rgba(0,0,0,1)))'; 
    var translateTemplate = 'translate3d({{x}}px, {{y}}px, 0px)';
    
    // hue gradient
    var css = '.t-picker-hue{ background-image: ' + hueGradientTemplate + ';}';
    // lightness gradient
    css += '.t-picker-value{ background-image: ' + valueGradientTemplate.replace('{{saturation}}', 0) + '; }';
    // saturation gradient
    css += '.t-picker-saturation{ background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#000000)); }';
    
    
    css += '.t-picker-hue{ position: relative; display: inline-block; }';
    css += '.t-picker-value{ z-index: 1; position: absolute; top: 0; left: 0; width: 100%; height: 100%; }';
    css += '.t-picker-saturation{ position: relative; display: inline-block; margin: 0 0 0 10px; }';
    
    css += '.t-selector{ position: absolute; top: 0; left: 0; border: 2px solid black; box-shadow: 0 0 0 2px white, 0 0 10px 2px black; -webkit-user-select: none; z-index: 2; }';
    css += '.t-hue-selector{ width: 10px; height: 10px; border-radius: 15px; transform: translate3d(-6px, -6px, 0px); }';
    css += '.t-saturation-selector{ width: 100%; height: 6px; border-radius: 1px; transform: translate3d(-2px, -5px, 0px); }';
    
    //insert CSS into the stylesheet and head
    (style.styleSheet) ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css));
    //insert stylesheet into head
    head.appendChild(style);

    // ***************************
    // HELPERS
    // ***************************
    function isDomNode (o) {
        return o && o.nodeType === 1;   
    }
    
    function Div(className){
        var div = document.createElement('div');
        div.className = className;
        return div;
    }

    // ***************************
    // PICKER MODULE
    // ***************************
    var Picker = function(domElem, value){
        if (typeof domElem === 'string') {
            domElem = document.querySelector(domElem);   
        }
        
        // inherit from EventEmitter
        EventEmitter.call(this);
        var that = this;
        
        // check to make sure we have an actual DOM node
        if (!isDomNode(domElem)) throw new TypeError(domElem + ' is not an HTMLElement');
        
        var DOM = {
            huePicker: Div('t-picker-hue'),
            valuePicker: Div('t-picker-value'),
            saturationPicker: Div('t-picker-saturation'),

            hueSelector: Div('t-selector t-hue-selector'),
            saturationSelector: Div('t-selector t-saturation-selector'),

            huePickerBB: {},
            saturationPickerBB: {}
        };
        
        var h = 0, s = 0, v = 100;
        
        function setColor(){
            // calculate new color
            var color = Color.fromHSV({
                h: h,
                s: 1 - (s/100),
                v: 1 - (v/100)
            });

            // calculate from and to colors for saturation gradient
            var fromColor = Color.fromHSV({
                h: h,
                s: 1,
                v: 1 - (v/100)
            });
            var toColor = Color.fromHSV({
                h: h,
                s: 0,
                v: 1 - (v/100)
            });

            // set saturation gradient
            DOM.saturationPicker.style.backgroundImage = saturationGradientTemplate.replace('{{from}}', fromColor.CSS()).replace('{{to}}', toColor.CSS());
            // set value gradient
            DOM.valuePicker.style.backgroundImage = valueGradientTemplate.replace('{{saturation}}', (s/100));
            // note: hue gradient never changes
            
            // fire ColorChange event
            that.asyncTrigger(pickerGlobal.Event.ColorChange, color.CSS());
        }
        
        function setSelectorLocation(ev){
            var x = ev.layerX || ev.clientX - DOM.huePickerBB.left;
            var y = ev.layerY || ev.clientY - DOM.huePickerBB.top;

            if (x > DOM.huePickerBB.width) x = DOM.huePickerBB.width;
            else if (x < 0) x = 0;
            if (y > DOM.huePickerBB.height) y = DOM.huePickerBB.height;
            else if (y < 0) y = 0;

            h = (x/DOM.huePickerBB.width) * 360;
            v = (y/DOM.huePickerBB.height) * 100;

            setColor();

            DOM.hueSelector.style.transform = translateTemplate.replace('{{x}}', x - 7).replace('{{y}}', y - 7);
        }

        function setSaturationSelector(ev){
            var y = ev.layerY || ev.clientY - DOM.huePickerBB.top;

            if (y > DOM.saturationPickerBB.height) y = DOM.saturationPickerBB.height;
            else if (y < 0) y = 0;

            s = (y/DOM.saturationPickerBB.height) * 100;

            setColor();

            DOM.saturationSelector.style.transform = translateTemplate.replace('{{x}}', -2).replace('{{y}}', y - 5);
        }
        
        // add event listeners
        function onHueStart(event){
            var onmove = function(ev){
                ev.preventDefault();
                setSelectorLocation(ev);
            };

            var onend = function(ev){
                DOM.huePicker.removeEventListener('mousemove', onmove);
                DOM.huePicker.removeEventListener('mouseup', onend);
                DOM.huePicker.removeEventListener('mouseleave', onend);
            };

            onmove(event);
            
            // register move and end listeners
            DOM.huePicker.addEventListener('mousemove', onmove);
            DOM.huePicker.addEventListener('mouseup', onend);
            DOM.huePicker.addEventListener('mouseleave', onend);
        }
        
        function onSaturationStart(event){
            var onmove = function(ev){
                ev.preventDefault();
                setSaturationSelector(ev);
            };

            var onend = function(ev){
                DOM.saturationPicker.removeEventListener('mousemove', onmove);
                DOM.saturationPicker.removeEventListener('mouseup', onend);
                DOM.saturationPicker.removeEventListener('mouseleave', onend);
            };

            onmove(event);
            
            // register move and end listeners
            DOM.saturationPicker.addEventListener('mousemove', onmove);
            DOM.saturationPicker.addEventListener('mouseup', onend);
            DOM.saturationPicker.addEventListener('mouseleave', onend);
        }
        
        // register start listeners
        DOM.huePicker.addEventListener('mousedown', onHueStart);
        DOM.saturationPicker.addEventListener('mousedown', onSaturationStart);

        // initialization functions
        function initSelectors(){
            var hueX = (h/360) * DOM.huePickerBB.width;
            var hueY = (v/100) * DOM.huePickerBB.height;

            DOM.hueSelector.style.transform = translateTemplate.replace('{{x}}', hueX - 7).replace('{{y}}', hueY - 7);

            var satY = (s/100) * DOM.saturationPickerBB.height;

            DOM.saturationSelector.style.transform = translateTemplate.replace('{{x}}', -2).replace('{{y}}', satY - 5);
            
            setColor();
        }
        
        function initColor(val){
            var color;
            if (typeof val === 'string') color = Color(val);
            else if (val.v !== undefined) color = Color.fromHSV(val);
            else color = Color('#ff0000');

            var hsv = color.HSV();

            h = hsv.h;
            s = (1 - hsv.s) * 100;
            v = (1 - hsv.v) * 100;

            initSelectors();
        }
        
        // build DOM
        DOM.huePicker.appendChild(DOM.valuePicker);
        DOM.huePicker.appendChild(DOM.hueSelector);
        
        DOM.saturationPicker.appendChild(DOM.saturationSelector);
        
        domElem.appendChild(DOM.huePicker);
        domElem.appendChild(DOM.saturationPicker);
        
        // get sizes
        // for now, we'll assume that these will never change
        DOM.huePickerBB = DOM.huePicker.getBoundingClientRect();
        DOM.saturationPickerBB = DOM.saturationPicker.getBoundingClientRect();
        
        // set initial color if requested
        (value) ? initColor(value) : initSelectors();
    };
    // inherit from EventEmitter
    Picker.prototype = new EventEmitter();
    
    // register the Picker class globally
    // let's make it so 'new' is not needed
    var pickerGlobal = window.Picker = function(domElem, value){
        return new Picker(domElem, value);
    };
    
    pickerGlobal.Event = {
        ColorChange: 'ColorChange'   
    };
    
    
    // TODO
    // - clean up area above DOM
    // - create better layout
    // - optimize mouse events for animation frames
    // - add touch event handling as well
    // - multi-browser support
    
    
    
    // not sure if this is needed anymore
    // https://gist.github.com/catdad/9399313
    var ready = function(){};
    var readyCheck = function(){ (document.readyState === 'complete') && ready(); };
    //check for when the document is ready
    if (document.addEventListener) document.addEventListener('readystatechange', readyCheck, false);
    else document.attachEvent('onreadystatechange', readyCheck);
}();
