package emulator.interpreter;

import java.util.ArrayList;
import java.util.Arrays;

public class Tokeniser {
    
    private ArrayList<Token> tokens;
    private int position;
    private String code;
    
    /**
     * Tokeniser constructor
     */
    public Tokeniser() {
    }
    
    /**
     * Adds a token to the tokeniser's token list
     * @param type Token type identifier
     * @param value Characters used by this token
     */
    private void addToken( int type, String value ) {
        tokens.add( new Token( type, value ) );
        position += value.length();
    }
    
    /**
     * Throws an InterpreterError
     */
    private void throwError( ) throws InterpreterError {
        throw new InterpreterError( "unrecognised character at: " + code.charAt( position ) );
    }
    
    /* Tokenisers */
    
    private void tokeniseComparison() {
        String couplet = code.substring( position, position+2 );
        char c = code.charAt( position );
        
        if ( couplet.equals( "<=" ) || couplet.equals( ">=" ) || couplet.equals( "!=" ) || couplet.equals( "==" ) ) {
            addToken( Token.OpComparison, couplet );
        } else if ( c == '<' || c == '>' ) {
            addToken( Token.OpComparison, Character.toString( c ) );
        }
    }
    
    private void tokeniseEqualsSign() {
        String couplet = code.substring( position, position+2 );
        
        if ( couplet.equals( "==" ) ) {
            addToken( Token.OpComparison, couplet );
        } else {
            addToken( Token.OpAssign, "=" );
        }
    }
    
    private void tokeniseLogicOp() {
        String couplet = code.substring( position, position+2 );
        char c = code.charAt( position );
        
        if ( couplet.equals( "&&" ) || couplet.equals( "||" ) ) {
            addToken( Token.OpLogic, couplet );
        } else {
            addToken( Token.OpBitwise, Character.toString( c ) );
        }
    }
    
    private void tokeniseBitshift() throws InterpreterError {
        String couplet = code.substring( position, position+2 );
        
        if ( couplet.equals( ">>" ) || couplet.equals( "<<" ) ) { 
            addToken( Token.OpBitwise, couplet );
        } else {
            throw new InterpreterError( "Unknown operator: " + couplet );
        }
    }

    private void tokeniseAddOp() {
        String couplet = code.substring( position, position+2 );
        char c = code.charAt( position );
        
        if ( couplet.equals( "+=" ) || couplet.equals( "-=" ) ) {
            addToken( Token.OpAssign, couplet );
        } else if ( couplet.equals( "++" ) || couplet.equals( "--" ) ) {
            addToken( Token.OpIncAssign, couplet );
        } else {
            addToken( Token.OpTerm, Character.toString(c) );
        }
    }


    private Boolean isDigit( char c ) {
        return ( c >= '0' && c <= '9' );
    }
    
    private Boolean isHexDigit( char c ) {
        return ( isDigit( c ) || ( c >= 'A' && c <= 'F' ) );
    }
    
    private Boolean isLetter( char c ) {
    	
        return (c == '_' || (c >= 'a' && c <= 'z') ||
        		            (c >= 'A' && c <= 'Z'));
    }
    
    private Boolean isAlphanumeric( char c ) {
        return (isDigit( c ) || isLetter( c ));
    }
    
    
    private void tokeniseInteger() {
        String digitStr = "";
        int i = position;
        while ( i < code.length() && isDigit( code.charAt( i ) ) ) {
            digitStr += code.charAt( i );
            i++;
        }
        //System.out.println("Tokenised: "+digitStr);
        addToken( Token.Integer, digitStr );
    }
    
    private void tokeniseHex() {
        String digitStr = "";
        position++; // ignore leading #
        int i = position;
        while ( i < code.length() && isHexDigit( code.charAt( i ) ) ) {
            digitStr += code.charAt( i );
            i++;
        }
        
        addToken( Token.Hex, digitStr );
    }
    
    private void tokeniseStringLiteral() {
        int i = position;
        String stringVal = "";
        
        i++; // skip initial "
        while ( i < code.length() && code.charAt( i ) != '"' ) {
            // escape TODO characters
            stringVal += code.charAt( i );
            i++;
        }
        
        addToken( Token.StringLiteral, stringVal );
        position += 2; // skip opening and closing quotes
        
    }
    
    private void tokeniseKeyword() {
        String keywordStr = "";
        int i = position;
        while ( i < code.length() && isAlphanumeric( code.charAt( i ) ) ) {
            keywordStr += code.charAt( i );
            i++;
        } 

        ArrayList<String> booleanLiterals = new ArrayList<String>( Arrays.asList( new String[] {
                "true",
                "false",
                "otherwise"
        } ) );
        
        ArrayList<String> commands = new ArrayList<String>( Arrays.asList( new String[] {
            "print",
            "printASCII",
            "bell",
            "halt",
            "nop"
        } ) );
        
        ArrayList<String> internalKeywords = new ArrayList<String>( Arrays.asList( new String[] {
            "numBellRings",
            "output",
            "numCycles"
        } ) );
        
        if ( booleanLiterals.contains( keywordStr ) ) {
            addToken( Token.BoolLiteral, keywordStr );
        } else if ( commands.contains( keywordStr ) ) {
            addToken( Token.Keyword, keywordStr );
        } else if ( internalKeywords.contains( keywordStr ) ) {
            addToken( Token.Internal, keywordStr );
        } else {
            addToken( Token.RegisterName, keywordStr );        
        }
    }
    
    public ArrayList<Token> tokenise( String code ) throws InterpreterError {
        this.code = code;
        
        tokens = new ArrayList<Token>();
        
        char c;
        
        position = 0;
        while ( position != code.length() ) {
            c = code.charAt( position );
            
            switch ( c ) {
                case '(': {
                    addToken( Token.GroupOpen, Character.toString( c ) );
                } break;
                
                case ')': {
                    addToken( Token.GroupClose, Character.toString( c ) );
                } break;
                
                case '[': {
                    addToken( Token.DerefOpen, Character.toString( c ) );
                } break;
                
                case ']': {
                    addToken( Token.DerefClose, Character.toString( c ) );
                } break;
                
                case '{': {
                    addToken( Token.RegRefOpen, Character.toString( c ) );
                } break;
                
                case '}': {
                    addToken( Token.RegRefClose, Character.toString( c ) );
                } break;
                
                case '*': 
                case '/':
                case '%': {
                    addToken( Token.OpFactor, Character.toString( c ) );
                } break;
                
                case '~': {
                    addToken( Token.OpUnary, Character.toString( c ) );
                } break;
                
                case '+': 
                case '-': {
                    tokeniseAddOp();
                } break;
                
                case '<':
                case '>':
                case '!': {
                    if ( code.charAt( position + 1 ) == c ) {
                        // two of the same
                        tokeniseBitshift();
                    } else {
                        tokeniseComparison();
                    }
                } break;
                
                case '=': {
                    tokeniseEqualsSign();
                } break;
                
                case '#': {
                    tokeniseHex();
                } break;
                
                case '&':
                case '|':
                case '^': {
                    tokeniseLogicOp();
                } break;
                
                case '"': {
                    tokeniseStringLiteral();
                } break;
                
                default: {
                    if ( isDigit( c ) ) {
                        tokeniseInteger();
                    } else if ( isLetter( c ) ) {
                        tokeniseKeyword();
                    } else {
                        throwError();
                    }
                } break;
            }    
        }
        
        return tokens;
    }    
}
