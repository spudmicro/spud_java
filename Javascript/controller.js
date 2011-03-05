var applet = null;
var components = {};

$( document ).ready( init );

function init( ) {
    registerComponent( new HardwareComponent( ) );
    registerWindowedComponent( new UploadComponent( ) );
    registerWindowedComponent( new GridViewComponent( ) );
    registerWindowedComponent( new SpudComponent( ) );
    registerWindowedComponent( new ReferenceComponent( ) );
	
	applet = new Applet( update, updateProcessor );
	applet.init("#applet");
    applet.loadProgram( [] );
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