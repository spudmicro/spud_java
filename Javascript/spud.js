function SpudComponent( ) {
    this.name = "spud";
    this.html = '<textarea id="spudText"></textarea>';
    this.dialogOptions = {
        minWidth: 480,
        minHeight: 240,
        title: "SPµD Editor",
        buttons: {
            "Upload": function() {
                rawProgram = $( "#spudText" ).val( );
                applet.loadSPuD( rawProgram );
            }, 
            "Cancel": function() { 
                $(this).dialog("close"); 
            }
        }
    };
    this.buttonName = "SPµD Editor";
}

SpudComponent.prototype.init = function( windowObject ) {
    this.windowObject = windowObject;
    
    windowObject.css( "overflow", "hidden" );
    $('#spudText').css( "width", "100%" );
    $('#spudText').css( "height", "100%" );
    
    // resizes the textbox
    windowObject.dialog("option", "height", "240");
};

SpudComponent.prototype.update = function( newData, applet ) {
    
};

SpudComponent.prototype.updateProcessor = function( processorData, applet ) {

};

