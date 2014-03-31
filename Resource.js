/**
 * Created by andycall on 14-3-28.
 */


function css(obj,attr,value){
    var isIE = !!document.currentStyle,
        isSet = arguments.length > 2 ? true : false,
        styleValue,opaValue;
    var RegFilter = /[\,\)]?opacity=([0-9]+)/;
    function setValue(attr){
        if(attr == 'opacity'){
            opaValue = parseInt(document.currentStyle[attr].match(RegFilter)[1])/100;
            styleValue = opaValue;
        }
        else{
            styleValue = document.currentStyle[attr];
        }
    }
    if(!isSet){
        if(isIE){

        }
        else{
//            debugger;
            styleValue = window.getComputedStyle(obj,null)[attr];
        }
        return styleValue;
    }
    else{
        if(attr == 'opacity' && isIE){
            if(document.currentStyle["filter"].indexOf(",") != -1){
//                var insertStart = document.currentStyle["filter"].indexOf("(");
//                var insertEnd = document.currentStyle["filter"].indexOf(")");
//                document.style['filter'] = "alpha(opacity=" + 100 * value + "," +  document.currentStyle["filter"].substring(insertStart+1,insertEnd) + ")";

            }
            else{
                document.style['filter'] = "alpha(opacity=" + 100 * value + ")";
            }
        }
        obj.style[attr] = value;
    }
}

function constant(obj,json,s,fn){
    var time = 1000 / 60;
    var speed = s || 1000;
    var jsonLen = Object.keys(json).length;
    var stop = true;

    for(var key in json){
        if(json.hasOwnProperty(key)){
            speed = s;
//            debugger;
            var len = parseFloat(json[key]) - parseFloat(css(obj, key));
            speed = len / (speed / time);
            obj[key.toString() + "speed"] = speed;
//            json.length ++;
        }
    }

    if(obj.timer){
        clearInterval(obj.timer);
    }

//    debugger;

    obj.timer = setInterval(function(){
        for(var key in json){
            if(json.hasOwnProperty(key)){
                var oldVal = parseFloat(css(obj,key));
                var newValue = oldVal + obj[key.toString() + "speed"];
//                debugger;
                if(key == 'opacity'){
                    json[key] *= 100;
                    newValue *= 100;
                }
//                debugger;
                if (Math.abs(parseFloat(json[key]) - newValue) < 1) {
                    clearInterval(obj.timer);
                    newValue = parseFloat(json[key]);
//                    debugger;
                    //判断是否到最后，然后执行回调函数
                    if(stop >= jsonLen){
                        if (typeof fn == 'function') {
                            fn.apply(this);
                        }
                    }
                    stop ++;
                }
                if(key == 'opacity'){
                    css(obj,key,newValue / 100);
                }
                else{
                    css(obj,key,newValue + 'px');
                }
            }

        }
    },time);
}
function sub(obj,json,scale,fn){
    var time = 1000 / 60;
    var speed,oldValue;
    scale = scale || 2;
    if(obj.timer){
        clearInterval(obj.timer);
    }
    obj.timer = setInterval(function(){
        for(var key in json){
            if(json.hasOwnProperty(key)){
                oldValue = parseFloat(css(obj,key));
                speed = ((json[key] - oldValue) / scale) / time;
                var newValue  = oldValue + speed;
                console.log(json[key]);

                if(key == 'opcacity'){

                }

                if((Math.abs(json[key] - newValue) <= 1 && key != 'opacity')|| (Math.abs(json[key] - newValue) * 100 <=1) ){
                    clearInterval(obj.timer);
                    newValue = obj[key];
                    if (key == "opacity") {
                        css(obj, key, newValue);
                    }
                    else {
                        css(obj, key, newValue + 'px');
                    }

                    if(typeof fn == 'function'){
                        return fn.apply(this);
                    }
                }
                if(key == 'opacity'){
                    css(obj,key,newValue);
                }
                else{
                    css(obj,key,newValue + 'px');
                }
            }
        }
    },time);
}

//弹性运动
function dap(obj,json,fn){
   var ele  = obj;
    //对于这种弹性运动的写法，7是效果比较好的"经验值"
        scale = 7;

    ele.speed = {};

    for(var item in json){
        ele.speed[item] = 0;
    }

    if(ele.timer)
        clearInterval(ele.timer);

    ele.timer = setInterval(function(){
        var stop = true;

        for(var item in json){

            var oldValue = parseFloat(css(obj,item)),
                newValue;

            if(oldValue != json[item]){
                stop = false;
            }else{
                continue;
            }

            ele.speed[item] += (json[item] - oldValue) / scale;
            ele.speed[item] *= 0.7;

            newValue = oldValue + ele.speed[item];

            if(Math.abs(json[item] - oldValue) < 1){
                newValue = json[item];
            }

            css(obj,item,newValue + "px");

        }

        if(stop){
            clearInterval(ele.timer);
            if(typeof fn != "undefined")
                fn();
        }

    },30);

}

