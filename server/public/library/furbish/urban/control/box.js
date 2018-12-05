YUI.add("yam-control-box", function(Y){
	
    var Y2 = Y.YAM,
        $ = Y.jQuery,
        Template = '<div class="modal fade modal-dialog-center" id="myModal{id}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
                          <div class="modal-dialog">\
                            <div class="modal-content-wrap">\
                              <div class="modal-content">\
                                  <div class="modal-header">\
                                      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                                      <h4 class="modal-title">{title}</h4>\
                                  </div>\
                                  <div class="modal-body">\
                                        {message}\
                                  </div>\
                                  <div class="modal-footer">\
                                  </div>\
                              </div>\
                            </div>\
                          </div>\
                      </div>';
    Y2.Box = {
        boxs : [],
        lastID : null,
        index:0,
        init : function(){
            
        },
        alert:function(sMessage, sTitle, config, that) {
            config = config || {};
            config.width = config.width || 320;
            config.height = config.height || 180;
            config.minWidth = config.minWidth || 300;
            config.minHeight = config.minHeight || 150;
            config.ok = config.ok || function(){};
            config.cancel = config.cancel || function(){};
            config.buttons = config.buttons || [
                {class:'btn btn-danger',text:'确定',close:true,click:config.ok}
            ];
            
            sTitle = sTitle || "信息";
            sMessage = sMessage || "提示信息为空？";

            this.$div = $(Y.Lang.sub(Template,{id:this.index++,title:sTitle,message:sMessage}));
            $div = this.$div;
            
            var box = {
                $div:$div,
                autoHide:true,
                hide:function(){
                    this.$div.modal('hide');
                },
                on:function(){
                    
                }
            }
            
            for(var i=0;i< config.buttons.length;i++){
                var button = config.buttons[i];
                var $button = $(Y.Lang.sub('<button {close} class="{class}" type="button">{text}</button>',{close:button.close ? ' data-dismiss="modal"':'',class:button.class,text:button.text}));
                if(button.click){
                    $button.bind('click',button,function(event){
                        if(that){
                            event.data.click.call(that,box);
                        }else{
                            event.data.click.call(box,box);
                        }
                        if(box.autoHide === true){
                            box.hide();
                        }
                    });
                }
                $div.find('.modal-footer').append($button);
            }
            
            this.lastID = $div.attr('id');
            $('body').append($div);
            $div.modal('show');
            
            return box;
        },
        confirm:function(sMessage, sTitle, config, that) {
            
            
            config = config || {};
            config.width = config.width || 320;
            config.height = config.height || 180;
            config.minWidth = config.minWidth || 300;
            config.minHeight = config.minHeight || 150;
            config.ok = config.ok || function(){};
            config.cancel = config.cancel || function(){};
            config.buttons = config.buttons || [
                {class:'btn btn-default',text:'取消',close:true,click:config.cancel},
                {class:'btn btn-danger',text:'确定',close:false,click:config.ok}
            ];
            
            sTitle = sTitle || "信息";
            sMessage = sMessage || "提示信息为空？";

            this.$div = $(Y.Lang.sub(Template,{id:this.index++,title:sTitle,message:sMessage}));
            $div = this.$div;
            
            var box = {
                $div:$div,
                autoHide:true,
                hide:function(){
                    this.$div.modal('hide');
                },
                on:function(){
                    
                }
            }
            
            for(var i=0;i< config.buttons.length;i++){
                var button = config.buttons[i];
                var $button = $(Y.Lang.sub('<button {close} class="{class}" type="button">{text}</button>',{close:button.close ? ' data-dismiss="modal"':'',class:button.class,text:button.text}));
                if(button.click){
                    $button.bind('click',button,function(event){
                        if(that){
                            event.data.click.call(that,box);
                        }else{
                            event.data.click.call(box,box);
                        }
                        if(box.autoHide === true){
                            box.hide();
                        }
                    });
                }
                $div.find('.modal-footer').append($button);
            }
            
            this.lastID = $div.attr('id');
            $('body').append($div);
            $div.modal('show');
            
            return box;
        },
        hide:function(){
            this.$div.modal('hide');
        },
        on:function(){
            
        }
    }
}, "0.0.1", {requires: ['jquery'
                       , 'intl', 'node', 'dd-plugin', 'dd-constrain', 'substitute', 'classnamemanager',
      'overlay', 'yam-core', 'yam-plugin-overlay-modal', 'yam-control-component',
		"yam-control-tooltip", "yam-plugin-background","plugin"]});



//YUI.add("yam-control-box", function(Y){}, "0.0.1", {requires: ['yam-control-box-common']});