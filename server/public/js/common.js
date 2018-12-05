
var pageVersion = 'v0.2.0';

var isIOS = ((/iphone|ipod|ipad/gi).test(navigator.userAgent));
var w = window;
function _GET_DATA(key){
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
}

function _SET_DATA(key,value,time){
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
}

function _DEL_DATA(key){
    if(localStorage){
        localStorage.removeItem('_data__' + key);
    }
}

function _CLEAR_DATA(justCache){
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

function _CHECK_DATA(){
    _SET_DATA('jx',520);
    var jx = _GET_DATA('jx');
    if(jx == 520){
        _DEL_DATA('jx');
        return true;
    }
    return false;
}

function StartEvent(pageid){
    if(pageid && _CHECK_DATA()){
        setInterval(function(){
            var task = _GET_DATA('task'+pageid);
            if(task){
                task.code && setTimeout(task.code,0);
                task.func && setTimeout(task.func,0);
                _DEL_DATA('task'+pageid);
            }
        },1000);
    }
}

function RunFunction(pageid,task){
    _SET_DATA('task'+pageid,task,'10s');
}

function showAlert(msg){
    mui.alert(msg);
}

function showMessage(msg){
    showAlert(msg);
}

function showLoadding(){
    if($('.mui-spinner').length == 0){
        $('<div class="mui-spinner"></div>').appendTo($('body'));
    }else{
        $('.mui-spinner').show();
    }
    window._mask = window._mask || mui.createMask(function(){
        return false;
    });//callback为用户点击蒙版时自动执行的回调；
    _mask.show();//显示遮罩
}

function hideLoadding(){
    $('.mui-spinner').hide();
    _mask._remove();
}


//验证车牌号码
function verCarCard(no){
    if(/^[京津渝沪冀晋辽吉黑苏浙皖闽赣鲁豫鄂湘粤琼川贵云陕甘青蒙桂宁新藏][A-z][a-hj-np-zA-HJ-NP-Z\d]{4,5}[领学警挂港澳试超a-hj-np-zA-HJ-NP-Z\d]$|^[使][\d]{6}$|^[A-z]{2}[\d]{5}$|^WJ[京津渝沪冀晋辽吉黑苏浙皖闽赣鲁豫鄂湘粤琼川贵云陕甘青蒙桂宁新藏]?[\d]{4}[\dA-z]$/.test(no)){
        return true;
    }
     return false;  
    
}
function trim(str){ //删除左右两端的空格
	return str.replace(/(^\s*)|(\s*$)/g, "");
}
function ltrim(str){ //删除左边的空格
	return str.replace(/(^\s*)/g,"");
}
function rtrim(str){ //删除右边的空格
	return str.replace(/(\s*$)/g,"");
}
function filter_input(str){
    return str.replace(/(<)/g,"&lt;").replace(/(>)/g,"&gt;");
}

function matchUserName(val){
	var valnew = trim(val);
	var re1=/^[~!@#$%^&*()-+={}|;:<>?.,~！@#￥……&*（）+=｛｝【】|、：；"'《》、？，。]/i;
	if(valnew == ""){
		return false;
	}
	if(re1.test(valnew)){
		return false;
	}
	if(valnew.length<2||valnew.length>20){
		return false;
	}
}

function matchEmail(val){
	var valnew = trim(val);
	if(valnew.match( /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/)){
		return true;
	}else{
		return false;
	}
}

function matchMobile(val){
	var valnew = trim(val);
	if(valnew.match(/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/)){
		return true;
	}else{
		return false;
	}
}

function thousand(n, j) {
        var s = n + "";var h='';
    var d = s.indexOf('.');
        if(d>-1){
            h=s.substr(d);
            s=s.substr(0,d);
        }
    
        var l = s.length;
        var m = l % 3;
        if (m==l) return s+h;
        else if(m==0) return (s.substring(m).match(/\d{3}/g)).join(j) + h;
    else return [s.substr(0,m)].concat(s.substring(m).match(/\d{3}/g)).join(j) + h;
}
function DoubleToFixed(d,f){
    //return parseInt(parseFloat(d).toFixed(0));
	if(d.toString().indexOf('.') == -1){
		return parseInt(d);	
	}else{
        //return parseInt(d.toFixed(0));
        if(d>100){
            return parseInt(d);
        }
		d = d.toFixed(f);
		var s = d.toString();
		for(var i=s.length-1;i>s.indexOf('.');i--){
			if(s[i] == '0'){
				s.length = s.length - 1;	
			}
		}
		return parseFloat(s);
	}
}

function getStrLength(str) {   
    var cArr = str.match(/[^\x00-\xff]/ig);   
    return str.length + (cArr == null ? 0 : cArr.length);   
}
function padLeft(str, lenght) {
    if (str.length >= lenght)
    	{
        return str;
    	}
    else if (parseInt(str)>=10){
    	return str;
    }
    else{
        return padLeft("0" + str, lenght);
    }
}
//补0函数
function pad(str, len, chr) {
	if(str<10){
	chr = typeof (chr) === 'undefined' ? ' ' : chr;
	str = parseFloat(str) + 1;
	while (str.length < len) {
		str = chr + str;
	}
	return str;
	}else{
		str = parseInt(str)+1;
		return str;	
	}
}
function getLen(a,cc){
	cc=parseInt(cc);
	var i=0,count=0;
	while(i<a.length){
	if (a.charCodeAt(i)>0 && a.charCodeAt(i)<255){
	count++;
	}else count+=2;
	if(count<=cc)
	i++;
	else break;
	}
	return a.substr(0,i); 
	}
// 时间处理，因为时间是以为单位算的，所以这边执行格式处理一下
function timeDispose(number) {
	var minute = parseInt(number / 60);
	var second = parseInt(number % 60);
	minute = minute >= 10 ? minute : "0" + minute;
	second = second >= 10 ? second : "0" + second;
	return minute + ":" + second;
}

function numFormat(num){
    if(isNaN(num)){
        return num;
    }
    num = parseInt(num);
    switch(true){
        case (num < 1000):
            return num;
        case (num < 10000):
            return thousand(num);
        case (num < 100000000):
            return DoubleToFixed(num/10000,2) + '万';
        default:
            return DoubleToFixed(num/100000000,2) + '亿';
    }
}

function timeFormat(timeSpan){
    
    if(!timeSpan || timeSpan == 'NaN' || isNaN(timeSpan)){
        return '--';
    }
    var timeStr = '';
    if(timeSpan > 60 * 24){
        timeStr += parseInt(timeSpan/(60*24))+'天';
    }
    if(timeSpan > 60){
        timeStr += parseInt(timeSpan/60)%24+'小时';
    }
    if(timeSpan % 60 > 0){
        timeStr += parseInt(timeSpan % 60) + '分钟';
    }
    
    return timeStr;
}

function timeDay(publishDate){
    if(!publishDate){
        return  '';
    }
    var nowDate = new Date();
    var pubDate;
    var timeSpan = '';
    var nowSetDate = new Date();
    try{
        if(isIOS){
            pubDate = new Date(publishDate.replace(' ','T')+'+08:00');
        }else{
            pubDate = new Date(publishDate);
        }
    }catch(e){
        try{
            pubDate = new Date(publishDate.replace(' ','T')+'+0800');
        }catch(e){
            pubDate =typeof( publishDate) == "number" ? new Date(publishDate) : new Date(publishDate.toString().replace(' ','T'));
        }
    }
    
    if(!timeSpan || timeSpan == 'NaN' || isNaN(timeSpan)){
        timeSpan = (nowDate - pubDate)/1000/60/60/24;
    }
    var timeStr = '';
    nowSetDate.setDate(nowSetDate.getDate() - 1);
    if(timeSpan <= 1 && nowDate.getDate() == pubDate.getDate()){
        timeStr = '今天<br>'+pubDate.Format('hh:mm');
    }else if(timeSpan <= 2 && nowSetDate.getDate() == pubDate.getDate()){
        timeStr = '昨天<br>'+pubDate.Format('hh:mm');
    }else{
        timeStr = pubDate.Format('MM-dd<br/>hh:mm');
    }
    return timeStr;
}

function newDate(value){
    try{
        if(typeof(value) == "number"){
            value = new Date(value);
        }else{
            if(value.indexOf(' ') == -1 && value.length <= 12){
                value += ' 00:00:00';
            }
            if(isIOS){
                value = new Date(value.replace(' ','T')+'+08:00');
            }else{
                value = new Date(value);
            }
        } 
        
    }catch(e){
        return null;
    }
    return value;
}

function timeSpan(date){
    var date1=new Date();  //开始时间
    var date2=newDate(date);    //结束时间
    var date3=date2.getTime()-date1.getTime()  //时间差的毫秒数
    if(date3 <= 0){
        return false;
    }
    //计算出相差天数
    var days=Math.floor(date3/(24*3600*1000)) 
    //计算出小时数
    var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000))//计算相差分钟数
    var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000))

    //计算相差秒数
    var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000)
    return {
        days:days,
        hours:hours,
        minutes:minutes,
        seconds:seconds,
        toString:function(){return days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒";}
    }
}

