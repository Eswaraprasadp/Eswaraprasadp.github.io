var canvas, raf, ctx, clock, theta, bricks = [], gameOver = false, flags, attatched, canAttatch, canSeperate, attatchedX, attatchedY, timeAttatched, affection;
var centerRadius, poweredup, timePoweredup, timeFlighted, thetaRate, moveHorizontal, moveRandomHorizontal, landmarksForHorizontalMovement;
var noOfBricksPassed, score, maxBricks, landmarkScoreForBricks, landmarkScoreForSpeed, landmarkScoreForAttatchment, landmarkBricks, savedLandmarkScore, savedLandmarkBricks, speedY, speedX;
var blue = 'rgba(100, 100, 255, 1)', pink = 'rgba(255, 100, 100, 1)', red = 'rgba(250, 50, 50, 0.9)', green = 'rgba(50, 250, 50, 0.9)';
var gray = 'rgba(190, 190, 190, 0.8)', grayTransparent = 'rgba(190, 190, 190, 0.4)', white = 'rgba(250, 250, 250, 0.9)', black = 'rgba(10, 10, 10, 0.8)', magenta = 'rgba(127, 0, 127, 0.9)';
var scoreText;
var noOfBricksAlive;
var singlePlayer = true;
var name, playerAName, playerBName, canStart = false;
var playerNumber = 2, playerRank = 2, scoreHistory = [[1, 1, 'noobmaster69', Infinity]];
var pauseButton, resumeButton, paused = false, started = false, ended = false, turnA;
var Start, Restart, PlayAgain, Play, GameOver, Name, PlayerA, PlayerB, Duet;
var Horlicks, Flight, horlicksGenerated, flightsGenerated, noOfHorlicksGenerated, noOfFlightsGenerated,  canGenerateHorlicks, canGenerateFlight;

