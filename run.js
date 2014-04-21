var d = document;
var wrapper = d.getElementById('wrap');
var lis = wrapper.getElementsByTagName('li'),
    positionArr = [],
    wapLeft = wrapper.offsetLeft || wrapper.documentElement.offsetLeft,
    wapTop = wrapper.offsetTop || wrapper.documentElement.offsetTop,
    wapWidth = wrapper.offsetWidth || wrapper.documentElement.offsetWidth,
    wapHeight = wrapper.offsetHeight || wrapper.documentElement.offsetHeight,
    index = 0;
function startDrag(ele){
    on(ele,'mousedown',function(e){
        e = e || window.event;

        var target = e.target || e.srcElement,
            pos = {
                left : target.offsetLeft || target.documentElement.offsetLeft ,
                top :  target.offsetTop || target.documentElement.offsetTop
            },
            hit = {};

            //还要考虑冒泡 = =
            if(this != target){
                return;
            }

            var targetWidth = target.offsetWidth || target.documentElement.offsetWidth,
                targetHeight = target.offsetHeight || target.documentElement.offsetHeight;
            index++;
            Tick.setAttr(ele,'zIndex',index);
            on(document,'mousemove',function(e){
                e = e || window.event;
                var mouseX = e.clientX,
                    mouseY = e.clientY,
                   hitArr = [],
                    BestEle;
                var left = mouseX - wapLeft - targetWidth / 2;
                var top = mouseY - wapTop - targetHeight / 2;
                Tick.setAttr(ele,'left',left + 'px');
                Tick.setAttr(ele,'top',top + 'px') ;
                hitArr = hitTest(ele);
                for(var i = 0,len = lis.length; i < len;  i ++){
                    lis[i].style.outline= "0";
                }
                if(hitArr.length){
                    hit.target = findBest(ele,hitArr);
                    hit.index = parseInt(hit.target.dataset.index);

                    hit.pos = {
                        left : hit.target.offsetLeft || hit.target.documentElement.offsetLeft,
                        top : hit.target.offsetTop || hit.target.documentElement.offsetTop
                    };
                    hit.target.style.outline = '1px solid #000';
                }
            });

            on(document,'mouseup',function(e){
                e = e || window.event;
                off(document,'mousemove');
                off(document,'mouseup');
                if(!hit.target){
                    Tick.To(ele,pos,500);
                }
                else{
                    Tick.To(ele,hit.pos,500);
                    Tick.To(hit.target,pos,500);
                }
                for(var i = 0,len = lis.length; i < len;  i ++){
                    lis[i].style.outline= "0";
                }

            });

    });
}
layout();
for(var i = 0,len = lis.length; i < len; i ++){
    startDrag(lis[i]);
}


function layout(){
    var wrapperPosition = Tick.getAttr(wrapper,"position");
    if(wrapperPosition == 'static'){
        Tick.setAttr(wrapper,"position",'relative');
    }
    for(var i = 0,len = lis.length; i < len; i ++){
        var item = lis[i];
        //            debugger;
        var top = (item.offsetTop || item.documentElement.offsetTop);
        var left = (item.offsetLeft|| item.documentElement.offsetLeft);

        lis[i].getAttribute('data-index',i);
        positionArr.push({
            item : item,
            top: top,
            left: left
        });
    }
    for(var i = 0,len = positionArr.length; i < len; i ++){
        var item = positionArr[i].item;
        var top = positionArr[i].top;
        var left = positionArr[i].left;
        Tick.setAttr(item,"top",top + 'px');
        Tick.setAttr(item,"left",left+ 'px');
        Tick.setAttr(item,"position",'absolute');
        Tick.setAttr(item,"margin","0");
    }
}

function hitTest(target){
    var hitArr = [];

    for(var i = 0,len = lis.length; i < len; i ++){
        if(target == lis[i]){
            continue;
        }
        var tLeft = target.offsetLeft || target.documentElement.offsetLeft;
        var tTop = target.offsetTop || target.documentElement.offsetTop;
        var tWidth = target.offsetWidth || target.documentElement.offsetWidth;
        var tHeight = target.offsetHeight || target.documentElement.offsetHeight;

        var toLeft = lis[i].offsetLeft || lis[i].documentElement.offsetLeft,
            toTop = lis[i].offsetTop || lis[i].documentElement.offsetTop,
            toWidth = lis[i].offsetWidth || lis[i].documentElement.offsetWidth,
            toHeight = lis[i].offsetHeight || lis[i].documentElement.offsetHeight;

        if(!(tLeft + tWidth < toLeft || tTop + tHeight < toHeight || toTop + toHeight < tTop || toLeft + toWidth < tLeft)){
            hitArr.push(lis[i])
        }
    }

    return hitArr;
}


function findBest(target,hitArr){
    if(hitArr.length < 1){
        console.log('aaa');
        return;
    }
    if(hitArr.length < 2){
        return hitArr[0];
    }

    var tLeft = target.offsetLeft || target.documentElement.offsetLeft;
    var tTop = target.offsetTop || target.documentElement.offsetTop;
    var tWidth = target.offsetWidth || target.documentElement.offsetWidth;
    var tHeight = target.offsetHeight || target.documentElement.offsetHeight;

    var position = {
        x : tLeft + tWidth / 2 ,
        y : tTop + tHeight / 2
    };
    var finder = Number.MAX_VALUE,
        temp,
        best;

    for(var i = 0,len = hitArr.length; i  < len; i++){
        var tmpLeft = hitArr[i].offsetLeft || hitArr[i].documentElement.offsetLeft;
        var tmpTop = hitArr[i].offsetTop || hitArr[i].documentElement.offsetTop;
        var tmpWidth = hitArr[i].offsetWidth || hitArr[i].documentElement.offsetWidth;
        var tmpHeight = hitArr[i].offsetHeight || hitArr[i].documentElement.offsetHeight;

        tmpPosition = {
            x : tmpLeft + tmpWidth / 2,
            y : tmpTop + tmpHeight / 2
        };

        temp = Math.sqrt(Math.pow(tmpPosition.x - position.x,2) + Math.pow(tmpPosition.y - position.y,2));
        if(temp < finder){
            finder = temp;
            best = i;
        }
    }
    return hitArr[best];
}