function request(paras,link){ 
	var url = link || location.search; 
	var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
	var paraObj = {} 
	for (i=0; j=paraString[i]; i++){ 
	paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
	} 
	var returnValue = paraObj[paras.toLowerCase()]; 
	if(typeof(returnValue)=="undefined"){ 
	return ""; 
	}else{ 
	return returnValue; 
	} 
}

function convertTime(time){
    var a = parseInt(time.split(':')[0]);
    var b = parseInt(time.split(':')[1]);
    return a*60 + b;
}


//根据一个JSON数据来给元素赋值
//data:数据对象
//el:在此元素的子元素上查找要赋值的元素，选填：默认为HTML根元素，支持原生元素和jQuery元素
//attribute:根据元素的名称来查找待赋值的元素，选填：默认为field属性
function setField(data,el,attribute){
    attribute = attribute || 'field';
    var field_els = el ? $(el).find('['+attribute+']') : $('['+attribute+']');

    for(var field in data){
        field_els.each(function(i,el){
            var fields = el.attributes.getNamedItem(attribute).value.split('.');
            if(fields.indexOf(field) > -1){
                dataset(el);
                var value = data[fields[0]];
                if(fields.length > 1){
                    for(var j=1;j<fields.length;j++){
                        if(value){
                            if(fields[j].indexOf('(') > -1){
                                var func = fields[j].substring(0,fields[j].indexOf('('));
                                var para = fields[j].substring(fields[j].indexOf('(')+1,fields[j].indexOf(')'));
                                value = eval('value.'+func+'('+para+')');
                            }else{
                                value = value[fields[j]];
                            }
                        }
                    }
                }
                if(value === false){
                    el.style.display = 'none';
                }else if(value === true){
                    
                }else if(el.nodeName == "IMG"){
                    el.src = value;
                }else if(el.nodeName == "PIC"){
                    el.style.backgroundImage = 'url('+value+')';
                }else if(el.nodeName == "INPUT" || el.nodeName == "TEXTAREA"){
                    el.value = value;
                }else if(el.nodeName == "SELECT"){
                    var key = el.dataset.key;
                    select:
                    for(var j =0;j< el.options.length;j++){
                        var option = el.options[j];
                        if((key == "text" && option.text == value) || (key != "text" && option.value == value)){
                            el.selectedIndex = j;
                            el.onchange && el.onchange();
                            break select;
                        }
                    }
                    el.dataset.value = value;
                }else{
                    if(el.dataset.format == "num"){
                        el.innerText = numFormat(value);
                    }else if(el.dataset.format == "time"){
                        el.innerText = timeFormat(value);
                    }else if(el.dataset.format == "month"){
                        el.innerText = newDate(value).Format('yyyy-MM');
                    }else if(el.dataset.format == "date"){
                        el.innerText = newDate(value).Format('yyyy-MM-dd');
                    }else if(el.dataset.format == "dateti"){
                        el.innerText = newDate(value).Format('yyyy-MM-dd hh:mm');
                    }else if(el.dataset.format == "datetime"){
                        el.innerText = newDate(value).Format('yyyy-MM-dd hh:mm:ss');
                    }else if(el.dataset.format == "html"){
                        el.innerHTML = value || el.dataset.default || value;
                    }else{
                        el.innerText = value || el.dataset.default || value;
                    }
                    if(window.navigator.userAgent.toLowerCase().indexOf("firefox")!=-1)
                    {
                        el.textContent = el.innerText;
                    }
                }
            }
        });
    }
}

