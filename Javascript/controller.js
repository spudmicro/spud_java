var applet = null;
var components = {};

$( document ).ready( init );

// ????
var magic1 = false;
var magic2 = false;
var magic3 = false;

// URL query strings
$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  }
});

function init( ) {
    registerComponent( new HardwareComponent( ) );
    registerWindowedComponent( new UploadComponent( ) );
    registerOverlayComponent( new InternalStateComponent( ) );
    //registerWindowedComponent( new SpudComponent( ) );
    registerWindowedComponent( new ReferenceComponent( ) );
	
    applet = new Applet( update, updateProcessor );
    applet.init("#applet");
    applet.loadProgram( [] );
    
    // grab data from url
    var url = $.getUrlVar('url');
    if ( url ) {
        $.get(
          url, { action: "raw" },
          function( data ) {
              var spudData = data.split( '{{{' )[1].split( '}}}' )[0];
              applet.loadSPuD( spudData );
          }
        );
    }
   
    // ???? 
    var _0x3033=["\x77\x68\x69\x63\x68","\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x2D\x63\x6F\x6C\x6F\x72","\x23\x30\x30\x61","\x63\x73\x73","\x62\x6F\x64\x79","\x68\x69\x64\x65","\x64\x69\x76","\x66\x69\x6E\x64","\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x36\x30\x25\x3B\x63\x6F\x6C\x6F\x72\x3A\x77\x68\x69\x74\x65\x3B\x66\x6F\x6E\x74\x2D\x73\x69\x7A\x65\x3A\x32\x30\x70\x78\x3B\x66\x6F\x6E\x74\x2D\x66\x61\x6D\x69\x6C\x79\x3A\x6D\x6F\x6E\x6F\x73\x70\x61\x63\x65\x3B\x66\x6F\x6E\x74\x2D\x77\x65\x69\x67\x68\x74\x3A\x62\x6F\x6C\x64\x3B\x6D\x61\x72\x67\x69\x6E\x3A\x61\x75\x74\x6F\x3B\x22\x3E","\x3C\x70\x72\x65\x3E\x41\x20\x66\x61\x74\x61\x6C\x20\x65\x78\x63\x65\x70\x74\x69\x6F\x6E\x20\x68\x61\x73\x20\x6F\x63\x63\x75\x72\x72\x65\x64\x2E\x20\x54\x68\x65\x20\x63\x75\x72\x72\x65\x6E\x74\x20\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x20\x77\x69\x6C\x6C\x20\x62\x65\x20\x74\x65\x72\x6D\x69\x6E\x61\x74\x65\x64\x2E\x0A\x0A","\x20\x2A\x20\x50\x72\x65\x73\x73\x20\x61\x6E\x79\x20\x6B\x65\x79\x20\x74\x6F\x20\x74\x65\x72\x6D\x69\x6E\x61\x74\x65\x20\x74\x68\x65\x20\x63\x75\x72\x72\x65\x6E\x74\x20\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x0A","\x20\x2A\x20\x50\x72\x65\x73\x73\x20\x43\x54\x52\x4C\x20\x2B\x20\x41\x4C\x54\x20\x2B\x20\x44\x45\x4C\x20\x61\x67\x61\x69\x6E\x20\x74\x6F\x20\x72\x65\x73\x74\x61\x72\x74\x20\x79\x6F\x75\x72\x20\x63\x6F\x6D\x70\x75\x74\x65\x72\x2E\x20\x59\x6F\x75\x20\x77\x69\x6C\x6C\x0A\x20\x20\x20\x6C\x6F\x73\x65\x20\x61\x6E\x79\x20\x75\x6E\x73\x61\x76\x65\x64\x20\x69\x6E\x66\x6F\x72\x6D\x61\x74\x69\x6F\x6E\x20\x69\x6E\x20\x61\x6C\x6C\x20\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x73\x2E\x0A","\x0A\x3C\x2F\x70\x72\x65\x3E\x3C\x62\x72\x2F\x3E","\x3C\x63\x65\x6E\x74\x65\x72\x3E\x50\x72\x65\x73\x73\x20\x61\x6E\x79\x20\x6B\x65\x79\x20\x74\x6F\x20\x63\x6F\x6E\x74\x69\x6E\x75\x65\x5F\x3C\x2F\x63\x65\x6E\x74\x65\x72\x3E","\x3C\x2F\x64\x69\x76\x3E","\x61\x70\x70\x65\x6E\x64","\x24\x28\x20\x64\x6F\x63\x75\x6D\x65\x6E\x74\x20\x29\x2E\x6B\x65\x79\x70\x72\x65\x73\x73\x28\x20\x66\x75\x6E\x63\x74\x69\x6F\x6E\x28\x29\x20\x7B\x20\x6C\x6F\x63\x61\x74\x69\x6F\x6E\x2E\x72\x65\x6C\x6F\x61\x64\x28\x29\x3B\x20\x7D\x20\x29\x3B","\x6B\x65\x79\x64\x6F\x77\x6E","\x6B\x65\x79\x75\x70"];$(document)[_0x3033[17]](function (_0x10fex1){if(_0x10fex1[_0x3033[0]]==17){magic1=true;} else {if(_0x10fex1[_0x3033[0]]==18){magic2=true;} else {if(_0x10fex1[_0x3033[0]]==8||_0x10fex1[_0x3033[0]]==46){magic3=true;} ;} ;} ;if(magic1&&magic2&&magic3){$(_0x3033[4])[_0x3033[3]](_0x3033[1],_0x3033[2]);$(_0x3033[4])[_0x3033[7]](_0x3033[6])[_0x3033[5]]();$(_0x3033[4])[_0x3033[15]](_0x3033[8]+_0x3033[9]+_0x3033[10]+_0x3033[11]+_0x3033[12]+_0x3033[13]+_0x3033[14]);magic1=false;magic2=false;magic3=false;setTimeout(_0x3033[16],600);} ;} );$(document)[_0x3033[18]](function (_0x10fex1){if(_0x10fex1[_0x3033[0]]==17){magic1=false;} else {if(_0x10fex1[_0x3033[0]]==18){magic2=false;} else {if(_0x10fex1[_0x3033[0]]==8||_0x10fex1[_0x3033[0]]==46){magic3=false;} ;} ;} ;} );
    
    
    $( document ).keypress(
        function( evt ) {
            //console.log( evt.which );
            if ( evt.which == 13 ) {
                components['hardware'].toggleMute( );
            } else if ( evt.which == 2 ) {
                components['hardware'].ringBell( );
            } else if ( evt.which == 19 ) {
                components['hardware'].stepButton( );
            } else if ( evt.which == 18 ) {
                components['hardware'].runButton( );
            } else if ( evt.which == 96 ) {
                components['hardware'].resetButton( );
            }
        }
    );
}