function load(){
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	scoreText = document.getElementById("score-text");
	affectionMeter = document.getElementById("affection-meter");
	singlePlayerDiv = document.getElementById("single-player-div");
	multiPlayerDiv = document.getElementById("multi-player-div");
	scoreboard = document.getElementById("scoreboard");	
	pauseButton = document.getElementById("pause-button");
	resumeButton = document.getElementById("resume-button");

	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = gray;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.restore();

	Start = new Button('Start!', 'start');
	Start.draw(green);
	
}
function submit(){
	canStart = false;
	if(!started || ended){
		if(ended){
			if(PlayAgain)
				if(PlayAgain.drew)
					PlayAgain.clear();
			if(Play)
				if(Play.drew)
					Play.clear();
			if(GameOver)
				if(GameOver.drew)
					GameOver.clear();

			Restart = new Button("Start", 'restart');
			Restart.draw(green);
		}
		if(singlePlayer){
			if(PlayerA)
				if(PlayerA.drew)
					PlayerA.clear();

			if(PlayerB)
				if(PlayerB.drew)
					PlayerB.clear();

			name = document.getElementById("name").value;
			if(name != "" && name != null){
				canStart = true;
				Name = new Button(name);
				Duet = new Button("Duet");
				Name.draw(black, 3, 1);
				Duet.draw(black, 3, 3);
			}
		}
		else{
			turnA = true;
			playerAName = document.getElementById("player-A-name").value;
			playerBName = document.getElementById("player-B-name").value;

			if(playerAName != "" && playerBName != "" && playerAName != null && playerBName != null){
				canStart = true;
				if(Name)
					if(Name.drew)
						Name.clear();
				if(Duet)
					if(Duet.drew)
						Duet.clear();		

				PlayerA = new Button("► " + playerAName);
				PlayerB = new Button(playerBName);
				PlayerA.draw(black, 3, 1);
				PlayerB.draw(black, 3, 3);
			}
		}
	}
}
function start(){
	
	// console.log("In start");
	init();
	raf = window.requestAnimationFrame(draw);
}
function restart(){
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	var prevName = scoreboard.rows[playerRank].cells[1].innerHTML;
	// console.log("Previous name in scoreboard is : " + prevName);
	scoreboard.rows[playerRank].cells[1].innerHTML = prevName.slice(0, -1);
	++playerNumber;
	playerRank = playerNumber;
	
	init();
	raf = window.requestAnimationFrame(draw);
}
function pause(){
	if(started){
		window.cancelAnimationFrame(raf);
		paused = true;
		resumeButton.disabled = false;
		// console.log("Paused");
	}
}
function resume(){
	if(started && paused){
		paused = false;
		pauseButton.disabled = false;
		resumeButton.disabled = true;
		// console.log("Resumed");
		raf = window.requestAnimationFrame(draw);
	}
}
function buttonRestart(){
	if(started){
		window.cancelAnimationFrame(raf);
		ended = true;
		restart();
	}
}
function init(){
	started = true;

	rishav = new Ball(blue, true);
	phoebe = new Ball(pink, false);

	theta = 0;
	thetaRate = Math.PI/10;
	centerRadius = 58;
	poweredup = false;
	attatched = false;
	canAttatch = false;
	canSeperate = false;
	canGenerateHorlicks = true;
	canGenerateFlight = true;
	moveHorizontal = false;
	moveRandomHorizontal = false;
	maxBricks = 1;
	affection = 0;
	attatchedY = 400;
	attatchedX = 150;
	timeAttatched = 0;
	timePoweredup = 0;
	timeFlighted = 0;
	affectionMeter.setAttribute("value", 0);

	noOfBricksAlive = 0;
	noOfBricksPassed = 0;

	bricks = [];
	noOfBricksAlive = 0;

	horlicksGenerated = [];
	flightsGenerated = [];

	noOfHorlicksGenerated = 0;
	noOfFlightsGenerated = 0;

	gameOver = false;
	score = 0;
	landmarkScoreForBricks = 2;
	landmarkScoreForSpeed = 2;
	landmarkScoreForAttatchment = 5;
	landmarkBricks = 9;
	savedLandmarkScore = 0;
	savedLandmarkBricks = 0;
	landmarksForHorizontalMovement = [3, 3];
	speedY = 3;
	speedX = 1;

	clock = true;
	flags = [true, true, true];

	var newRow = document.createElement("tr");

	var newRank = document.createElement("td");
	var newName = document.createElement("td");
	var newScore = document.createElement("td");

	newRank.innerHTML = playerRank;	
	newScore.innerHTML = score;

	if(singlePlayer){
		newName.innerHTML =  name + '*';
		scoreHistory.push([playerNumber, playerRank, name, score]);
	}
	else{
		if(turnA){
			newName.innerHTML = playerAName + '*';
			scoreHistory.push([playerNumber, playerRank, playerAName, score]);			
		}
		else{
			newName.innerHTML = playerBName + '*';
			scoreHistory.push([playerNumber, playerRank, playerBName, score]);					
		}
	}

	newRow.appendChild(newRank);
	newRow.appendChild(newName);
	newRow.appendChild(newScore);	

	scoreboard.appendChild(newRow);

	document.addEventListener("keydown", arrowControl);
}
function toggleButton(id){
	switch(id){
		case 1: singlePlayer = true;
			singlePlayerDiv.style.display = "block";
			multiPlayerDiv.style.display = "none";
			break;
		case 2: singlePlayer = false;
			singlePlayerDiv.style.display = "none";
			multiPlayerDiv.style.display = "block";
			break;
		default: 

			// console.log("id is not either 1 or 2 in toggleButton"); 
			break;
	}
}
class Ball{
	constructor(color, positive){
		this.color = color;
		this.x = 0;
		this.y = 0;
		this.radius = 10;
		this.positive = positive;
	}
	draw(centerX, centerY, centerRadius){
		ctx.save();
		if(this.positive){
			this.x = centerX + centerRadius * Math.cos(theta);
			this.y = centerY - centerRadius * Math.sin(theta);
		}
		else{
			this.x = centerX - centerRadius * Math.cos(theta);
			this.y = centerY + centerRadius * Math.sin(theta);			
		}
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.lineWidth = 0.2;
		ctx.strokeStyle = magenta;
		ctx.stroke();		

		if(poweredup && this.positive){
			ctx.save();
			this.radius = 15;
			//Spikes
			for (let angle = 0; angle < Math.PI * 2; angle += Math.PI/4){			
				let rx = Math.cos(angle);
				let ry = -1 * Math.sin(angle);
				let tx = Math.sin(angle);
				let ty = Math.cos(angle);
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(this.x + this.radius*rx, this.y + this.radius*ry);
				ctx.lineTo(this.x + this.radius*rx + this.radius/5*tx, this.y + this.radius*ry + this.radius/5*ty);
				ctx.lineTo(this.x + this.radius*1.3*rx, this.y + this.radius*1.3*ry);
				ctx.closePath();
				ctx.fillStyle = blue;
				ctx.fill();
				ctx.lineWidth = 0.3;				
				ctx.strokeStyle = magenta;
				ctx.stroke();
				ctx.restore();			
			}
			ctx.restore();
		}
		else if(!poweredup){
			this.radius = 10;
		}

		ctx.restore();
	}
	hide(text){
		// console.log("Inside hide for " + text);
		ctx.clearRect(this.x - this.radius, this.y -  this.radius, 2 * this.radius, 2 * this.radius);
		ctx.save();
		ctx.fillStyle = gray;
		ctx.fillRect(this.x - this.radius, this.y -  this.radius, 2 * this.radius, 2 * this.radius);
		ctx.restore();
	}
}
class AttachedBall extends Ball{
	constructor(color, color1, color2){
		super(color, true);
		this.color1 = color1;
		this.color2 = color2;
	}
	draw(x, y){
		ctx.save();
		this.x = x;
		this.y = y;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.restore();
	}
}
class Obstacle{
	constructor(shape, color){
		this.shape = shape;
		this.color = color;
	}
}
class Brick extends Obstacle{
	constructor(){
		var rand1 = Math.random();
		var rand2 = Math.random();
		var rand3 = Math.random();
		var color;
		if((rand1*255 >= 200 && rand2*255 >= 200 && rand3*255 >= 200) || (Math.abs(rand1 - rand2)*255 <= 5 && Math.abs(rand2 - rand3)*255 <= 5 && Math.abs(rand3 - rand1)*255 <= 5)){
			rand1 = 250;
			rand2 = 50;
			rand3 = 50;
			color = 'rgb(250, 50, 50)';
		}
		else{
			color = 'rgb(' + Math.floor(rand1*255) + ',' + Math.floor(rand2*255) + ',' + Math.floor(rand3*255) + ')';
		}
		
		super('rectangle', color);
		this.color = color;
		if(Math.random() < 0.50){
			this.width = 48;
			this.height = 40;

		}
		else{
			this.width = 40;
			this.height = 48;
		}
		
		this.x = Math.random()*200 + 50 - this.width/2;
		this.initialX = this.x;
		this.positive = randomBoolean(50);
		
		this.y = 5;
		this.vx = 1;
		this.vy = 3;
		this.alive = true;

		if(rand1 >= rand2 && rand1 >= rand3){
			this.borderR = (rand1 <= 215) ? rand1 + 40 : rand1;
			this.borderG = (rand1 >= 40) ? rand1 - 40 : rand1;
			this.borderB = (rand1 >= 40) ? rand1 - 40 : rand1;
		}
		else if(rand1 >= rand2 && rand1 >= rand3){
			this.borderR = (rand1 >= 40) ? rand1 - 40 : rand1;
			this.borderG = (rand1 <= 215) ? rand1 + 40 : rand1;
			this.borderB = (rand1 >= 40) ? rand1 - 40 : rand1;
		}
		else{
			this.borderR = (rand1 >= 40) ? rand1 - 40 : rand1;
			this.borderG = (rand1 >= 40) ? rand1 - 40 : rand1;
			this.borderB = (rand1 <= 215) ? rand1 + 40 : rand1;
		}
	}
	