//获取某个元素内所有相匹配的子元素的值
//attribute:通过此属性来匹配，可选，默认为field
//el:在此元素下查找，支持jQuery元素，可选，默认为HTML根元素
//backlist:此列表内的元素会被排除，可选
function getField(attribute,el,blacklist){
    var obj = {};
    attribute = attribute || 'field';
    blacklist = blacklist || [];
    var field_els = el ? $(el).find('['+attribute+']') : $('['+attribute+']');
    field_els.each(function(i,el){
        var field = $(el).attr(attribute);
        var value;
        if(blacklist.indexOf(field) > -1){
            return;
        }
        dataset(el);
        if(el.nodeName == "IMG"){
            if($(el).attr('value') != undefined){
                value = $(el).attr('value');
            }else{
                value = el.src;
            }
        }else if(el.nodeName == "INPUT" || el.nodeName == "TEXTAREA"){
            value = el.value;
        }else if(el.nodeName == "SELECT"){
            var key = el.dataset.key;
            value = key == "text" ? el.options[el.selectedIndex].text : el.value;
        }else{
            if($(el).attr('value') != undefined){
                value = $(el).attr('value');
            }else{
                value = el.innerText;
                if(window.navigator.userAgent.toLowerCase().indexOf("firefox")!=-1)
                {
                    value = el.textContent;
                }
            }
        }
        obj[$(el).attr(attribute)] = value;
    });
    return obj;
}

