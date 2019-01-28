<?php

	$PAGE['title'] = 'Choose Players | ' . $PAGE['title'];
	
	include( 'head.php' );
	
?>
<body class="setup">
	<div id="wrapper">
		<a href="#">go!</a>
		<a href="#">add player</a>
		<div id="playing" class="player-container"></div>
		<div id="bench" class="player-container">>
			<?php foreach( $players as $p ): ?>
				<div class="player" id="<?php $p['id'] ?>" name="<?php echo $p['name']; ?>"></div>
			<?php endforeach; ?>
		</div>
	</div>
	<script type="text/javascript" src="jquery-ui-1.10.3.custom.min.js"></script>
</body>
</html>