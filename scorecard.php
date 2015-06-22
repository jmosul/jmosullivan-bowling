<?php
	$send_back = true; //bool to determine if user should be redirected back to 'Create Game'
	//Check if players have been submitted, else set send back to true;
	if(isset($_POST['players'])){
		$players = $_POST['players'];
		
		foreach($players as $key=>$name){
			$name = trim($name);	//remove excess whitespace
			//Check at least one valid name has been submitted
			if(strlen($name) > 0){	
				$send_back = false;
			}else{
				//remove non-players
				unset($players[$key]);
			}
		}
	}
	
	//send back if no players have been submitted
	if($send_back){
		header('Location:index.php?msg='.urlencode('You must specify at least 1 player before continuing'));
		die('Not enough players');
	}
	
	//reset array index
	$players = array_values($players);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<title>Bowling Scorecard</title>
		<link rel='stylesheet' type="text/css" href='resources/css/scorecard.css' />
		<link rel='stylesheet' type="text/css" href='resources/css/common.css' />
		<script type='text/javascript' src='resources/js/jquery-1.11.0.min.js' ></script>
		<script type='text/javascript' src='resources/js/scorecard.js' ></script>
		<script type='text/javascript' src='resources/js/class.player.js' ></script>
	</head>
	<body>
		<div id='scoresheet-container'>
			<table>
				<thead>
					<tr>
						<th>No.</th>
						<th>Player</th>
						<th>1</th>
						<th>2</th>
						<th>3</th>
						<th>4</th>
						<th>5</th>
						<th>6</th>
						<th>7</th>
						<th>8</th>
						<th>9</th>
						<th>10</th>
					</tr>
				</thead>
				<tbody>
					<?php
						//run through submitted players to build scorecard
						foreach($players as $key => $name){
							$name = trim($name);	//remove extra white space
							createPlayerScorecard($key, $name);
						}
					?>
					</tr>
				</tbody>
			</table>
		</div>
		<div id='controls'>
			<div id='button-container' class='button-container'>
				<div id='btn0' class='marRight'>0</div>
				<div id='btn1' class='marRight'>1</div>
				<div id='btn2' >2</div>
				<div id='btn3' class='marRight marTop'>3</div>
				<div id='btn4' class='marRight marTop'>4</div>
				<div id='btn5' class='marTop'>5</div>
				<div id='btn6' class='marRight marTop'>6</div>
				<div id='btn7' class='marRight marTop'>7</div>
				<div id='btn8' class='marTop'>8</div>
				<div id='btn9' class='marRight marTop'>9</div>
				<div id='btn10' class='marRight marTop'>X</div>
			</div>
			<div id='newGame' class='hidden button-container'>
				<p>Start New<br />Game</p>
			</div>
		</div>
		<script type='text/javascript'>
			<?php
				foreach($players as $key=>$name){	//create JavaScript Player objects
					echo "players[$key] = new Player($key, '$name');\n";				
				}
			?>
		</script>
	</body>
</html>

<?php
	//Builds the HTML for a player in the scorecard
	function createPlayerScorecard($key, $name){
		$no = $key + 1;	//Set readable player number
		if($key == 0){	//if first player set css class
			$cssTR = " class='current_player'";
		}else{
			$cssTR = '';
		}
		echo "<tr id='pRow$key'$cssTR>
				<td class='player_no'>$no</td>
				<td class='player_name'>$name</td>";
		//create the 9 standard frames
		for($f=0; $f<=8; $f++){
			echo "<td class='frame";
			
			//set CSS class for first frame
			if($f == 0 && $key == 0){
				echo " current_frame";
			}
			
			echo "' id='p$key-f$f'>
					<div class='frame'></div>
					<div class='shot shot1'></div>						
					<div class='shot shot0'></div>
				  </td>";
		}
		//create the final frame
		echo "<td class='frame' id='p$key-f9'>
				<div class='frame final_frame'></div>
				<div class='shot shot2'></div>
				<div class='shot shot1'></div>						
				<div class='shot shot0'></div>						
			  </td>
			</tr>";	
	}
?>