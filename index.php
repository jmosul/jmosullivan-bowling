<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Bowling</title>
	<script type='text/javascript' src='resources/js/jquery-1.11.0.min.js'></script>
	<script type='text/javascript' src='resources/js/index.js'></script>
	<link rel="stylesheet" type="text/css" href="resources/css/index.css" />
	<link rel="stylesheet" type="text/css" href="resources/css/common.css" />
</head>
<body>
	<h1>Ten Pin Bowling</h1>	
	<div id='game_form'>
		<h3>Create Game</h3>
		<p>Please choose the number of players.</p>
		<div id='button-container' class='button-container'>
			<div id='btn1' class='marRight active'>1</div>
			<div id='btn2' class='marRight'>2</div>
			<div id='btn3' class='marRight'>3</div>
			<div id='btn4' class='marRight'>4</div>
			<div id='btn5' class='marRight'>5</div>
			<div id='btn6' >6</div>		
		</div>		
		<form action='scorecard.php' method='post'>
			<div id='players'>
				<p>Please enter the names of the players.</p>
				<p class='error-msg'>
					<?php
						//Print out any message
						if(isset($_GET['msg'])){
							echo $_GET['msg'];
						}
					?>
				</p>
				<div id='row_0' class='row'>
					<label for='player_0'>Player 1</label>
					<input name='players[0]' id='player_0' type='text' />
				</div>
				<div id='row_1' class='row hidden'>
					<label for='player_1'>Player 2</label>
					<input name='players[1]' id='player_1' type='text' />
				</div>
				<div id='row_2' class='row hidden'>
					<label for='player_2'>Player 3</label>
					<input name='players[2]' id='player_2' type='text' />
				</div>
				<div id='row_3' class='row hidden'>
					<label for='player_3'>Player 4</label>
					<input name='players[3]' id='player_3' type='text' />
				</div>
				<div id='row_4' class='row hidden'>
					<label for='player_4'>Player 5</label>
					<input name='players[4]' id='player_4' type='text' />
				</div>
				<div id='row_5' class='row hidden'>
					<label for='player_5'>Player 6</label>
					<input name='players[5]' id='player_5' type='text' />
				</div>
				<div class='startgame'>
					<input id='btnStartGame' type='submit' value='Start Game' />
				</div>
			</div>
		</form>
	</div>
</body>
</html>