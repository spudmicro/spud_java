function GridViewComponent( ) {
    this.name = "gridView";
    this.html = '';
    this.dialogOptions = {
        minWidth: 50,
        minHeight: 50,
        width: 200,
        title: "Memory and Registers"
    };
    this.buttonName = "Memory and Registers";
}

GridViewComponent.prototype.init = function( windowObject ) {
    this.windowObject = windowObject;
};

GridViewComponent.prototype.update = function( newData, applet ) {
    this.windowObject.memorygrid( 'setMemory', newData.memory );
    for ( var i in newData.registers ) {
        this.windowObject.memorygrid( 'setRegister', i, newData.registers[i] );
    }
};

GridViewComponent.prototype.updateProcessor = function( processorData, applet ) {
    var cols;
    if (processorData.memorysize > 64) {
        cols = 16;
    } else if (processorData.memorysize > 20) {
        cols = 8;
    } else {
        cols = 4;
    }
    
    var rows = processorData.memorysize / cols;
    
    var instructions = [];
    for ( var i in processorData.instructions ) {
        instructions.push( processorData.instructions[i][2] );
    }
    this.windowObject.html("");
    this.windowObject.memorygrid( {
		rows: rows,
		cols: cols,
		registers: processorData.registers,
		onChange: handleGridChange,
		instructions: instructions
	} );
	
	this.windowObject.memorygrid( 'clearMemory', 0 );
	this.windowObject.memorygrid( 'clearRegisters', 0 );
};

function handleGridChange( data ) {
    if (applet.processor.registers.indexOf(data.cell) == -1) {
        applet.setCell( data.cell, data.value );
    } else {
        applet.setRegister( data.cell, data.value );
    }
}