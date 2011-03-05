package emulator.interpreter;

import java.util.ArrayList;
import java.util.Arrays;

public class Token {
    public static final int OpAssign        = 0;
    public static final int OpLogic         = 1;
    public static final int OpComparison    = 2;
    public static final int BoolLiteral     = 3;
    public static final int GroupOpen       = 4;
    public static final int GroupClose      = 5;
    public static final int OpTerm          = 6;
    public static final int OpFactor        = 7;
    public static final int Integer         = 8;
    public static final int Keyword         = 9;
    public static final int RegisterName    = 10;
    public static final int DerefOpen       = 11;
    public static final int DerefClose      = 12;
    public static final int OpIncAssign     = 13;
    public static final int OpBitwise       = 14;
    public static final int OpUnary         = 15;
    public static final int RegRefOpen      = 16;
    public static final int RegRefClose     = 17;
    public static final int Hex             = 18;
    public static final int Internal        = 19;
    public static final int StringLiteral   = 20;
    
    public static String typeString( int type ) {
        ArrayList<String> typeNames = new ArrayList<String>( Arrays.asList( new String[] {
            "assignment",
            "logical operator",
            "logical comparison",
            "boolean literal",
            "open group",
            "close group",
            "term operator",
            "factor operator",
            "integer",
            "keyword",
            "register name",
            "open dereference",
            "close dereference",
            "modifying assignment",
            "bitwise operator",
            "unary operator",
            "register reference open",
            "register reference close",
            "hex hash"
        } ) );
        
        return typeNames.get( type );
    }
    

    public String value;
    public int type;
    
    public String toString() {
        return "(" + Token.typeString( this.type ) + ", \"" + this.value + "\")";
    }
    
    public String typeToString() {
        return Token.typeString( this.type );
    }
    
    public Token( int type, String value ) {
        this.type = type;
        this.value = value;
    }
    
}
