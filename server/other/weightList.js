module.exports = function(maxLength){
    this.list = [];
    this.maxLength = maxLength || 100;
    this.set = function(key,value){
        if(!this.replace(key,value)){
            if(this.list.length >= this.maxLength){
                this.sort();
                this.list.pop();
            }
            this.list.push({key:key,value:value,weight:1});
        }
    },
    this.get = function(key){
        for(var i=0;i<this.list.length;i++){
            if(this.list[i].key == key){
                this.list[i].weight ++;
                return this.list[i].value;
            }
        }
        return false;
    },
    this.has = function(key){
        for(var i=0;i<this.list.length;i++){
            if(this.list[i].key == key){
                return this.list[i];
            }
        }
        return false;
    },
    this.replace = function(key,value){
        for(var i=0;i<this.list.length;i++){
            if(this.list[i].key == key){
                this.list[i].key = key;
                this.list[i].value = value;
                this.list[i].weight ++;
                return true;
            }
        }
        return false;
    },
    this.sort = function(){
        this.list.sort(function(a,b){
            return a.weight < b.weight;
        });
    }
}