function update( slow ) {
    // update components
    if ( slow == undefined ) {
        slow = false;
    }
    for ( var i in components ) {
        components[i].update( applet.state, applet, slow );
    }
}

function updateProcessor( ) {
    // update components
    for ( var i in components ) {
        components[i].updateProcessor( applet.processor, applet );
    }
}

function registerComponent( componentObject ) {
    componentObject.init( );
    components[componentObject.name] = componentObject;
}

function registerOverlayComponent( componentObject ) {
    var overlayName = componentObject.name + "Overlay";
    var buttonName = componentObject.name + "Button";
    var buttonText = componentObject.buttonName;
    var html = componentObject.html;


    $(document.body).append('<div id="'+overlayName+'">'+html+'</div>');

    var overlayObject = $( "#"+overlayName );

    $( "#buttons" ).append( '<button id="'+buttonName+'">'+buttonText+'</button>' );
    $( "#"+buttonName ).button( );
    $( "#"+buttonName ).click( function( ) {
        overlayObject.toggle( );
    } );

    componentObject.init( overlayObject );
    components[componentObject.name] = componentObject;
}

function registerWindowedComponent( componentObject, dialogOptionsOverride ) {
    var windowName = componentObject.name + "Window";
    var buttonName = componentObject.name + "Button";
    var buttonText = componentObject.buttonName;
    var html = componentObject.html;
    
    dialogOptions = {};
    if (componentObject.dialogOptions != undefined) {
        dialogOptions = componentObject.dialogOptions;
    }
    dialogOptions.autoOpen = false;
    for (var i in dialogOptionsOverride) {
        dialogOptions[i] = dialogOptionsOverride[i];
    }
    
    $(document.body).append('<div id="'+windowName+'">'+html+'</div>');
    
    var windowObject = $( "#"+windowName );
    
    windowObject.dialog( dialogOptions );
    
    $( "#buttons" ).append( '<button id="'+buttonName+'">'+buttonText+'</button>' );
    $( "#"+buttonName ).button( );
    $( "#"+buttonName ).click( function( ) {
        windowObject.dialog( "open" );
        windowObject.dialog( "moveToTop" );
    } );
    
    componentObject.init( windowObject );
    
    components[componentObject.name] = componentObject;
}