require('../xtag/x-tag');
var Accordion = require('../primes/accordion'),

xtag.register('x-accordion',{
	onCreate: function(){
		var ax = new Accordion(this, xtag.query(this, 'h2'), xtag.query(this, '.content'));
	}
})