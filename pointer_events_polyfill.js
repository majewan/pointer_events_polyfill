/*
 * Pointer Events Polyfill: Adds support for the style attribute "pointer-events: none" to browsers without this feature (namely, IE).
 * (c) 2013, Kent Mewhort, licensed under BSD. See LICENSE.txt for details.
 */

// constructor
function PointerEventsPolyfill(options){
    // set defaults
    this.options = {
        selector: '*',
        mouseEvents: ['click','dblclick','mousedown','mouseup'],
        usePolyfillIf: function(){
            if(navigator.appName == 'Microsoft Internet Explorer')
            {
                var agent = navigator.userAgent;
                if (agent.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/) != null){
                    var version = parseFloat( RegExp.$1 );
                    if(version < 11)
                      return true;
                }
            }
            return false;
        }
    };
    if(options){
        var obj = this;
        jQuery.each(options, function(k,v){
          obj.options[k] = v;
        });
    }

    if(this.options.usePolyfillIf())
      this.register_mouse_events();
}

// singleton initializer
PointerEventsPolyfill.initialize = function(options){
    if(PointerEventsPolyfill.singleton == null)
      PointerEventsPolyfill.singleton = new PointerEventsPolyfill(options);
    return PointerEventsPolyfill.singleton;
};

// handle mouse events w/ support for pointer-events: none
PointerEventsPolyfill.prototype.register_mouse_events = function(){
    // register on all elements (and all future elements) matching the selector
    jQuery(document).on(this.options.mouseEvents.join(" "), this.options.selector, function(e){
       if(jQuery(this).css('pointer-events') == 'none'){
             // peak at the element below
             var origDisplayAttribute = jQuery(this).css('display');
             jQuery(this).css('display','none');

             var underneathElem = document.elementFromPoint(e.clientX, e.clientY);

            if(origDisplayAttribute)
                jQuery(this)
                    .css('display', origDisplayAttribute);
            else
                jQuery(this).css('display','');

             // fire the mouse event on the element below
            e.target = underneathElem;
            jQuery(underneathElem).trigger(e);

            return false;
        }
        return true;
    });
};
