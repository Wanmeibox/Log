var ERR_CODE = "error_code";		    /* 定义错误码名称 */
var ENONE = 0;						    /* 没有错误 */

/* ---------------------------------- 系统通用错误 ----------------------------------- */
var ESYSTEM = -40101;					/* 系统错误。 */
var EEXPT = -40102;					/* 异常情况 */
var ENOMEMORY = -40103;					/* 内存不足 */
var EINVEVT = -40104;					/* 不支持的事件 */
var ECODE = -40105;					/* 不支持的操作类型； */
var EINVINSTRUCT = -40106;				/* 不支持的指令 */
var EFORBID = -40107;					/* 禁止的操作。 */
var ENOECHO = -40108;					/* 超时无响应。 */
var ESYSBUSY = -40109;					/* 系统繁忙。 */
var ENODEVICE = -40110;					/* 找不到设备。 */

/* ---------------------------------- 数据通用错误 ----------------------------------- */
var EOVERFLOW = -40201;					/* 数据溢出。 */
var ETOOLONG = -40202;					/* 数据过长。 */
var EENTRYEXIST = -40203;				/* 条目已存在。 */
var EREFERED = -40204;					/* 条目被关联了 */
var EENTRYNOTEXIST = -40205;			        /* 条目不存在。 */
var EENTRYCONFLIC = -40206;				/* 条目冲突。 */
var ETABLEFULL = -40207;				/* 表满。 */
var ETABLEEMPTY = -40208;				/* 空表。 */
var EINVARG = -40209;					/* 参数错误 */
var EINVFMT = -40210;					/* 格式错误 */
var ELACKARG    = -40211;				/* 缺少必要参数 */
var EINVBOOL = -40212;					/* 布尔类型的取值只能是0或者1 */
var ESTRINGLEN = -40213;				/* 字符串长度非法 */

/* --------------------------------- 网络参数通用错误 --------------------------------- */
var EINVIP = -40301;					/* IP地址不正确。 */
var EINVGROUPIP = -40302;				/* 组播的IP地址 */
var EINVIPFMT = -40303;					/* IP地址格式错误 */
var EINVLOOPIP = -40304;				/* 回环的IP地址 */
var EINVMASK = -40305;					/* 掩码不正确。 */
var EINVGTW = -40306;					/* 网关不正确。 */
var EGTWUNREACH = -40307;				/* 网关不可达。 */
var ECOMFLICTNET = -40308;				/* 网段冲突*/
var EINVNET = -40309;					/* 非法的网段 */
var EINVMACFMT = -40310;				/* MAC地址格式不正确。 */
var EINVMACGROUP = -40311;				/* MAC地址为组播地址 */
var EINVMACZERO = -40312;				/* MAC地址全零 */
var EINVMACBROAD = -40313;				/* 广播地址的MAC地址 */
var EINVNETID = -40314;					/* 网络号全0或者1 */
var EINVHOSTID = -40315;				/* 主机号全0或者1 */
var EINDOMAIN = -40316;					/* 非法的域名 */
var EINVIPMASKPAIR = -40317;			        /* IP和掩码不匹配 */
var EMACEMPTY = -40318;					/* MAC地址为空 */

/* --------------------------------- 认证通用错误 -------------------------------------- */
var EUNAUTH = -40401;					/* 认证失败。 */
var ECODEUNAUTH = -40402;				/* 验证码认证失败 */
var ESESSIONTIMEOUT = -40403;			        /* session超时 */
var ESYSLOCKED = -40404;				/* 系统锁定。 */
var ESYSRESET = -40405;					/* 恢复出厂设置。 */
var ESYSCLIENTFULL = -40406;			/* 认证失败，超出支持的客户端数量 */
var ESYSCLIENTNORMAL = -40407;			/* 其它情况，一般是首次登录。 */

