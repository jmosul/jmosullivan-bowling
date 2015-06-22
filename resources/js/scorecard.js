var players = new Array();	//array of players (as Player class)
var in_play = true;			//if a game is in progress
var current_player = 0;		//pointer to the current player
var pins_remaining = 10;	//number of pins remaining

//Handles each shot
function playShot(pins){
	if(!in_play){ return;	}	//check for end of game
	var next_player = players[current_player].scoreShot(pins);
	if(next_player){
		current_player++;
		var current_frame_id = $('td.current_frame').attr('id');
		var current_frame = current_frame_id.slice(-1);
		if(current_frame == 9 && current_player == players.length){
			return false;	//End of game
		}else if(current_player >= players.length){
			current_player = 0;
			current_frame++;
		}
		
		//reset pins and inputs
		resetPins();
		
		//show next player
		$('tr.current_player').removeClass('current_player');
		$('#pRow'+current_player).addClass('current_player');
		
		//show next frame
		$('td.current_frame').removeClass('current_frame');
		$('#p'+current_player+'-f'+current_frame).addClass('current_frame');
	}else{
		//restrict input to total remaining pins for next shot
		var frame = players[current_player].getCurrentFrame();
		if(frame == 9){	//final frame
			var shot = players[current_player].getCurrentShot(frame) - 1;
			if(shot == 0 && players[current_player].shots[frame][shot] == 10){	//if first shot of final frame a strike, reset pins
				resetPins(current_frame);
			}else if(shot == 1){	//on final bonus shot
				var framescore = players[current_player].getFrameScore(frame);
				if(framescore % 10 !== 0){	//if divisible by 10, 2 strikes or spare
					resetPins(current_frame);
				}else{
					clearPins(pins);
				}
			}else{
				clearPins(pins);
			}
		}else{
			clearPins(pins);
		}
	}
	return true;
}
/**
 *	JQuery Document Ready functions
 */
$(document).ready(function(){
	//Watch for input via keyboard
	$(this).keyup(function(e){
		var key = convertKeyPress(e.keyCode);
		if(key > -1){	//Correct input			
			if(key <= pins_remaining){	//check for valid shot
				//simulate press
				$("#btn"+key).addClass("hoversim").delay(300).queue(function(next){
					$(this).removeClass("hoversim");
					next();
				});
				//Score shot
				in_play = playShot(parseInt(key));
				if(!in_play){
					endGame();
				}
			}else{
				//animate invalid press
				$("#btn"+key).addClass("invalid").delay(300).queue(function(next){
					$(this).removeClass("invalid");
					next();
				});
			}
		}
	});
	
	//Watch for input via on screen scorer
	$(document).on('click', '#control-container div', function(){
		if($(this).hasClass('btnDisabled')){ return; }	//if invalid press, ignore
		var id = $(this).attr('id');
		var score = id.replace('btn', '');
		in_play = playShot(parseInt(score));
		if(!in_play){
			endGame();
		}
	});
	
	$(document).on('click', '#newGame', function(){
		window.location.href = 'index.php';
	});
});
/**
 *	Other functions
 */
//Converts keycode into numerical value, takes Numpad and converts 'x' and Numpad '*' into 10 (strike)
function convertKeyPress(k){
	if(k >= 96 && k<= 105){	//number pad entries, convert to number
		k = k - 48;
		var key = String.fromCharCode(k);
	}else if(k == 106 || k == 88){	//watch for 'X' or 'Numpad *' for strike
		return 10;
	}else if(k == 111 || k == 191){	//watch for '/' of 'Numpad /' for spare and convert to required number
		if($('#control-container').children('div.btnSpare').length){
			var id = $('#control-container').children('div.btnSpare').attr('id');
			var key = parseInt(id.replace('btn', ''));
		}else{
			var key = String.fromCharCode(k);		
		}
		
	}else{
		var key = String.fromCharCode(k);	
	}
	if(!isNaN(key)){
		return key;
	}else{
		return -1;
	}	
}
//resets pins_remains to 10 and re-enables all buttons
function resetPins(current_frame){
	$('.btnDisabled').each(function() {	//remove any disabled inputs
		$(this).removeClass('btnDisabled');
	});
	if(pins_remaining == 10){
		var str_pins_remaining = 'X';
	}else{
		var str_pins_remaining = pins_remaining;
	}
	$('#btn'+pins_remaining).text(str_pins_remaining).removeClass('btnSpare');
	pins_remaining = 10;	
}
//Sets pins_remaing and disable now invalid button controls 
function clearPins(pins){
	pins_remaining -= pins;
	var i = 10;
	while(i > pins_remaining){
		$('#btn'+i).addClass('btnDisabled');	//disable input for knocked over pins
		i--;
	}
	if(pins_remaining > 0){
		$('#btn'+pins_remaining).text('/').addClass('btnSpare');	//assign 'Spare' key
	}
}

//Clears all pins and ends the game
function endGame(){
	clearPins(10);
	var totalPlayers = players.length;
	$('tr.current_player').removeClass('current_player');
	$('td.current_frame').removeClass('current_frame');
	
	if(totalPlayers == 1){
		$('#pRow0').addClass('winning_player');
		alert('Final Score: '+players[0].getTotalScore());
		return;
	}
	
	var winner = new Array();
	var bestscore = 0;
	for(var i = 0; i < totalPlayers; i++){
		var playerscore = players[i].getTotalScore();
		if(playerscore > bestscore){	//new higher score found
			bestscore = playerscore;
			winner.length = 0;
			winner.push(i);
		}else if(playerscore == bestscore){	//equal high score found
			winner.push(i);
		}
	}
	
	var winners = winner.length;
	if(winners == 1){
		var msg = players[winner[0]].name+' has won';
		markWinner(0);
	}else{
		winners--; //set up for for loop
		var msg = ''
		for(var i = 0; i <= winners; i++){
			markWinner(winner[i]);
			if(i == winners){
				msg = msg+' and ';
			}else if(i > 0){
				msg = msg+', ';
			}
			msg = msg+players[winner[i]].name;
		}
		var msg = ' have drawn';
	}
	
	alert(msg+' the game with a score of: '+bestscore);	//give result
	
	$('#newGame').fadeIn(500);
}
//marks the Winning player
function markWinner(player_no){
	$('#pRow'+player_no).addClass('winning_player');
}