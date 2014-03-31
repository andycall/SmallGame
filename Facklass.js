/**
 * Created by andycall on 14-3-28.
 */
function FackKlass(Base,prop){
    var F = function(){};
    var Child = function(){
        if(Child.super && Child.super.hasOwnProperty('constructor')){
            Child.super.constructor.apply(this,arguments);
        }
        else if(Child.super.hasOwnProperty('constructor')){
            Child.super.constructor.apply(this,arguments);
        }
    };
    F.prototype = Base.prototype;
    Child.prototype = new F;
    Child.super = Base.prototype;
    Child.prototype.constructor = Child;
    for(var key in prop){
        if(prop.hasOwnProperty(key)){
            Child[key] = Base[key];
        }
    }
    return Child;
}