/* --------------------------------- 模块network错误 ------------------------------------ */
var EINVMTU = -50101;					/* MTU错误 */
var EINVFDNSVR = -50102;				/* 非法的首选DNS */
var EINVSDNSVR = -50103;				/* 非法的备选DNS */
var EDNSMODE = -50104;					/* DNS模式非法 */
var ENOLINK = -50105; 					/* WAN口未连接 */
var ENETMASKNOTMATCH = -50106;			        /* 网络号与掩码不匹配 */
var ENETLANSAME = -50107;				/* 网络号处于LAN口IP网段 */
var ENETWANSAME = -50108;				/* 网络号处于WAN口IP网段 */
var EWANSPEED = -50109;					/* WAN口速率非法 */
var EISPMODE = -50110;					/* ISP模式值非法 */
var EDIAGMODE = -50111;					/* 拨号模式值非法 */
var ECONNECTMODE = -50112;				/* 连接模式值非法 */
var ELANIPMODE = -50113;				/* LAN口IP模式值非法 */
var EHOSTNAME = -50114;					/* 主机名非法 */
var EPPPOEUSER = -50115;				/* 宽带帐号长度非法 */
var EPPPOEPWD = -50116;					/* 宽带密码长度非法 */
var EINVTIME = -50117;					/* 自动断线等待时间非法 */
var EPPPOEAC = -50118;					/* PPPoE服务名器名非法 */
var EPPPOESVR = -50119;					/* PPPoE服务名名非法 */
var EINVPTC = -50120;					/* 不支持的协议类型。 */
var EWANTYPE = -50121;					/* 不支持的WAN口接入类型。*/
var EMACCLONECONFLICT = -50122;				/* MAC地址克隆冲突 */

/* --------------------------------- 模块wireless错误 ------------------------------------ */
var EWLANPWDBLANK = -50201;				/* 无线密码为空 */
var EINVSSIDLEN = -50202;				/* 无线SSID长度不合法 */
var EINVSECAUTH = -50203;				/* 无线安全设置的认证类型错误 */
var EINVWEPAUTH = -50204;				/* WEP认证类型错误 */
var EINVRADIUSAUTH = -50205;			        /* RADIUS认证类型错误 */
var EINVPSKAUTH = -50206;				/* PSK认证类型错误 */
var EINVCIPHER = -50207;				/* 加密算法错误 */
var EINVRADIUSLEN = -50208;				/* radius密钥短语长度错误 */
var EINVPSKLEN = -50209;				/* psk密钥短语错误 */
var EINVGKUPINTVAL = -50210;			        /* 组密钥更新周期错误 */
var EINVWEPKEYTYPE = -50211;			        /* WEP密钥类型错误 */
var EINVWEPKEYIDX = -50212;				/* 默认WEP密钥索引错误 */
var EINVWEPKEYLEN = -50213;				/* WEP密钥长度错误 */
var EINVACLDESCLEN = -50214;			        /* MAC地址过滤条目描述信息长度错误 */
var EINVWPSPINLEN = -50215;				/* WPS PIN码长度错误 */
var EINVAPMODE = -50216;				/* 无线设备工作模式错误 */
var EINVWLSMODE = -50217;				/* 无线速率模式(bgn)错误 */
var EINVREGIONIDX = -50218;				/* 无线国家码错误 */
var EINVCHANWIDTH = -50219;				/* 频段带宽错误 */
var EINVRTSTHRSHLD = -50220;			        /* 无线RTS阈值错误 */
var EINVFRAGTHRSHLD = -50221;			        /* 无线分片阈值错误 */
var EINVBCNINTVL = -50222;				/* 无线beacon间隔错误 */
var EINVTXPWR = -50223;					/* 无线Tx功率错误 */
var EINVDTIMINTVL = -50224;				/* 无线DTIM周期错误 */
var EINVWLANPWD = -50225;				/* 无线密码错误 */
var ESSIDBROAD = -50226;				/* 广播配置错误 */
var EAPISOLATE = -50227;				/* AP隔离配置错误 */
var EWIFISWITCH = -50228;				/* 无线开启关闭配置错误 */
var EMODEBANDWIDTHNOTMATCH = -50229; 	                /* 无线模式与带宽不匹配 */
var EINVCHANNEL2G = -50230;				/* 2g信道不合法 */
var EINVCHANNEL5G = -50231;				/* 5g信道不合法 */
var EPSKNOTHEX = -50232;				/* 64位加密包含非十六进制字符 */
var EINVWDSAUTH = -50233;				/* 无线WDS认证类型错误 */
var EINVA34DETECT = -50234;				/* 3/4地址格式配置错误 */
var EINVSSIDNULL = -50237;				/* 无线SSID为空 */
var EINVCHNAMODEBAND = -50238;				/* WDS开启时，信道、模式和带宽均不可配 */
var EINVSSIDBLANK = -50239;				/* SSID全为空格 */

