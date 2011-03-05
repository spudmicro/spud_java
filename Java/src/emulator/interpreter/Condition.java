package emulator.interpreter;

import java.util.ArrayList;

public class Condition {
    public ArrayList<Token> condition;
    public ArrayList<ArrayList<Token>> statements;
    public Boolean continuation;
    
    public Condition(ArrayList<Token> condition, ArrayList<ArrayList<Token>> statements, Boolean continuation) {
    	this.condition = condition;
    	this.statements = statements;
    	this.continuation = continuation;
    }
}