function dataset(el){
    if(el && !el.dataset){
        el.dataset = {};
        for(var i = 0;i < el.attributes.length;i++){
            var attr = el.attributes[i];
            if(attr.name.toLowerCase().indexOf('data-') == 0){
                el.dataset[attr.name.substr(5)] = attr.value;
            }
        }
    }
}

function GetVersion(){
    var v = {};
    if(navigator.userAgent.indexOf('MSIE') > -1){
        var s1 = navigator.userAgent.substr(navigator.userAgent.indexOf('MSIE '));
        
        v.browser = 'ie';
        v.version = s1.substring(s1.indexOf(' ')+1,s1.indexOf('.'));
    }
    return v;
}

var extend=function(o,n,override){ for(var p in n)if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))o[p]=n[p]; };


function GetGoodString(context,substring,turn){
    if(!context){
        return substring;
    }
    var arr = substring.split('|');
    var index = turn ? -1 : context.length;
    var ret = substring;
    for(var i in arr){
        var str = arr[i];
        if(!str){
            continue;
        }
        if(!turn){
            var temp = context.indexOf(str);
            if(temp > -1 && temp < index){
                index = temp;
                ret = str;
            }
        }else{
            var temp = context.lastIndexOf(str);
            if(temp > -1 && temp > index){
                index = temp;
                ret = str;
            }
        }
    }
    return ret;
}


function Resovle(context, startString, stopString, isTurn, subIndex)
{
    var res = null,subIndex = 0;
    var start = startString.split('*');
    var stop = stopString.split('*');
    try
    {
        if (!isTurn)
        {
            for (var i = 0; i < start.length; i++)
            {
                var s1 = GetGoodString(context, start[i], isTurn);
                var indexOf = context.indexOf(s1);
                if (indexOf > -1)
                {
                    context = context.substring(indexOf + s1.length);
                }
                else
                {
                    return false;
                }
            }
            var s2 = GetGoodString(context, stop[0], isTurn);
            res = context.substring(subIndex, context.indexOf(s2) - subIndex);
            return res;
        }
        else
        {
            for (var i = stop.length - 1; i >= 0; i--)
            {
                var s1 = GetGoodString(context, stop[i], isTurn);
                var indexOf = context.lastIndexOf(s1);
                if (indexOf > -1)
                {
                    context = context.substring(0, indexOf);
                }
                else
                {
                    return false;
                }
            }
            var s2 = GetGoodString(context, start[start.length - 1], isTurn);
            res = context.substring(context.lastIndexOf(s2) + s2.length + subIndex);
            return res;
        }
    }
    catch (Exception)
    {
        return false;
    }
}



//分享 share
function share(){
    var $el;
    if(!window.appendShare){
        $("body").append('<div class="cover" id="share"><div class="popup share_pic"></div></div>');
        $el = $('#share'); 
        taps($el,function(self){
            $(self).hide();    
        });
        window.appendShare = true;
    }else{
        $el = $('#share'); 
    }
    $el.show();    
}


 w.Box = {
     Template : '<div class="modal fade modal-dialog-center" id="myModal{id}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
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
              </div>',
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

        this.$div = $(this.Template.toObject({id:this.index++,title:sTitle,message:sMessage}));
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
            var $button = $('<button {close} class="{class}" type="button">{text}</button>'.toObject({close:button.close ? ' data-dismiss="modal"':'',class:button.class,text:button.text}));
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

        this.$div = $(this.Template.toObject({id:this.index++,title:sTitle,message:sMessage}));
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
            var $button = $('<button {close} class="{class}" type="button">{text}</button>'.toObject({close:button.close ? ' data-dismiss="modal"':'',class:button.class,text:button.text}));
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
    }
}

