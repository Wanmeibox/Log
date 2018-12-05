YUI.add("yam-control-component", function(Y){

var Y2 = Y.namespace("YAM"),
	EMPTY_FN = function() {};

function Y2Widget() {
	this._handlers = [];
	this.on("render", this._beforeChildRender, this);
	Y.after(this.syncSize, this, "syncUI");
	Y.after(this._destructor, this, "destructor");
}

Y2Widget.ATTRS = {
	stageName : {
		value: "root",
		writeOnce: true
	}
};

Y2Widget.prototype = {

	addHandler: function(h) {
		this._handlers.push(h);		
	},

	_clearHandlers: function() {

		Y.Array.each(this._handlers, function(h){
			if(h && h.detach) {
				//Y.log(h.toString());
				h.detach();
				h = null;
			}
		});
		delete this._handlers;
	},

	_destructor: function() {
		this._clearHandlers();
		this.unplug();
		
		//clear node cache
		for(var i in Y.Node._instances) {
			delete Y.Node._instances[i];
		}
		//clear aop cache
		this.clearAOPCache(this);
		this.clearYUIEventCache();
		
		if(window.CollectGarbage) window.CollectGarbage();
	},

	clearYUIEventCache: function() {
		for(var i in Y._yuievt.events) {
			if(Y._yuievt.events[i].afterCount+Y._yuievt.events[i].subCount===0) {
				delete Y._yuievt.events[i];		
			}
		}
	},

	clearAOPCache: function(object) {
		if(Y.Lang.isString(object)) {
			var guid = object;
			if(Y.Do.objs[guid]) {
				for (var method in Y.Do.objs[guid]) {
				  Y.Do.objs[guid][method]._delete();
				  delete Y.Do.objs[guid][method];
				}
				delete Y.Do.objs[guid];
			}
		} else {
			this.clearAOPCache(Y.stamp(object));
			if(object._plugins) {
				for (var ns in object._plugins) {
				    if (object._plugins.hasOwnProperty(ns)) {
					    var p = object[object._plugins[ns].NS];
					    this.clearAOPCache(Y.stamp(p));
				    }
				}
			}
		}
	},

	_beforeChildRender: function(ev) {
		var p = this.get("parent");
		if(p && p.hasImpl(Y2.Widget)) {
			var stageNode = p.getChildStageNode(this, this.get("stageName"));
			if(stageNode instanceof Y.Node) {
				ev.parentNode = stageNode;
			}
		}
		return true;
	},

	getChildStageNode: function(child, stageName) {
		var cb = this.get("contentBox");
		return cb.one(".yui3-component-"+stageName);
	},

	syncOwnSize: EMPTY_FN,

	syncSize: function() {
		if(false !== this.syncOwnSize()) {
			if(this.each) {
				this.each(function (child) {
				    if(child.syncSize) {
					    child.syncSize();
				    }
				});
			}
		}
	}
}

Y2.Widget = Y2Widget;
Y2.Widget.NAME = "y2widget"

Y2.Component = Y.Base.create("component", Y.Widget, [Y.WidgetParent, Y.WidgetChild, Y2.Widget], {
	initializer: function() {
		this.before("destroy", function() {
			//Fix issue from YUI (widgetparent don't call children's destory method)
			this._destroyChildren();
		}, this);
		this.after("destroy", function(){
			this._destructor();
		});
	},

	destructor: function() {
		//Y.log(this.toString());
	}

}, {});
Y2.Overlay = Y.Base.create("overlay", Y.Overlay, [Y.WidgetParent, Y.WidgetChild, Y2.Widget], {

	initializer: function() {
		this.before("destroy", function() {
			this._destroyChildren();
		}, this);
		this.after("destroy", function(){
			this._destructor();	
		});
	},

	destructor: function() {
		//Y.log(this.toString());
	}

}, {});

Y2.Component.clearAOPCache = Y2Widget.prototype.clearAOPCache;	


}, "0.0.1", {requires:['widget', 'widget-parent', 'widget-child', 'overlay']});