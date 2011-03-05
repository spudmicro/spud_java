function UploadComponent( ) {
    this.name = "upload";
    this.html = '<textarea id="uploadText"></textarea>';
    this.dialogOptions = {
        minWidth: 480,
        minHeight: 240,
        title: "Code Editor",
        buttons: {
            "Upload": function() {
                rawProgram = $( "#uploadText" ).val( );
                applet.upload( rawProgram );
            }, 
            "Cancel": function() { 
                $(this).dialog("close"); 
            }
        }
    };
    this.buttonName = "Code Editor";
}

UploadComponent.prototype.init = function( windowObject ) {
    this.windowObject = windowObject;
    
    windowObject.css( "overflow", "hidden" );
    $('#uploadText').css( "width", "100%" );
    $('#uploadText').css( "height", "100%" );
    
    // resizes the textbox
    windowObject.dialog("option", "height", "240");
};

UploadComponent.prototype.update = function( newData, applet ) {
    
};

UploadComponent.prototype.updateProcessor = function( processorData, applet ) {

};