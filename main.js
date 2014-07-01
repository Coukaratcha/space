$("button#play").click(function(){
	$("#frontStart").slideUp(500, function(){
		$("canvas").fadeIn(200, launchGame());
	});
});

$("button#help").click(function(){
	$("#help_panel").slideDown();
});

$("#help_panel").click(function(){
	$("#help_panel").slideUp();
});

var launchGame = function(){
	var jeu = new Game();

	$(document).bind('dblclick',function(e){
	    e.preventDefault();
	});

	$(document).click(function(e){
		var powerUsed = Math.sqrt(squareDistanceWith([e.pageX, jeu.vue.canvas.height - e.pageY], [jeu.vue.canvas.width/2, jeu.vue.canvas.height/2]))/20;
		var powerPrevious = powerUsed;
		if (powerUsed > jeu.power){
			powerUsed = jeu.power;
		}
		jeu.objects[0].velocity[0]+= (e.pageX - jeu.vue.canvas.width/2)/50*(powerUsed/powerPrevious);
		jeu.objects[0].velocity[1]+= (jeu.vue.canvas.height/2 - e.pageY)/50*(powerUsed/powerPrevious);
		jeu.power-= powerUsed;
	});

	/*$(document).mousemove(function(e){
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
	});*/

	function derouler(){
		jeu.display();
		jeu.updatePhysics();
		if (jeu.gameover){
			clearInterval(boucle);
			$("#score").text(""+Math.floor(jeu.score));
			$("#frontEnd").slideDown(500, function(){
				$("canvas").fadeOut();
			});
		}
		else {
			jeu.timer++;
		}
		if (jeu.timer > 10){
			jeu.timer = 0;
			jeu.popBody();
		}
	}

	var boucle = setInterval(derouler, 1000/70);
};