package emulator.builtin;

import java.util.ArrayList;
import java.util.Arrays;

import emulator.*;

public class Processor4917 extends FetchIncExecProcessor {
    public Processor4917() {
        super();
                    
        this.name = "4917";
        this.memoryBitSize = 4;
        this.numMemoryAddresses = 16;
        this.registerBitSize = 4;
        
        this.setRegisterNames( new ArrayList<String>( Arrays.asList( new String[] {"IP", "IS", "R0", "R1"} ) ) );
        
        IInstruction InstructionHalt = new IInstruction( ) { public void run(State state) { InstructionHalt( state ); } };
        IInstruction InstructionAdd = new IInstruction( ) { public void run(State state) { InstructionAdd( state ); } };
        IInstruction InstructionSubtract = new IInstruction( ) { public void run(State state) { InstructionSubtract( state ); } };
        IInstruction InstructionIncrementR0 = new IInstruction( ) { public void run(State state) { InstructionIncrementR0( state ); } };
        IInstruction InstructionIncrementR1 = new IInstruction( ) { public void run(State state) { InstructionIncrementR1( state ); } };
        IInstruction InstructionDecrementR0 = new IInstruction( ) { public void run(State state) { InstructionDecrementR0( state ); } };
        IInstruction InstructionDecrementR1 = new IInstruction( ) { public void run(State state) { InstructionDecrementR1( state ); } };
        IInstruction InstructionRingBell = new IInstruction( ) { public void run(State state) { InstructionRingBell( state ); } };
        IInstruction InstructionPrint = new IInstruction( ) { public void run(State state) { InstructionPrint( state ); } };
        IInstruction InstructionLoadR0 = new IInstruction( ) { public void run(State state) { InstructionLoadR0( state ); } };
        IInstruction InstructionLoadR1 = new IInstruction( ) { public void run(State state) { InstructionLoadR1( state ); } };
        IInstruction InstructionStoreR0 = new IInstruction( ) { public void run(State state) { InstructionStoreR0( state ); } };
        IInstruction InstructionStoreR1 = new IInstruction( ) { public void run(State state) { InstructionStoreR1( state ); } };
        IInstruction InstructionJump = new IInstruction( ) { public void run(State state) { InstructionJump( state ); } };
        IInstruction InstructionJumpIfR0is0 = new IInstruction( ) { public void run(State state) { InstructionJumpIfR0is0( state ); } };
        IInstruction InstructionJumpIfR0not0 = new IInstruction( ) { public void run(State state) { InstructionJumpIfR0not0( state ); } };
        
        this.instructions = new ArrayList<IMicroInstruction> ( Arrays.asList( new IMicroInstruction[] {
            new BuiltinInstruction( "Halt",                       1, InstructionHalt ),
            new BuiltinInstruction( "Add (R0 = R0 + R1)",         1, InstructionAdd ),
            new BuiltinInstruction( "Subtract (R0 = R0 - R1)",    1, InstructionSubtract ),
            new BuiltinInstruction( "Increment R0 (R0 = R0 + 1)", 1, InstructionIncrementR0 ),
            new BuiltinInstruction( "Increment R1 (R1 = R1 + 1)", 1, InstructionIncrementR1 ),
            new BuiltinInstruction( "Decrement R0 (R0 = R0 - 1)", 1, InstructionDecrementR0 ),
            new BuiltinInstruction( "Decrement R1 (R1 = R1 - 1)", 1, InstructionDecrementR1 ),
            new BuiltinInstruction( "Ring Bell",                  1, InstructionRingBell ),
            
            new BuiltinInstruction( "Print <data> (numerical value is printed)", 2, InstructionPrint ),
            new BuiltinInstruction( "Load value at address <data> into R0",      2, InstructionLoadR0 ),
            new BuiltinInstruction( "Load value at address <data> into R1",      2, InstructionLoadR1 ),
            new BuiltinInstruction( "Store R0 into address <data>",              2, InstructionStoreR0 ),
            new BuiltinInstruction( "Store R1 into address <data>",              2, InstructionStoreR1 ),
            new BuiltinInstruction( "Jump to address <data>",                    2, InstructionJump ),
            new BuiltinInstruction( "Jump to address <data> if R0 == 0",         2, InstructionJumpIfR0is0 ),
            new BuiltinInstruction( "Jump to address <data> if R0 != 0",         2, InstructionJumpIfR0not0 )
        } ) );
    }
    
    
    // Instruction Definitions for 4917
    
    public void InstructionHalt( State state ) {
        state.halt();
    }
    
    public void InstructionAdd( State state ) {
        int r0 = state.getRegister( "R0" );
        int r1 = state.getRegister( "R1" );
        
        state.setRegister( "R0", r0+r1 );
    }
    
    public void InstructionSubtract( State state ) {
        int r0 = state.getRegister( "R0" );
        int r1 = state.getRegister( "R1" );
        
        state.setRegister( "R0", r0-r1 );
    }
    
    public void InstructionIncrementR0( State state ) {
        int r0 = state.getRegister( "R0" );

        state.setRegister( "R0", r0+1 );
    }

    public void InstructionIncrementR1( State state ) {
        int r1 = state.getRegister( "R1" );

        state.setRegister( "R1", r1+1 );
    }
    
    public void InstructionDecrementR0( State state ) {
        int r0 = state.getRegister( "R0" );

        state.setRegister( "R0", r0-1 );
    }

    public void InstructionDecrementR1( State state ) {
        int r1 = state.getRegister( "R1" );

        state.setRegister( "R1", r1-1 );
    }
    
    public void InstructionRingBell( State state ) {
        state.ringBell( );
    }
    
    public void InstructionPrint( State state ) {
        int ip = state.getRegister( "IP" );
        int data = state.getMemory( ip-1 );
        state.print( data );
    }
    
    public void InstructionLoadR0( State state ) {
        int ip = state.getRegister( "IP" );
        int address = state.getMemory( ip-1 );
        
        state.setRegister( "R0", state.getMemory( address ) );
    }
    
    public void InstructionLoadR1( State state ) {
        int ip = state.getRegister( "IP" );
        int address = state.getMemory( ip-1 );
        
        state.setRegister( "R1", state.getMemory( address ) );
    }
    
    public void InstructionStoreR0( State state ) {
        int ip = state.getRegister( "IP" );
        int address = state.getMemory( ip-1 );
        
        state.setMemory( address, state.getRegister( "R0" ) );
    }
    
    public void InstructionStoreR1( State state ) {
        int ip = state.getRegister( "IP" );
        int address = state.getMemory( ip-1 );
        
        state.setMemory( address, state.getRegister( "R1" ) );
    }

    public void InstructionJump( State state ) {
        int ip = state.getRegister( "IP" );
        int address = state.getMemory( ip-1 );            
        
        state.setRegister( "IP", address );
    }        

    public void InstructionJumpIfR0is0( State state ) {
        if ( state.getRegister( "R0" ) == 0 ) {
            int ip = state.getRegister( "IP" );
            int address = state.getMemory( ip-1 );            
        
            state.setRegister( "IP", address );
        }
    }    
    
    public void InstructionJumpIfR0not0( State state ) {
        if ( state.getRegister( "R0" ) != 0 ) {
            int ip = state.getRegister( "IP" );
            int address = state.getMemory( ip-1 );            
        
            state.setRegister( "IP", address );
        }
    }
    
}
