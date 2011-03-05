package emulator.interpreter;

public class InterpreterError extends Exception {
	private static final long serialVersionUID = 1L;
	private String message;
	private int id;

	public InterpreterError( String message, int id ) {
        super( );
        this.message = message;
        this.id = id;
    }
	
	public InterpreterError( String message ) {
        super( );
        this.message = message;
        this.id = 0;
    }
	
	public InterpreterError( ) {
        super( );
        this.message = "";
        this.id = 0;
    }
	
	public String toString( ) {
		return message + " " + Integer.toString(this.id);
	}
	
    public void assert_( Boolean condition, String message ) throws InterpreterError {
        if ( !condition ) {
            throw new InterpreterError( message );
        }
    }
    
}
