package emulator.interpreter;

import emulator.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import util.Strings;

public class InterpretedProcessor extends FetchIncExecProcessor {    
        
    public InterpretedProcessor( String definition ) throws InterpreterError {
        super();
        
        updateDefinition( definition );
    }
    
    private String removeWhitespace( String code ) {
        // replace one or more whitespace chars with a nothing
        return code.replaceAll( "\\s+", "" );
    }
    
    private String trim( String str ) {
        return str.replaceAll( "^\\s+", "" ).replaceAll( "\\s+$", "" );
    }
    
    private Boolean isTitleLine( String line ) {
        return ( !trim( line ).equals( "" ) && trim( line ).charAt( 0 ) == '[');
    }
    
    private void addLineToDict( HashMap<String,String> dict, String line ) {
        //trace( " InterpretedProcessor.addLineToDict" );
        //trace( "  trimmed line: " + trim( line ) );
        if ( !trim( line ).equals( "" ) ) {
            
            ArrayList<String> property = new ArrayList<String>( Arrays.asList( line.split( ":" ) ) );
            String key = trim( property.get(0) );
            
            property = new ArrayList<String>( property.subList( 1, property.size() ) );
            String value = trim( Strings.join( property, ":" ) ); // TODO
            
            //trace( "  key: " + key + ", value: " + value );

            dict.put(key, value);
        }
    }
    
    private Boolean isDigit( char c ) {
        return ( c >= '0' && c <= '9' );
    }
    
    private ArrayList<Integer> extractHeader( String code ) {
        ArrayList<Integer> header = new ArrayList<Integer>();
        int i;
        int start, end;

        i = 0;
        start = i;
        while ( i != code.length( ) && code.charAt( i ) != Interpreter.instructionPartSeparator ) {
            i++;
        }
        
        end = i;
        header.add( Integer.parseInt( code.substring( start, end ) ) );
        
        i++; // skip separator char
        start = i;
        while ( i != code.length() && isDigit( code.charAt( i ) ) ) {
            i++;
        }
        
        end = i;
        header.add( Integer.parseInt( code.substring( start, end ) ) );
        
        return header;
    }
    
    private String extractCodeSection( String code ) {
        int codeStart;
        for ( codeStart = 0; codeStart != code.length(); codeStart++ ) {
            // or detect case statement
            if ( code.charAt( codeStart ) == Interpreter.conditionTerminator
                || code.substring( codeStart, codeStart + Interpreter.guardKeyword.length() ).equals( Interpreter.guardKeyword ) ) {
                break;
            }
        }
        return code.substring( codeStart, code.length() );
    }
    
    
    private void addInstructionCode( String code, HashMap<String, String> descriptions ) throws InterpreterError {
        String instrNumStr;
        Integer instrNum;
        int ipInc;
        String instrCode;
        
        ArrayList<Integer> headerParts = extractHeader( code );
        instrNum = headerParts.get(0);
        instrNumStr = instrNum.toString();
        ipInc = headerParts.get(1);
        
        instrCode = extractCodeSection( code );
        /*
        trace( "[InterpretedProcessor.addInstructionCode] code: " + code );
        trace( "[InterpretedProcessor.addInstructionCode] instrNumStr: " + instrNumStr );
        trace( "[InterpretedProcessor.addInstructionCode] ipInc: " + ipInc );
        trace( "[InterpretedProcessor.addInstructionCode] instrCode: " + instrCode );
        */
        // because java won't let you set past the end of an arraylist
        while (this.instructions.size() <= instrNum) {
        	this.instructions.add(null);
        }
        this.instructions.set(instrNum, new InterpretedInstruction( descriptions.get(instrNumStr), ipInc, instrCode ));
    }
    
    public void updateDefinition( String definition ) throws InterpreterError {
        
        HashMap<String,String> properties = new HashMap<String,String>( );
        HashMap<String,String> descriptions = new HashMap<String,String>( );
        
        this.instructions = new ArrayList<IMicroInstruction>( );
        
        ArrayList<String> lines =  new ArrayList<String>( Arrays.asList( definition.split( "\n" ) ) );
        int lineNum = 0;
        
        while ( !isTitleLine( lines.get(lineNum) ) ) {
            // up until next [ ] heading
            
            addLineToDict( properties, lines.get(lineNum) );
            
            lineNum++;
        }
        // {{ lines[lineNum] starts with '[' }}
        
        this.name = properties.get("name");
        this.memoryBitSize = Integer.parseInt( properties.get("memoryBitSize") );
        this.numMemoryAddresses = Integer.parseInt( properties.get("numMemoryAddresses") );
        this.registerBitSize = Integer.parseInt( properties.get("registerBitSize") );
        
        ArrayList<String> registerNames = new ArrayList<String>( );
        
        for ( String regName : properties.get("registerNames").split( "," ) ) {
            registerNames.add( trim( regName ) ); // order is important
        }
        
        this.setRegisterNames(registerNames); // setter does verification
        
        // grab instruction descriptions
        if ( trim( lines.get(lineNum) ).equals( "[descriptions]" ) ) {
            lineNum++;
            
            while ( !isTitleLine( lines.get(lineNum) ) ) {
            // up until next [ ] heading
            
                addLineToDict( descriptions, lines.get(lineNum) );
            
                lineNum++;
            }
            
        } else {
            throw new InterpreterError( "Descriptions must be listed before instructions." );
        }
        
        String code;
        if ( trim( lines.get(lineNum) ).equals( "[instructions]" ) ) {
            lineNum++;
            
            // code = all following lines without newlines
            // remove all text before start of instructions
            code = Strings.join(lines.subList( lineNum, lines.size( ) ), "");
            code = removeWhitespace( code );
        } else {
            throw new InterpreterError( "No Instruction Set Defined" );
        }
        
        // splits each instruction definition
        ArrayList<String> instructionCodes = new ArrayList<String>( Arrays.asList( code.split( "\\." ) ) );
        for ( String instructionCode : instructionCodes ) {
            if ( instructionCode != "" ) {
                addInstructionCode( instructionCode, descriptions );
            }
        }   
    }
}
