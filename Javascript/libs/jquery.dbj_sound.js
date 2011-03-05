/**
 *  DBJ-SOUND
 * jQuery dbj_sound plugin (no flash, or any other simillar control used)
 * 
 * Loosely inspired on code by Joern Zaefferer (also Jules Gravinese http://www.webveteran.com/ ) 
 * 
 * Copyright (c) 2009 Dusan Jovanovic ( http://dbj.org ) 
 * 
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 ************************************************************************************   
 * Crash course:
 * MODIFIED: now takes url as all arguments (David)
 * 
 * return sound file url from host element
 * host must be valid html element with attribute href present
 * $.dbj_sound.url( host_element )
 *
 * play a sound from the href of the host_element
 * $.dbj_sound.play( host_element )
 *
 * stop a playback of the sound from the href of the host_element
 * $.dbj_sound.stop( host_element )
 * 
 * return true if sounds are on and sound defined by href of the host_element
 * is playing
 * $.dbj_sound.playing( host_element )
 * 
 * toggle on/off all sounds on the current page, controlled by this plugin
 * $.dbj_sound.enabledisable( host_element )
 * 
 */

(function($) {

    $.dbj_sound = {
        tracks: {},
        enabled: true,
        
        url : function ( url ) {
             if ( "undefined" == typeof(url) ) throw new Error(0xFF,"DBJ-SOUND EXCEPTION: host element invalid or missing a valid HREF attribute") ;
             return url ;
        },

        play: function( url ) {
            //
        		var sound_jq = function(src) {

        /* I might introduce this for very old browsers, or ... ?
        if ($.browser.msie)
        return $('<bgsound/>').attr({ src: options.track,
        loop: "infinite", // dbj changed from 1
        autostart: true
        }); */
                //
                return $('<embed />').attr({
                    style: "height:0",
                    loop: "true",
                    src: options.track,
                    autostart: "true",
                    hidden: "true"
                });
            }

            // sanity checks
            if (!this.enabled) return;
            if (!url) return;

            var options = { track: url }; 

            if (this.tracks[options.track]) {
                var current = this.tracks[options.track];
                current.remove();
            }

            var element = sound_jq();
                element.appendTo(document.body);
                    this.tracks[options.track] = element;
            return element; // which is jQuery object 
        }

        // DBJ added
        , stop: function( url ) {
            if (this.tracks[url]) {
                var current = this.tracks[url];
                // Check when Stop is avaiable, but not on a jQuery object
                if ('undefined' != typeof [0].Stop) current[0].Stop();
                else if ('undefined' != typeof current[0].stop) current[0].stop();
                current.remove();
                this.tracks[url] = null;
            }
        }

        // DBJ added
        , playing: function( url ) {
            if (!$.dbj_sound.enabled) return false;
            return this.tracks[url] != null;
        }

        // DBJ added
        , enabledisable: function() {
            this.enabled = !this.enabled;
            if (this.enabled == false) {
                for (var j in this.tracks) {
                    if (this.tracks[j]) {
                        this.tracks[j].remove();
                        this.tracks[j] = null;
                    }
                }
            }
            return this.enabled;
        }
        
        // DC added
        
        , enable: function() {
            this.enabled = true;
        }
        
        , disable: function() {
            this.enabled = false;
            for (var j in this.tracks) {
                if (this.tracks[j]) {
                    this.tracks[j].remove();
                    this.tracks[j] = null;
                }
            }
        }

    };

})(jQuery);