/* --------------------------------- 模块dhcp错误 ------------------------------------ */
var EINVLEASETIME = -50301;				/* 非法的地址租期。 */
var EINVSTARTADDRPOOL = -50302;			        /* 地址池开始地址非法 */
var EINVENDADDRPOOL = -50303;			        /* 地址池结束地址非法 */
var EDHCPDGTW = -50304;					/* 网关非法 */
var EGTWNOTLANSUBNET = -50305;			        /* 网关不在LAN网段 */
var EDHCPDPRIDNS = -50306;				/* 首选DNS服务器地址非法 */
var EDHCPDSNDDNS = -50307;				/* 备用DNS服务器地址非法 */

/* --------------------------------- 模块firewall错误 -------------------------------- */
var EHOSTNAMEEMP = -50401;				/* 受控主机名为空 */
var EOBJNAMEEMP = -50402;				/* 访问目标名为空 */
var EPLANNAMEEMP = -50403;				/* 日程计划名为空 */
var ERULENAMEEMP = -50404;				/* 规则描述名为空 */
var EOBJDOMAINALLEMP = -50405;			        /* 访问目标域名全为空 */
var EHOSTALLEMPTY = -50406;				/* 受控主机IP全为空 */
var EOBJALLEMPTY = -50407;				/* 访问目标IP和端口全为空 */
var ENOTLANSUBNET = -50408;				/* IP地址必须是LAN网段IP */
var ELANSUBNET = -50409;				/* IP地址不能为LAN网段IP */
var ELANIPCONFLIC = -50410;				/* IP地址不能为LAN口IP */
var EILLEGALPORT = -50411;				/* 端口值非法 */
var EPORTRESERVED = -50412;				/* 端口冲突*/
var EINVPORT = -50413;					/* 超出端口范围 */
var EINVPORTFMT = -50414;				/* 端口格式错误 */
var ECONTROLPORTEMPY = -50415;				/* 控制端口不能为空 */
var EDATAPORTALLEMPY = -50416;				/* 数据端口全为空 */

/* --------------------------------- 模块nas错误 ------------------------------------ */
var EINVNASUSER = -50501;				/* 用户名非法 */
var EINVNASUSERLEN = -50502;			        /* 用户名长度非法 */
var EINVNASPWD = -50503;				/* 密码非法 */
var EINVNASPWDLEN = -50504;				/* 密码长度非法 */
var EDELADMIN = -50505;					/* admin帐户不能删除 */
var EEDITADMIN = -50506;				/* admin帐户名不能修改 */
var EINVPATHNULL = -50507;				/* 文件夹路径为空 */
var EINVPATH = -50508;					/* 文件夹路径格式非法 */
var EINVPATHLEN = -50509;				/* 文件夹路径长度非法 */
var EPATHCONFLICT = -50510;				/* 文件夹路径冲突 */

/* --------------------------------- 模块samba错误 ---------------------------------- */


/* --------------------------------- 模块media_server错误 ---------------------------- */
var ESCANVAL = -50701;					/* 自动扫描时间非法 */
var EMSNAMENULL = -50702;				/* 媒体服务器共享名称为空 */
var EMSNAME = -50703;					/* 媒体服务器共享名称非法 */
var EMSNAMELEN = -50704;				/* 媒体服务器共享名称长度非法 */
var EMSNAMECONFLICT = -50705;			        /* 媒体服务器共享名称冲突 */

/* --------------------------------- 模块ddns错误 ------------------------------------ */
var ENAMEBLANK = -50801;				/* 用户名输入为空 */
var EINVNAME = -50802;					/* 用户名非法 */
var EINVNAMELEN = -50803;				/* 用户名长度超出范围 */
var EDDNSPWDLEN = -50804;				/* 密码长度非法 */
var EDDNSPWD = -50805;					/* 密码还有非法字符 */
var EDDNSPWDBLANK = -50806;			        /* 密码为空 */

