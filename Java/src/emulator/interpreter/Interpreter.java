package emulator.interpreter;

import java.util.ArrayList;
import java.util.HashMap;

import emulator.State;

public class Interpreter {
    public static final String guardKeyword  = "case";
    public static final String helperKeyword = "where";
    public static final String pretestKeyword = "whenever";
    public static final String statementSeparator = ";";
    public static final char conditionTerminator = ':';
    public static final char instructionPartSeparator = ',';
    
    private State state;
    
    private ArrayList<Token> tokens;
    private Token acceptedToken = null;
    private Token pendingToken;
    
    private int tokenPos = 0;
    
    private HashMap<String,ArrayList<Token>> where;
    
    public Boolean internalAccessible = false;
    
    public Interpreter( ArrayList<Token> tokens, State state, HashMap<String,ArrayList<Token>> where ) {
        this.state = state;
        this.tokens = tokens;
        this.where = where;
        getToken( );
    }
    
    private void getToken() {
        if ( tokenPos != tokens.size( ) ) {
            pendingToken = tokens.get( tokenPos );
            tokenPos++;
        } else {
            pendingToken = null;
        }
    }
    
    private Boolean accept( int tokenType ) {
        Boolean accepted = false;
        
        if ( pendingToken != null && pendingToken.type == tokenType ) {
            //trace( "[Interpreter.accept] tokenType: " + tokenType );
            //trace( "[Interpreter.accept] pendingToken: " + pendingToken.toString( ) );
            acceptedToken = pendingToken;
            getToken( );
            accepted = true;
        }
        
        return accepted;    
    }
    
    private void expect( int tokenType ) throws InterpreterError {
        if ( !accept( tokenType ) ) {
            throw new InterpreterError( "Expected " + Token.typeString( tokenType ) + " but found " + pendingToken.typeToString() );
        }
    }
    
    private Boolean validRegister( String registerName ) {
        return (state.processor.getRegisterNames( ).indexOf( registerName ) != -1);
    }
    
    
    
    /*
     * Recursive Descent:
     */
    
    private int bitExpression() throws InterpreterError {
        int value = addExpression( );
        
        while ( accept( Token.OpBitwise ) ) {
            if ( acceptedToken.value.equals( "^" ) ) {
                value ^= addExpression( );
            } else if ( acceptedToken.value.equals( "&" ) ) {
                value &= addExpression( );
            } else if ( acceptedToken.value.equals( "|" ) ) {
                value |= addExpression( );
            } else if ( acceptedToken.value.equals( ">>" ) ) {
                value >>= addExpression( );
            } else if ( acceptedToken.value.equals( "<<" ) ) {
                value <<= addExpression( );
            } else {
                throw new InterpreterError( "Unknown bitwise operator: " + acceptedToken.value );
            }
        }
        
        return value;
    }
    
    private int addExpression() throws InterpreterError {
        int value = mulExpression();
        while ( accept( Token.OpTerm ) ) {
        	if ( acceptedToken.value.equals( "+" ) ) {
                value += mulExpression( );
        	} else if ( acceptedToken.value.equals( "-" ) ) {
                value -= mulExpression( );
        	} else {
                throw new InterpreterError( "Unknown additive operator: " + acceptedToken.value );
            }
        }
        
        return value;
    }
    
    private int mulExpression() throws InterpreterError {
        int value = unaryExpression();
        
        while ( accept( Token.OpFactor ) ) {
        	if ( acceptedToken.value.equals( "*" ) ) {
                value *= unaryExpression( );
        	} else if ( acceptedToken.value.equals( "/" ) ) {
                value /= unaryExpression( );
        	} else if ( acceptedToken.value.equals( "%" ) ) {
                value %= unaryExpression( );
        	} else {
                throw new InterpreterError( "Unknown multiplicative operator: " + acceptedToken.value );
            }
        }
        
        return value;
    }
    
    private int unaryExpression() throws InterpreterError {
        Boolean isUnary = accept( Token.OpUnary );

        int value = simpleExpression( );
        
        if ( isUnary ) {
        	if ( acceptedToken.value.equals( "~" ) ) {
                value = ~value;
        	} else {
                throw new InterpreterError( "Unknown unary operator: " + acceptedToken.value );
            }
        }
        
        return value;
    }
    
    private int simpleExpression() throws InterpreterError {
        int value = -1; // todo: is this necessary?
        
        if ( accept( Token.GroupOpen ) ) {
            value = intExpression();
            expect( Token.GroupClose );
        } else if ( accept( Token.Integer ) ) {
            value = Integer.parseInt( acceptedToken.value );
        } else if ( accept( Token.Hex ) ) {
            value = Integer.parseInt( acceptedToken.value, 16 );
        } else if ( pendingToken.type == Token.RegisterName || pendingToken.type == Token.DerefOpen || pendingToken.type == Token.RegRefOpen ) {
            value = identifier();
        } else if ( pendingToken != null ) {
            throw new InterpreterError( "Unable to parse expression at: " + pendingToken.value );
        }
        
        return value;
    }
    
