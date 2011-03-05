package emulator;

public interface IMicroInstruction {
	public String getDescription( );
	public int getBytes( );
	public void execute( State state );
}
