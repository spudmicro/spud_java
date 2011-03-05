package emulator;

//import netscape.javascript.*;
import java.applet.*;
import java.awt.*;
import emulator.builtin.*;
import emulator.interpreter.*;

import java.net.*;

public class AppletRunner extends Applet {
    /**
	 * 
	 */
	private static final long serialVersionUID = 7209576351844103952L;

	private Processor processor;
	private State state;
	private Emulator emulator;
	
	public void init( ) {
		processor = new Processor4917( );
		state = new State( processor );
		emulator = new Emulator( );
    }

    public void paint( Graphics g ) {
		g.drawString( "Yay! Graphics!", 50, 25 );
	}

    
	// Javascript interface functions:
	public String step( ) {
		emulator.step( state );
		return getState( );
	}
    
	public String clearState( ){
		state = new State(processor);
		return getState( );
	}
	
	public void setMemory( int address, int value ) {
		state.setMemory( address, value );
	}
	
	public void setRegister( String register, int value ) {
		state.setRegister( register, value );
	}
	
	public String getState( ) {
		return state.toJSON();
	}
    
	public void executeScript( String javascript ) {
		try {
			getAppletContext().showDocument( new URL( "javascript:" + javascript ) );
		} catch ( MalformedURLException e ) {
			// Auto-generated catch block
			e.printStackTrace();
		}
	}
	
    public String getProcessor( ) {
    	return processor.getJSON( );
    }
    
    public String loadSPuD( String definition ) {
    	Processor trialProcessor;
		try {
			trialProcessor = new InterpretedProcessor( definition );
			// if there are no errors:
			this.processor = trialProcessor;
			this.state = new State( processor );
			this.emulator = new Emulator( );
		} catch (InterpreterError e) {
			executeScript("alert('Error parsing SPuD processor definition.');");
		}
    	
    	return getState( );
    }
}
