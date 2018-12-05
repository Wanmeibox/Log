YUI.add("yam-plugin-background", function(Y){

	var Background = function(config) {
		Background.superclass.constructor.apply(this, arguments);
	},
	HOST = "host",
	BG = "bg",
	CONTAINER = "container",
	CONTENT_BOX = "contentBox",

	getCN = Y.ClassNameManager.getClassName;

	Background.NAME = "bg-plugin";
	Background.NS = "bg",
	YArray = Y.Array;

	Y.extend(Background, Y.Plugin.Base, {
		initializer: function(config) {
			//default class yui3-wrapper-bg-container
			this._CSS_CONTAINER = getCN(this.get("baseClass"), BG, CONTAINER);
			this._CSS_BLOCKS = getCN(this.get("baseClass"),BG);

			this._bgNodes = [];

			if(this.get(HOST).renderUI) {
				this.doAfter('renderUI', this.renderUI);
				if (this.get(HOST).get('rendered')) {
					this.renderUI();
				}
			} else {
				this.renderUI();
			}

		},

		destructor: function() {
			YArray.each(this._bgNodes, Y.bind(function(node){
				node.remove(true);	
			}));
		},

		renderUI: function() {
			var host = this.get(HOST);

			if(this.get("containerClass") !== "") {
				host.get(CONTENT_BOX).all(this.get("containerClass")).each(Y.bind(function(conNode){
			   	    this._insertNode(conNode);
				},this));
			} else {
				this._insertNode(host.get(CONTENT_BOX));
			}

		},

		_insertNode: function(conNode) {
			var node = Y.Node.create("<div></div>");
			node.addClass(this._CSS_CONTAINER);
			node.insert(this.getTemplate());
			node.setStyle("zIndex", -1);
			conNode.insertBefore(node, conNode.get('firstChild'));
			this._bgNodes.push(node);
		},

		getTemplate: function() {
			var css = this._CSS_BLOCKS;
			return Y.Array.map(this.get("places"), function(v){
				var className = css + " " + css + "-" + v;
				return "<div class='" +className+"'></div>";
			}).join("");
		}

	}, {
		ATTRS: {
			baseClass : { value: "wrap" },
			containerClass: { value: "" },
			places: {value: ["c", "t", "rt", "r", "rb", "b", "lb", "l", "lt"]}
		}
	});

	Y.namespace('Plugin');
	Y.Plugin.Background = Background;

}, "0.0.1", {requires: ['plugin', 'array-extras']});