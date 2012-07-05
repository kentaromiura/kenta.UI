var fx = require('moofx/lib/fx'),
	moofx = require('moofx'),
	$ = require('nodes/lib/nodes'),
	prime = require("prime");

var scrollBarSize = undefined;

var getOffsets = function(element, container){
	if (!element || element == container) return {x: 0, y: 0};
	var parent = getOffsets(element.offsetParent, container);
	return {x: element.offsetLeft + parent.x, y: element.offsetTop + parent.y};
}

var propertyRender = prime({
	inherits: fx,
	constructor: function(element, property, unit){
		var self = this;
		self.unit = unit || 'px';
		self.property = property;
		self.element = $(element)[0];
		self.set = function(value){
			self.element[property] = value;
		}
		propertyRender.parent.constructor.call(self, self.set);
	}
});

var axesToObj = function(axes){
	axes = axes || ['x', 'y'];
	var oAxes = {x: false, y: false};

	for (var i = 0, max = axes.length; i < max; i++){
		//using switch as safer
		switch (axes[i]){
			case 'x':
				oAxes.x = true;
				break;
			case 'y':
				oAxes.y = true;
				break;
		}
	}
	return oAxes;
}

var getScrollBarSize = function(){
	//http://javascript.jstruebig.de/javascript/70
	document.body.style.overflow = 'hidden';
	var width = document.body.clientWidth;
	document.body.style.overflow = 'scroll';
	width -= document.body.clientWidth;
	if (!width) width = document.body.offsetWidth - document.body.clientWidth;
	document.body.style.overflow = '';

	return width;
}

var scroll = moofx.scroll = prime({
	constructor: function(element, options){
		if (scrollBarSize === undefined){
			scrollBarSize = getScrollBarSize();
		}

		var self = this;
		options = options || {};

		// todo : options.wheelStop = options.wheelStop || true;
		options.offset = options.offset || {};
		options.offset.x = options.offset.x || 0;
		options.offset.y = options.offset.y || 0;

		self.vertical = new propertyRender(element, 'scrollTop', 'px');
		self.horizontal = new propertyRender(element, 'scrollLeft', 'px');

		//TODO: handle setOptions
		self.setOptions(options);
		self.element = $(element)[0];
		//TODO: fallback to body

		//TODO: handle wheelstop

	},
	setOptions: function(options){
		options = options || {};
		options.equations = options.equations || 'default';
		options.durations = options.durations || '500ms';
		this.options = options;
	},
	start: function(x, y){
		if (x !== false) this.horizontal.start(this.element.scrollLeft, x + this.options.offset.x, this.options);
		if (y !== false) this.vertical.start(this.element.scrollTop, y + this.options.offset.y, this.options);
		return this;
	},
	toTop: function(){
		return this.start(false, 0);
	},
	toLeft: function(){
		return this.start(0, false);
	},
	toBottom: function(){
		return this.start(false, this.element.scrollHeight);
	},
	toRight: function(){
		return this.start(this.element.scrollWidth, false)
	},
	toElement: function(el, axes){
		axes = axesToObj(axes);
		el = $(el)[0];
		var offsets = getOffsets(el, this.element);
		return this.start(axes.x && offsets.x, axes.y && offsets.y);
	},
	toElementAtBottom: function(el, axes){
		axes = axesToObj(axes);
		el = $(el)[0];
		var offsets = getOffsets(el, this.element); //element @top

		offsets.y -= (this.element.offsetHeight - el.offsetHeight);
		offsets.y += this.options.useScrollBarSize ? scrollBarSize : 0;

		return this.start(axes.x && offsets.x, axes.y && offsets.y);
	},
	toElementEdge: function(el, axes){
		el = $(el)[0];
		var offsets = getOffsets(el, this.element);

		offsets.y -= (this.element.offsetHeight - el.offsetHeight) / 2;
		offsets.y += this.options.useScrollBarSize ? scrollBarSize : 0;

		var currentPos = this.element.scrollTop;

		if (currentPos >= offsets.y){
			this.toElement(el, axes)
		} else {
			this.toElementAtBottom(el, axes);
		}

		return this;
	},
	toElementCenter: function(el, axes){

		axes = axesToObj(axes);
		el = $(el)[0];
		var offsets = getOffsets(el, this.element);

		offsets.y -= (this.element.offsetHeight - el.offsetHeight) / 2;
		offsets.y += this.options.useScrollBarSize ? scrollBarSize : 0;

		offsets.x -= (this.element.offsetWidth - el.offsetWidth) / 2;
		offsets.x += this.options.useScrollBarSize ? scrollBarSize : 0;

		return this.start(axes.x && offsets.x, axes.y && offsets.y);

	},
	set: function(x, y){
		x = x || 0;
		y = y || 0;

		this.element.scrollLeft = x;
		this.element.scrollTop = y;
		return this;
	}
});

module.exports = scroll;