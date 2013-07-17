var PB = PB || {}

PB.Map = {}
PB.Map.Action = function() {
    
    this.parameter = {}
    this.addParameter = function(param) {
        this.parameter = param;
    }
}


PB.Map.Module = function() {
    
    PB.Map.Action.call(this);
    
}

