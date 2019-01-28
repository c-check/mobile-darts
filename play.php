<?php

	$dbc = mysql_connect( 'teddibiase.curtishiller.com', 'ccheck', 'Dibiase5000' );
	mysql_set_charset( 'utf8', $dbc );
	mysql_select_db( 'darts' );

	$sess_key = hash( 'sha256', session_id().md5($_SERVER['HTTP_USER_AGENT'].'SLATBAKA') );
	
	$players = array();
	$query = 
		"SELECT * 
		FROM `players` 
		WHERE `live` = 1 
		ORDER BY `name`;";
	$results = mysql_query( $query );
	while( $row = mysql_fetch_assoc($results) )
	{
		$players[] = $row;
	}

	$PAGE['title'] = "Let's play!  |  {$PAGE['title']}";
	include( 'head.php' );
	
?>
<body class="play">
	<div id="wrapper">
	
		<div id="cricket" class="game">
			<div class="topper topper-cricket">
				<div class="ft-menu">
					<a class="ft-menu-button">D</a>
					<div class="ft-menu-title"></div>
					<div class="clrr"></div>
					<div class="ft-menu-dd">
						<a id="ft-menu-quit" class="ft-menu-dd-item">Quit</a>
					</div>
				</div>
				<div class="ft-scoring">
					<div class="ft-row ft-header">
						<div class="cell header-cell cell-left">Player</div>
						<div class="cell header-cell header-cell-number header-cell-number-20">20</div>
						<div class="cell header-cell header-cell-number header-cell-number-19 cell-odd">19</div>
						<div class="cell header-cell header-cell-number header-cell-number-18">18</div>
						<div class="cell header-cell header-cell-number header-cell-number-17 cell-odd">17</div>
						<div class="cell header-cell header-cell-number header-cell-number-16">16</div>
						<div class="cell header-cell header-cell-number header-cell-number-15 cell-odd">15</div>
						<div class="cell header-cell header-cell-number header-cell-number-25">bull</div>
						<div class="cell header-cell cell-right">pts</div>
					</div>
					<div class="ft-players">
						<div pid="" class="ft-row ft-player">
							<div class="cell player-cell cell-left cell-name"></div>
							<div class="cell player-cell cell-number cell-number-20" marks="0"></div>
							<div class="cell player-cell cell-number cell-number-19 cell-odd" marks="0"></div>
							<div class="cell player-cell cell-number cell-number-18" marks="0"></div>
							<div class="cell player-cell cell-number cell-number-17 cell-odd" marks="0"></div>
							<div class="cell player-cell cell-number cell-number-16" marks="0"></div>
							<div class="cell player-cell cell-number cell-number-15 cell-odd" marks="0"></div>
							<div class="cell player-cell cell-number cell-number-25" marks="0"></div>
							<div class="cell player-cell cell-right cell-points cell-odd">0</div>
						</div>
					</div>
					<div class="clrl"></div>
				</div>
				<div class="spacer spacer-cricket"></div>
			</div>
			
			<div class="footer footer-cricket">
				<div class="hud-name"></div>
				<div class="cricket-hud">
					<div class="plus_minus">+0</div>
					<div class="wins"></div>
					<div class="clrl"></div>
				</div>
				<div class="stat-bar">
					<div class="round" round="1">Round:1</div>
					<div class="marks-round"></div>
					<div class="points-round"></div>
					<div class="marks-total" marks="0">0</div>
					<div class="clrl"></div>
				</div>
				<div class="cricket-marker">
					<div class="marker-row marker-row-numbers">
						<a class="marker-cell marker-cell-number marker-cell-number-20" num="20">20</a>
						<a class="marker-cell marker-cell-number marker-cell-number-19" num="19">19</a>
						<a class="marker-cell marker-cell-right marker-cell-number marker-cell-number-18" num="18">18</a>
					</div>
					<div class="marker-row marker-row-numbers">
						<a class="marker-cell marker-cell-number marker-cell-number-17" num="17">17</a>
						<a class="marker-cell marker-cell-number marker-cell-number-16" num="16">16</a>
						<a class="marker-cell marker-cell-right marker-cell-number marker-cell-number-15" num="15">15</a>
					</div>
					<div class="marker-row marker-row-bottom">
						<a class="marker-cell marker-cell-undo">undo</a>
						<a class="marker-cell marker-cell-number marker-cell-number-25" num="25">bull</a>
						<a class="marker-cell marker-cell-right marker-cell-redo disabled">redo</a>
					</div>
					<div class="marker-row marker-row-enter">
						<a class="marker-cell marker-cell-2by marker-cell-delete">&lt;X</a>
						<a class="marker-cell marker-cell-2by marker-cell-right marker-cell-enter">enter</a>
					</div>
					<div class="clrl"></div>
				</div>
			</div>
		</div>
		
		
		<div id="drop-ten" class="game"></div>
		
		
		<div id="x01" class="game">
			<div class="topper topper-x01">
			</div>
			<div class="footer footer-x01">
			</div>
		</div>
	
		<div id="choose-game" class="hidden setup-screen">
			<h1>Choose A Game</h1>
			<p>
				<strong>Players:</strong>
				<span id="cg-players-list"></span>
			</p>
			<p>Pick which game to play.</p>
			<div class="game-group">
				<h2>Cricket</h2>
				<a id="cricket-standard">standard</a>
				<a id="cricket-noslop">straight w/ points</a>
				<a id="cricket-buttslop">buttslop</a>
				<a id="cricket-straight">straight</a>
			</div>
			<div class="game-group">
				<h2>Drop-Ten</h2>
				<a id="d10-standard">standard</a>
				<a id="d10-noslop">straight w/ points</a>
				<a id="d10-buttslop">buttslop</a>
				<a id="d10-straight">straight</a>
			</div>
			<div class="game-group">
				<h2>X01</h2>
				<a id="x101">101</a>
				<a id="x301">301</a>
				<a id="x501">501</a>
			</div>
			<a id="back-to-choose-players">< Back</a>
		</div>
	
		<div id="setup" class="setup-screen">
			<h1>Choose Players</h1>
			<p>Click or drag names to swap and arrange them.</p>
			<div id="playing" class="player-container"></div>
			<a id="finish-choosing-players">Go!</a>
			<div id="setup-errors"></div>
			<h2>Available...<a id="setup-add-player">+</a></h2>
			<div class="bench-wrapper">
				<div id="bench" class="player-container">
					<?php foreach( $players as $p ): ?>
						<a class="player" id="p<?php echo $p['id']; ?>" id_no="<?php echo $p['id']; ?>"><?php echo $p['name']; ?></a>
					<?php endforeach; ?>
				</div>
				<a href="manage" id="manage">Manage...</a>
			</div>
		</div>
		
	</div>
	<script type="text/javascript" src="jquery-ui-1.10.3.custom.min.js"></script>
</body>
</html>