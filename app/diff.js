/*
This file is modified version of scottgonzalez/pretty-diff
https://github.com/scottgonzalez/pretty-diff

Thanks for the script @scottgonzalez.
*/


module.exports = function( diff, fn ) {
			fn( null, splitByFile( diff ) );
};

function splitByFile( diff ) {
	var filename;
	var isEmpty = true;
	var files = {};

	diff.split( "\n" ).forEach(function( line, i ) {
		// Unmerged paths, and possibly other non-diffable files
		// https://github.com/scottgonzalez/pretty-diff/issues/11
		if ( !line || line.charAt( 0 ) === "*" ) {
			return;
		}
		if ( line.charAt( 0 ) === "d" ) {
			isEmpty = false;
			filename = line.replace( /^diff --(?:cc |git a\/)(\S+).*$/, "$1" );
			files[ filename ] = [];
		}
		if (i > 5) files[ filename ].push( line );
	});

	if ( !files ) {
		console.log( "No differences" );
		return;
	}
	return generatePrettyDiff( files );
}

function generatePrettyDiff( parsedDiff ) {
	var diffHtml = "";

	for ( var file in parsedDiff ) {
		diffHtml += "<h2>" + file + "</h2>" +
		"<div class='file-diff'><div>" +
			markUpDiff( parsedDiff[ file ] ) +
		"</div></div>";
	}
	return diffHtml;
}

var markUpDiff = function() {
	var diffClasses = {
		"d": "file",
		"i": "file",
		"@": "info",
		"-": "delete",
		"+": "insert",
		" ": "context"
	};

	function escape( str ) {
		return str
			.replace( /&/g, "&amp;" )
			.replace( /</g, "&lt;" )
			.replace( />/g, "&gt;" )
			.replace( /\t/g, "    " );
	}

	return function( diff ) {
		return diff.map(function( line ) {
			var type = line.charAt( 0 );
			return "<pre class='" + diffClasses[ type ] + "'>" + escape( line ) + "</pre>";
		}).join( "\n" );
	};
}();
