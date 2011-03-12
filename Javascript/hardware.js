var assetDir = "media/";

var assets = {
	"background_img"   : this.assetDir + "board_Off.png",
	"board_on"         : this.assetDir + "board_On.png",
	"bell_on"          : this.assetDir + "Bell_On_21_197.png",

	"exLED_on"         : this.assetDir + "Ex_On_429_40.png",
	"fetchLED_on"      : this.assetDir + "Fetch_On_267_40.png",
	"incLED_on"        : this.assetDir + "Inc_On_358_40.png",

	"resetButton_down" : this.assetDir + "Reset_Down_278_308.png",
	"runButton_down"   : this.assetDir + "Run_Down_278_250.png",
	"stepButton_down"  : this.assetDir + "Step_Down_417_250.png",

	"invisible"        : this.assetDir + "invisible.gif",

	"ding"             : this.assetDir + "ding.mp3",
	"power_up"         : this.assetDir + "powerup.mp3",
	"power_down"       : this.assetDir + "powerdown.mp3",
	"hum"              : this.assetDir + "hum.mp3"
};

function changeImage( id, imgSuffix ) {    
	var buttonObj = $(id);
	var id = buttonObj.attr( 'id' );
	
	var key    = id + '_' + imgSuffix;
	var imgUrl = assets[key];
	
	if ( imgUrl == undefined ) {
		imgUrl = assets['invisible'];
	}
	
	buttonObj.css( 'background-image', 'url("' + imgUrl + '")' );
}


// Begin class

function HardwareComponent( ) {
    this.html = '<div id="background" class="graphic" height=1000>';
    this.html += '<div id="board" class="graphic"></div>';
    this.html += '<div id="powerSwitch" class="switch"></div>';
    this.html += '<div id="runButton" class="button"></div>';
    this.html += '<div id="stepButton" class="button"></div>';
    this.html += '<div id="resetButton" class="button"></div>';
    this.html += '<div id="bell" class="graphic"></div>';
    this.html += '<div id="fetchLED" class="graphic"></div>';
    this.html += '<div id="incLED" class="graphic"></div>';
    this.html += '<div id="exLED" class="graphic"></div>';
    this.html += '<div id="chipLabel" class="text">4917</div>';
    this.html += '<div id="outputLCD" class="graphic"></div>';
    this.html += '</div>';
    
    this.numBellRings = 0;
    
    this.buttons = [
    	"resetButton",
    	"runButton",
    	"stepButton",
    ];
    
    this.name = "hardware";
    
    this.isMute = false;
}

HardwareComponent.prototype.setCSS = function( identifier, css ) {
    obj = $( identifier );
    for ( var i in css ) {
        obj.css( i, css[i] );
    }
}

HardwareComponent.prototype.init = function( windowObject ) {
    $("#hardware").html(this.html);

    this.setCSS( '.graphic, .button, .switch', 
    {'position': 'absolute', 'background-repeat': 'no-repeat'} );

    this.setCSS( '.text', 
    {'position': 'absolute'} );

    this.setCSS( '#background', 
    {'width': '620px', 'top': '30px', 'left': '0px', 'height': '600px'} );

    this.setCSS( '#board', 
    {'width': '620px', 'top': '0px', 'left': '0px', 'height': '600px'} );

    this.setCSS( '#bell', 
    {'width': '182px', 'top': '197px', 'left': '21px', 'height': '177px'} );

    this.setCSS( '#powerSwitch', {'width': '68px', 'top': '56px', 'left': '54px', 'height': '134px'} );

    this.setCSS( '#resetButton', {'width': '139px', 'top': '308px', 'left': '278px', 'height': '65px'} );

    this.setCSS( '#stepButton', {'width': '139px', 'top': '250px', 'left': '417px', 'height': '65px'} );

    this.setCSS( '#runButton', {'width': '139px', 'top': '250px', 'left': '278px', 'height': '65px'} );
    this.setCSS( '#chipLabel', {'opacity': '0.7', 'font-size': '10pt', 'color': '#BFBFBF', 'top': '152px', 'filter': 'alpha(opacity=70)', 'width': '150px', 'text-align': 'center', 'font-family': "'LastWordsThin'", '-moz-opacity': '0.7', 'left': '325px'} );
    this.setCSS( '#outputLCD', {'opacity': '0.6', 'font-size': '20pt', 'color': '#000', 'top': '425px', 'height': '93px', 'filter': 'alpha(opacity=60)', 'width': '510px', 'overflow': 'auto', 'font-family': "'LCDDotRegular'", '-moz-opacity': '0.6', 'left': '55px'} );

    this.setCSS( '#fetchLED', {'width': '91px', 'top': '40px', 'left': '267px', 'height': '57px'} );
    this.setCSS( '#incLED', {'width': '91px', 'top': '40px', 'left': '358px', 'height': '57px'} );
    this.setCSS( '#exLED', {'width': '91px', 'top': '40px', 'left': '429px', 'height': '57px'} );

    $.sound.enabled = true;

	// force browser to cache images
	var imageCache = [];
	for ( var key in assets ) {
		var cachedImage = document.createElement('img');
		cachedImage.src = assets[key];
		imageCache.push( cachedImage );
	}
	
	// power on board
	this.boardInit( );
	
	// make all buttons un-pressed
	this.liftButtons( );
	
	// add events
	$( '.button' ).mousedown( [this], function(e) { e.data[0].pushInEvent( e ); } );
	$( '.button' ).mouseup( [this], function(e) { e.data[0].pushOutEvent( e ); } );
	
	$( document ).mouseup( [this], function(e) { e.data[0].liftButtons( e ); } );
	
	$( '#powerSwitch' ).click( [this], function(e) { e.data[0].togglePowerEvent( ); } );
	
	$( '#runButton' ).click( [this], function(e) { e.data[0].runButton( ); } );
	$( '#stepButton' ).click( [this], function(e) { e.data[0].stepButton( ); } );
	$( '#resetButton' ).click( [this], function(e) { e.data[0].resetButton( ); } );
};

