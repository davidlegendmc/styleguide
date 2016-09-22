const cheerio = require( 'cheerio' );
const fs = require( 'fs' );
const handlebars = require( 'handlebars' );
const path = require( 'path' );

const TEMPLATE = fs.readFileSync( 'views/demo-iframe.handlebars', 'utf8' );
const SECTION_ATTR = 'styleguide-content';
const SECTION_SELECTOR = `[${SECTION_ATTR}]`;

module.exports = {
	getDemoContainer: ( demoFilePath ) => {
		let iframeName = path.basename( demoFilePath );
		let iframeSrc = `/demo?file=${encodeURIComponent( demoFilePath )}`;

		let code = fs.readFileSync( demoFilePath, 'utf8' );
		let $ = cheerio.load( code );

		let tabs = [];

		$( SECTION_SELECTOR ).each( ( idx, item ) => {
			let id = $( item ).attr( SECTION_ATTR );
			// replace tabs with spaces as tab indentations look huge in the browser
			let contents = $( item ).html().replace( /\t/g, '  ' );
			tabs.push( { id, contents } );
		} );

		let vm = { iframeName, iframeSrc, tabs };
		return handlebars.compile( TEMPLATE )( vm );
	},
	getIframeContents: ( demoFilePath ) => {
		let contents = fs.readFileSync( demoFilePath, 'utf8' );
		return contents;
	}
};
