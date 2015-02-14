/* global describe, it */

'use strict';

describe('Xcept', function () {

	it('should be a function', function () {
		expect(xcept).to.be.a('function');
	});

});

describe('app', function () {

	it('should be an instance of xcept', function () {
		expect(app).to.be.an.instanceof(xcept);
	});

});

describe('Build inject code', function () {

	it('should be a script element', function () {
		var script = app.buildInjectCode();
		expect(script.nodeName).to.equal("SCRIPT");
	});

});