	draw(){
		if(this.alive){
			ctx.save();
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.strokeStyle = 'rgb(' + (Math.floor(this.borderR*255)) + ',' + (Math.floor(this.borderG*255)) + ',' + (Math.floor(this.borderB*255)) + ')';
			ctx.lineWidth = 0.8;
			ctx.strokeRect(this.x, this.y, this.width, this.height);
			ctx.restore();	
		}	
	}	
	hide(){
		this.alive = false;
		ctx.clearRect(this.x, this.y, this.width, this.height);
		ctx.save();
		ctx.fillStyle = gray;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();		
	}

	isAlive(){
		
		if(this.y + this.vy + this.height/2 >= canvas.height){
			this.alive = false;
			return false;
		}
		else if(!this.alive){
			// console.log("Inside brick, isAlive is false because of hide()");
			return false;
		}
		else{
			return true;
		}
	}
	updateSpeed(dx, dv){
		this.vx += dx;
		this.vy += dv;
	}
	update(){
		this.y += this.vy;
		if(moveHorizontal && Math.abs(this.x - this.initialX) < 20 && this.y >= Math.random()*canvas.height){
			if(this.positive){
				this.x += this.vx;
			}
			else{
				this.x -= this.vx;
			}
		}
		else if(moveRandomHorizontal && Math.abs(this.x - this.initialX) < 50){
			this.vx = max(this.vx, 2.5);
			if(randomBoolean(50)){
				this.x += this.vx;
			}
			else{
				this.x -= this.vx;
			}
		}		
	}
	updateToSpeed(vx, vy){
		this.vx = vx;
		this.vy = vy;
	}

}
class Powerup{
	constructor(name){
		this.powerup = new Image();
		this.name = name;
		this.loaded = false;
		this.width = 50;
		this.height = 100;

		switch(name){
			case 'horlicks' : this.powerup.src = "res/horlicks.png"; this.width = 50; this.height = 100;break;
			case 'flight' : this.powerup.src = "res/flight.png"; this.width = 64; this.height = 64;break;
		}
		this.x = Math.random()*200 + 50 - this.width/2;	
		this.y = 5;
		this.vy = 3;
		this.alive = true;
		this.picked = false;

	}
	draw(){

		if(this.loaded && this.alive && !this.picked){
				ctx.save();
				ctx.drawImage(this.powerup, this.x, this.y);
				ctx.restore();	
		}
	}
	hide(){
		this.picked = true;
		ctx.clearRect(this.x, this.y, this.width, this.height);
		ctx.save();
		ctx.fillStyle = gray;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();		
	}
	update(){
		this.y += this.vy;
	}
	isAlive(){
		
		if(this.y + this.vy + this.height/2 >= canvas.height){
			this.alive = false;
			return false;
		}
		else{
			return true;
		}
	}
	isPicked(){
		return this.picked;
	}
	updateToSpeed(vy){
		this.vy = vy;
	}
}
class Button{
	constructor(text, action = 'none'){

		ctx.save();
		this.text = text;

		ctx.font = '400 40px Kremlin Pro Web';
		this.width = ctx.measureText(this.text).width;
		this.x = canvas.width/2 - this.width/2;
		this.height = 50;
		this.start = false;
		this.restart = false;

		switch(action){
			case 'start' : this.start = true; break;
			case 'restart' : this.restart = true; break;
		}
			
	}
	draw(color, noOfButtons = 1, number = 1){
	
		ctx.fillStyle = gray;
		ctx.fillRect(0, this.y, canvas.width, this.height);
		if(noOfButtons == 1)
			this.y = canvas.height/2 - this.height/2;
		else
			this.y = canvas.height/2 - this.height/2 + (2*number - (noOfButtons + 1)) * this.height * 3 / 2;
		if(this.start || this.restart)
			ctx.fillStyle = white;
		else
			ctx.fillStyle = gray;
		ctx.clearRect(this.x, this.y, this.width, this.height);		
		ctx.fillRect(this.x, this.y, this.width, this.height);

		ctx.fillStyle = color;

		ctx.fillText(this.text, this.x, this.y + this.height - 10);
		ctx.restore();

		this.drew = true;

		if(this.restart || this.start){
			this.clickEventListenerBind = this.click.bind(this);
			document.addEventListener('click', this.clickEventListenerBind, true);
		}		
	}
	clear(){
		ctx.clearRect(this.x, this.y, this.width, this.height);
		ctx.save();
		ctx.fillStyle = gray;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}
	click(e){
		
		if(isInside(getMousePos(canvas, e), this)){
			
			if(gameOver && this.restart){
				if(canStart){
					document.removeEventListener('click', this.clickEventListenerBind, true);
					restart();
				}
				else{
					alert("Please enter your name before starting game");
				}
			}
			else if(this.start){
				if(canStart){
					document.removeEventListener('click', this.clickEventListenerBind, true);
					start();
				}
				else{
					alert("Please enter your name before starting game");
				}
			}
		}
	}

}
function getMousePos(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: event.clientX - rect.left,
	  y: event.clientY - rect.top
	};
}
	
