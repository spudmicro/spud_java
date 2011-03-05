var applet = null;
var components = {};

$( document ).ready( init );

var ctrlDown = false;
var altDown  = false;
var delDown  = false;

function init( ) {
    registerComponent( new HardwareComponent( ) );
    registerWindowedComponent( new UploadComponent( ) );
    registerOverlayComponent( new InternalStateComponent( ) );
    registerWindowedComponent( new SpudComponent( ) );
    registerWindowedComponent( new ReferenceComponent( ) );
	
    applet = new Applet( update, updateProcessor );
    applet.init("#applet");
    applet.loadProgram( [] );
    
    
    // BSOD
    
    $( document ).keydown( 
        function( evt ) {
            if ( evt.which == 17 ) {
                ctrlDown = true;
            } else if ( evt.which == 18 ) {
                altDown = true;
            } else if ( evt.which == 8 || evt.which == 46 ) {
                delDown = true;
            }
            
            if ( ctrlDown && altDown && delDown ) {
                $('body').css( 'background-color', '#00a' );
                $('body').find( 'div' ).hide( );
                $('body').append( '<div style="width:60%;color:white;font-size:20px;font-family:monospace;font-weight:bold;margin:auto;">'
                + '<pre>A fatal exception has occurred. The current application will be terminated.\n\n'
                + ' * Press any key to terminate the current application\n'
                + ' * Press CTRL + ALT + DEL again to restart your computer. You will\n   lose any unsaved information in all applications.\n'
                + '\n</pre><br/>'
                + '<center>Press any key to continue_</center>'
                + '</div>');
                ctrlDown = false;
                altDown = false;
                delDown = false;
                setTimeout( '$( document ).keypress( function() { location.reload(); } );', 600 );
            }
        }
    );
    
    
    $( document ).keyup(
        function( evt ) {
            if ( evt.which == 17 ) {
                ctrlDown = false;
            } else if ( evt.which == 18 ) {
                altDown = false;
            } else if ( evt.which == 8 || evt.which == 46 ) {
                delDown = false;
            }
        }
    );
    
    // End BSOD
    
    $( document ).keypress(
        function( evt ) {
            if ( evt.which == 109 ) {
                mute( );
            }
        }
    );
}

function mute( ) {
    components['hardware'].toggleMute( );
}

function update( ) {
    // update components
    for ( var i in components ) {
        components[i].update( applet.state, applet );
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