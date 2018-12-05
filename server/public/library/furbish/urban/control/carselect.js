YUI.add("yam-control-carselect", function(Y){
	var jQuery = Y.jQuery;
	
	(function ($) {
	    var PREFIX = ["京","冀","津","豫","鲁","贵","渝","云",
	                  "辽","沪","黑","湘","皖","新","苏","浙",
	                  "赣","鄂","桂","甘","晋","蒙","陕","吉",
	                  "闽","粤","青","藏","川","宁","琼","使"];
	    var timer, input;
	    $.fn.CarHeadForAjax = function (options) {
	    	var context = this;
	        var opts = $.extend({}, $.fn.CarHeadForAjax.defaults, options);
	        this.addClass("plate-select");
            createObj(opts,this);
            $(this).click(function () {
                input = $(this);
                showTable(input,context);
                context._dropdown.toggle("normal");
            }).blur(function () {
                if (timer) clearTimeout(timer);
                timer = setTimeout(function () {
                	context._dropdown.hide();
                }, 200);
            });
	    };
	    $.fn.CarHeadForAjax.defaults = {
	    };

	    //创建弹出层
	    function createObj(opts,context) {
	    	dropdown = $('<div style="display: none; position: absolute; z-index: 10000; background:#fff;"></div>').appendTo(document.body);
	        var items = PREFIX;
	        var tbl = $("<table/>").addClass("dropdowntable");
	        var tr, td;
	        for (var i = 0; i < items.length; i++) {
	            if (i % 8 == 0) {
	                tr = $("<tr/>");
	            }
	            td = $("<td/>");
	            td.append($("<span/>").addClass("HspanArea").html(items[i])).click(function () {
	            	input.get(0).value = $(this).text().toUpperCase();
	                if(opts.pickedCallback){
	                	opts.pickedCallback();
	                }
	            }).mouseover(function () {
	                $(this).css({
	                    background: 'skyblue',
	                    color: 'white',
	                    fontWeight: 'bold'
	                });
	            }).mouseout(function () {
	                $(this).css({
	                    background: 'white',
	                    color: '#696969',
	                    fontWeight: 'normal'
	                });
	            });
                tr.append(td);
                tbl.append(tr);
	        }
	        tr = $("<tr/>");
	        var newTd = $("<td/>").attr("colspan", "8").css("text-align", "right");
            newTd.append($("<span/>").html("无 牌").addClass("spanArea").click(function () {
                input.get(0).value = "无牌";
                if(opts.pickedCallback){
                	opts.pickedCallback();
                }
            }));
            newTd.append($("<span/>").html("清 除").addClass("spanArea").click(function () {
                input.get(0).value = "";
                if(opts.pickedCallback){
                	opts.pickedCallback();
                }
            }));
            newTd.append($("<span/>").html("关 闭").addClass("spanArea").click(function () {
            }));
            tr.append(newTd);
            tbl.append(tr);
	        dropdown.append(tbl);
	        context._dropdown = dropdown;
	    }

	    //显示弹出层
	    function showTable(input,context) {
	        show(input, context._dropdown);
	    };

	    function show(input, dropdown) {
	        var offset = input.offset();
	        dropdown.css({
	            top: (offset.top + input.outerHeight()) + "px",
	            left: (offset.left - 70) + "px",
	            minWidth: input.css("width")
	        });

	    };
	})(jQuery);
	
}, "0.0.1", {requires: ['jquery']});