//Function to check whether a point is inside a rectangle
function isInside(pos, rect){
    return (pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y);
}

function arrowControl(e) {
	var code = e.keyCode ? e.keyCode : e.which;
	if (code === 37) { //left key
		if(!attatched){
			theta += thetaRate;
			clock = false;
		}
		else{
			// console.log("attatched = true in left key press");
			if(attatchedX > 0){
				attatchedX -= 10;
				// console.log("attatchedX : " + attatchedX);
			}
		}
	}
	else if (code === 39) {
		if(!attatched){
			theta -= thetaRate; //right key
			clock = true;
		}
		else{
			// console.log("attatched = true in right key press");
			if(attatchedX < canvas.width){
				attatchedX += 10;
				// console.log("attatchedX : " + attatchedX);
			}
		}
	}
};
function randomBoolean(probability){
	let n = probability/100;
	let rand = Math.random();
	return (rand < n) ? true : false;
}

function draw(){

	drawBackground();

	if(!attatched){
		rishav.draw(150, 400, centerRadius);
		phoebe.draw(150, 400, centerRadius);
	}
	else{
		Attatched.draw(attatchedX, attatchedY);
	}

	score += 1/100;
	scoreText.innerHTML = "Score : " + Math.floor(score);

	if(score >= 3 && noOfHorlicksGenerated == 0 && canGenerateHorlicks && randomBoolean(5)){
		Horlicks = new Powerup('horlicks');
		horlicksGenerated.push(Horlicks);
		++noOfHorlicksGenerated;
		// console.log("New Horlicks generated");
		canGenerateHorlicks = false;
	}
	else if(poweredup && timePoweredup < 200){
		++timePoweredup;
	}
	else if(poweredup && timePoweredup >= 200){
		poweredup = false;
		// console.log("timePoweredup is " + timePoweredup + ", so poweredup is : " + poweredup);
		// console.log("Horlicks picked and ended");
		timePoweredup = 0;
		canGenerateHorlicks = true;		
	}

	if(score >= 3 && noOfFlightsGenerated == 0 && canGenerateFlight && randomBoolean(7)){
		Flight = new Powerup('flight');
		flightsGenerated.push(Flight);
		++noOfFlightsGenerated;
		// console.log("New Flight generated");
		canGenerateFlight = false;
	}
	else if(thetaRate > Math.PI/10 && timeFlighted < 300){
		++timeFlighted;
	}
	else if(thetaRate > Math.PI/10 && timeFlighted >= 300){
		thetaRate /= 1.5;
		// console.log("timeFlighted is " + timeFlighted + ", so relative thetaRate is : " + (thetaRate/(Math.PI/10)).toFixed(1));
		// console.log("Flight picked and ended");
		canGenerateFlight = true;
		// canGenerateFlight = true;
	}

	if(flags[1]){
		// console.log("scoreHistory is : " + scoreHistory);
		flags[1] = false;		
	}
	if(score >= landmarksForHorizontalMovement[0] && noOfBricksPassed >= landmarksForHorizontalMovement[1]){
		if(!moveHorizontal){
			// console.log("Starting regular horizontal motion");
			// console.log("SpeedX is : " + speedX.toFixed(2));
			moveHorizontal = true;
			moveRandomHorizontal = false;
		}
		else if(!moveRandomHorizontal){
			speedX = max(speedX + 0.5, 4);
			moveHorizontal = false;
			moveRandomHorizontal = true;
			// console.log("Starting random motion");
			// console.log("SpeedX is : " + speedX.toFixed(2));
		}
		landmarksForHorizontalMovement[0] += 3;
		landmarksForHorizontalMovement[1] += 4;
		speedX += 0.3;
	}
	

	affection = (score - savedLandmarkScore) / landmarkScoreForAttatchment * 50 + (noOfBricksPassed - savedLandmarkBricks) / landmarkBricks * 50;
	affectionMeter.setAttribute("value", affection);

	scoreHistory[playerRank - 1][3] = Math.floor(score);

	// console.log("Score is greater in scoreHistory ?: " + (score >= scoreHistory[playerNumber - 1][2]));
	if(score >= scoreHistory[playerRank - 2][3]){
		// console.log("Current score was greater than previous score");
		swapScoreHistory(playerRank - 1, playerRank - 2);	
		swapTableTexts(playerRank, playerRank - 1);
		--playerRank;
	}
	scoreboard.rows[playerRank].cells[2].innerHTML = Math.floor(score);

	// console.log('Score : ' + Math.floor(score));
	if(flags[0]){
		// console.log('Bricks Passed : ' + noOfBricksPassed);
		flags[0] = false;
	}
	
	var deletedBrick, deletedHorlicks, deletedFlight;

	if(score >= landmarkScoreForBricks){
		landmarkScoreForBricks += 2;
		++maxBricks;
	}
	if(score >= landmarkScoreForSpeed){
		// console.log("landmarkScoreForSpeed : " + landmarkScoreForSpeed + " Reached");
		// flags[1] = false;
		speedY += 0.2;
		landmarkScoreForSpeed += 1;
	}
	// console.log("affection = " + affection);
	if(affection >= 100){
		// console.log("affection = 100 reached");
		// console.log("Attatchment about to start");
		Attatched = new AttachedBall(magenta, blue, pink);
		canAttatch = true;
		timeAttatched = 0;
		savedLandmarkScore = landmarkScoreForAttatchment;
		savedLandmarkBricks = landmarkBricks;
		landmarkScoreForAttatchment += 6;
		landmarkBricks += 10;
	}
	if(canAttatch){
		if(centerRadius > 0 && !attatched){
			--centerRadius;
		}
		else if(!attatched){
		rishav.hide("rishav");
		phoebe.hide("phoebe");
		Attatched.draw(attatchedX, attatchedY);
		attatched = true;
		// console.log("Attatchment started");
		}
		else if(timeAttatched < 300 && attatched){
			++timeAttatched;
			// console.log("Time attatched : " + timeAttatched);
		}
		else if(attatched){
			// console.log("Time attatched >= 300");
			attatched = false;
			canSeperate = true;
			canAttatch = false;
			timeAttatched = 0;
			Attatched.hide("Attatched");
			// console.log("Attatchment ended. Balls started seperating");
		}
	}
	if(canSeperate){
		if(centerRadius < 58){
			++centerRadius;
		}
		else if(centerRadius == 58){
			canSeperate = false;
			// console.log("Balls fully seperated")
		}
	}

	//Generate the maxumimum no of bricks at a time.
	if(noOfBricksAlive < maxBricks && noOfBricksAlive >= 0 && !gameOver && !canSeperate && timeAttatched < 200 && affection < 88){

		if(noOfBricksAlive > 0 && bricks[noOfBricksAlive-1].y >= canvas.height/2){
			
			bricks.push(new Brick());

			++noOfBricksAlive;
			bricks[noOfBricksAlive - 1].updateToSpeed(speedX, speedY);
			// console.log("Speed updated to : " + bricks[noOfBricksAlive - 1].vy.toFixed(2) + " for brick : " + noOfBricksAlive);
		}
		else if(noOfBricksAlive == 0){
			bricks.push(new Brick());
			++noOfBricksAlive;
			bricks[noOfBricksAlive - 1].updateToSpeed(speedX, speedY);
			// console.log("Speed updated to : " + bricks[noOfBricksAlive - 1].vy.toFixed(2) + " for brick : " + noOfBricksAlive);
			// console.log("Since noOfBricksAlive is 0, noOfBricksAlive was incremented to " + noOfBricksAlive);
		}			
		
	}
	if(noOfBricksAlive > 0){
		if(!bricks[0].isAlive()){
			deletedBrick = bricks.splice(0, 1);
			--noOfBricksAlive;
			++noOfBricksPassed;
			flags[0] = true;
		}
	}
	if(noOfHorlicksGenerated > 0){
		if(!horlicksGenerated[0].isAlive()){
			deletedHorlicks = horlicksGenerated.splice(0, 1);
			--noOfHorlicksGenerated;
			canGenerateHorlicks = true;
		}
		else if(horlicksGenerated[0].isPicked()){
			deletedHorlicks = horlicksGenerated.splice(0, 1);
			--noOfHorlicksGenerated;
		}
	}

	if(noOfFlightsGenerated > 0){
		if(!flightsGenerated[0].isAlive()){
			deletedFlight = flightsGenerated.splice(0, 1);
			--noOfFlightsGenerated;
			canGenerateFlight = true;
		}
		else if(flightsGenerated[0].isPicked()){
			deletedFlight = flightsGenerated.splice(0, 1);
			--noOfFlightsGenerated;
		}
	}
	
	if(!gameOver){
		bricks.forEach(function(brick, index){
			brick.update();
			brick.draw();	
		});
		horlicksGenerated.forEach(function(horlicks){
			horlicks.powerup.onload = function(){
				horlicks.loaded = true;
			}
			horlicks.update();
			horlicks.draw();
		});
		flightsGenerated.forEach(function(flight){
			flight.powerup.onload = function(){
				flight.loaded = true;
			}
			flight.update();
			flight.draw();
		})
		raf = window.requestAnimationFrame(draw);
	}
	bricks.forEach(function(brick, index){
		// console.log("poweredup : " + poweredup);
		if(!attatched && !poweredup){
			if((circleCollidesRectangle(rishav, brick) || circleCollidesRectangle(phoebe, brick))){
				window.cancelAnimationFrame(raf);
				gameOver = true;
				// console.log("Game is Over!");
				ending();
			}
		}
		else if(!attatched && poweredup){
			if(circleCollidesRectangle(rishav, brick)){
				// console.log("Brick collided with powered rishav");
				brick.hide();
				deletedBrick = bricks.splice(index, 1);
				--noOfBricksAlive;
				++noOfBricksPassed;
			}
			else if(circleCollidesRectangle(phoebe, brick)){
				// console.log("Phoebe collided with brick when rishav was powered");
				window.cancelAnimationFrame(raf);
				gameOver = true;
				console.log("Game is Over!");
				ending();
			}
		}
		else if(attatched){
			if(circleCollidesRectangle(Attatched, brick)){
				window.cancelAnimationFrame(raf);
				gameOver = true;
				// console.log("Game is Over!");
				ending();				
			}
		}

	});
	horlicksGenerated.forEach(function(horlicks, index){
		// console.log("Inside main animation horlicks.loaded is : " + horlicks.loaded);
		if(circleCollidesRectangle(rishav, horlicks) && horlicks.loaded && !attatched){
			poweredup = true;
			// console.log("Rishav picked up horlicks. poweredup : " + poweredup);
			horlicks.hide();
		}
	});
	flightsGenerated.forEach(function(flight, index){
		if((circleCollidesRectangle(rishav, flight) || circleCollidesRectangle(phoebe, flight))&& flight.loaded && !attatched){
			thetaRate *= 1.5;
			// console.log("One of the balls picked up flight. Relative thetaRate : " + (thetaRate/(Math.PI/10)).toFixed(2));
			flight.hide();
		}	
	});
	
}
function ending(){
	
	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = gray;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.restore();

	started = false;
	ended =  true;

	// console.log("noOfBricksPassed = " + noOfBricksPassed);

	// console.log("scoreHistory is : " + scoreHistory);

	if(singlePlayer){
		GameOver = new Button('Game Over!');
		PlayAgain = new Button('Play Again', 'restart');

		GameOver.draw(red, 2, 1);
		PlayAgain.draw(green, 2, 2);
	}
	else{

		GameOver = new Button('Game Over!');
		Play = new Button('Play', 'restart');
		
		if(turnA){
			// console.log("A's turn is over");
			PlayerA = new Button(playerAName);
			PlayerB = new Button("► " + playerBName);
			turnA = false;
		}
		else{
			// console.log("B's turn is over");
			PlayerA = new Button("► " + playerAName);
			PlayerB = new Button(playerBName);
			turnA = true;
		}

		GameOver.draw(red, 4, 1);
		PlayerA.draw(black, 4, 2);
		Play.draw(green, 4, 3);
		PlayerB.draw(black, 4, 4);
	}
				
}
			

