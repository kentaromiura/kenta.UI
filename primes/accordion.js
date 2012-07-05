var prime = require('prime'),
	$ = require('nodes');
require('moofx');

var accordion = prime({
	constructor: function(element, togglers, contents){
		var sections = [];
		var togglers = $(togglers);
		var contents = $(contents);
		var attribute = 'data-rel';
		if (!contents[0].dataset) {
			attribute = 'rel';
		}

		for (var i = 0, max = contents.length; i < max; i++) {
			var section = $(contents[i]);
			sections.push({element: section, height: section.compute('height')});
		}
		for (var i = 0, max = togglers.length; i < max; i++) {
			togglers[i].setAttribute(attribute, i);
		}

		contents.style('overflow', 'hidden');

		this.contents = contents;
		this.sections = sections;

		this.show(0);

		var self = this;
		$(element).on('click', function(e){
			var rel = $(e.target).getAttribute(attribute);
			if (rel) {
				self.show(rel - 0);
			}
		});
	},
	show:        function(index){
		if (this.sections[index]) {
			this.contents.animate('height', 0);
			this.sections[index].element.animate('height', this.sections[index].height);
		}
	}
});

module.exports = accordion;