/**
 *	Player Class
 */
function Player(player_no, name){
	this.player_no = player_no;	//player's unique number
	this.name = name;			//name of the player
	this.shots = new Array();	//array of player scores for each shot (2 per frame)
	this.frames = new Array();	//array of scores for each frame, keeps a running total
}

/* 	Scores a shot
 *	@param: pins, number of pins knocked down in shot
 *	Returns: true if end of player's frame
 */
Player.prototype.scoreShot = function(pins){
	var frame = this.getCurrentFrame();
	var shot = this.getCurrentShot(frame);
	
	this.shots[frame][shot] = pins;
	
	this.markShot(frame, shot, pins);

	var frameRes = this.checkForTen(frame);	//result of this frame
	if(frame == 0){	//first frame
			if(frameRes == 'spare' || frameRes == 'strike'){	//spare/strike end of turn, but wait for next frame to record score
				return true;
			}else if(shot == 1){ //last shot of frame, record frame and signal next player
				this.recordFrameScore(frame, 0);
				return true;	//end of turn
			}else{
				return false;	//player has another shot
			}
	}else if(shot != 2){ //standard frames
			//check for spares/strikes etc...
			var pFrameRes = this.checkForTen(frame - 1);	//get if strike or spare on pious frame
			if(pFrameRes == 'strike'){
				var ppFrameRes = this.checkForTen(frame - 2); //check for second strike or spare
				
				if(shot == 1){	//if only one previous strike and on second shot of frame, score previous frame
					this.recordFrameScore(frame - 1, this.getFrameScore(frame, 0));
				}else if(ppFrameRes == 'strike'){	//both previous shots were strikes, score frame before previous frame
					this.recordFrameScore(frame - 2, pins + 10);
				}	
			}else if(pFrameRes == 'spare' && shot == 0 ){
				this.recordFrameScore(frame - 1, pins);	//update pious shot score (spare)
			}
			
			//determine result of this frame
			if(frame == 9 && (frameRes == 'strike' || frameRes == 'spare' || frameRes == '20')){
				return false;
			}else if((frameRes == 'strike' || frameRes == 'spare')){ //last shot of frame, but wait to record score
				return true;	//end of turn
			}else if(shot == 1){
				this.recordFrameScore(frame, 0);
				return true;	//end of turn
			}else{
				return false;	//player has another shot
			}
	}else{
		this.recordFrameScore(frame, 0);	//record player's final score
		//get if the game is over
		return true;		
	}	
}

//gets current frame number
Player.prototype.getCurrentFrame = function(){
	var total = this.shots.length - 1;
	if(total == -1){	//first shot
		return 0;
	}else if(total == 9){
		return 9;
	}else if (typeof this.shots[total] != "undefined" && (this.shots[total] instanceof Array)){
		if(this.shots[total].length < 1){
			return total;
		}else if(this.shots[total].length == 1 && this.shots[total][0] != 10){
			return total;
		}else{
			return total + 1;
		}
	}else{
		return total;
	}
}
//gets the shot number in current frame
Player.prototype.getCurrentShot = function(frame){
	if (typeof this.shots[frame] == "undefined" || !(this.shots[frame] instanceof Array)){
		//shots[frame] not yet an array, create;
		this.shots[frame] = new Array();
	}
	return this.shots[frame].length;
}

//checks for a strike/spare/completed/score in given frame
Player.prototype.checkForTen = function(frame){
	if (typeof this.shots[frame] == "undefined" || !(this.shots[frame] instanceof Array)){	//if no shots return 'false'
		return 'false';
	}
	var totalshots = this.shots[frame].length;
	
	var framescore = this.getFrameScore(frame, 0);
	
	if(totalshots == 1 && framescore == 10){	// strike
		return 'strike';
	}else if(totalshots == 1){	//not a completed frame
		return 'false';
	}else if(totalshots == 2 && framescore == 10){	//total is 10 and total shots = 2 therefore, spare
		return 'spare';
	}else{
		return framescore.toString() ; //return frame score as string
	}
}

//calculates the frame score and marks it, sums up frame score and adds given bonus for X and /
Player.prototype.recordFrameScore = function(frame, bonus){
	var framescore = this.getFrameScore(frame, bonus);
	this.frames[frame] = framescore;
	this.markScore(frame);
}
//calculates the frame score
Player.prototype.getFrameScore = function(frame, bonus){
	var totalshots = this.shots[frame].length;
	var framescore = bonus;
	for(var i=0; i < totalshots; i++){
		framescore += this.shots[frame][i];
	}
	return framescore;
}
//Calculate current total score 
Player.prototype.getTotalScore = function(){
	var totalframes = this.frames.length;
	var totalscore = 0;
	for(var i = 0; i < totalframes; i++){
		totalscore += this.frames[i];
	}
	return totalscore;
}
//marks the scorecard for shot
Player.prototype.markShot = function(frame, shot, score){
	if(score == 0){	//if no score
		score = '-';
	}else if(frame == 9){	//final frame
		if(shot == 0 && score == 10){	//strike on first shot in 10th frame
			$(this.getFrameTdId(frame)+' .shot2').fadeIn(300);	//show third shot
			score = 'X';
		}else if(shot == 1){	//second shot, final frame
			var frame_score = this.shots[frame][0] + score;
			if(this.shots[9][0] == 10){	//strike on first shot
				if(frame_score == 20){	//second strike
					score = 'X';
				}
			}else if(frame_score == 10){	//spare
				$(this.getFrameTdId(frame)+' .shot2').fadeIn(300);	//show third shot
				score = '/';
			}
		}else if(shot == 2){	//third shot, final frame
				if(this.shots[frame][0] == 10 && this.shots[frame][1] == 10){	//strike on both shots
					if(score == 10){	//third strike on final frame
						score = 'X';
					}
				}else if((this.shots[frame][1] + score) == 10){	//strike on first, followed by spare
					score = '/';					
				}
		}
	}else if(shot == 1){	//if second shot watch for spare
		var frame_score = this.shots[frame][0] + score;
		if(frame_score == 10){ //spare
			score = '/';
		}
	}else if(score == 10){	//strike
		score = 'X';
	}
	
	$(this.getFrameTdId(frame)+' .shot'+shot).text(score);	//print score to scoresheet
}
//marks the running score of the player on the score sheet
Player.prototype.markScore = function(frame){	
	$(this.getFrameTdId(frame)+' div.frame').text(this.getTotalScore());
}
// Gets the ID of the HTML element used to display frame results
Player.prototype.getFrameTdId = function(frame){
	return '#p'+this.player_no+'-f'+frame;
}