/* --------------------------------- 模块system错误 ---------------------------------- */
var EINVDATE = -50901;					/* 日期输入错误 */
var EINVTIMEZONE = -50902;				/* 时区输入错误 */
var EFWERRNONE = -50903;                                /* 固件无错误，升级模块base code */
var EFWEXCEPTION = -50904;				/* 固件升级出现异常 */
var EFWRSAFAIL = -50905;				/* 固件RSA签名错误 */
var EFWHWIDNOTMATCH = -50906;			        /* 固件不支持该类型硬件升级 */
var EFWZONECODENOTMATCH = -50907;		        /* 固件区域码不匹配 */
var EFWVENDORIDNOTMATCH = -50908;		        /* 固件品牌不匹配 */
var EFWNOTINFLANDBL = -50909;			        /* 固件不在升级列表之内 */
var EFWNEWEST = -50910;					/* 固件内容与现有相同 */
var EFWNOTSUPPORTED = -50911;			        /* 固件类型不支持升级 */
var EMD5 = -50914;					/* MD5校验失败 */
var EDESENCODE = -50915;				/* DES加密失败 */
var EDESDECODE = -50916;				/* DES解密失败 */
var ECHIPID = -50917;					/* 不支持的芯片类型； */
var EFLASHID = -50918;					/* 不支持的FLASH类型； */
var EPRODID = -50919;					/* 不支持的产品型号； */
var ELANGID = -50920;					/* 不支持的语言； */
var ESUBVER = -50921;					/* 不支持子版本号； */
var EOEMID = -50922;					/* 不支持的OEM类型； */
var ECOUNTRYID = -50923;				/* 不支持的国家； */
var EFILETOOBIG = -50924;				/* 上传文件过大 */
var EPWDERROR = -50925;					/* 登录密码错误 */
var EPWDBLANK = -50926;					/* 密码输入为空 */
var EINVPWDLEN = -50927;				/* 密码长度超出范围 */
var EINVKEY = -50928;					/* 旧密码错误 */
var EINVLGPWDLEN = -50929;				/* 登录密码长度不合法 */
var EINLGVALCHAR = -50930;				/* 登录密码含有非法字符 */
var EINLGVALOLDSAME = -50931;			        /* 新登录密码和旧登录密码一样 */
var EHASINITPWD = -50932;				/* 已设置过初始密码，不能重复设置 */

/* --------------------------------- 模块FTP错误 ------------------------------------ */
var EFTPNAMENULL = -51001;				/* FTP文件夹名称为空 */
var EFTPNAME = -51002;					/* FTP文件夹名称非法 */
var EFTPNAMELEN = -51003;				/* FTP文件夹名称长度非法 */
var EFTPNAMECONFLICT = -51004;			        /* FTP文名称冲突 */
var EFTPNAMEINVCHR = -51005;				/* 名称中含有非法字符 */
var EFTPNAMEINVSTARTENDCHR = -51006;			/* 名称的起始或结束字符非法 */

/* --------------------------------- 模块app错误 --------------------------------------- */
var EAPPNONE = -51101;					/* 安装应用不存在 */
var EAPPHAS = -51102;					/* 应用程序已安装 */ 
var EAPPNOT = -51103;					/* 应用程序未安装 */
var EINSFAIL = -51104;					/* 应用程序安装失败 */
var EUNINSFAIL = -51105;				/* 应用程序卸载失败 */

/* --------------------------------- 模块cloud错误 ------------------------------------- */


/* --------------------------------- 模块guest_network错误 ----------------------------- */
var EINVSPEEDCFG = -51301;				/* 最大上传速度或最大下载速度配置错误 */
var EINVTIMEOUTCFG = -51302;			        /* 超时配置错误 */
var EINVLIMITTYPE = -51303;				/* 开放时间类型非法 */
var EINVMON = -51304;					/* 周期的开放时间，周一时间非法 */
var EINVTUE = -51305;					/* 周期的开放时间，周二时间非法 */
var EINVWED = -51306;					/* 周期的开放时间，周三时间非法 */
var EINVTHU = -51307;					/* 周期的开放时间，周四时间非法 */
var EINVFRI = -51308;					/* 周期的开放时间，周五时间非法 */
var EINVSAT = -51309;					/* 周期的开放时间，周六时间非法 */
var EINVSUN = -51310;					/* 周期的开放时间，周日时间非法 */

/* --------------------------------- 模块ip_mac_bind错误 -------------------------------- */
var ENOTLANWANNET = -51401;				/* 网段不是LAN或WAN */
var EBINDIPUSED = -51402;				/* 要绑定的IP已经被占用 */

