
function $$(id){
    return typeof id === 'string' ? document.getElementById(id) : id;
}

/**
*  添加事件监听
*/
function on(target,eventName,fn){
    var factor = /\s+/g;
    var fnString = fn.toString().replace(factor,"");
    if(!target[eventName + "event"]){
        target[eventName + 'event'] = {};
    }
    target[eventName + 'event'][eventName] = function(e){
        fn.call(this,e);
    }
    var eventFunc = target[eventName + "event"][eventName];

    if(document.attachEvent){
        target.attachEvent('on' + eventName,eventFunc);
    }
    else if(document.addEventListener){
        target.addEventListener(eventName,eventFunc,false);
    }
    else{
        target['on' + eventName] = eventFunc;
    }
}

/*
* 取消事件监听
*/
function off(target,eventName){
    var factor = /\s+/g;
    var Func = target[eventName + "event"][eventName];
    if(document.detachEvent){
        target.detachEvent('on' + eventName,Func);
    }
    else if(document.removeEventListener){
        target.removeEventListener(eventName,Func,false);
    }
    else{
        target['on' + eventName] = null;
    }
}

/*
* 取消所有事件监听
*/
function offAll(target,eventName){
    var factor = /\s+/g;
    var Funcs = target[eventName + "event"];
    var e;
    for(var key in Funcs){
        if(Funcs.hasOwnProperty(key)){
            e = Funcs[key];
            if(document.detachEvent){
                target.detachEvent('on' + eventName,e);
            }
            else if(document.addEventListener){
                target.removeEventListener(eventName,e,false);
            }
            else{
                target['on' + eventName] = null;
            }
        }
    }
}
/*
* 判断对象是否是DOM对象
*/
function isElement(o){
    return (
        typeof HTMLElement === "function" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
        );
}
/*
* 事件代理函数
*/
function EventWatch(parent,delegate,eventName,fn){
    var callback;
    callback = function (e) {
        e = e || window.event;
        console.log(e);
        var target = e.target || e.srcElement;
        var isRun = false;
        if(Object.prototype.toString.call(delegate) == "[object Array]"){
            for(var i = 0,len = delegate.length; i < len ; i++){
                var item  = delegate[i];
                if(item == target){
                    isRun = true;
                }
            }
        }
        else if(delegate == target){
            isRun = true;
        }
        if(isRun){
            fn.call(target,e);
        }
    };
    on(parent,eventName,callback);
}

/*
* 判断是否包含
*/

function containers(outer,inner){
    return outer.contains ? outer != inner && outer.contains(inner) : !!(outer.compareDocumentPosition(inner) && 16);
}


/*
* 兼容的mouseEnter方法
*/
function mouseEnter(target,fn){
    var eventName = "mouseover";

    var hander = function(e){
        e = e || window.event;
        var target = e.target;
        var FromEle = e.relatedTarget || e.fromElement;
        var flag;
        flag = containers(FromEle,target) && this == target;
        if(flag){
            fn.call(target,e);
        }
    }
    on(target,eventName,hander);
}
/*
* 兼容的mouseOut方法
*/
function mouseOut(target,fn){
    var eventName = "mouseleave";

    var hander = function(e){
        e = e || window.event;
        var target = e.target;
        var FromEle = e.relatedTarget || e.fromElement;

        var flag;
        flag = containers(FromEle,target) && this == target;
        if(flag){
            fn.call(target,e);
        }
    }
    on(target,eventName,hander);
}


/*
*  focus事件的冒泡实现
*/
function focusIn(target,fn){
    var eventName = 'focus';
    var eventIE = "onfocusin";
    var factor = /\s+/g;
//    debugger;
    var fnString = fn.toString().replace(factor,"");
    if(!target[eventName + "event"]){
        target[eventName + 'event'] = {};
    }
    target[eventName + 'event'][fnString + eventName] = function(){
        fn.call(this);
    }
    var eventFunc = target[eventName + "event"][fnString + eventName];
    if(document.attachEvent){
        target.attachEvent(eventIE,eventFunc);
    }
    else if(document.addEventListener){
        target.addEventListener(eventName,eventFunc,true);
    }
    else{
        target[eventIE] = eventFunc;
    }
}
/*
* blur事件的冒泡实现
*/
function focusOut(target,fn){
    var eventName = 'blur';
    var eventIE = "onfocusout";
    var factor = /\s+/g;
//    debugger;
    var fnString = fn.toString().replace(factor,"");
    if(!target[eventName + "event"]){
        target[eventName + 'event'] = {};
    }
    target[eventName + 'event'][fnString + eventName] = function(){
        fn.call(this);
    }
    var eventFunc = target[eventName + "event"][fnString + eventName];
    if(document.attachEvent){
        target.attachEvent(eventIE,eventFunc);
    }
    else if(document.addEventListener){
        target.addEventListener(eventName,eventFunc,true);
    }
    else{
        target[eventIE] = eventFunc;
    }
}