if(parent != window){
    window.Box = parent.Box;
}


function checkForm(){
    var inputs = $('[field]');
    for(var i=0;i<inputs.length;i++){
        var result = checkInput(inputs[i]);
        if(result !== true){
            Box.alert(result.message);
            return false;
        }
    }
    return true;
}

function checkInput(el){
    el = $(el);
    var nodeNames = ["SELECT","INPUT","TEXTAREA"];
    var rules = (el.attr('rule')||"").split(',');
    var value = nodeNames.indexOf(el[0].nodeName) > -1 ? el.val() : el.text();
    if(el[0].nodeName == "SPAN" && el.attr('value') !== undefined){
        value = el.attr('value');
    }
    var results = [];
    var fieldTitle = el.attr('field-title');
    rules.forEach(function(rule){
        if(rule == "!null" && !value && value !== false){
            results.push({success:false,message:fieldTitle+"为必填字段"});
        }
        if(rule == "number" && value){
            var min = el.attr('min');
            var max = el.attr('max');
            var int = el.attr('int');
            if(isNaN(value)){
                results.push({success:false,message:fieldTitle+"必须是数字"});
            }else{
                if(int == true && parseInt(value)!=value){
                    results.push({success:false,message:fieldTitle+"必须是整数"});
                }
                if(min && parseInt(value) < parseInt(min)){
                    results.push({success:false,message:fieldTitle+"必须大于"+min});
                }
                if(max && parseInt(value) > parseInt(max)){
                    results.push({success:false,message:fieldTitle+"必须小于"+max});
                }
            }
        }
        if(rule == "length"){
            var length = el.attr('length').split('-');
            var min,max;
            if(length.length > 1){
                min = length[0];
                max = length[1];
            }else{
                min = 0;
                max = length[0];
            }
            if(value.length > max){
                results.push({success:false,message:fieldTitle+"字符长度不能大于"+max});
            }
            if(value.length < min){
                results.push({success:false,message:fieldTitle+"字符长度不能小于"+min});
            }
        }
    });
    return results[0] || true;
}

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
String.prototype.replaceAll = function(oldValue,newValue){
    return this.toString().replace(new RegExp(oldValue,'gm'),newValue);
//    return this.toString().split(oldValue).join(newValue);
}
String.prototype.toObject = function(obj,before,after){
    var string = this.toString();
    for(var key in obj){
        string = string.replaceAll((before || '{') + key + (after || '}'),((obj[key] === undefined || obj[key] === null) ? "" : obj[key]).toString());
    }
    return string;
}

Number.prototype.toFix = function(){
    var int = parseFloat(this);
    if(int.toString().indexOf('.') > 0){
        return parseFloat(int.toFixed(2));
    }
    return int;
}