/* ---------------------------------- 无线定时开关错误 -------------------------------- */
var ETSTIMEPERIODBLANK = -51801;       	/* 无线定时开关描述为空 */
var ETSTIMEPERIODTOOLONG = -51802;     	/* 无线定时开关描述太长	*/
var ETSINVTLBEGINTIME = -51803;        	/* 无线定时开关时间非法	*/
var ETSINVTLEENDTIME = -51804;         	/* 无线定时开关结束时间非法	*/ 
var ETSINVTLBEGINENDTIME = -51805;     	/* 无线定时开关开始时间不早于结束时间 */ 
var ETSTLREPEATBLANK = -51806;        	/* 无线定时开关重复周期为空 */
var ETSLIMITTIMEREPEAT = -51807;       	/* 无线定时开关重复周期非法 */
var ETSENABLE = -51808;                	/* 无线定时开关开启开关非法 */

function Checks()
{
	this.ipStr = "ip";
	this.maskStr = "mask";
	this.gatewayStr = "gateway";
	this.dnsStr = "dns";

	/* 检查IP地址类型是否合法（E类IP地址认定为非法） */
	this.validIpAddr = function(value, checkOption)
	{
		var ipByte = value.split(".");
		var result = true;

		for(var i = 1, len = ipByte.length; i < len; i++)
		{
			if (255 < ipByte[i])
			{
				return EINVIP;
			}
		}

		/* 网段非法 */
		if (false == result || (0 == ipByte[0]) || 0xE0 < ipByte[0])
		{
			return EINVNET;
		}

		/* 组播IP地址 */
		if ((undefined == checkOption || true != checkOption.unCheckMutiIp) && 0xE0 == ipByte[0])
		{
			return EINVGROUPIP;
		}

		/* 回环IP地址 */
		if ((undefined == checkOption || true != checkOption.unCheckLoopIp) && 127 == ipByte[0])
		{
			return EINVLOOPIP;
		}

		return ENONE;
	};

	/* 检查IP地址格式是否正确 */
	this.validIpFormat = function (value)
	{
		var result = /^([0-9]{1,3}\.){3}([0-9]{1,3})+$/g.test(value);
		return (result == true ? ENONE : EINVIPFMT);
	};

	/* 检查IP是否合法 */
	this.checkIp = function(value, checkOption)
	{
		var result = ENONE;

		if (0 == value.length)
		{
			return EINVIP;
		}

		if (ENONE != (result = this.validIpFormat(value)))
		{
			return result;
		}

		if (ENONE != (result = this.validIpAddr(value, checkOption)))
		{
			return result;
		}

		return result;
	};

	/* 检查MAC地址范围是否合法 */
	this.validMacAddr = function(value)
	{
		var charSet = "0123456789abcdef";
		var macAddr = value.toLowerCase();

		if (macAddr == "00-00-00-00-00-00")
		{
			return EINVMACZERO;
		}

		if (macAddr == "ff-ff-ff-ff-ff-ff")
		{
			return EINVMACBROAD;
		}

		if (1 == charSet.indexOf(macAddr.charAt(1)) % 2)
		{
			return EINVMACGROUP;
		}

		return ENONE;
	};

	/* 检查MAC地址格式是否合法 */
	this.validMacFormat = function(value)
	{
		var macAddr = value.split("-");
		var result = /^([0-9a-f]{2}-){5}([0-9a-f]{2})+$/gi.test(value);

		return (result == true ? ENONE : EINVMACFMT);
	};

	/* 检查MAC地址是否正确 */
	this.checkMac = function(value)
	{
		var result = ENONE;

		if (ENONE != (result = this.validMacFormat(value)))
		{
			return result;
		}

		if (ENONE != (result = this.validMacAddr(value)))
		{
			return result;
		}

		return result;
	};

	/* 检查子网掩码是否正确 */
	this.checkMask = function(value)
	{
		var maskVal, maskTmp = 0x00000001;

		if (ENONE != this.validIpFormat(value))
		{
			return EINVMASK;
		}

		maskVal = this.transIp(value)

		for (var index = 0; index < 32; index++, maskTmp <<= 1)
		{
			if (0x00 != (maskTmp & maskVal))
			{
				if (0 == (maskVal ^ (0xFFFFFFFF << index)))
				{
					return ENONE;
				}

				return EINVMASK;
			}
		}

		return EINVMASK;
	};

	/* 检查MTU值是否在规定范围内 */
	this.checkMtu = function(value, max, min)
	{
		var result = ENONE;

		if (this.checkNum(value) == false)
		{
			return EINVMTU;
		}

		if (max == undefined)
		{
			max = 1500;
			min = 576;
		}

		if (false == this.checkNumRange(parseInt(value), max, min))
		{
			return EINVMTU;
		}

		return ENONE;
	};

	/* 使用掩码检查IP是否合法 */
	this.checkIpMask = function(ipValue, maskValue)
	{
		var maskVal = this.transIp(maskValue);
		var ipVal = this.transIp(ipValue);
		var result = this.checkIPNetHost(ipVal, maskVal);

		if (result != ENONE)
		{
			return result;
		}

		result = this.checkIpClass(ipValue, maskValue);

		/* 子网掩码比IP地址网络号小 */
		if (result != ENONE)
		{
			return result;
		}

		return ENONE;
	};
	
	/* 使用掩码检查网络是否合法, added by WuWeier */
	this.checkNetworkMask = function(netValue, maskValue)
	{
		var result = netValue == this.getNetwork(netValue, maskValue);
		return (result ? ENONE : EINVIPMASKPAIR);
	};
	
	/* 根据IP和掩码获取网络地址, added by WuWeier */
	this.getNetwork = function(ipValue, maskValue)
	{
		var ipByte = ipValue.split(".");
		var maskByte = maskValue.split(".");
		var netByte = new Array();
		
		for(var i = 0, len = ipByte.length; i < len; i++)
		{
			var temp = ipByte[i] & maskByte[i];
			netByte.push(temp);
		}
		
		return netByte.join(".");
	};
	
	/* 使用掩码判断两个IP是否处于同一网段, added by WuWeier */
	this.isSameNet = function(srcIpValue, srcMaskValue, dstIpValue)
	{
		var result = true;
		var srcNetValue = this.getNetwork(srcIpValue, srcMaskValue);
		var dstNetValue = this.getNetwork(dstIpValue, srcMaskValue);
		result = srcNetValue == dstNetValue;
		return result;
	};

	/* 将点分格式的IP转换为整数 */
	this.transIp = function(val)
	{
		var value = val.split(".");
		return (0x1000000 * value[0] + 0x10000 * value[1] + 0x100 * value[2] + 1 * value[3]);
	};

	/* 获取汉字的长度 */
	this.getCNStrLen = function(str)
	{
		return str.replace(/[^\x00-\xFF]/g, "xxx").length;	// modified by xiesimin: SLP采用UTF-8编码
	};

	/* 获取IP类型：A、B、C、D、E */
	this.getIpClass = function(value)
	{
		var ipByte = value.split(".");
		if (ipByte[0] <= 127)
		{
			return 'A';
		}
		if (ipByte[0] <= 191)
		{
			return 'B';
		}
		if (ipByte[0] <= 223)
		{
			return 'C';
		}
		if (ipByte[0] <= 239)
		{
			return 'D';
		}
		return 'E';
	};

	/* 检查是否含有非数字的字符 */
	this.checkNum = function(value)
	{
		/* 返回值为true表明是纯数字，false表明不是纯数字 */
		return (!(/\D/g.test(value)));
	};

	/* 检测主机号和网络号是否全是0/1 */
	this.checkIPNetHost = function(ipVal, maskVal)
	{
		/* 网络号全0/1 */
		if (0x0 == (ipVal & maskVal) || maskVal == (ipVal & maskVal))
		{
			return EINVNETID;
		}

		/* 主机号全0/1(源地址/广播地址) */
		if (0x0 == (ipVal & (~maskVal)) || (~maskVal) == (ipVal & (~maskVal)))
		{
			return EINVHOSTID;
		}

		return ENONE;
	};

	/* 检查Ip类型是否合法 */
	this.checkIpClass = function(ipValue, maskValue)
	{
		var netId = this.getIpClass(ipValue);
		var ipVal = this.transIp(ipValue);
		var maskVal = this.transIp(maskValue);

		switch(netId)
		{
		case 'A':
			ipVal &= 0xFF000000;
			break;
		case 'B':
			ipVal &= 0xFFFF0000;
			break;
		case 'C':
			ipVal &= 0xFFFFFF00;
			break;
		}

		return (maskVal > ipVal ? ENONE : EINVIPMASKPAIR);
	};

	/* 检查输入的值是否在规定的范围内 */
	this.checkInputName = function(value, maxLen, minLen)
	{
		var len = this.getCNStrLen(value);

		if (minLen > len || maxLen < len)
		{
			return ESTRINGLEN;
		}

		return ENONE;
	};

	/* 检查给出的值是否在指定的范围内 */
	this.checkNumRange = function(value, max, min)
	{
		if (isNaN(value) || value < min || value > max)
		{
			return false;
		}

		return true;
	};
	
	/* checkWepPasswd added by xiesimin */
	this.checkWepPasswd = function(value)
	{
		//密码只能是代表16进制数字的字符
		if (/[^\da-fA-F]/g.test(value))
		{
			return false;
		}
		
		var len = this.getCNStrLen(value);
		if ((len != 5) && (len != 10) && (len != 13) && (len != 26))
		{
			return false;
		}
		
		return true;
	};
	
	/* checkPskPasswd added by xiesimin */
	this.checkPskPasswd = function(value)
	{
		//密码只能包含字母、数字、下划线
		if (/\W/g.test(value))
		{
			return false;
		}
		
		//对最大最小长度进行限制
		var len = this.getCNStrLen(value);
		if ((len < 8) || (len > 64))
		{
			return false;
		}

		return true;
	};
	
	/* checkWifiPasswd added by xiesimin */
	this.checkWifiPasswd = function(value, mode)
	{
		switch(mode)
		{
			case "wep":
				return this.checkWepPasswd(value);
				break;
			case "psk":
				return this.checkPskPasswd(value);
				break;
			default :
				return false;
				break;
		}
	};
	
	/* checkWifiName added by xiesimin */
	this.checkWifiName = function(value, maxLen, minLen)
	{
		if (ENONE != this.checkInputName(value, maxLen, minLen))
		{
			return false;
		}
		
		return true;
	};
	
	/* 检查域名是否含有非法字符 */
	this.checkDomain = function(value)
	{
		if (/[^0-9a-z\-\.]/gi.test(value) == true)
		{
			return EINDOMAIN;
		}

		return ENONE;
	};

	/* 检查无线密码长度，如果长度符合，则检查是否有非法字符 */
	this.checkWlanPwd = function(wlanPwd)
	{
		var pwdLen = getCNStrLen(wlanPwd);

		/* 检查无线密码是否含有非法字符 */
		function checkIllegalChar(value)
		{
			var ch = "0123456789ABCDEFabcdefGHIJKLMNOPQRSTUVWXYZghijklmnopqrstuvwxyz`~!@#$^&*()-=_+[]{};:\'\"\\|/?.,<>/% ";
			var chr;

			for (var i = 0, len = value.length; i < len; i++)
			{
				chr = value.charAt(i);
				if (ch.indexOf(chr) == -1)
				{
					return false;
				}
			}

			return true;
		};

		if (0 == pwdLen)		/* 无线密码为空 */
		{
			return EWLANPWDBLANK;
		}
		else if (false == checkIllegalChar(wlanPwd)) /* 检查密码是否有非法字符 */
		{			
			return EINVWLANPWD;
		}		
		else if (8 > pwdLen || 63 < pwdLen)	/* 密码位数小于8 或者是大于63位*/
		{
			return EINVPSKLEN;
		}

		return ENONE;
	};
	
	/* 检查文件路径是否合法 added by LiGuanghua */
	this.checkPath = function(value)
	{
		if (null == value || undefined === value || 0 == value.length)
		{
			return EINVPATHNULL;
		}

		return ENONE;
	};
	
	/* added by WuWeier */
	this.checkEmail = function(email)
	{
		var reg = /^[\x21-\x7e]{1,64}@[\w\d\-]+\./;
		if (!reg.test(email))
		{
			return false;
		}
		
		var tokens = email.split("@");
		if (tokens.length > 2)
		{
			return false;
		}
		
		var domain = tokens[1];
		if (domain.length > 255)
		{
			return false;
		}

		var domainTokens = domain.split(".");
		for (var i in domainTokens) 
		{
			if (!/^[a-zA-Z\d\-]{1,64}$/.test(domainTokens[i]))
			{
				return false;
			}
		}

		return true;
	};
}

(function(){
	Checks.call(window);
})();
