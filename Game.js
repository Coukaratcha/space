function Game(){
	this.score = 0;
	this.power = 100;
	this.gameover = false;
	this.vue = new Display([0, 0], 1);
	this.objects = [new Ball([this.vue.canvas.width/2, this.vue.canvas.height/2], [0,0], [0, 0], 25, 10, [[0, 0]])];
	this.timer = 0;
	this.end = [0, 0];
	this.current = [0, 0];
	this.trigger = false;

	this.display = function(){
		this.vue.clearScreen();
		this.vue.displayGrid();
		this.vue.displayBar(this.power);
		this.vue.updateDisplay(this.objects[0].position);
		var pointer = this;
		this.objects.forEach(function(element, index, array){
			pointer.vue.displayBall(element, array[0]);
			pointer.vue.displayMassBall(element);
		});
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
		this.power+= value;
	}

	this.popBody = function(){
		var part = Math.floor(Math.random()*4);
		var mass = Math.random() * (5/2*this.objects[0].mass) + this.objects[0].mass/2;
		var radius = Math.random() * (this.objects[0].radius*5/2) + this.objects[0].radius/2;
		switch(part){
			case 0: // l'objet popera en haut
				var position = [Math.random()*this.vue.canvas.width + this.vue.origin[0] - this.vue.canvas.width/2, this.vue.origin[1] + (this.vue.canvas.height/2 + radius*2)];
				var velocity = [Math.random() * (6) - 3, Math.random() * (3)];
				break;
			case 1: // l'objet popera en bas
				var position = [Math.random()*this.vue.canvas.width + this.vue.origin[0] - this.vue.canvas.width/2, this.vue.origin[1] - (this.vue.canvas.height/2 + radius*2)];
				var velocity = [Math.random() * (6) - 3, Math.random() * (-3)];
				break;	
			case 2: // l'objet popera en droite
				var position = [this.vue.origin[0] + (this.vue.canvas.width/2 + radius*2), Math.random()*this.vue.canvas.height + this.vue.origin[1] - this.vue.canvas.height/2];
				var velocity = [Math.random() * (-3), Math.random() * (6) - 3];
				break;
			case 3: // l'objet popera en gauche
				var position = [this.vue.origin[0] - (this.vue.canvas.width/2 + radius*2), Math.random()*this.vue.canvas.height + this.vue.origin[1] - this.vue.canvas.height/2];
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
		if (Math.abs(element.position[0]-this.objects[0].position[0]) > this.vue.canvas.width*2 || Math.abs(element.position[1]-this.objects[0].position[1]) > this.vue.canvas.height*2){
			this.objects.splice(index, 1);
		}
	};
} 

var jeu = new Game();

$(document).mousemove(function(e){
	jeu.current = [e.pageX, e.pageY];
});

$(document).mousedown(function(e){
	jeu.trigger = true;
	jeu.end = [e.pageX, e.pageY];
});

$(document).mouseup(function(e){
	var powerUsed = Math.sqrt(squareDistanceWith(jeu.end, jeu.current))/20;
	var powerPrevious = powerUsed;
	if (powerUsed > jeu.power){
		powerUsed = jeu.power;	
	}
	jeu.trigger = false;
	jeu.objects[0].velocity[0]+= (jeu.end[0] - jeu.current[0])/50*(powerUsed/powerPrevious);
	jeu.objects[0].velocity[1]+= (jeu.current[1] - jeu.end[1])/50*(powerUsed/powerPrevious);
	jeu.power-= powerUsed;
});

function derouler(){
	jeu.display();
	jeu.updatePhysics();
	if (jeu.gameover) {
		alert("Perdu ! Score : "+jeu.score);
	}
	else {
		jeu.timer++;
	}
	if (jeu.timer > 10){
		jeu.timer = 0;
		jeu.score+= 50;
		jeu.popBody();
	}
}

var boucle = setInterval(derouler, 1000/70);