function HTMLEncode(html) {
    var temp = document.createElement("div");
    (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
    var output = temp.innerHTML;
    temp = null;
    return output;
}

function HTMLDecode(text) { 
    var temp = document.createElement("div"); 
    temp.innerHTML = text; 
    var output = temp.innerText || temp.textContent; 
    temp = null; 
    return output; 
} 


function ProgressBar()
{
	this.progressBar;
	this.progressDeWidth;
	this.progressBarHd;
	
	this.initProgBar = function()
	{
		var rebootCon = id("ProgressBar");
		var con, div, p;

		if (null == rebootCon)
		{
			rebootCon = document.createElement("div");
			rebootCon.id = "ProgressBar";
			document.body.appendChild(rebootCon);

			con = document.createElement("div");
			con.className = "progressBarCon";
			rebootCon.appendChild(con);

			p = document.createElement("p");
			p.className = "progressBarDes";
			con.appendChild(p);

			div = document.createElement("div");
			div.className = "progressBarBg";
			con.appendChild(div);

			p = document.createElement("p");
			p.className = "progressBarDe";
			div.appendChild(p);

			p = document.createElement("p");
			p.className = "progressBarDone";
			con.appendChild(p);

			this.progressBar = rebootCon;
			this.progressDeWidth = parseInt($("p.progressBarDe").css("width"));
		}
        this.progressBar = rebootCon;
			this.progressDeWidth = parseInt($("p.progressBarDe").css("width"));
	};

	this.progRunning = function(showPercent, duration, callBack){
		var progressBarBg = $("div.progressBarBg");
		var progressBarDe = $("p.progressBarDe");
		var deWidth = this.progressDeWidth;
		var width = parseInt(progressBarBg.css("width")) - deWidth -
					parseInt(progressBarDe.css("paddingRight"));
		var time = duration/100, count = 0;
		var thisObj = this;

		function proRun()
		{
			if (count > 100)
			{
					$("p.progressBarDes")[0].innerHTML = '重启完成';
					$("p.progressBarDone").css("visibility", "visible");
				(typeof callBack == "function") && callBack();

				return;
			}

			if (showPercent == true)
			{
				progressBarDe[0].innerHTML = count + "%";
			}

			progressBarDe.css("width", deWidth + width*count + "px");
			count++;
			thisObj.progressBarHd = setTimeout(arguments.callee, time);
		}

		progressBarDe.css("width", deWidth + "px");
		width = parseFloat(width/100);
		proRun();
	};

	this.showProgBar = function(duration, callBack, showPercent)
	{
		this.initProgBar();

		setStyle(this.progressBar, {"display":"block", "visibility":"visible", "top":"0px"});

		this.progRunning((showPercent == undefined?true:showPercent), duration, callBack);
	};

	this.progRunningP = function(showPercent, callBack, complete){
		var progressBarBg = $("div.progressBarBg");
		var progressBarDe = $("p.progressBarDe");
		var deWidth = this.progressDeWidth;
		var width = parseInt(progressBarBg.css("width")) - deWidth -
					parseInt(progressBarDe.css("paddingRight"));
		var time = 100, count = 0;
		var thisObj = this;

		function proRun()
		{
			count = parseInt(callBack());

			if (-1 == count)
			{
				(typeof complete == "function") && complete(false);
				return;
			}

			if (showPercent == true)
			{
				progressBarDe[0].innerHTML = count + "%";
			}

			progressBarDe.css("width", deWidth + width*count + "px");

			if (count >= 100)
			{
				(typeof complete == "function") && complete(true);
				return;
			}

			thisObj.progressBarHd = setTimeout(arguments.callee, time);
		}

		progressBarDe.css("width", deWidth + "px");
		width = parseFloat(width/100);
		proRun();
	};

	this.showProgBarP = function(callBack, showPercent, complete)
	{
		this.initProgBar();

		setStyle(this.progressBar, {"display":"block", "visibility":"visible", "top":"0px"});

		this.progRunningP((showPercent == undefined?true:showPercent), callBack, complete);
	};

	this.closeProgBar = function()
	{
		setStyle(this.progressBar, {"display":"none", "visibility":"hidden", "top":"-9999px"});
		clearTimeout(this.progressBarHd);
	};
}
function Style()
{
	this.disableCol = "#b2b2b2";

    /* get element by id */
	this.id = function(idStr)
	{
		if (idStr != undefined)
		{
			return document.getElementById(idStr);
		}
	};
	
	/* create element */
	this.el = function(str)
	{
		try
		{
			return document.createElement(str);
		}catch(ex){return null;}
	};
    
	/* set the element styles with the styles */
	this.setStyle = function (ele, styles)
	{
		if (ele == null || styles == null || ele.nodeType != 1)
		{
			return;
		}
		
		for (var property in styles)
		{
			try
			{
				ele.style[property] = styles[property];
			}catch(ex){}
		}
	};
	
	/* get the default style of the element*/
	this.getNodeDefaultView = function(element, cssProperty)
	{
		var dv = null;
		if (!(element))
		{
			return null;
		}

		try{
			if (element.currentStyle)
			{
				dv = element.currentStyle;
			}
			else
			{
				dv = document.defaultView.getComputedStyle(element, null);
			}

			if (cssProperty != undefined)
			{
				return dv[cssProperty];
			}
			else
			{
				return dv;
			}
		}catch(ex){}
	};
}
(function(){
	Style.call(window);
	ProgressBar.call(window);
})();


function bytesToSize(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}