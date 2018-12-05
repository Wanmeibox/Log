YUI.add("yam-common-validate", function(Y){
	var Y2 = Y.YAM,
		Lang = Y.Lang;
	var Validate = Y.Base.create("Validate", Y.Base, [], {}, {
			//邮箱验证 参数：string
			isMail: function(val){
				var isEmail = RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
				if ( isEmail.test(val)||val==''){
					return {success:true};
				} else {
					return {success:false,message:'邮箱格式不正确!'};
				}
			},
			//整数验证 参数：string
			isInteger : function(val){
				var isInteger = RegExp(/^[0-9]+$/);
				if ( isInteger.test(val) ||val==''){
					return {success:true};
				} else {
					return {success:false,message:'格式不正确！请输入整数'};
				}
			},
			//字符长度验证 参数：string
			isShorter : function(str,reqlength){
				if( str.length<reqlength ){
					return {success:true};
				} else {
					return {success:false,message:'输入字符过长！'};
				}
			},
			//非空验证 参数：string
			isEmpty : function(val){
				if( val==null ||val=='' || val == 'null'){
					return {success:true,message:'不能为空！'};
				} else {
					return {success:false};
				}
			},
			//非空验证 参数：string
			notEmpty : function(val){
				if( val==null ||val=='' || val == 'null'){
					return {success:false,message:'不能为空！'};
				} else {
					return {success:true};
				}
			},
			//特殊字符验证 参数：string
			containSpecial : function(val){
				var containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);
				if ( containSpecial.test(val)&&!Lang.isNull(val) ){
					return {success:true,message:'格式不正确！不能包含特殊字符'};
				} else {
					return {success:false};
				}
			},
			/**
			 * 最大输入长度
			 * @param {string} 
			 * @param {Integer} 要控制的长度
			 */
			checkLength : function(val,len){
				var s = val;
				var totalLength = 0;
				var charCode;
				
				for(i=0;i<s.length;i++)
				{
					charCode = s.charCodeAt(i);
					if (charCode < 0x007f) {//ASCII字母继续使用1字节储存，而常用的汉字就要使用2字节
						totalLength ++;
					} else if ((0x0080 <= charCode) && (charCode <= 0xffff)) {
						totalLength += 2;
					} 
			    }
				if( len>=totalLength ||Lang.isNull(val) ){
					return {success:true};
				} else {
					return {success:false,message:'输入过长，最多输入'+(len/2)+'个汉字！'};
				}
			},
			/**
			 *是否为规范的手机电话号码
			 *@param {string} 
			 */
			isTelephone : function(val){
				if(!(Validate.isInteger(val).success)||val.length>12||val.length<7&&val!='') {
					return {success:false,message:'格式不正确！'};
				}
				return {success:true};
			},
			/**
			 *是否为规范的手机电话号码
			 *@param {string} 
			 */
			isStupidTelephone : function(val){
				var isStupidTelephone = RegExp(/^(?:13\d|15[89])-?\d{5}(\d{3}|\*{3})$/);
				if(!(Validate.isInteger(val).success)||val.length!==11&&val!=''||(!isStupidTelephone.test ( val )&&val!='')) {
					return {success:false,message:'格式不正确！'};
				}
				return {success:true};
			},
			/**
			 * 是否规范的邮编
			 * @param {string} 
			 */
			isZip : function(val){
				if ( val.length == 6&&Validate.isInteger ( val ).success ||val==''){
					return {success:true};
				}
				return {success:false,message:'邮编格式不正确！'};
			},
			/**
			 * 常用固定电话验证
			 * @param {string} 
			 */
			isPhoneNumber : function(val){
				var isPhoneNumber = RegExp(/(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)/);
				if ( isPhoneNumber.test ( val )||val=='' ){
					return {success:true};
				}
				return {success:false,message:'格式不正确！格式：区号(可选)-主机号'};
			},
			/**
			 * 办公电话验证
			 * @param {string} 
			 */
			isWorkPhone : function(val){
				var isWorkPhone = RegExp(/(^[0-9]{3,4}\-[0-9]{7,8}\-[0-9]{3,4}$)|(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}\-[0-9]{3,4}$)|(^[0-9]{7,8}$)/);
				if ( isWorkPhone.test ( val ) ||val==''){
					return {success:true};
				}
				return {success:false,message:'格式不正确！格式：区号(可选)-主机号-分机号(可选)'};
			},
		
			isSimplePhone: function(val) {
				var isPhone = RegExp(/[0-9\-]*/);
				if ( isPhone.test ( val ) ||val==''){
					return {success:true};
				}
				return {success:false,message:'电话号码格式不正确！'};
			},
			/**
			 * 判断输入是否相同
			 * @param {string,string}
			 */
			equalTo : function(val,oldval){
				if(val==oldval){
					return {success:true};
				}
				return {success:false,message:'输入不相同！请输入相同的值'};
			},
			notEqualTo : function(val,oldval){
				if(val != oldval){
					return {success:true};
				}
				return {success:false,message:'输入相同！请输入不相同的值'};
			},
			/**
			 * 判断输入是否不小于
			 * @param {string,string}
			 */
			greatThanOrEqualTo : function(value,oldval){
				value = parseInt(value);
				oldval = parseInt(oldval);
				if(value > oldval || value == oldval){
					return {success:true};
				}
				return {success:false,message:'输入值过小！'};
			},
			/**
			 * 日期
			 * @param {string,string}
			 */
			isDate : function(DateString,Dilimeter){
				if(DateString   ==   null || DateString   == ''){  
		            return   {success:true};  
		      }  
		      if(Dilimeter   ==   ''   ||   Dilimeter   ==   null){  
		            Dilimeter   =   '-';    
		      }  
		      var   tempy='';  
		      var   tempm='';  
		      var   tempd='';  
		      var   tempArray;  
		      if(DateString.length<8   ||   DateString.length>10){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'}; 
		      }  
		      tempArray   =   DateString.split(Dilimeter);  
		      if(tempArray.length   !=   3){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'};  
		      }  
		       
		      if(tempArray[0].length   !=   4){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'};  
		      }  
		      else{ 
		            tempy   =   tempArray[0];  
		            tempm   =   tempArray[1];  
		            tempd   =   tempArray[2];  
		      }  
		       
		      if(isNaN(tempy)){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'};  
		      }  
		      if(isNaN(tempm)){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'};  
		      }  
		      if(isNaN(tempd)){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'};  
		      }  
		      var   tDateString   =   tempy   +   '/'   +   tempm   +   '/'   +   tempd;  
		      var   tempDate   =   new   Date(tDateString);  
		       
		      if(tempDate.getFullYear()   !=   tempy){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'};  
		      }  
		      if(tempDate.getMonth()   !=   tempm-1){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'};  
		      }  
		      if(tempDate.getDate()   !=   tempd){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'};  
		      }  
		      return   {success:true}; 
			},
			/**
			 * 身份证
			 * @param {string,string}
			 */
			isIdCard : function(val){
				var isIdCard = RegExp(/(^[1-9](\d{16}|\d{13})[0-9xX]$)/);
				if(isIdCard.test ( val ) ||val==''){
					return {success:true};
				}
				return {success:false,message:'身份证格式不正确！'};
			},
		    /**
			 * 身份证验证
			 */
			isCardID : function(val){
			  var checkFlag = new clsIDCard(val);
			  if (!checkFlag.IsValid()) {
			    return {success:false,message:'格式不正确！'};
			  }else{
			    return {success:true};
			  }
			},
			/**
			 * 出生年月不能大于当前日期不能小于1900年
			 * @param {string,string}
			 */
			dateCheck : function(DateString,Dilimeter){
				var isDate = RegExp(/(^\d{4}\-\d{2}\-\d{2}$)/);
				if(isDate.test ( DateString ) ||DateString ==''){									 
					var date = new Date(); 				    
                    var birthday = new Date(Date.parse(DateString.replace(/-/g,   "/")));					 
					if(birthday.valueOf() > date.valueOf()){					 
					   return {success:false,message:'出生年月不能大于当前日期'};
					}
					if(parseInt(DateString.substring(0,4))<1900){
						 return {success:false,message:'出生年月不能小于1900年'};
					}
				}
				if(DateString   ==   null || DateString   == ''){  
		            return   {success:true};  
		      }  
		      if(Dilimeter   ==   ''   ||   Dilimeter   ==   null){  
		            Dilimeter   =   '-';    
		      }  
		      var   tempy='';  
		      var   tempm='';  
		      var   tempd='';  
		      var   tempArray;  
		      if(DateString.length<8   ||   DateString.length>10){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'}; 
		      }  
		      tempArray   =   DateString.split(Dilimeter);  
		      if(tempArray.length   !=   3){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'};  
		      }  
		       
		      if(tempArray[0].length   !=   4){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'};  
		      }  
		      else{ 
		            tempy   =   tempArray[0];  
		            tempm   =   tempArray[1];  
		            tempd   =   tempArray[2];  
		      }  
		       
		      if(isNaN(tempy)){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'};  
		      }  
		      if(isNaN(tempm)){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'};  
		      }  
		      if(isNaN(tempd)){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'};  
		      }  
		      var   tDateString   =   tempy   +   '/'   +   tempm   +   '/'   +   tempd;  
		      var   tempDate   =   new   Date(tDateString);  
		       
		      if(tempDate.getFullYear()   !=   tempy){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'};  
		      }  
		      if(tempDate.getMonth()   !=   tempm-1){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'};  
		      }  
		      if(tempDate.getDate()   !=   tempd){  
		            return   {success:false,message:'格式不正确！格式：2001-01-01'};  
		      }  
		      return   {success:true}; 
			},
			isNumOrLetter : function(val){
				var isWorkPhone = RegExp(/(^[0-9a-zA-Z]+$)/);
				if ( isWorkPhone.test ( val ) ||val==''){
					return {success:true};
				}
				return {success:false,message:'格式不正确！只能包含数字或字母'};
			}	
	}
	);
	// 构造函数，变量为15位或者18位的身份证号码
	function clsIDCard(CardNo) {
	  this.Valid=false;
	  this.ID15='';
	  this.ID18='';
	  this.Local='';
	  if(CardNo!=null)this.SetCardNo(CardNo);
	}
	
	// 设置身份证号码，15位或者18位
	clsIDCard.prototype.SetCardNo = function(CardNo) {
	  this.ID15='';
	  this.ID18='';
	  this.Local='';
	  CardNo=CardNo.replace(" ","");
	  var strCardNo;
	  if(CardNo.length==18) {
	    pattern= /^\d{17}(\d|x|X)$/;
	    if (pattern.exec(CardNo)==null)return;
	    strCardNo=CardNo.toUpperCase();
	  } else {
	    pattern= /^\d{15}$/;
	    if (pattern.exec(CardNo)==null)return;
	    strCardNo=CardNo.substr(0,6)+'19'+CardNo.substr(6,9)
	    strCardNo+=this.GetVCode(strCardNo);
	  }
	  this.Valid=this.CheckValid(strCardNo);
	}
	
	// 校验身份证有效性
	clsIDCard.prototype.IsValid = function() {
	  return this.Valid;
	}
	
	// 返回生日字符串，格式如下，1981-10-10
	clsIDCard.prototype.GetBirthDate = function() {
	  var BirthDate='';
	  if(this.Valid)BirthDate=this.GetBirthYear()+'-'+this.GetBirthMonth()+'-'+this.GetBirthDay();
	  return BirthDate;
	}
	
	// 返回生日中的年，格式如下，1981
	clsIDCard.prototype.GetBirthYear = function() {
	  var BirthYear='';
	  if(this.Valid)BirthYear=this.ID18.substr(6,4);
	  return BirthYear;
	}
	
	// 返回生日中的月，格式如下，10
	clsIDCard.prototype.GetBirthMonth = function() {
	  var BirthMonth='';
	  if(this.Valid)BirthMonth=this.ID18.substr(10,2);
	  if(BirthMonth.charAt(0)=='0')BirthMonth=BirthMonth.charAt(1);
	  return BirthMonth;
	}
	
	// 返回生日中的日，格式如下，10
	clsIDCard.prototype.GetBirthDay = function() {
	  var BirthDay='';
	  if(this.Valid)BirthDay=this.ID18.substr(12,2);
	  return BirthDay;
	}
	
	// 返回性别，1：男，0：女
	clsIDCard.prototype.GetSex = function() {
	  var Sex='';
	  if(this.Valid)Sex=this.ID18.charAt(16)%2;
	  return Sex;
	}
	
	// 返回15位身份证号码
	clsIDCard.prototype.Get15 = function() {
	  var ID15='';
	  if(this.Valid)ID15=this.ID15;
	  return ID15;
	}
	
	// 返回18位身份证号码
	clsIDCard.prototype.Get18 = function() {
	  var ID18='';
	  if(this.Valid)ID18=this.ID18;
	  return ID18;
	}
	
	// 返回所在省，例如：上海市、浙江省
	clsIDCard.prototype.GetLocal = function() {
	  var Local='';
	  if(this.Valid)Local=this.Local;
	  return Local;
	}
	
	clsIDCard.prototype.GetVCode = function(CardNo17) {
	  var Wi = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1);
	  var Ai = new Array('1','0','X','9','8','7','6','5','4','3','2');
	  var cardNoSum = 0;
	  for (var i=0; i<CardNo17.length; i++)cardNoSum+=CardNo17.charAt(i)*Wi[i];
	  var seq = cardNoSum%11;
	  return Ai[seq];
	}
	
	clsIDCard.prototype.CheckValid = function(CardNo18) {
	  if(this.GetVCode(CardNo18.substr(0,17))!=CardNo18.charAt(17))return false;
	  if(!this.IsDate(CardNo18.substr(6,8)))return false;
	  var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
	  if(aCity[parseInt(CardNo18.substr(0,2))]==null)return false;
	  this.ID18=CardNo18;
	  this.ID15=CardNo18.substr(0,6)+CardNo18.substr(8,9);
	  this.Local=aCity[parseInt(CardNo18.substr(0,2))];
	  return true;
	}
	
	clsIDCard.prototype.IsDate = function(strDate) {
	  var r = strDate.match(/^(\d{1,4})(\d{1,2})(\d{1,2})$/);
	  if(r==null)return false;
	  var d= new Date(r[1], r[2]-1, r[3]);
	  return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[2]&&d.getDate()==r[3]);
	}
	
	Y2.Validate = Validate;
	Y2.ValidateManager = {
			Int : Validate.isInteger,
			Empty : Validate.isEmpty,
			NotEmpty : Validate.notEmpty,
			MaxLength : Validate.checkLength,
			IsZip : Validate.isZip,
			IsWorkPhone : Validate.isWorkPhone,
			IsPhoneNumber : Validate.isPhoneNumber,
			IsTelephone :Validate.isTelephone,
			IsSimplePhone: Validate.isSimplePhone,
			IsMail:Validate.isMail,
			EqualTo:Validate.equalTo,
			NotEqualTo:Validate.notEqualTo,
			GreatThanOrEqualTo:Validate.greatThanOrEqualTo,
			IsDate:Validate.isDate,
			IsIdCard:Validate.isIdCard,
			IsCardID:Validate.isCardID,
			DateCheck:Validate.dateCheck,
			IsStupidTelephone:Validate.isStupidTelephone,
			IsNumOrLetter : Validate.isNumOrLetter
		};
}, "0.0.1", {requires:[]});