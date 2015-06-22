var no_players = 1;	//default number of players
/**
 *	JQuery Document Ready functions
 */
$(document).ready(function(){
	//Set number of players
	$('#button-container div').click(function(){
		//get new number of players
		var id = $(this).attr('id');
		no_players = parseInt(id.replace('btn', ''));
		
		//remove active class
		$('#button-container div.active').removeClass('active');
		//add active class to this
		$(this).addClass('active');
		
		//Fade In/Out player name input boxes
		for(var i=1; i < 6; i++){
			if(i < no_players){
				$('#row_'+i).fadeIn(300);
			}else{
				$('#row_'+i).fadeOut(300);			
				$('#player_'+i).val('');			
			}
		}
	});
	//validates the begins the game
	$('#btnStartGame').click(function(e){
		var valid_players = 0;
		for(var i=0; i < no_players; i++){
			//get player name, but remove whitespace from ends of string
			var pname = strTrim($('#player_'+i).val());
			$('#player_'+i).val(pname);
			
			if(pname.length > 0){
				valid_players++;
			}
		}		
		//Validate
		if(valid_players == 0){	//if no valid players added, return error
			var submit_form = false;
			$('#players .error-msg').text('Please enter at least one player name.');
		}else if(valid_players < no_players){	//if less than the chosen number, confirm continue
			var submit_form = confirm('You have entered the names of fewer players than chosen. Do you wish to continue with '+valid_players+' players?');
		}else{
			var submit_form = true;	
		}
		//if any errors, submit
		if(!submit_form){
			e.preventDefault();
		}
	});
});
//used to trim strings
function strTrim(x){
	return x.replace(/^\s+|\s+$/gm,'');
}