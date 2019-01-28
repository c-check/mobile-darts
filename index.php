<?php

	ini_set('session.gc-maxlifetime', 86400);
	session_cache_expire( 86400 );
	
	session_start();

	$PAGE = array();
	$PAGE['title'] = 'Darts Scorekeeper';
	
	$RUS = array();
	$temp = preg_split( '/\?/', $_SERVER['REQUEST_URI'] );
  $RUS = preg_split( '/\//', $temp[0] );
  array_shift( $RUS );
	if( !empty($RUS[1]) )
	{
		@require( str_replace('/','',$RUS[1]) . '.php' );
		die();
	}
	
	include( 'head.php' );
	
?>
<body class="index">
	<div class="wrapper">
		<h1>Darts</h1>
		<a href="play">play</a>
		<a href="stats">stats</a>
		<a href="manage">manage players</a>
	</div>
</body>
</html>