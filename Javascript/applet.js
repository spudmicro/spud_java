function isInt(x) {
    var y = parseInt( x );
    if ( isNaN( y ) ) return false;
    return (x == y && x.toString( ) == y.toString( ));
}

function Applet( updateCallback, processorUpdateCallback ) {
    this.delay = 50;
    this.timeout = undefined;
    this.updateCallback = updateCallback;
    this.processorUpdateCallback = processorUpdateCallback;
    this.currentProgram = [];
    this.enabled = true;
}

Applet.prototype.init = function( id ) {
    this.id = id;
    this.state = JSON.parse( $( this.id )[0].getState( ) );
    this.processor = JSON.parse( $( this.id )[0].getProcessor( ) );
    this.processorUpdateCallback( );
    this.updateCallback( );
};

Applet.prototype.updateProcessor = function( s ) {
    if ( !this.enabled ) return;
    
    if ( s == undefined ) {
        s = $( this.id )[0].getProcessor( );
    }

    this.processor = JSON.parse( s );
    this.processorUpdateCallback( );
};

Applet.prototype.update = function( s ) {
    if ( !this.enabled ) return;
    
    if ( s == undefined ) {
        s = $( this.id )[0].getState( );
    }

    this.state = JSON.parse( s );
    this.updateCallback( );
};

Applet.prototype.step = function( ) {
    if (!this.state.isHalted) {
        this.update( $( this.id )[0].step( ) );
    }
};

Applet.prototype.loadSPuD = function( code ) {
    var temp = $( this.id )[0].loadSPuD( code );
    this.updateProcessor( );
    this.update( temp );
};

Applet.prototype.setMemory = function( values ) {
    for ( var i in values ) {
        $( this.id )[0].setMemory( i, values[i] );
    }
    this.update( );
};


Applet.prototype.setRegister = function( register, value ) {
    $( this.id )[0].setRegister( register, value );
    this.update( );
};

Applet.prototype.setCell = function( cell, value ) {
    $( this.id )[0].setMemory( cell, value );
    this.update( );
};

Applet.prototype.clearState = function( ) {
    this.update( $( this.id )[0].clearState( ) );
};

Applet.prototype.loadProgram = function( values ) {
    this.clearState( );
    this.setMemory( values );
};

Applet.prototype.run = function( ) {
    if ( this.timeout == undefined ) {
        this.timeout = setTimeout( function( thisObj ) { thisObj.runStep( ) }, this.delay, this );
    } else {
        clearTimeout( this.timeout );
        this.timeout = undefined;
    }
};

Applet.prototype.runStep = function( ) {
    if ( !this.state.isHalted ) {
        this.step( );
        this.timeout = setTimeout( function( thisObj ) { thisObj.runStep( ); }, this.delay, this );
    } else {
        this.timeout = undefined;
    }
};

Applet.prototype.reset = function( ) {
    this.loadProgram( this.currentProgram );
};

Applet.prototype.validateCode = function( program ) {
    for ( var i in program ) {
        if ( !isInt( program[i] ) ) {
            return false;
        }
    }
    return true;
};

Applet.prototype.upload = function( text ) {
    
    // remove comments
    text = text.replace( /\#.*$/mg, "" );
    
    // condense whitespace
    text = text.replace( /[ \n]+/mg, " " );text
    
    // trim
    text = text.replace( / *$/mg, "" );
    text = text.replace( /^ */mg, "" );
    
    // split
    text = text.split( /\W+/g );
    
    // upload
    if ( this.validateCode( text ) ) {
        this.currentProgram = text;
    }
    
    // reset
    this.reset( );
};