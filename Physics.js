var G = 6.67384 * 0.1;

function squareDistanceWith(x, y){
  return (y[0]-x[0])*(y[0]-x[0]) + (y[1]-x[1])*(y[1]-x[1]);
}

function calcProjections(F, x, y){
  var sin = (y[1] - x[1])/Math.sqrt(squareDistanceWith(x, y));
  var cos = (y[0] - x[0])/Math.sqrt(squareDistanceWith(x, y));
  return [F*cos, F*sin];
}

function Ball(position, velocity, acceleration, mass, radius, actions){
  /* attributes */
  this.position = position;
  this.velocity = velocity;
  this.acceleration = acceleration;
  this.mass = mass;
  this.radius = radius;
  this.actions = actions;
  this.nextRadius = this.radius;

  /* methods */  

  /* Calcule la résultante des forces subies par l'object */
  this.resultActions = function(){
    var result = [0, 0];
    
    this.actions.forEach(function(element, index, array){
      result[0]+=element[0];
      result[1]+=element[1];
    });

    return result;
  };

  /* Calcule l'accélération de l'objet en utilisant la 3ème loi de Newton : Sum F_ext = mass * acceleration */
  this.calcAcceleration = function(){
    var result = this.resultActions();
    this.acceleration[0] = result[0]/this.mass;
    this.acceleration[1] = result[1]/this.mass;
  };

  /* Calcule la vitesse de l'objet à partir de l'accélération : dv = a * dt, avec dt = 1. D'où v_final = v_initial + a */
  this.calcVelocity = function(){
    this.velocity[0]+= this.acceleration[0];
    this.velocity[1]+= this.acceleration[1];
  };

  /* Calcule la position de l'objet à partir de la vitesse : dp = v * dt, avec dt = 1. D'où p_final = p_initial + v */
  this.calcPosition = function(){
    this.position[0]+= this.velocity[0];
    this.position[1]+= this.velocity[1];
  };

  /* Actualise la position de l'objet */
  this.updatePosition = function(objects){
    this.calcActions(objects); /* On actualise les forces subies par l'objet */
    this.calcAcceleration(); /* On actualise son accélération */
    this.calcVelocity(); /* On actualise sa vitesse */
    this.calcPosition(); /* On actualise sa position */
  };

  /* Calcule les actions subies par l'objet, soit les forces d'attraction qu'il subit par tous les autres objets */
  this.calcActions = function(objects){
    var pointer = this;
    objects.forEach(function(element, index, array){
     	if (pointer.position != element.position){
        var F = (G * pointer.mass * element.mass)/(squareDistanceWith(pointer.position, element.position));
        pointer.actions[index] = calcProjections(F, pointer.position, element.position);
      }
    });
  };

  this.updateRadius = function(){
    if (this.radius < this.nextRadius){
      this.radius+= this.radius*0.1;
    }
  }
};
  
function checkInnerCollisions(objects){
  var result = 0;
  objects.forEach(function(ei, i, arrayi){
    objects.forEach(function(ej, j, arrrayj){
      if (i < j) {
      	if (Math.sqrt(squareDistanceWith(ei.position, ej.position)) < ei.radius + ej.radius) {
          if (i == 0) {
            if (ei.mass < ej.mass){
              result =  -1;
            }
            else {
              result =  ej.mass;
            }
          }
          ei.acceleration[0]= (ei.mass*ei.acceleration[0] + ej.mass*ej.acceleration[0])/(ei.mass + ej.mass);
      	  ei.acceleration[1]= (ei.mass*ei.acceleration[1] + ej.mass*ej.acceleration[1])/(ei.mass + ej.mass);
      	  ei.nextRadius =  Math.pow(Math.pow(ej.radius, 3) + Math.pow(ei.radius, 3), 1.0/3);
      	  ei.mass = Math.max(ei.mass+ej.mass/4, ej.mass+ei.mass/4);
      	  objects.splice(j, 1);
      	  ei.actions[j] = [0,0];
      	}
      }
    });
  });
  return result;
}