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
	var offset = spudContainer.offset( );
	var x = offset.left + 100;
	var y = offset.top + 100;
    windowObject.dialog("option", "height", "240");
    windowObject.dialog("option", "position", [x,y]);
};

UploadComponent.prototype.update = function( newData, applet ) {
    
};

UploadComponent.prototype.updateProcessor = function( processorData, applet ) {

};