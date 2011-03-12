function ReferenceComponent( ) {
    this.name = "reference";
    this.html = '';
    this.dialogOptions = {
        minWidth: 100,
        minHeight: 100,
        width: 350,
        title: "Instructions",
    };
    this.buttonName = "Instruction Reference";
}

ReferenceComponent.prototype.init = function( windowObject ) {
    this.windowObject = windowObject;
    
	var offset = spudContainer.offset( );
	var x = offset.left + 620;
	var y = offset.top + 260;
    windowObject.dialog("option", "position", [x,y]);
};

ReferenceComponent.prototype.update = function( newData, applet ) {
    
};

ReferenceComponent.prototype.updateProcessor = function( processorData, applet ) {
    table = '<table id="instructionTable">';
    table += '<tr><th style="padding-right:30px">#</th><th>Bytes</th><th>Meaning</th></tr>';
    for ( var i in processorData.instructions ) {
        var instruction = processorData.instructions[i];
    
        table += '<tr><td>'+instruction[0]+'</td><td>'+instruction[1]+'</td><td>'+instruction[2]+'</td></tr>';
    }
    table += '</table>';

    this.windowObject.html( table );
};