    private int identifier() throws InterpreterError {
        int value = -1; // todo: is this necessary?
        String registerName;
        
        if ( accept( Token.RegisterName ) ) {
            registerName = acceptedToken.value;
            
            if ( validRegister( registerName ) ) {
                value = state.getRegister( registerName );
            } else if ( where.containsKey( registerName ) ) {
                // lookup a 'where' clause value
                //trace( "WHERE" );
                value = Interpreter.interpretExpression( where.get(registerName), state, where );
            } else {
                throw new InterpreterError( "Unknown register or 'where' identifier: " + registerName );
            }
        } else if ( accept( Token.DerefOpen ) ) {
            int address = intExpression();
            
            expect( Token.DerefClose );
            
            value = state.getMemory( address );
        } else if ( accept( Token.RegRefOpen ) ) {
            int registerNumber = intExpression();
            
            expect( Token.RegRefClose );
            
            if ( registerNumber < state.processor.getNumRegisters() ) {
                registerName = state.processor.getRegisterNames().get(registerNumber);
                value = state.getRegister( registerName );
            } else {
                //trace( "[identifier] Out of bounds register reference" );
            }
        } else if ( accept( Token.Internal ) ) {
            if ( internalAccessible ) {
                if ( acceptedToken.value.equals("numBellRings") ) {
                    value = state.numBellRings;
                } else if ( acceptedToken.value.equals( "numCycles" ) ) { 
                    value = state.executionStep;
                } else {
                    throw new InterpreterError( "Unknown integer internal value" );
                }
            } else {
                throw new InterpreterError( "Internal information inaccessible" );
            }
        } else {
            throw new InterpreterError( "Unrecognised identifier: " + pendingToken.value );
        }
        
        //trace("[identifier] value: " + value.toString() );
        return value;
    }
    
    private int intExpression() throws InterpreterError {
        return bitExpression();
    }
    
    private Boolean stringComparison() throws InterpreterError {
        Boolean value;
        
        
        if ( internalAccessible ) {
            expect( Token.Internal );
        
            if ( acceptedToken.value != "output" ) {
                throw new InterpreterError( "Unknown internal string identifier: " + acceptedToken.value );
            } 
        
            expect( Token.OpComparison );
        
            if ( acceptedToken.value.equals( "==" ) ) {
                expect( Token.StringLiteral );
                
                value = state.output.equals( acceptedToken.value );
                
            } else if ( acceptedToken.value.equals( "!=" ) ) {
                expect( Token.StringLiteral );
                
                value = !state.output.equals( acceptedToken.value );
                
            } else {
                throw new InterpreterError( "Unknown string comparison operator: " + acceptedToken.value );
            }
        } else {
            throw new InterpreterError( "Internal information inaccessible." );
        }
        
        return value;
    }

    private Boolean boolExpression() throws InterpreterError {
        Boolean value;
        
        if ( accept( Token.BoolLiteral ) ) {
            if ( acceptedToken.value.equals( "true" ) || acceptedToken.value.equals( "otherwise" ) ) {
                value = true;
            } else if ( acceptedToken.value.equals( "false" ) ) {
                    value = false;
            } else {
                throw new InterpreterError( "Unknown boolean literal: " + acceptedToken.value );
            }
        } else if ( accept( Token.GroupOpen ) ) {
            
            value = condition();
            
            expect( Token.GroupClose );
        } else if ( pendingToken.type == Token.Internal && pendingToken.value.equals("output")) { 
            value = stringComparison();
        } else {
            int leftSide = intExpression( );
            
            expect( Token.OpComparison );
            String operator = acceptedToken.value;
            int rightSide = intExpression( );
            
            if ( operator.equals( ">" ) ) {
            	value = leftSide > rightSide;
            } else if ( operator.equals( "<" ) ) {
            	value = leftSide < rightSide;
            } else if ( operator.equals( ">=" ) ) {
            	value = leftSide >= rightSide;
            } else if ( operator.equals( "<=" ) ) {
            	value = leftSide <= rightSide;
            } else if ( operator.equals( "==" ) ) {
            	value = leftSide == rightSide;
            } else if ( operator.equals( "!=" ) ) {
            	value = leftSide != rightSide;
            } else {
                throw new InterpreterError( "Unknown comparison operator: " + operator );
            }
        }
        
        return value;
    }
    
