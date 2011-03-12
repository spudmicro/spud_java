
var requiredLibraries = [
	"libs/jquery.mousewheel.js",
	"libs/jquery.jscrollpane.min.js",
	"libs/mwheelIntent.js",
	"libs/jquery.sound.js",
	"libs/jquery.dbj_sound.js",
	"libs/jquery-ui-1.8.9.custom.min.js",
	"libs/jquery.color.js",
	"libs/memorygrid.js",
    
	"controller.js",
	"applet.js",
    
	"hardware.js",
	"upload.js",
	"internalstate.js",
	"spud.js",
	"reference.js"
];
var nextScriptToLoad = 0;

var embedSpudContainer = null;

function loadNextScript( ) {
	if ( requiredLibraries.length == nextScriptToLoad ) {
		// done!
		init( embedSpudContainer ); // part of controller.js
		return;
	}
	
	var scriptName = requiredLibraries[nextScriptToLoad];
	nextScriptToLoad++;
	
	$.ajax({
		url: scriptName,
		dataType: 'script',
		success: loadNextScript,
		error: function(jqXHR, textStatus, errorThrown) {
			alert( 'Could not load ' + scriptName );
		}
	});
}

function embedSpud( container_id ) {
	var container = $('#'+container_id);
	embedSpudContainer = container;
	
	var head = document.getElementsByTagName('head')[0];
	
	// start loading scripts
	loadNextScript( );
	
	$(head).append( 
		"<link rel=\"stylesheet\" type=\"text/css\" href=\"css/custom-theme/jquery-ui-1.8.9.custom.css\" />" +

		"<link rel=\"stylesheet\" type=\"text/css\" href=\"media/fonts.css\" />" +
		"<link rel=\"stylesheet\" type=\"text/css\" href=\"css/style.css\" />" +
		"<link rel=\"stylesheet\" type=\"text/css\" href=\"css/jquery.jscrollpane.css\" />" +
		"<link rel=\"stylesheet\" type=\"text/css\" href=\"css/memorygrid.css\" />"
	);
	
	container.html(
		'<div id="spud_container">' +
			'<div id="hardware"></div>' +
			'<div id="buttons"></div>' + 
			'<div><object type="application/x-java-applet" width="1" height="1" id="applet">' +
			' <param name="code" value="emulator/AppletRunner.class" value="code">' +
			'</object></div>' +
		'</div>'
	);
}