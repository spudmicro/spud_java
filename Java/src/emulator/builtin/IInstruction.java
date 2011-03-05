package emulator.builtin;

import emulator.State;

public interface IInstruction {
	void run( State state );
}