    private Boolean condition( ) throws InterpreterError {
        Boolean value = boolExpression( );
        
        while ( accept( Token.OpLogic ) ) {
            if ( acceptedToken.value.equals( "&&" ) ) {
                value = value && boolExpression( );
            } else if ( acceptedToken.value.equals( "||" ) ) {
                value = value || boolExpression( );
            } else {
                throw new InterpreterError( "Unknown boolean operator: " + acceptedToken.value );
            }
        }

        return value;
    }
    
    
    private int assignment( int oldValue ) throws InterpreterError {
        int newValue;
        
                
        if ( accept( Token.OpAssign ) ) {
            
            String tokenValue = acceptedToken.value;
            
            // Recurse
            newValue = intExpression();
            
            //trace( "[assignment] newValue: " + newValue );
            
            if ( tokenValue.equals("+=") ) {
                newValue = oldValue + newValue;
            } else if ( tokenValue.equals( "-=" ) ){
                newValue = oldValue - newValue;
            } else if ( tokenValue.equals( "=" ) ) {
             	// new value already set
            } else {
                throw new InterpreterError( "Unknown assignment operator: " + acceptedToken.value );
            }
            
        } else if ( accept( Token.OpIncAssign ) ) {
            
            newValue = oldValue;
            
            if ( acceptedToken.value.equals("++") ) {
                newValue++;
            } else if ( acceptedToken.value.equals("--") ) {
                newValue--;
            } else {
                throw new InterpreterError( "Unknown increment operator: " + acceptedToken.value );
            }
            
        } else {
            throw new InterpreterError( "Unknown assignment operator: " + pendingToken.value );
        }
        return newValue;
    }
    
    private void statement() throws InterpreterError {
        int value;
        if ( accept( Token.RegisterName ) ) {
            // register name assignment
            
            String registerName = acceptedToken.value;
            
            if ( validRegister( registerName ) ) {
                // recognised register name
                value = assignment( state.getRegister( registerName ) );
                state.setRegister( registerName, value );
                //trace( "[statement] set register " + registerName + " to " + value.toString() ); // TODO (auto): no "set" in java
            } else {
                throw new InterpreterError( "Unknown register name: " + registerName );
            }
            
        } else if ( accept( Token.DerefOpen ) ) {
            // memory address assignment
            
            int memoryAddress = intExpression();
            
            expect( Token.DerefClose );
            
            value = assignment( state.getMemory( memoryAddress ) );
            state.setMemory( memoryAddress, value );
            
        } else if ( accept( Token.RegRefOpen ) ) {
            // register reference assignment
            
            int registerNumber = intExpression();
            
            expect( Token.RegRefClose );
            
            
            if ( registerNumber < state.processor.getNumRegisters( ) ) {
                String registerName = state.processor.getRegisterNames( ).get( registerNumber );
                value = assignment( state.getRegister( registerName ) );
                state.setRegister( registerName, value );
            } else {
                //trace( "[statement] Out of bounds register reference" );
            }
            
        } else if ( accept( Token.Keyword ) ) {
            // command keyword
            
            int argumentValue;

                if ( acceptedToken.value.equals( "print" ) ) {
                    expect( Token.GroupOpen );
                    argumentValue = intExpression();
                    expect( Token.GroupClose );
                    
                    state.print( argumentValue );
                } else if ( acceptedToken.value.equals( "printASCII" ) ) {
                    // generalise TODO into functionArguments function:
                    expect( Token.GroupOpen );
                    argumentValue = intExpression();
                    expect( Token.GroupClose );
                    
                    state.printASCII( argumentValue );
                } else if ( acceptedToken.value.equals( "bell" ) ) {
                    state.ringBell();
                } else if ( acceptedToken.value.equals( "halt" ) ) {
                    state.halt();    
                } else if ( acceptedToken.value.equals( "nop" ) ) {
                    // twiddle thumbs    
                } else {
                    throw new InterpreterError( "Unknown command: " + acceptedToken.value );
                }
        } else {
            throw new InterpreterError( "Unable to parse statement, register name, memory address or command not found." );
        }

    } 
    
    /*
     * Interface
     */
    static public void interpretStatement( ArrayList<Token> statementTokens, State state, HashMap<String,ArrayList<Token>> where ) throws InterpreterError {
        Interpreter interpreter = new Interpreter( statementTokens, state, where );
        interpreter.statement();
    }
    
    static public Boolean interpretCondition( ArrayList<Token> conditionTokens, State state, HashMap<String,ArrayList<Token>> where  ) throws InterpreterError {
        Interpreter interpreter = new Interpreter( conditionTokens, state, where );
        return interpreter.condition();
    }
    
    static public int interpretExpression( ArrayList<Token> expressionTokens, State state, HashMap<String,ArrayList<Token>> where  ) throws InterpreterError {
        Interpreter interpreter = new Interpreter( expressionTokens, state, where );
        return interpreter.intExpression();
    }

}





