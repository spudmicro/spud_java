function UploadComponent( ) {
    this.name = "upload";
    this.defaultText = "Separate instructions with spaces";
    this.html = '<textarea id="uploadText">' + this.defaultText + '</textarea>';
    this.dialogOptions = {
        minWidth: 480,
        minHeight: 240,
        title: "Code Editor",
        buttons: {
            "Upload": function() {
                rawProgram = $( "#uploadText" ).val( );
                applet.upload( rawProgram );
            }, 
            "Hide": function() { 
                $(this).dialog("close"); 
            }
        }
    };
    this.buttonName = "Code Editor";
}

UploadComponent.prototype.init = function( windowObject ) {
    this.windowObject = windowObject;
    
    windowObject.css( "overflow", "hidden" );
    $('#uploadText').css( "width", "99%" );
    $('#uploadText').css( "height", "99%" );
    
    var defaultText = this.defaultText;
    $('#uploadText').mousedown(
        function( ) {
            if ( $('#uploadText').val() == defaultText ) {
                $('#uploadText').val( "" );
            }
        }
    );
    // resizes the textbox
    windowObject.dialog("option", "height", "240");
    windowObject.dialog("option", "position", [100,100]);
};

UploadComponent.prototype.update = function( newData, applet ) {
    
};

UploadComponent.prototype.updateProcessor = function( processorData, applet ) {

};