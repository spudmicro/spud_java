package emulator.interpreter;

import java.util.ArrayList;
import java.util.Arrays;

import emulator.Instruction;
import emulator.State;

import java.util.HashMap; // TODO (auto): no flash imports

public class InterpretedInstruction extends Instruction {
    private ArrayList<Condition> conditions;
    private HashMap<String,ArrayList<Token>> where;
    private Tokeniser tokeniser = new Tokeniser();
    
    public InterpretedInstruction( String description, int ipIncrement, String code ) throws InterpreterError {
        super( description, ipIncrement );
        updateCode( code );
    }
    
    private String removeWhitespace( String code ) {
        // replace one or more whitespace chars with a nothing
        return code.replaceAll( "\\s+", "" );
    }
    
    private void addCondition( String conditionCode, String statements, Boolean continuation ) throws InterpreterError {
        
        ArrayList<Token> condition = tokeniser.tokenise( conditionCode );
        ArrayList<ArrayList<Token>> tokenisedStatements = new ArrayList<ArrayList<Token>>( );
        
        //trace( conditionCode );
        //trace( statements );
        
        for ( String statement : statements.split( Interpreter.statementSeparator ) ) {
        	tokenisedStatements.add( tokeniser.tokenise( statement ) );
        }
        
        //trace( "[addCondition] tokenised as: " );
        //trace( tokenisedStatements );
        conditions.add( new Condition (condition, tokenisedStatements, continuation) );
    }
    
    public void updateCode( String code ) throws InterpreterError {
        // { code = characters after number, increment defn }
        
        code = removeWhitespace( code );
        conditions = new ArrayList<Condition>( );
        
        // try/catch (non-trusted data)
        
        String startingSymbol = Character.toString( code.charAt( 0 ) );
        
        // detect and remove starting symbol
        if ( startingSymbol.equals( Character.toString( Interpreter.guardKeyword.charAt( 0 ) ) ) ) {
        	// TODO:
            // InterpreterError.assert_( code.substring( 0, Interpreter.guardKeyword.length() ).equals(Interpreter.guardKeyword), "Invalid symbol after instruction header" );
            code = code.substring( Interpreter.guardKeyword.length(), code.length() );
            startingSymbol = Interpreter.guardKeyword;
        } else {
            code = code.substring( 1, code.length() );
        }
        
        //trace( "[updateCode] startingSymbol: " + startingSymbol );
        //trace( "[updateCode] code: " + code );
        
        
        //trace( "[updateCode] Building Tokens for '" + startingSymbol + "': " );
        
        // extract helper clause
        ArrayList<String> parts = new ArrayList<String>( Arrays.asList( code.split( Interpreter.helperKeyword ) ) );
        code = parts.get(0);
        
        //trace( "[updateCode] parts" + parts.toString() );
        
        if ( parts.size() > 1 ) {
            // parse helper clause
        	// TODO:
            //InterpreterError.assert_( parts.size() == 2, "Only one '" + Interpreter.helperKeyword + "' allowed" );
            
            String whereClause = parts.get(1);
            
            ArrayList<String> whereStatements = new ArrayList<String>( Arrays.asList( whereClause.split( Interpreter.statementSeparator ) ) );
            
            where = new HashMap<String,ArrayList<Token>>();
            for ( String whereStatement : whereStatements ) {
                
                if ( whereStatement.length() > 0 ) {
                    
                    ArrayList<String> statementParts = new ArrayList<String>( Arrays.asList( whereStatement.split( "=" ) ) );
                
                    // TODO:
                    //InterpreterError.assert_( statementParts.size() == 2, "assignment required" );
                
                    String key = statementParts.get( 0 );
                    String expressionValue = statementParts.get( 1 );
                
                    where.put( key, tokeniser.tokenise( expressionValue ) );
                }
            }
        }
        
        if ( startingSymbol.equals( Character.toString( Interpreter.conditionTerminator ) ) ) {
            // is a single command
            
            //trace( "[updateCode] Single Instruction" );
            addCondition( "true", code, false );
        } else if ( startingSymbol.equals( Interpreter.guardKeyword ) ) {
            // is a conditional command
            //trace( "[updateCode] Conditional Instruction" );
            // split code into condition blocks
            ArrayList<String> chunks = new ArrayList<String>( Arrays.asList( code.split( Interpreter.guardKeyword ) ) );
            
            //trace( chunks );
            
            for ( int i = 0; i != chunks.size(); i++ ) {
                
                // split condition blocks into condition and program
                ArrayList<String> subChunks = new ArrayList<String>( Arrays.asList( chunks.get( i ).split( Character.toString( Interpreter.conditionTerminator ) ) ) );
                Boolean continuation = false;
                
                // fallthrough dodgy conditions
                if ( subChunks.size() == 1 ) {
                    subChunks = new ArrayList<String>( Arrays.asList( chunks.get( i ).split( "?" ) ) );
                    continuation = true;
                }
                
                String condition = subChunks.get( 0 );
                String program = subChunks.get( 1 );
                
                if ( condition.length() > 0 ) {
                    addCondition( condition, program, continuation );
                }
            }    
        }
    }
    
    public void execute( State state ) {
        for ( Condition condition : conditions ) {
            try {
                Boolean conditionValue = Interpreter.interpretCondition( condition.condition, state, where );

                if ( conditionValue ) {
                    
                    //trace( "EXECUTING: " + conditionObj['statements'] );
                    for ( ArrayList<Token> statement : condition.statements ) {

                    	//trace( "  * " + statement );
                        Interpreter.interpretStatement( statement, state, where );
                    }
                    
                    // escape after a true condition
                    if ( !condition.continuation ) {
                        break;
                    }
                }
            } catch ( InterpreterError interpreterError ) {
            	// TODO:
            	System.out.println("Error (InterpretedInstruction.java)" + interpreterError.toString());
                //Alert.show( "Parsing Error: " + interpreterError.message );
            }
        }
    }
    
}
