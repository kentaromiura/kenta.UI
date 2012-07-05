var prime = require('prime');
var zen = require('nodes/lib/zen');
var $ = require('nodes');
require('moofx');

var gridlayout = prime({
	constructor: function(element, options){
		this.cells = [];

		this.options = {
			top:      0,
			left:     0,
			columns:  3,
			rows:     1,
			height:   '300px',
			width:    '100%',
			overflow: 'hidden',
			display:  'block',
			isRTL:    false
		};
		this.setOptions(options);
		var me = this.element = zen('div.gridlayout');
		var o = this.options;
		me.style({
			top:      o.top,
			left:     o.isRTL?'auto':o.left,
			right:    o.isRTL? o.left: 'auto',
			height:   o.height,
			display:  o.display,
			width:    o.width,
			overflow: o.overflow
		});
		if (element) {
			me.bottom(element);
		}
		this.current = {
			column: 0,
			row:    0
		};

		this.cell_width = 100 / o.columns;
		this.cell_height = 100 / o.rows;
	},
	setOptions:  function(options){
		this.options = this.options || (this.options = {});
		for (var key in options) {
			this.options[key] = options[key];
		}
	},
	add: function(element){
		var	currentColumn = this.current.column++,
			position = {
				x: currentColumn % this.options.columns +1,
				y: this.current.row
			};

		if(position.x == this.options.columns){
			this.current.row++;
		}

		position.left = ((position.x - 1) * this.cell_width) + '%';
		position.top =  (position.y * this.cell_height) + '%';

		var cell = zen('div.cell');
		cell.style({
			position: 'absolute',
			top: position.top,
			left: this.options.isRTL? 'auto': position.left,
			right: this.options.isRTL? position.left: 'auto',
			display: 'block',
			overflow: 'auto',
			witdh: this.cell_width + '%',
			height: this.cell_height + '%'
		});
		this.cells.push(cell);
		$(element).bottom(cell);
		cell.bottom(this.element);
		return cell;
	},
	toElement: function(){
		return this.element;
	}
})


module.exports = gridlayout;