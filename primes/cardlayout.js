var gridlayout = require('./gridlayout');
var prime = require('prime');
var $ = require('nodes');
require('nodes/lib/traversal');

$merge = function(original, extension){
	var clone = {}, prop;
	for (prop in original) {
		clone[prop] = original[prop];
	}
	for (prop in extension) {
		clone[prop] = extension[prop];
	}
	return clone;
}

var disableTabIndex = function(element, index){
	element.setAttribute('tabIndex', -1)
	return element;
};
var enableTabIndex = function(element, index){
	element.setAttribute('tabIndex', 0);
	return element;
};

cardlayout = prime({
	constructor: function(element, options){
		this.options = {
			top:    0,
			left:   0,
			height: '300px'
		};
		this.setOptions(options);

		var GL = this.GridLayout = new gridlayout(element, $merge(this.options, { columns: 1, rows: 1 }));
		$(GL.toElement()).addClass('cardlayout');
		this.element = GL.toElement();
		this.cards = [];
	},
	setOptions: function(options){
		this.options = this.options || (this.options = {});
		for (var key in options) {
			this.options[key] = options[key];
		}
	},
	add: function(element){
		var card = this.GridLayout.add(element);
		this.cards.push(card);
		return card;
	},
	showPage: function(index){
		var card = this.cards[index];
		if (card) {
			var tabindexes = this.element.find('[tabIndex], input');
			tabindexes && tabindexes.handle(disableTabIndex);

			var cardindexes = card.find('[tabIndex], input');
			cardindexes && cardindexes.handle(enableTabIndex);
			var top = card.compute('top');

			var first = this.element[0].firstChild;
			$(first).style('top', top);
			card.style('top', 0);
			card.top(this.element);

		}
	},
	toElement: function(){
		return this.element;
	}
});

module.exports = cardlayout;