HardwareComponent.prototype.update = function( newData, applet ) {
    //console.log( newData );
    
    this.setOutput( newData.output );
    this.setPipelineStep( newData.pipelineStep );
    
    while ( newData.numBellRings > this.numBellRings ) {
        this.ringBell( );
        this.numBellRings++;
    }
    
    this.numBellRings = newData.numBellRings;
    
    // do a sort of animation on halt
    if ( newData.isHalted ) {
        changeImage( "#fetchLED", "on" );
        changeImage( "#incLED", "on" );
        changeImage( "#exLED", "on" );
        
        $("#fetchLED").fadeOut( 1000 );
        $("#incLED").fadeOut( 1000 );
        $("#exLED").fadeOut( 1000 );
    } else {
        $("#fetchLED").show( );
        $("#incLED").show( );
        $("#exLED").show( );
    }
};

HardwareComponent.prototype.updateProcessor = function( processorData, applet ) {
    if ( processorData ) {
        $("#chipLabel").html(processorData.name);
    }
};

HardwareComponent.prototype.boardInit = function( ) {
	
	changeImage( '#background', 'img' );
	changeImage( '#board', 'on' );
	
	this.turnOn( );
	this.bellInit( );
	
	// fancy scrollbar has update problems
	//$('#outputLCD').jScrollPane( );
};

HardwareComponent.prototype.bellInit = function( ) {
	changeImage( '#bell', 'on' );
	$( '#bell' ).hide( );
};

HardwareComponent.prototype.setOutput = function( outputText ) {
	$( '#outputLCD' ).text( outputText );
};

HardwareComponent.prototype.bellOff = function( ) {
	$('#bell').fadeOut( 'slow' );
};

HardwareComponent.prototype.ringBell = function( ) {
	if ( !this.isMute ) {
		$.sound.play( assets['ding'] );
	}
	
	$('#bell').fadeIn( 10, this.bellOff );
};

HardwareComponent.prototype.liftButtons = function( ) {
	for ( var buttonIndex in this.buttons ) {
		changeImage( '#' + this.buttons[buttonIndex], 'up' );
	}
};

HardwareComponent.prototype.toggleMute = function( ) {
	this.isMute = !this.isMute;
	$.dbj_sound.enabledisable( );
	if ( $.dbj_sound.enabled ) {
	    $.dbj_sound.play( assets['hum'] );
	}
};

HardwareComponent.prototype.turnOn = function( ) {
	this.isOn = true;
	if ( applet ) {
	    applet.enabled = true;
	    applet.reset( );
    }

	$( '#board' ).fadeIn( 'fast' );
	$( '#outputLCD' ).fadeIn( 'slow' );
    changeImage( "#fetchLED", "on" );

	if ( !this.isMute ) {
		$.sound.play( assets['power_up'] );
		$.dbj_sound.enable( );
	} else {
	    $.dbj_sound.disable( );
	}

    
	$.dbj_sound.play( assets['hum'] );
};

HardwareComponent.prototype.turnOff = function( ) {
	this.isOn = false;
	applet.enabled = false;
    
    changeImage( "#fetchLED", "off" );
    changeImage( "#incLED", "off" );
    changeImage( "#exLED", "off" );
	$( '#board' ).fadeOut( 'slow' );
	$( '#outputLCD' ).fadeOut( 'slow' );

	if ( !this.isMute ) {
		$.sound.play( assets['power_down'] );	
	}

	setTimeout( "$.dbj_sound.stop( assets['hum'] );", 500 );
};

HardwareComponent.prototype.togglePowerEvent = function( evtObj ) {
	if ( this.isOn ) {
		this.turnOff( );
	} else {
		this.turnOn( );
	}
};

HardwareComponent.prototype.pushInEvent = function( evtObj ) {
	changeImage( evtObj.target, 'down' );
};

HardwareComponent.prototype.pushOutEvent = function( evtObj ) {
	changeImage( evtObj.target, 'up' );
};

HardwareComponent.prototype.runButton = function( ) {
    if ( this.isOn ) {
        applet.run( );
    }
};

HardwareComponent.prototype.stepButton = function( ) {
    if ( this.isOn ) {
        applet.step( true ); // slow step
    }
};

HardwareComponent.prototype.resetButton = function( ) {
    if ( this.isOn ) {
        // reset and upload last program
        applet.reset( );
    }
};

HardwareComponent.prototype.setPipelineStep = function( step ) {
    changeImage( "#fetchLED", "off" );
    changeImage( "#incLED", "off" );
    changeImage( "#exLED", "off" );
    
    if ( step == 0 ) {
        changeImage( "#fetchLED", "on" );
    } else if ( step == 1 ) {
        changeImage( "#incLED", "on" );
    } else if ( step == 2 ) {
        changeImage( "#exLED", "on" );
    }
};

