function Progress(endValue, reference, step, delay){
	this.endValue = endValue;
	this.reference = reference;
	this.step = step | 1;
	this.delay = delay | 0.1;

	this.adding = function(){
		this.reference.value+= this.step;
	};

	this.check = function(){
		if (this.step > 0){
			return (this.reference.value < this.endValue);
		}
		else{
			return (this.reference.value > this.endValue);
		}
	};

	this.going = function(){
		if (this.check()){
			this.adding();
		}
		else {
			clearInterval(this.timer);
		}
	};

	this.timer = setInterval(this.going, this.delay);
}