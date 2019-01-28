<?php

	if(empty($_POST['id']))
	{
		die(json_encode(array(
			'error'=>'no pid'
		)));
	}
	
	$sess_key = 'redacted'; 
	if( $_POST['sess_key'] != $sess_key )
	{
		die(json_encode(array(
			'error'=>'sess_key mismatch',
			'sess_key'=>$sess_key,
			'receieved'=>$_POST['sess_key']
		)));
	}
	
	$dbc = mysql_connect(); //redacted
	mysql_set_charset( 'utf8', $dbc );
	mysql_select_db( 'darts' );
	mysql_query("SET NAMES 'utf8'");
	
	foreach( $_POST as $k => $p )
	{
		switch( $k )
		{
			case 'against':
				$temp = json_decode( $p );
				foreach( $temp as $ak => $ap )
				{
					if( $ap == $_POST['id'] )
					{
						unset( $temp[$ak] );
					}
				}
				$clean_post[$k] = mysql_real_escape_string( implode(',',$temp) );
			break;
			default:
				$clean_post[$k] = mysql_real_escape_string( $p );
			break;
		}
	}
	
	$query = 
		"INSERT INTO `games` 
		(`pid`,`type`,`win`,`rounds`,`marks`,`points`,`against`) 
		VALUES 
		(
			'{$clean_post['id']}', 
			'{$clean_post['type']}', 
			'{$clean_post['win']}', 
			'{$clean_post['rounds']}', 
			'{$clean_post['marks']}', 
			'{$clean_post['points']}', 
			'{$clean_post['against']}'
		);";
	$success = mysql_query( $query );
	if( !$success )
	{
		die(json_encode(array(
			'error'=>mysql_error(),
			'query'=>$query
		)));
	}
	
?>

