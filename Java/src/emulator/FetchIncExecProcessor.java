package emulator;

import java.util.ArrayList;

public class FetchIncExecProcessor extends Processor {
    public FetchIncExecProcessor() {
        super( );
        
        this.pipeline = new ArrayList<IPipelineStep>( );
        
        
        IPipelineStep fetch = new IPipelineStep( ) {
			public void run(State state) {
				fetch( state );
			}
        };
        
        this.pipeline.add( fetch );
        
        
        IPipelineStep increment = new IPipelineStep( ) {
			public void run(State state) {
				increment( state );
			}
        };
        
        this.pipeline.add( increment );
        
        
        IPipelineStep execute = new IPipelineStep( ) {
			public void run(State state) {
				execute( state );
			}
        };
        
        this.pipeline.add( execute );
    }
    
    private void fetch( State state ) {
        // The instruction at the address given by IP is loaded into IS
        int ip = state.getRegister( "IP" );
        int instruction = state.getMemory( ip );
        state.setRegister( "IS", instruction );
    }
    
    private void increment( State state ) {
        int ip = state.getRegister( "IP" );
        int instructionNum = state.getRegister( "IS" );
        
        IMicroInstruction instruction = null;
        
        if (instructionNum < state.processor.instructions.size()) {
        	instruction = state.processor.instructions.get( instructionNum );
        }
        
        int ipIncrement;
        if ( instruction == null ) {
            ipIncrement = 1;
        } else {
            ipIncrement = instruction.getBytes();
        }
        
        state.setRegister( "IP", ip + ipIncrement );
    }
    
    private void execute( State state ) {
    	
        int instructionNum = state.getRegister( "IS" );

    	
        IMicroInstruction instruction = null;
        
        if (instructionNum < state.processor.instructions.size()) {
        	instruction = state.processor.instructions.get( instructionNum );
        }
        
        if ( instruction != null ) {
            instruction.execute( state );
        } else {
            // be evil
        }
    }
    
}
