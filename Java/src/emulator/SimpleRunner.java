package emulator;

/*import java.util.Arrays;
*/
import java.util.ArrayList;

import emulator.interpreter.*;

public class SimpleRunner {
	/*public static void main(String[] args) throws Exception {
		String definition = util.Files.readFile( "/Users/dougallj/Dropbox/Projects/Microprocessor/src/8918.proc" );
		ArrayList<Integer> program = new ArrayList<Integer>( Arrays.asList( new Integer[] {40} ) );
		Processor processor = new InterpretedProcessor( definition );
		System.out.println(processor.getJSON());
		State state = new State( processor );
		state.setAllMemory( program );
		Emulator emulator = new Emulator( );
		emulator.run( state, 10000 );
	}*/

	
	public String run(ArrayList<Integer> program, String processorDefinition, int maxCycles) throws InterpreterError {
		
		Processor processor = new InterpretedProcessor( processorDefinition );
		
		State state = new State( processor );
		state.setAllMemory( program );
		
		Emulator emulator = new Emulator( );
		emulator.run( state, maxCycles );
		
		return state.toJSON();
	}
}