function drawBackground(){
	
	var backgroundBalls = grayTransparent;		
				
	ctx.save();
	ctx.fillStyle = gray;
	ctx.fillRect(0, 0, canvas.width, 340);

	ctx.fillRect(0, 460, canvas.width, 40);

	ctx.fillRect(0, 340, 90, 120);

	ctx.fillRect(210, 340, 90, 160);

	ctx.fillStyle = backgroundBalls;
	ctx.fillRect(90, 340, 120, 120);

	ctx.restore();
}

function circleCollidesRectangle(Circle, Rectangle){
	var cx = Circle.x;
	var cy = Circle.y;
	var cr = Circle.radius;
	var rx = Rectangle.x;
	var ry = Rectangle.y;
	var rw = Rectangle.width;
	var rh = Rectangle.height;

	var distX = Math.abs(cx - rx - rw / 2);
	var distY = Math.abs(cy - ry - rh / 2);

	if (distX > (rw / 2 + cr)) {
	   return false;
	}
	if (distY > (rh / 2 + cr)) {
	   return false;
	}

   if (distX <= (rw / 2)) {
	   return true;
	}
	if (distY <= (rh / 2)) {
	   return true;
	}

	var dx = distX - rw / 2;
	var dy = distY - rh / 2;
	return (dx * dx + dy * dy <= (cr * cr));
}
function swapScoreHistory(i, j){
	var arr = [0, 2, 3];
	arr.forEach(function(value){
		[scoreHistory[i][value], scoreHistory [j][value]] = [scoreHistory[j][value], scoreHistory [i][value]];
	});
}
function swapTableTexts(i, j){
	var arr = [1, 2];
	arr.forEach(function(value){
		[scoreboard.rows[i].cells[value].innerHTML, scoreboard.rows[j].cells[value].innerHTML] = [scoreboard.rows[j].cells[value].innerHTML, scoreboard.rows[i].cells[value].innerHTML]	
	});
}
function max(a, b){
	return ((a > b) ? a : b);
}


