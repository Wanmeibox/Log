YUI.add("jq-pending", function(Y){
	var $ = Y.jQuery;
    Y.YAM.Pending = function(options){
        var defaultOptions = {
            $els : [],
            $el : [],
            text : ''
        }
        this.options = $.extend(defaultOptions,options);
        this.$els = this.options.$el.add(this.options.$els);
        this.tempText;
        this.pending = function(text,$els){
            if(this.options.text || text){
                this.tempText = this.options.$el.html();
                this.options.$el.html(text || this.options.text);
            }
            this.options.$el.addClass('pending');
            if($els){
                this.$els = $els.add(this.$els);
            }
            this.$els.attr("disabled","disabled");
            
            
        }
        this.ok = function(){
            if(this.options.text){
                this.options.$el.html(this.tempText);
                this.tempText = '';
            }
            this.options.$el.removeClass('pending');
            this.$els.removeAttr("disabled");
        }
    }
}, "0.0.1", {requires: ['jquery']});