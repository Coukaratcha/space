function Game(){
	this.power = 100;
	this.score = 0;
	this.gameover = false;
	this.vue = new Display([0, 0], 1);
	this.objects = [new Ball([this.vue.windowW/2, this.vue.windowH/2], [0,0], [0, 0], 25, 10, [[0, 0]])];
	this.timer = 0;
	this.trigger = true;

	this.display = function(){
		this.vue.updateScale(this.objects[0]);
		this.vue.clearScreen();
		//this.vue.displayGrid();
		this.vue.updateDisplay(this.objects[0].position);
		var pointer = this;
		this.objects.forEach(function(element, index, array){
			pointer.vue.displayBall(element, array[0]);
			pointer.vue.displayMassBall(element);
		});
		this.vue.displayBar(this.power);
	};

	this.updatePhysics = function(){
		var powerGained = checkInnerCollisions(this.objects);
		if (powerGained == -1){
			this.gameover = true;
		}
		else {
			this.gainPower(powerGained);
		}
		var pointer = this;
		this.objects.forEach(function(element, index, array){
	      element.updatePosition(array);
	      pointer.eliminateFarest(element, index);
	    });
	};

	this.gainPower = function(value){
		this.score+= value;
		this.power+= value;
	}

	this.popBody = function(){
		var part = Math.floor(Math.random()*4);
		var mass = Math.random() * (this.objects[0].mass) + this.objects[0].mass*3/4;
		var radius = Math.random() * (this.objects[0].radius*5/2) + this.objects[0].radius/2;
		switch(part){
			case 0: // l'objet popera en haut
				var position = [Math.random()*this.vue.windowW + this.vue.origin[0] - this.vue.windowW/2, this.vue.origin[1] + (this.vue.windowH/2 + radius*2)];
				var velocity = [Math.random() * (6) - 3, Math.random() * (3)];
				break;
			case 1: // l'objet popera en bas
				var position = [Math.random()*this.vue.windowW + this.vue.origin[0] - this.vue.windowW/2, this.vue.origin[1] - (this.vue.windowH/2 + radius*2)];
				var velocity = [Math.random() * (6) - 3, Math.random() * (-3)];
				break;	
			case 2: // l'objet popera en droite
				var position = [this.vue.origin[0] + (this.vue.windowW/2 + radius*2), Math.random()*this.vue.windowH + this.vue.origin[1] - this.vue.windowH/2];
				var velocity = [Math.random() * (-3), Math.random() * (6) - 3];
				break;
			case 3: // l'objet popera en gauche
				var position = [this.vue.origin[0] - (this.vue.windowW/2 + radius*2), Math.random()*this.vue.windowH + this.vue.origin[1] - this.vue.windowH/2];
				var velocity = [Math.random() * (3), Math.random() * (6) - 3];
				break;
		}
		this.objects.push(new Ball(
			position, 
			velocity, 
			[0, 0],
			mass, 
			radius, 
			[[0,0]]
			));
	};

	this.eliminateFarest = function(element, index){
		if (Math.abs(element.position[0]-this.objects[0].position[0]) > this.vue.windowW*2 || Math.abs(element.position[1]-this.objects[0].position[1]) > this.vue.windowH*2){
			this.objects.splice(index, 1);
		}
	};
}