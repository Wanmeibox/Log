YUI.add("yam-common-storage", function(Y){
	var Y2 = Y.YAM;
    
    
    Y2.Storage = {
        get:function(key){
            if(localStorage){
                var value = localStorage.getItem('_data__' + key);
                if(value){
                    var j = JSON.parse(value);
                    if(j.time && j.time < new Date()){
                        localStorage.removeItem('_data__' + key);
                        return null;
                    }
                    return j.data;
                }
            }
            return null;
        },
        set:function(key,value,time){
            if(localStorage){
                var t = null;
                if(time && time.length >= 2){
                    try{
                        t = new Date();
                        var n = parseInt(time.substring(0,time.length-1));
                        var f = time.substring(time.length-1,time.length);

                        switch(f){
                            case 's':t.setSeconds(t.getSeconds()+n);break;   
                            case 'm':t.setMinutes(t.getMinutes()+n);break;   
                            case 'h':t.setHours(t.getHours()+n);break;   
                            case 'd':t.setDate(t.getDate()+n);break;   
                            case 'w':t.setDate(t.getDate()+(n*7));break;   
                            case 'M':t.setMonth(t.getMonth()+n);break;   
                            case 'y':t.setFullYear(t.getFullYear()+n);break;   
                        }
                        t = t.getTime();
                    }catch(e){
                        t = null;
                    }
                }
                try{
                    localStorage.setItem('_data__' + key,JSON.stringify({data:value,time:t}));
                }catch(ex){
                    _CLEAR_DATA(true);
                    localStorage.setItem('_data__' + key,JSON.stringify({data:value,time:t}));
                }
                return true;
            }
            return false;
        },
        remove:function(key){
            if(localStorage){
                localStorage.removeItem('_data__' + key);
            }
        },
        clear:function(justCache){
            if(localStorage){
                for(var i = 0;i < localStorage.length;){
                    if((localStorage.key(i).indexOf('_data__')) != -1){
                        if(justCache){
                            var value = localStorage.getItem(localStorage.key(i));
                            if(value){
                                var j = JSON.parse(value);
                                if(j.time && j.time < new Date()){
                                    if(localStorage.removeItem){
                                        localStorage.removeItem(localStorage.key(i));
                                    }else{
                                        return;
                                    }
                                }else{
                                    i ++;
                                }
                            }
                        }else{
                            if(localStorage.removeItem){
                                localStorage.removeItem(localStorage.key(i));
                            }else{
                                return;
                            }
                        }
                    }else{
                        i ++;
                    }
                }
            }
        }
    }
    //清空过期数据
    Y2.Storage.clear(true);
}, "0.0.1", {requires: []});