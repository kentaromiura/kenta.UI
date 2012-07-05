var xtag = require('../xtag/x-tag')

xtag.register('x-scroll',{
	onCreate: function(){
		this.xtag.scroll = new scroll(this);
	},
	methods:{
		toTop: function(){
			this.xtag.scroll.toTop();
		},
		toBottom: function(){
			this.xtag.scroll.toBottom();
		},
		toLeft: function(){
			this.xtag.scroll.toLeft();
		},
		toRight: function(){
			this.xtag.scroll.toRight();
		},
		toElement: function(el, axes){
			this.xtag.scroll.toElement(xtag.query(this, el), axes);
		}
	}
})