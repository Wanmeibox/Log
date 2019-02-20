
module.exports = {
    GetGoodString: function(context,substring,turn){
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
    },
    Resovle:function(context, startString, stopString, isTurn = false, subIndex = 0)
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
                    var s1 = this.GetGoodString(context, start[i], isTurn);
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
                var s2 = this.GetGoodString(context, stop[0], isTurn);
                res = context.substring(subIndex, context.indexOf(s2) - subIndex);
                return res;
            }
            else
            {
                for (var i = stop.length - 1; i >= 0; i--)
                {
                    var s1 = this.GetGoodString(context, stop[i], isTurn);
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
                var s2 = this.GetGoodString(context, start[start.length - 1], isTurn);
                res = context.substring(context.lastIndexOf(s2) + s2.length + subIndex);
                return res;
            }
        }
        catch (Exception)
        {
            return false;
        }
    },
    Resovles:function(context, startString, stopString, isTurn = false, subIndex = 0)
    {
        var list = [];
        var start = startString.split('*');
        var stop = stopString.split('*');
        try
        {
            if (!isTurn)
            {
                while (context.indexOf(start[0]) > -1)
                {
                    for (var i = 0; i < start.length; i++)
                    {
                        var indexOf = context.indexOf(start[i]);
                        if (indexOf > -1)
                        {
                            context = context.substring(indexOf + start[i].length);
                        }
                        else
                        {
                            return list;
                        }
                    }
                    if (context.indexOf(stop[0]) > -1)
                    {
                        list.push(context.substring(subIndex, context.indexOf(stop[0]) - subIndex));
                    }
                    else
                    {
                        return list;
                    }
                }
            }
            else
            {
                while (context.indexOf(stop[0]) > -1)
                {
                    for (var i = stop.length - 1; i >= 0; i--)
                    {
                        var indexOf = context.lastIndexOf(stop[i]);
                        if (indexOf > -1)
                        {
                            context = context.substring(0, indexOf);
                        }
                        else
                        {
                            return list;
                        }
                    }
                    list.push(context.substring(context.lastIndexOf(start[start.length - 1]) + start[start.length - 1].length + subIndex));
                }
            }
            return list;
        }
        catch (Exception)
        {
            return list;
        }
    }
};