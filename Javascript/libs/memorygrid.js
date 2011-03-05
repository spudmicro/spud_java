/**
 * jQuery Plugin for SPuD Microcontroller Memory and Registers
 * David Collien
 * 2011
 *
 * Requires: jQuery and jquery.color (for colour animation)
 */

(function($) {
	
	// Supported Methods
	var methods = {
		setMemoryEditable: function( editable ) {
			$(this).find( '.ui-memorygrid-input' ).attr( 'disabled', !editable );
		},
		setRegistersEditable: function( editable ) {
			$(this).find( '.ui-memorygrid-registerinput' ).attr( 'disabled', !editable );
		},
		clearMemory: function( value ) {
			if ( !value ) {
				value = 0;
			}
			var numCells = $(this).data( 'options' ).rows * $(this).data( 'options' ).cols;
			for ( var i = 0; i < numCells; i++ ) {
				setMemoryCell.call( this, i, value );
			}
		},
		clearRegisters: function( value ) {
			if ( !value ) {
				value = 0;
			}
			var registers = $(this).data( 'options' ).registers;
			for ( var i in registers ) {
				setRegisterCell.call( this, registers[i], value );
			}
		},
		setMemory: function( ) {
			if ( arguments.length == 1 ) {
				setMemoryArray.apply( this, arguments );
			} else {
				setMemoryCell.apply( this, arguments );
			}
			return this;
		},
		setRegister: function( ) {
			setRegisterCell.apply( this, arguments )
			return this;
		},
		getMemory: function( cellNum ) {
			return $(this).find( '#memory' + cellNum ).val( );
		},
		getRegister: function( cellId ) {
			return $(this).find( '#register' + cellId ).val( );
		},
		animateHighlight: function( cellId, colour, duration ) {
			var cellObj = cellIdToObj.call( this, cellId );
			var prevColour = cellObj.css( 'backgroundColor' );
			
			cellObj.stop().animate( 
				{
					backgroundColor: colour,
				},
				duration,
				function( ) {
					cellObj.animate( {
						backgroundColor: prevColour,
					} )
				}
			);
		},
		animateCopy: function( cellIdFrom, cellIdTo, duration ) {
			var fromObj = cellIdToObj.call( this, cellIdFrom );
			var toObj   = cellIdToObj.call( this, cellIdTo );
			
			var moveObj = fromObj.clone().appendTo(this);
			moveObj.unbind( );
			moveObj.attr( 'id', 'animationcell' );
			
			moveObj.css( 'position', 'absolute' );
			
			var startOffset = fromObj.offset();
			var containerOffset = $(this).offset();
			
			startOffset.top = Math.max( containerOffset.top, startOffset.top );
			startOffset.top = Math.min( containerOffset.top + $(this).height(), startOffset.top );
			
			
			startOffset.left = Math.max( containerOffset.left, startOffset.left );
			startOffset.left = Math.min( containerOffset.left + $(this).width(), startOffset.left );
			
			moveObj.offset( startOffset );
			
			var toOffset = toObj.offset();
			moveObj.animate( {
				left:toOffset.left,
				top:toOffset.top,
			},
			duration,
			function() {
				toObj.val( moveObj.val() );
				updateCell( cellIdTo, toObj.val() );
				moveObj.remove();
			}
			);
			
		},
	};
	
	// Create the plugin
	$.fn.extend({
		memorygrid: function( arg ) {
			
			if ( methods[arg] ) {
				// call as "this" with rest of arguments
				return methods[arg].apply( this, Array.prototype.slice.call( arguments, 1 ) );
			} else {
				// make default options
				var defaults = {
					cols:4,
					rows:4,
					registers:['IP', 'IS', 'R0', 'R1'],
					onChange:function( data ) { },
					instructions: [],
				}			
				var options = $.extend( defaults, arg );
				
				$(this).data( 'options', options );
				init( this, options );
			}
			return this;
		}
	} );
	
	// Helpers to set memory
	
	function setMemoryArray( memoryArray ) {
		for ( var i in memoryArray ) {
			setMemoryCell.call( this, i, memoryArray[i] )
		}
	}
	
	function setMemoryCell( cellNum, value ) {
		$(this).find( '#memory' + cellNum ).val( value );
		updateCell.apply( this, arguments );
	}
	 
	function setRegisterCell( cellId, value ) {
		$(this).find( '#register' + cellId ).val( value );
		updateCell.apply( this, arguments );
	}

	// jQuery object from a cell id (number/memory or string/register)
	
	function cellIdToObj( cellId ) {
		var obj;
		if ( typeof cellId == 'number' ) {
			obj = $(this).find( '#memory' + cellId );
		} else {
			obj = $(this).find( '#register' + cellId );
		}
		return obj;
	}
	
	// called after changing memory to update any styles
	
	function updateCell( cellId, cellValue ) {
		if ( cellId == 'IP' ) {
			$(this).find( '.ui-memorygrid-cell' ).removeClass( 'ui-memorygrid-activeIP' );
			$(this).find( '#memory' + cellValue ).parent( ).addClass( 'ui-memorygrid-activeIP' );
		}
	}

	// Initialise the grid
	
	function init( container, options ) {
		this.element = container;
		
		var rows = options.rows;
		var cols = options.cols;
		var registers = options.registers;
		var onChange = options.onChange;
		
		var tableRows = '<div class="ui-memorygrid-container">'
		
		tableRows += '<table class="ui-memorygrid" cellpadding="0" cellspacing="0">';
		var cellNum = 0;
		for ( var r = 0; r < rows; r++ ) {
			tableRows += '<tr class="ui-memorygrid-row"><td class="ui-memorygrid-rowheader">' + cellNum + '</td>';
			
			for ( var c = 0; c < cols; c++ ) {
				tableRows += '<td class="ui-memorygrid-cell">';
				tableRows += '<input type="text" class="ui-memorygrid-input" id="memory' + cellNum + '"></input>'
				tableRows += '</td>';
				cellNum++;
			}
			
			tableRows += '</tr>';
		}
		tableRows += '</table></div>';
		
		$(container).append( tableRows );
		
		var registerConsole = '<div class="ui-memorygrid-registerconsole">';
		
		for ( var i in registers ) {
			registerConsole += '<div class="ui-memorygrid-register">';
			
			registerConsole += '<span class="ui-memorygrid-registerlabel">' + registers[i] + '</span>';
			registerConsole += '<input class="ui-memorygrid-registerinput" id="register' + registers[i] + '"></input>';
			
			registerConsole += '</div>';
		}
		
		var padding = 30;
		var maxRows = 16;
		if ( rows > maxRows ) {
		    $(container).find('.ui-memorygrid-container').height( 280 );
	    }
		$(container).width( $(container).find('.ui-memorygrid').width( ) + padding );
		
		$(container).append( registerConsole );
		
		$(container).append('<div id="instructionBubble"></div>');
		
		$(container).find('#instructionBubble').hide( );
		
		$(container).append('<div id="ipLine"></div>');
		
		$(container).find('#ipLine').css('position', 'absolute').hide( );
		
		$('.ui-memorygrid-input').focusout(
			function( event ) {
				var cellNum = parseInt( $(event.target).attr( 'id' ).replace( "memory", "") );
				var cellVal = parseInt( $(event.target).val( ) );
				var data = { cell:cellNum, value:cellVal };
				updateCell.call( container, cellNum, cellVal );
				onChange( data );
			}
		).mouseover(
			function( event ) {
				var val = parseInt( $(event.target).val( ) );
				var instructions = $(container).data( 'options' ).instructions;
				var obj = $(event.target);
				if ( val >= 0 && val < instructions.length ) {
					
					var instruction = instructions[val];
					
					var bubble = $(container).find('#instructionBubble');
					bubble.html( instruction );
					var topOffset  = 30;//bubble.height();
					var leftOffset = 0;//bubble.width()/2;
					var offset = { left: obj.offset( ).left, top: obj.offset( ).top };
					
					offset.left -= leftOffset + $(container).offset( ).left;
					offset.top  -= topOffset  + $(container).offset( ).top;
					
					bubble.css( 'top', offset.top );
					bubble.css( 'left', offset.left );
					
					bubble.show( );
					//bubble.fadeIn( "fast" );
				}
			}
		).mouseout(
			function( event ) {
				$(container).find('#instructionBubble').hide( );
			}
		);
		
		$(container).find('#instructionBubble').mouseout(
			function( event ) {
				$(container).find('#instructionBubble').hide( );
			}
		);
		
		$(container).mouseout(
			function( event ) {
				$(container).find('#instructionBubble').hide( );
			}
		);
		
		$('.ui-memorygrid-registerinput').focusout(
			function( event ) {
				var cellId = $(event.target).attr( 'id' ).replace( "register", "");
				var cellVal = parseInt( $(event.target).val( ) );
				var data = { cell:cellId, value:cellVal };
				updateCell.call( container, cellId, cellVal );
				onChange( data );
			}
		).mouseover(
			function( event ) {
				var cellId = $(event.target).attr( 'id' ).replace( "register", "");
				if ( cellId == 'IP' ) {
					var memoryObj = $(container).find( '#memory' + $(event.target).val() );
					var toOffset   = memoryObj.offset();
					var fromOffset = $(event.target).offset();
					// TODO
				}
				
			}
		).mouseout(
			function( event ) {
				// TODO
			}
		);
		
	};
})(jQuery);