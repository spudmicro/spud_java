function InternalStateComponent( ) {
    this.name = "internalStateView";
    this.html = '';
    this.buttonName = "Memory and Registers";
}

InternalStateComponent.prototype.init = function( uiObject ) {
    this.uiObject = uiObject;
};

InternalStateComponent.prototype.update = function( newData, applet ) {
    this.uiObject.memorygrid( 'setMemory', newData.memory );
    for ( var i in newData.registers ) {
        this.uiObject.memorygrid( 'setRegister', i, newData.registers[i] );
    }
};

InternalStateComponent.prototype.updateProcessor = function( processorData, applet ) {
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
    this.uiObject.attr( 'id', 'memoryOverlay' );
    this.uiObject.html("");
    this.uiObject.memorygrid( {
		rows: rows,
		cols: cols,
		registers: processorData.registers,
		onChange: handleGridChange,
		instructions: instructions
	} );
	
	this.uiObject.memorygrid( 'clearMemory', 0 );
	this.uiObject.memorygrid( 'clearRegisters', 0 );
};

function handleGridChange( data ) {
    if (applet.processor.registers.indexOf(data.cell) == -1) {
        applet.setCell( data.cell, data.value );
    } else {
        applet.setRegister( data.cell, data.value );
    }
}