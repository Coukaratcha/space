var end = [0, 0];
var current = [0, 0];
var trigger = true;

function Display(origin, scale){
  this.origin = origin;
  this.scale = scale;
  this.showActions = false;
  this.canvas = document.getElementById('screen');
  this.context = this.canvas.getContext('2d');
  this.canvas.height = window.innerHeight;
  this.canvas.width = window.innerWidth;
  this.context.font = "15pt Arial,serif";
  this.windowH = this.canvas.height*this.scale;
  this.windowW = this.canvas.width*this.scale;  
  this.nextScale = this.scale;

  this.updateScale = function(Ball){
    this.nextScale = Math.floor(Ball.radius/10);
    if (this.nextScale < 1){
      this.nextScale = 1;
    }
    if (this.nextScale > this.scale){
      this.scale+= 0.01*this.scale;
    }
    this.windowH = this.canvas.height*this.scale;
    this.windowW = this.canvas.width*this.scale;
  };

  this.clearScreen = function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  this.updateDisplay = function(position){
      $("#screen").css({
      "background-position": (-this.origin[0]/this.scale%1024)+"px "+(this.origin[1]/this.scale%1024)+"px"
      });
      this.origin = position;
  };

  this.displayGrid = function(){
    this.context.beginPath();
    this.context.strokeStyle = "grey";
    this.context.lineWidth = "1";
    this.context.moveTo(0, this.canvas.height/2);
    this.context.lineTo(this.canvas.width, this.canvas.height/2);
    this.context.moveTo(this.canvas.width/2, 0);
    this.context.lineTo(this.canvas.width/2, this.canvas.height);
    this.context.stroke();
  };

  this.displayBall = function(Ball, perso){
    this.context.beginPath();
    if (Ball.mass > perso.mass) {
      color = "#c22121";
    }
    else if (Ball.mass < perso.mass){
      color = "#7ED1D8";
    }
    else {
      color = "white";
    }
    this.context.fillStyle = color;
    this.context.shadowColor = color;
    this.context.shadowBlur = '5';
    this.context.arc((Ball.position[0] - this.origin[0])/this.scale + this.canvas.width/2, this.canvas.height/2 - (Ball.position[1] - this.origin[1])/this.scale, Ball.radius/this.scale, 0, Math.PI*2);
    this.context.fill();
  };

  this.displayMassBall = function(Ball){
    this.context.beginPath();
    this.context.shadowBlur = '0';
    this.context.fillStyle = 'white';
    this.context.fillText(""+Math.floor(Ball.mass*100)/100, (Ball.position[0] - this.origin[0] + Ball.radius)/this.scale + this.canvas.width/2, this.canvas.height/2 - (Ball.position[1] - this.origin[1] + Ball.radius)/this.scale);
    this.context.fill();
  }

  this.drawActions = function(Ball){
    if (this.showActions){
      this.context.beginPath();
      this.context.strokeStyle = "Chocolate";
      this.context.lineWidth = "4";
      this.context.lineCap = 'round';
      var pointer = this;
      Ball.actions.forEach(function(element, index, array){
        pointer.context.moveTo(Ball.position[0] - origin[0] + pointer.canvas.width/2, pointer.canvas.height/2 - Ball.position[1] + origin[1]);
        pointer.context.lineTo(2*element[0]+Ball.position[0] - origin[0] + pointer.canvas.width/2, pointer.canvas.height/2 - (2*element[1] + Ball.position[1] - origin[1]));
      });
      this.context.stroke();
    }
  };
  
  this.displayLine = function(){
    if (trigger){
      this.context.beginPath();
    	this.context.strokeStyle = "rgba(0, 0, 0, 0)";
    	this.context.strokeStyle = "rgba(0, 0, 0, 0.2)";
    	this.context.lineWidth = "5";
    	this.context.moveTo(end[0], this.canvas.height - end[1]);
    	this.context.lineTo(current[0], this.canvas.height - current[1]);
    	this.context.stroke();
    }
  };

  this.displayBar = function(value){
    if (value < 0){
      value = 0;
    }
    this.context.beginPath();
    this.context.shadowColor = '#FFF';
    this.context.shadowBlur = '0';
    this.context.fillStyle = 'rgba(0,0,0,0.2)';
    this.context.rect(0, 0, this.canvas.width, 100);
    this.context.fill();
    this.context.beginPath();
    this.context.shadowBlur = '5';
    this.context.fillStyle = 'white';
    this.context.rect(50, 50, value/this.scale, 20);
    this.context.fillText("Power : "+Math.floor(value), 50, 30);
    this.context.fill();
  };
}  