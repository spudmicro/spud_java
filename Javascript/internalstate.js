function InternalStateComponent( ) {
    this.name = "internalStateView";
    this.html = '';
    this.buttonName = "Memory and Registers";
}

InternalStateComponent.prototype.init = function( uiObject ) {
    this.uiObject = uiObject;
};

InternalStateComponent.prototype.update = function( newData, applet, slow ) {
    if ( slow ) {
        this.animateUpdate( newData );
    }
    
    this.uiObject.memorygrid( 'setMemory', newData.memory );
    for ( var i in newData.registers ) {
        this.uiObject.memorygrid( 'setRegister', i, newData.registers[i] );
    }
};

InternalStateComponent.prototype.animateUpdate = function( newData ) {
    if (newData.pipelineStep == 0) {
        // execute
        this.uiObject.memorygrid( "animateHighlight", "IS", "#00FF00", 200 );
    } else if (newData.pipelineStep == 1) {
        // fetch
        ip = parseInt(this.uiObject.memorygrid( "getRegister", "IP"));
        this.uiObject.memorygrid( "animateCopy", ip, "IS", 200 );
    } else if (newData.pipelineStep == 2) {
        // increment
        this.uiObject.memorygrid( "animateHighlight", "IP", "#FFFF00", 200 );
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

    // clear old memorygrid
    this.uiObject.html( "" );

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