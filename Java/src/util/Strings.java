package util;

import java.util.Iterator;

public class Strings {
	
	/**
	 * Joins an iterable of String together, separated by a delimiter
	 * @param joinMe an iterable of Strings to join
	 * @param delim delimiter to separate joining
	 * @return the joined string
	 */
	public static String join ( Iterable<String> joinMe, String delim ) {
		String target = "";
		
		Iterator<String> iter = joinMe.iterator();
		
		while ( iter.hasNext() ) {
			target += iter.next();
			if ( iter.hasNext( ) ) {
				target += delim;
			}
		}
		
		return target;
	}
}
